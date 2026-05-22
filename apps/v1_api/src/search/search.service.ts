import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { V1AuthUser } from '../auth/v1-auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { RecentSearchesQueryDto, RecordSearchDto } from './dto/search-history.dto';

type SearchIdentity = {
  userId?: string;
  sessionKey?: string;
};

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async recent(user: V1AuthUser | null, sessionKey: string | null, query: RecentSearchesQueryDto) {
    const identity = this.getIdentity(user, sessionKey);
    if (!identity) return { items: [] };

    const limit = Math.min(Math.max(query.limit ?? 8, 1), 20);
    const items = await this.prisma.v1SearchHistory.findMany({
      where: this.identityWhere(identity),
      orderBy: { searchedAt: 'desc' },
      take: limit,
    });

    return {
      items: items.map((item) => ({
        id: item.id,
        query: item.query,
        filters: item.filters,
        searchedAt: item.searchedAt,
      })),
    };
  }

  async record(user: V1AuthUser | null, sessionKey: string | null, dto: RecordSearchDto) {
    const identity = this.getIdentity(user, sessionKey);
    if (!identity) {
      throw new BadRequestException({
        code: 'SEARCH_SESSION_REQUIRED',
        message: 'Search session is required',
      });
    }

    const normalizedQuery = dto.query.trim().replace(/\s+/g, ' ');
    if (!normalizedQuery) {
      throw new BadRequestException({
        code: 'INVALID_SEARCH_QUERY',
        message: 'Search query is required',
      });
    }

    const existing = await this.prisma.v1SearchHistory.findFirst({
      where: {
        ...this.identityWhere(identity),
        query: normalizedQuery,
      },
      select: { id: true },
    });

    const data = {
      query: normalizedQuery,
      filters: dto.filters ? (dto.filters as Prisma.InputJsonValue) : Prisma.JsonNull,
      searchedAt: new Date(),
    };

    const item = existing
      ? await this.prisma.v1SearchHistory.update({
          where: { id: existing.id },
          data,
        })
      : await this.prisma.v1SearchHistory.create({
          data: {
            ...data,
            userId: identity.userId,
            sessionKey: identity.sessionKey,
          },
        });

    return {
      id: item.id,
      query: item.query,
      filters: item.filters,
      searchedAt: item.searchedAt,
    };
  }

  private getIdentity(user: V1AuthUser | null, sessionKey: string | null): SearchIdentity | null {
    if (user?.id) return { userId: user.id };
    if (sessionKey?.trim()) return { sessionKey: sessionKey.trim().slice(0, 80) };
    return null;
  }

  private identityWhere(identity: SearchIdentity): Prisma.V1SearchHistoryWhereInput {
    return identity.userId ? { userId: identity.userId } : { sessionKey: identity.sessionKey };
  }
}
