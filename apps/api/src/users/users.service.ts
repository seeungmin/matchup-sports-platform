import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSportProfilesDto } from './dto/update-sport-profiles.dto';

// Fields that must never be exposed in API responses
const SAFE_USER_SELECT = {
  id: true,
  email: true,
  nickname: true,
  role: true,
  profileImageUrl: true,
  phone: true,
  gender: true,
  birthYear: true,
  bio: true,
  sportTypes: true,
  locationCity: true,
  locationDistrict: true,
  mannerScore: true,
  totalMatches: true,
  createdAt: true,
  updatedAt: true,
  sportProfiles: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        ...SAFE_USER_SELECT,
        sportProfiles: true,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async getPublicProfile(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        nickname: true,
        profileImageUrl: true,
        gender: true,
        mannerScore: true,
        totalMatches: true,
        sportProfiles: true,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async update(id: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        ...SAFE_USER_SELECT,
        sportProfiles: true,
      },
    });
  }

  async updateSportProfiles(id: string, dto: UpdateSportProfilesDto) {
    const uniqueSportTypes = new Set(dto.profiles.map((profile) => profile.sportType));
    if (uniqueSportTypes.size !== dto.profiles.length) {
      throw new BadRequestException('종목은 중복해서 등록할 수 없습니다.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: { sportTypes: dto.profiles.map((profile) => profile.sportType) },
      });

      await tx.userSportProfile.deleteMany({
        where: {
          userId: id,
          sportType: { notIn: dto.profiles.map((profile) => profile.sportType) },
        },
      });

      for (const profile of dto.profiles) {
        await tx.userSportProfile.upsert({
          where: {
            userId_sportType: {
              userId: id,
              sportType: profile.sportType,
            },
          },
          update: {
            level: profile.level,
            preferredPositions: profile.preferredPositions ?? [],
          },
          create: {
            userId: id,
            sportType: profile.sportType,
            level: profile.level,
            preferredPositions: profile.preferredPositions ?? [],
          },
        });
      }
    });

    return this.findById(id);
  }

  /**
   * Searches users by nickname (case-insensitive, partial match).
   * Excludes the caller and soft-deleted users. Returns max 10 results.
   */
  async searchByNickname(query: string, excludeUserId: string) {
    return this.prisma.user.findMany({
      where: {
        nickname: { contains: query, mode: 'insensitive' },
        deletedAt: null,
        NOT: { id: excludeUserId },
      },
      select: {
        id: true,
        nickname: true,
        profileImageUrl: true,
        mannerScore: true,
        sportTypes: true,
      },
      take: 10,
    });
  }

  async getMatchHistory(
    userId: string,
    options: { status?: string; cursor?: string; limit?: number },
  ) {
    const limit = options.limit ?? 20;

    const participants = await this.prisma.matchParticipant.findMany({
      where: {
        userId,
        ...(options.status && {
          match: { status: options.status as never },
        }),
      },
      include: {
        match: {
          include: {
            venue: { select: { id: true, name: true, city: true } },
            host: {
              select: { id: true, nickname: true, profileImageUrl: true },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
      take: limit + 1,
      ...(options.cursor && {
        cursor: { id: options.cursor },
        skip: 1,
      }),
    });

    const hasNext = participants.length > limit;
    const items = hasNext ? participants.slice(0, limit) : participants;

    return {
      items: items.map((p) => p.match),
      nextCursor: hasNext ? items[items.length - 1].id : null,
    };
  }
}
