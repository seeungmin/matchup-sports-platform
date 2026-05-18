import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoticesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const notices = await this.prisma.v1Notice.findMany({
      where: {
        status: 'published',
        audience: 'public',
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      take: 20,
      select: {
        id: true,
        audience: true,
        title: true,
        body: true,
        publishedAt: true,
      },
    });

    return {
      notices: notices.map((notice) => ({
        noticeId: notice.id,
        audience: notice.audience,
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
        title: notice.title,
        body: notice.body,
        publishedAt: notice.publishedAt,
      },
    };
  }
}
