import { http } from 'msw';
import { success, paged } from './_utils';
import { mockTeamMatch, mockTeamMatchApplication, mockMyTeamMatchApplications } from '../../fixtures/team-matches';

export const teamMatchesHandlers = [
  http.get('/api/v1/team-matches', ({ request }) => {
    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');
    const status = url.searchParams.get('status');
    const gender = url.searchParams.get('gender');

    const baseMatches = [
      mockTeamMatch,
      { ...mockTeamMatch, id: 'tm-2', gender: 'male' as const, status: 'scheduled' as const, title: '수요일 남성 팀 매치', hostTeamId: teamId ?? mockTeamMatch.hostTeamId },
      { ...mockTeamMatch, id: 'tm-3', gender: 'female' as const, status: 'completed' as const, title: '여성 팀 경기 기록', hostTeamId: teamId ?? mockTeamMatch.hostTeamId },
      { ...mockTeamMatch, id: 'tm-4', gender: 'female' as const, status: 'recruiting' as const, title: '여성 팀 매치 모집', hostTeamId: teamId ?? mockTeamMatch.hostTeamId },
    ];

    const filtered = baseMatches.filter((match) => {
      if (status && !status.split(',').includes(match.status)) return false;
      if (gender && match.gender !== gender) return false;
      return true;
    });

    return paged(filtered.map((match) => (teamId ? { ...match, hostTeamId: teamId } : match)));
  }),

  http.post('/api/v1/team-matches', () => {
    return success(mockTeamMatch);
  }),

  http.patch('/api/v1/team-matches/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return success({
      ...mockTeamMatch,
      id: params.id as string,
      ...body,
    });
  }),

  http.get('/api/v1/team-matches/me/applications', () => {
    return success(mockMyTeamMatchApplications);
  }),

  http.get('/api/v1/team-matches/:id', ({ params }) => {
    return success({ ...mockTeamMatch, id: params.id as string });
  }),

  http.post('/api/v1/team-matches/:id/apply', ({ params }) => {
    return success({ ...mockTeamMatchApplication, teamMatchId: params.id as string });
  }),

  http.get('/api/v1/team-matches/:id/applications', ({ params }) => {
    return success([{ ...mockTeamMatchApplication, teamMatchId: params.id as string }]);
  }),

  http.patch('/api/v1/team-matches/:id/applications/:appId/approve', ({ params }) => {
    return success({ id: params.appId as string, status: 'approved' });
  }),

  http.patch('/api/v1/team-matches/:id/applications/:appId/reject', ({ params }) => {
    return success({ id: params.appId as string, status: 'rejected' });
  }),

  http.post('/api/v1/team-matches/:id/check-in', ({ params }) => {
    return success({ teamMatchId: params.id as string, arrivedAt: new Date().toISOString() });
  }),

  http.post('/api/v1/team-matches/:id/result', ({ params }) => {
    return success({ ...mockTeamMatch, id: params.id as string, status: 'completed' });
  }),

  http.post('/api/v1/team-matches/:id/evaluate', ({ params }) => {
    return success({ teamMatchId: params.id as string, evaluated: true });
  }),

  http.get('/api/v1/team-matches/:id/referee-schedule', ({ params }) => {
    return success({
      hasReferee: mockTeamMatch.hasReferee,
      quarterCount: mockTeamMatch.quarterCount,
      schedule: null,
      teamMatchId: params.id as string,
    });
  }),
];
