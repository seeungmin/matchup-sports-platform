import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { NoticesQueryDto } from './dto/notices-query.dto';

@Injectable()
export class NoticesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: NoticesQueryDto = {}) {
    const notices = await this.prisma.v1Notice.findMany({
      where: {
        status: 'published',
        audience: 'public',
        ...(query.category ? { category: query.category } : {}),
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      take: 20,
      select: {
        id: true,
        audience: true,
        category: true,
        title: true,
        body: true,
        publishedAt: true,
      },
    });

    return {
      notices: notices
        .sort((a, b) => {
          if (a.category === '고정' && b.category !== '고정') return -1;
          if (a.category !== '고정' && b.category === '고정') return 1;
          return 0;
        })
        .map((notice) => ({
          noticeId: notice.id,
          audience: notice.audience,
          category: notice.category,
          title: notice.title,
          body: notice.body,
          publishedAt: notice.publishedAt,
        })),
      pageInfo: {
        hasNextPage: false,
        nextCursor: null,
      },
    };
  }

  async detail(noticeId: string) {
    const notice = await this.prisma.v1Notice.findFirst({
      where: {
        id: noticeId,
        status: 'published',
        audience: 'public',
      },
      select: {
        id: true,
        audience: true,
        category: true,
        title: true,
        body: true,
        publishedAt: true,
      },
    });

    if (!notice) {
      throw new NotFoundException('Notice not found');
    }

    return {
      notice: {
        noticeId: notice.id,
        audience: notice.audience,
        category: notice.category,
        title: notice.title,
        body: notice.body,
        publishedAt: notice.publishedAt,
      },
    };
  }
}
