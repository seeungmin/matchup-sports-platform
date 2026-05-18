import {
  PrismaClient,
  V1AdminRole,
  V1AuthProvider,
  V1MatchParticipantRole,
  V1NotificationTargetType,
  V1TeamMembershipRole,
  V1TermsKind,
} from '@prisma/client';

const prisma = new PrismaClient();

const sports = [
  ['soccer', '축구'],
  ['futsal', '풋살'],
  ['basketball', '농구'],
  ['baseball', '야구'],
  ['badminton', '배드민턴'],
  ['tennis', '테니스'],
  ['running', '러닝'],
] as const;

const levels = [
  ['beginner', '입문'],
  ['novice', '초급'],
  ['intermediate', '중급'],
  ['advanced', '상급'],
  ['expert', '최상급'],
] as const;

const users = [
  ['host@teameet.v1', '호스트민'],
  ['applicant@teameet.v1', '지원수'],
  ['owner@teameet.v1', '팀장원'],
  ['manager@teameet.v1', '매니저준'],
  ['member@teameet.v1', '멤버현'],
  ['admin@teameet.v1', '운영자'],
] as const;

async function seedRuntimeCheck() {
  await prisma.v1RuntimeCheck.upsert({
    where: { key: 'seed' },
    update: { value: 'ok' },
    create: { key: 'seed', value: 'ok' },
  });
}

async function seedSports() {
  const result: Record<string, string> = {};

  for (const [index, [code, name]] of sports.entries()) {
    const sport = await prisma.v1Sport.upsert({
      where: { code },
      update: { name, isActive: true, sortOrder: index + 1 },
      create: { code, name, isActive: true, sortOrder: index + 1 },
    });

    result[code] = sport.id;

    for (const [levelIndex, [levelCode, levelName]] of levels.entries()) {
      await prisma.v1SportLevel.upsert({
        where: {
          sportId_code: {
            sportId: sport.id,
            code: levelCode,
          },
        },
        update: {
          name: levelName,
          description: `${name} ${levelName} 레벨`,
          sortOrder: levelIndex + 1,
          isActive: true,
        },
        create: {
          sportId: sport.id,
          code: levelCode,
          name: levelName,
          description: `${name} ${levelName} 레벨`,
          sortOrder: levelIndex + 1,
          isActive: true,
        },
      });
    }
  }

  return result;
}

async function seedRegions() {
  const seoul = await prisma.v1Region.upsert({
    where: { code: 'seoul' },
    update: { name: '서울', level: 1, isActive: true, sortOrder: 1 },
    create: { code: 'seoul', name: '서울', level: 1, isActive: true, sortOrder: 1 },
  });

  const gyeonggi = await prisma.v1Region.upsert({
    where: { code: 'gyeonggi' },
    update: { name: '경기', level: 1, isActive: true, sortOrder: 2 },
    create: { code: 'gyeonggi', name: '경기', level: 1, isActive: true, sortOrder: 2 },
  });

  const childRegions = [
    [seoul.id, 'seoul-gangnam', '강남구', 1],
    [seoul.id, 'seoul-songpa', '송파구', 2],
    [seoul.id, 'seoul-mapo', '마포구', 3],
    [gyeonggi.id, 'gyeonggi-seongnam', '성남시', 1],
    [gyeonggi.id, 'gyeonggi-suwon', '수원시', 2],
  ] as const;

  for (const [parentId, code, name, sortOrder] of childRegions) {
    await prisma.v1Region.upsert({
      where: { code },
      update: { parentId, name, level: 2, isActive: true, sortOrder },
      create: { parentId, code, name, level: 2, isActive: true, sortOrder },
    });
  }

  return {
    seoulGangnam: await prisma.v1Region.findUniqueOrThrow({ where: { code: 'seoul-gangnam' } }),
    seoulSongpa: await prisma.v1Region.findUniqueOrThrow({ where: { code: 'seoul-songpa' } }),
  };
}

async function seedTermsAndNotice() {
  for (const [kind, title, required] of [
    [V1TermsKind.terms, 'Teameet v1 서비스 이용약관', true],
    [V1TermsKind.privacy, 'Teameet v1 개인정보 처리방침', true],
    [V1TermsKind.marketing, 'Teameet v1 마케팅 수신 동의', false],
  ] as const) {
    await prisma.v1TermsDocument.upsert({
      where: { kind_version: { kind, version: '2026-05-18' } },
      update: {
        title,
        content: `${title} seed document`,
        status: 'published',
        isRequired: required,
        publishedAt: new Date('2026-05-18T00:00:00.000Z'),
      },
      create: {
        kind,
        version: '2026-05-18',
        title,
        content: `${title} seed document`,
        status: 'published',
        isRequired: required,
        publishedAt: new Date('2026-05-18T00:00:00.000Z'),
      },
    });
  }

  await prisma.v1Notice.upsert({
    where: { id: '00000000-0000-4000-8000-000000000001' },
    update: {
      audience: 'public',
      title: 'Teameet v1 개발 환경 안내',
      body: 'v1 seed 데이터로 생성된 공지입니다.',
      status: 'published',
      publishedAt: new Date('2026-05-18T00:00:00.000Z'),
    },
    create: {
      id: '00000000-0000-4000-8000-000000000001',
      audience: 'public',
      title: 'Teameet v1 개발 환경 안내',
      body: 'v1 seed 데이터로 생성된 공지입니다.',
      status: 'published',
      publishedAt: new Date('2026-05-18T00:00:00.000Z'),
    },
  });
}

async function seedUsers() {
  const result: Record<string, string> = {};
  const requiredTerms = await prisma.v1TermsDocument.findMany({
    where: {
      isRequired: true,
      status: 'published',
    },
    select: { id: true },
  });

  for (const [email, nickname] of users) {
    const user = await prisma.v1User.upsert({
      where: { email },
      update: { accountStatus: 'active', onboardingStatus: 'completed' },
      create: {
        email,
        accountStatus: 'active',
        onboardingStatus: 'completed',
        authIdentities: {
          create: {
            provider: V1AuthProvider.email,
            providerUserKey: email,
            email,
            status: 'active',
          },
        },
        profile: {
          create: {
            nickname,
            visibility: 'public',
            displayName: nickname,
          },
        },
        onboardingProgress: {
          create: {
            currentStep: 'completed',
            completedAt: new Date('2026-05-18T00:00:00.000Z'),
          },
        },
        reputationSummary: {
          create: {
            trustState: 'sample',
            mannerScore: 4.5,
            reviewCount: 3,
            sourceLabel: 'seed',
            calculatedAt: new Date('2026-05-18T00:00:00.000Z'),
          },
        },
        notificationPreference: {
          create: {
            importantEnabled: true,
            activityEnabled: true,
            marketingEnabled: false,
          },
        },
      },
    });

    result[email] = user.id;

    for (const termsDocument of requiredTerms) {
      await prisma.v1UserTermsConsent.upsert({
        where: {
          userId_termsDocumentId: {
            userId: user.id,
            termsDocumentId: termsDocument.id,
          },
        },
        update: {
          acceptedAt: new Date('2026-05-18T00:00:00.000Z'),
          revokedAt: null,
        },
        create: {
          userId: user.id,
          termsDocumentId: termsDocument.id,
          acceptedAt: new Date('2026-05-18T00:00:00.000Z'),
        },
      });
    }
  }

  return result;
}

async function seedTeams(userIds: Record<string, string>, sportIds: Record<string, string>, regionId: string) {
  const ownerTeam = await prisma.v1Team.upsert({
    where: { id: '00000000-0000-4000-8000-000000000101' },
    update: {
      name: '강남 러닝 크루',
      ownerUserId: userIds['owner@teameet.v1'],
      sportId: sportIds.running,
      regionId,
      status: 'active',
      memberCount: 3,
      managerCount: 1,
    },
    create: {
      id: '00000000-0000-4000-8000-000000000101',
      name: '강남 러닝 크루',
      ownerUserId: userIds['owner@teameet.v1'],
      sportId: sportIds.running,
      regionId,
      status: 'active',
      memberCount: 3,
      managerCount: 1,
      profile: {
        create: {
          description: '평일 저녁에 함께 뛰는 v1 seed 팀입니다.',
          activityNote: '주 2회 러닝',
          skillNote: '초급부터 중급까지',
        },
      },
      trustScore: {
        create: {
          trustState: 'sample',
          mannerScore: 4.6,
          matchCount: 8,
          sourceLabel: 'seed',
          calculatedAt: new Date('2026-05-18T00:00:00.000Z'),
        },
      },
    },
  });

  const applicantTeam = await prisma.v1Team.upsert({
    where: { id: '00000000-0000-4000-8000-000000000102' },
    update: {
      name: '송파 풋살 모임',
      ownerUserId: userIds['host@teameet.v1'],
      sportId: sportIds.futsal,
      regionId,
      status: 'active',
      memberCount: 2,
      managerCount: 0,
    },
    create: {
      id: '00000000-0000-4000-8000-000000000102',
      name: '송파 풋살 모임',
      ownerUserId: userIds['host@teameet.v1'],
      sportId: sportIds.futsal,
      regionId,
      status: 'active',
      memberCount: 2,
      profile: {
        create: {
          description: '주말 풋살 상대를 찾는 v1 seed 팀입니다.',
        },
      },
    },
  });

  await prisma.v1TeamMembership.upsert({
    where: { teamId_userId: { teamId: ownerTeam.id, userId: userIds['owner@teameet.v1'] } },
    update: { role: V1TeamMembershipRole.owner, status: 'active', joinedAt: new Date('2026-05-18T00:00:00.000Z') },
    create: { teamId: ownerTeam.id, userId: userIds['owner@teameet.v1'], role: V1TeamMembershipRole.owner, status: 'active', joinedAt: new Date('2026-05-18T00:00:00.000Z') },
  });
  await prisma.v1TeamMembership.upsert({
    where: { teamId_userId: { teamId: ownerTeam.id, userId: userIds['manager@teameet.v1'] } },
    update: { role: V1TeamMembershipRole.manager, status: 'active', joinedAt: new Date('2026-05-18T00:00:00.000Z') },
    create: { teamId: ownerTeam.id, userId: userIds['manager@teameet.v1'], role: V1TeamMembershipRole.manager, status: 'active', joinedAt: new Date('2026-05-18T00:00:00.000Z') },
  });
  await prisma.v1TeamMembership.upsert({
    where: { teamId_userId: { teamId: ownerTeam.id, userId: userIds['member@teameet.v1'] } },
    update: { role: V1TeamMembershipRole.member, status: 'active', joinedAt: new Date('2026-05-18T00:00:00.000Z') },
    create: { teamId: ownerTeam.id, userId: userIds['member@teameet.v1'], role: V1TeamMembershipRole.member, status: 'active', joinedAt: new Date('2026-05-18T00:00:00.000Z') },
  });

  return { ownerTeam, applicantTeam };
}

async function seedMatches(userIds: Record<string, string>, sportIds: Record<string, string>, regionId: string) {
  const match = await prisma.v1Match.upsert({
    where: { id: '00000000-0000-4000-8000-000000000201' },
    update: {
      title: '강남 저녁 러닝 멤버 모집',
      status: 'recruiting',
    },
    create: {
      id: '00000000-0000-4000-8000-000000000201',
      hostUserId: userIds['host@teameet.v1'],
      sportId: sportIds.running,
      regionId,
      title: '강남 저녁 러닝 멤버 모집',
      description: '가볍게 5km 뛰는 v1 seed 매치입니다.',
      placeName: '강남역 11번 출구',
      placeAddress: '서울 강남구',
      startAt: new Date('2026-05-20T10:00:00.000Z'),
      endAt: new Date('2026-05-20T11:00:00.000Z'),
      maxParticipants: 6,
      levelNote: '초급 환영',
      genderRule: '무관',
      costNote: '무료',
      status: 'recruiting',
      participants: {
        create: {
          userId: userIds['host@teameet.v1'],
          role: V1MatchParticipantRole.host,
          status: 'active',
          approvedAt: new Date('2026-05-18T00:00:00.000Z'),
        },
      },
    },
  });

  await prisma.v1MatchApplication.upsert({
    where: { matchId_applicantUserId: { matchId: match.id, applicantUserId: userIds['applicant@teameet.v1'] } },
    update: { status: 'requested', message: '참여하고 싶습니다.' },
    create: { matchId: match.id, applicantUserId: userIds['applicant@teameet.v1'], status: 'requested', message: '참여하고 싶습니다.' },
  });

  return match;
}

async function seedTeamMatches(
  userIds: Record<string, string>,
  sportIds: Record<string, string>,
  regionId: string,
  ownerTeamId: string,
  applicantTeamId: string,
) {
  const teamMatch = await prisma.v1TeamMatch.upsert({
    where: { id: '00000000-0000-4000-8000-000000000301' },
    update: {
      title: '토요일 풋살 상대팀 모집',
      status: 'recruiting',
    },
    create: {
      id: '00000000-0000-4000-8000-000000000301',
      hostTeamId: ownerTeamId,
      createdByUserId: userIds['owner@teameet.v1'],
      sportId: sportIds.futsal,
      regionId,
      title: '토요일 풋살 상대팀 모집',
      description: '가볍게 6:6 풋살 경기할 팀을 찾습니다.',
      placeName: '잠실 풋살장',
      placeAddress: '서울 송파구',
      startAt: new Date('2026-05-23T05:00:00.000Z'),
      endAt: new Date('2026-05-23T07:00:00.000Z'),
      formatNote: '6:6',
      genderRule: '무관',
      costNote: '구장비 N분의 1',
      status: 'recruiting',
    },
  });

  await prisma.v1TeamMatchApplication.upsert({
    where: { teamMatchId_applicantTeamId: { teamMatchId: teamMatch.id, applicantTeamId } },
    update: {
      appliedByUserId: userIds['host@teameet.v1'],
      status: 'requested',
      message: '상대팀으로 신청합니다.',
    },
    create: {
      teamMatchId: teamMatch.id,
      applicantTeamId,
      appliedByUserId: userIds['host@teameet.v1'],
      status: 'requested',
      message: '상대팀으로 신청합니다.',
    },
  });

  return teamMatch;
}

async function seedChatAndNotifications(
  userIds: Record<string, string>,
  matchId: string,
  teamMatchId: string,
) {
  const matchRoom = await prisma.v1ChatRoom.upsert({
    where: { matchId },
    update: { status: 'active', lastMessageAt: new Date('2026-05-18T00:00:00.000Z') },
    create: { matchId, status: 'active', lastMessageAt: new Date('2026-05-18T00:00:00.000Z') },
  });

  await prisma.v1ChatRoomParticipant.upsert({
    where: { chatRoomId_userId: { chatRoomId: matchRoom.id, userId: userIds['host@teameet.v1'] } },
    update: { status: 'active' },
    create: { chatRoomId: matchRoom.id, userId: userIds['host@teameet.v1'], status: 'active' },
  });

  await prisma.v1ChatMessage.upsert({
    where: { id: '00000000-0000-4000-8000-000000000401' },
    update: {
      chatRoomId: matchRoom.id,
      senderUserId: userIds['host@teameet.v1'],
      body: 'v1 seed 매치 채팅입니다.',
      status: 'sent',
    },
    create: {
      id: '00000000-0000-4000-8000-000000000401',
      chatRoomId: matchRoom.id,
      senderUserId: userIds['host@teameet.v1'],
      body: 'v1 seed 매치 채팅입니다.',
      status: 'sent',
    },
  });

  await prisma.v1ChatRoom.upsert({
    where: { teamMatchId },
    update: { status: 'active' },
    create: { teamMatchId, status: 'active' },
  });

  await prisma.v1Notification.upsert({
    where: { id: '00000000-0000-4000-8000-000000000501' },
    update: {
      recipientUserId: userIds['applicant@teameet.v1'],
      targetType: V1NotificationTargetType.match,
      targetId: matchId,
      title: '매치 신청 상태 안내',
      body: '신청한 매치가 접수되었습니다.',
      deepLink: `/matches/${matchId}`,
    },
    create: {
      id: '00000000-0000-4000-8000-000000000501',
      recipientUserId: userIds['applicant@teameet.v1'],
      targetType: V1NotificationTargetType.match,
      targetId: matchId,
      title: '매치 신청 상태 안내',
      body: '신청한 매치가 접수되었습니다.',
      deepLink: `/matches/${matchId}`,
    },
  });
}

async function seedAdmin(userIds: Record<string, string>) {
  await prisma.v1AdminUser.upsert({
    where: { userId: userIds['admin@teameet.v1'] },
    update: { adminRole: V1AdminRole.owner, status: 'active' },
    create: {
      userId: userIds['admin@teameet.v1'],
      adminRole: V1AdminRole.owner,
      status: 'active',
      grantedAt: new Date('2026-05-18T00:00:00.000Z'),
    },
  });
}

async function main() {
  await seedRuntimeCheck();
  const sportIds = await seedSports();
  const regions = await seedRegions();
  await seedTermsAndNotice();
  const userIds = await seedUsers();

  const runningLevel = await prisma.v1SportLevel.findFirstOrThrow({
    where: { sportId: sportIds.running, code: 'beginner' },
  });

  await prisma.v1UserSportPreference.upsert({
    where: { userId_sportId: { userId: userIds['host@teameet.v1'], sportId: sportIds.running } },
    update: { sportLevelId: runningLevel.id, isPrimary: true },
    create: { userId: userIds['host@teameet.v1'], sportId: sportIds.running, sportLevelId: runningLevel.id, isPrimary: true },
  });

  await prisma.v1UserRegion.upsert({
    where: { userId_regionId: { userId: userIds['host@teameet.v1'], regionId: regions.seoulGangnam.id } },
    update: { isPrimary: true },
    create: { userId: userIds['host@teameet.v1'], regionId: regions.seoulGangnam.id, isPrimary: true },
  });

  const { ownerTeam, applicantTeam } = await seedTeams(userIds, sportIds, regions.seoulGangnam.id);
  const match = await seedMatches(userIds, sportIds, regions.seoulGangnam.id);
  const teamMatch = await seedTeamMatches(userIds, sportIds, regions.seoulSongpa.id, ownerTeam.id, applicantTeam.id);

  await seedChatAndNotifications(userIds, match.id, teamMatch.id);
  await seedAdmin(userIds);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
