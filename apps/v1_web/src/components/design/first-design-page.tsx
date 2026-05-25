import { DesignFrame } from '@/components/design/design-frame';
import type { ReactNode } from 'react';
import {
  SMRevisionAdminMobile,
  SMRevisionApplicantTeamProfileSM1,
  SMRevisionApplicantUserProfileSM1,
  SMRevisionAuthFinalWelcome,
  SMRevisionAuthSM3Login,
  SMRevisionAuthSM3TermsStep,
  SMRevisionAuthSM4Confirm,
  SMRevisionAuthSM4Resume,
  SMRevisionAuthSM5LevelStep,
  SMRevisionAuthSM5RegionStep,
  SMRevisionAuthSM5SignupCompleteGuide,
  SMRevisionAuthSM5SportStep,
  SMRevisionAuthSM5TermsBeforeSignup,
  SMRevisionChatListMobileSM2,
  SMRevisionChatRoomMobileSM2,
  SMRevisionHomeMobileV2,
  SMRevisionHomeNoticeDetailFinal,
  SMRevisionHomeNoticeListFinal,
  SMRevisionHomeSearchFinalMobile,
  SMRevisionHomeSearchFinalNoInputMobile,
  SMRevisionHomeSearchFinalStateMobile,
  SMRevisionLandingMobile,
  SMRevisionMatchCreateConfirmStepSMFinal,
  SMRevisionMatchCreateInfoStepSMFinal,
  SMRevisionMatchCreateListEntrySMFinal,
  SMRevisionMatchCreatePlaceTimeStepSMFinal,
  SMRevisionMatchCreateShareCompleteSMFinal,
  SMRevisionMatchCreateSportStepSMFinal,
  SMRevisionMatchDetailMobileSM3,
  SMRevisionMatchEditSMFinal,
  SMRevisionMatchListMobileSM7,
  SMRevisionMatchParticipantsMobileSM5,
  SMRevisionMatchSM7EmptyTextState,
  SMRevisionMatchSM7FilterSheetOption,
  SMRevisionMatchSM7SearchErrorToastState,
  SMRevisionMyCreatedMatchManageSM1,
  SMRevisionMyMatchesCreatedSM1,
  SMRevisionMyMatchesJoinedSM1,
  SMRevisionMyPageSM1,
  SMRevisionMyTeamDetailSM1,
  SMRevisionMyTeamMembersSM1,
  SMRevisionMyTeamMatchEditSM1,
  SMRevisionMyTeamMatchesSM1,
  SMRevisionMyTeamsSM1,
  SMRevisionNotificationsMobileSM2,
  SMRevisionPaymentMobile,
  SMRevisionProfileReviewMobileSM2,
  SMRevisionProfileStateMobileSM2,
  SMRevisionTeamBrowseDetailSM5,
  SMRevisionTeamBrowseFilterSheetSM5,
  SMRevisionTeamBrowseMobileSM5,
  SMRevisionTeamBrowseSearchMobileSM5,
  SMRevisionTeamMatchCreateConditionStepSMFinal,
  SMRevisionTeamMatchCreateConfirmStepSMFinal,
  SMRevisionTeamMatchCreateInfoStepSMFinal,
  SMRevisionTeamMatchCreateListEntrySMFinal,
  SMRevisionTeamMatchCreatePlaceTimeStepSMFinal,
  SMRevisionTeamMatchCreateShareCompleteSMFinal,
  SMRevisionTeamMatchCreateSportStepSMFinal,
  SMRevisionTeamMatchCreateTeamStepSMFinal,
  SMRevisionTeamMatchDetailMobileSM2,
  SMRevisionTeamMatchEditSMFinal,
  SMRevisionTeamMatchListMobileSM4,
  SMRevisionTeamMatchSM4EmptyTextState,
  SMRevisionTeamMatchSM4FilterSheetOption,
  SMRevisionTeamMatchSM4SearchErrorToastState,
} from '@/design-source/sm-first-design';

export type FirstDesignScreen =
  | 'admin'
  | 'adminAudit'
  | 'applicantTeamProfile'
  | 'applicantUserProfile'
  | 'authConfirm'
  | 'authLevel'
  | 'authLogin'
  | 'authRegion'
  | 'authResume'
  | 'authSignup'
  | 'authSport'
  | 'authTerms'
  | 'authWelcome'
  | 'chatList'
  | 'chatRoom'
  | 'home'
  | 'landing'
  | 'matchCreateComplete'
  | 'matchCreateConfirm'
  | 'matchCreateInfo'
  | 'matchCreatePlaceTime'
  | 'matchCreateSport'
  | 'matchDetail'
  | 'matchEdit'
  | 'matchEmpty'
  | 'matchError'
  | 'matchFilter'
  | 'matchList'
  | 'matchParticipants'
  | 'my'
  | 'myCreatedMatchManage'
  | 'myMatchesCreated'
  | 'myMatchesJoined'
  | 'myTeamDetail'
  | 'myTeamMatchEdit'
  | 'myTeamMatches'
  | 'myTeamMembers'
  | 'myTeams'
  | 'noticeDetail'
  | 'noticeList'
  | 'notifications'
  | 'notificationsRead'
  | 'payment'
  | 'profile'
  | 'profilePrivate'
  | 'search'
  | 'searchEmpty'
  | 'searchError'
  | 'searchNew'
  | 'teamBrowse'
  | 'teamBrowseDetail'
  | 'teamBrowseEmpty'
  | 'teamBrowseError'
  | 'teamBrowseFilter'
  | 'teamMatchCreateComplete'
  | 'teamMatchCreateConfirm'
  | 'teamMatchCreateCondition'
  | 'teamMatchCreateInfo'
  | 'teamMatchCreatePlaceTime'
  | 'teamMatchCreateSport'
  | 'teamMatchCreateTeam'
  | 'teamMatchDetail'
  | 'teamMatchEdit'
  | 'teamMatchEmpty'
  | 'teamMatchError'
  | 'teamMatchFilter'
  | 'teamMatchList';

const screenMap: Record<FirstDesignScreen, { node: ReactNode }> = {
  admin: { node: <SMRevisionAdminMobile /> },
  adminAudit: { node: <SMRevisionAdminMobile /> },
  applicantTeamProfile: { node: <SMRevisionApplicantTeamProfileSM1 /> },
  applicantUserProfile: { node: <SMRevisionApplicantUserProfileSM1 /> },
  authConfirm: { node: <SMRevisionAuthSM4Confirm /> },
  authLevel: { node: <SMRevisionAuthSM5LevelStep /> },
  authLogin: { node: <SMRevisionAuthSM3Login /> },
  authRegion: { node: <SMRevisionAuthSM5RegionStep /> },
  authResume: { node: <SMRevisionAuthSM4Resume /> },
  authSignup: { node: <SMRevisionAuthSM5SignupCompleteGuide /> },
  authSport: { node: <SMRevisionAuthSM5SportStep /> },
  authTerms: { node: <SMRevisionAuthSM5TermsBeforeSignup /> },
  authWelcome: { node: <SMRevisionAuthFinalWelcome /> },
  chatList: { node: <SMRevisionChatListMobileSM2 /> },
  chatRoom: { node: <SMRevisionChatRoomMobileSM2 /> },
  home: { node: <SMRevisionHomeMobileV2 /> },
  landing: { node: <SMRevisionLandingMobile /> },
  matchCreateComplete: { node: <SMRevisionMatchCreateShareCompleteSMFinal /> },
  matchCreateConfirm: { node: <SMRevisionMatchCreateConfirmStepSMFinal /> },
  matchCreateInfo: { node: <SMRevisionMatchCreateInfoStepSMFinal /> },
  matchCreatePlaceTime: { node: <SMRevisionMatchCreatePlaceTimeStepSMFinal /> },
  matchCreateSport: { node: <SMRevisionMatchCreateSportStepSMFinal /> },
  matchDetail: { node: <SMRevisionMatchDetailMobileSM3 noTop /> },
  matchEdit: { node: <SMRevisionMatchEditSMFinal /> },
  matchEmpty: { node: <SMRevisionMatchSM7EmptyTextState /> },
  matchError: { node: <SMRevisionMatchSM7SearchErrorToastState /> },
  matchFilter: { node: <SMRevisionMatchSM7FilterSheetOption /> },
  matchList: { node: <SMRevisionMatchListMobileSM7 /> },
  matchParticipants: { node: <SMRevisionMatchParticipantsMobileSM5 noTop /> },
  my: { node: <SMRevisionMyPageSM1 /> },
  myCreatedMatchManage: { node: <SMRevisionMyCreatedMatchManageSM1 /> },
  myMatchesCreated: { node: <SMRevisionMyMatchesCreatedSM1 /> },
  myMatchesJoined: { node: <SMRevisionMyMatchesJoinedSM1 /> },
  myTeamDetail: { node: <SMRevisionMyTeamDetailSM1 /> },
  myTeamMatchEdit: { node: <SMRevisionMyTeamMatchEditSM1 /> },
  myTeamMatches: { node: <SMRevisionMyTeamMatchesSM1 /> },
  myTeamMembers: { node: <SMRevisionMyTeamMembersSM1 /> },
  myTeams: { node: <SMRevisionMyTeamsSM1 /> },
  noticeDetail: { node: <SMRevisionHomeNoticeDetailFinal /> },
  noticeList: { node: <SMRevisionHomeNoticeListFinal /> },
  notifications: { node: <SMRevisionNotificationsMobileSM2 /> },
  notificationsRead: { node: <SMRevisionNotificationsMobileSM2 readAll /> },
  payment: { node: <SMRevisionPaymentMobile /> },
  profile: { node: <SMRevisionProfileReviewMobileSM2 /> },
  profilePrivate: { node: <SMRevisionProfileStateMobileSM2 /> },
  search: { node: <SMRevisionHomeSearchFinalMobile /> },
  searchEmpty: { node: <SMRevisionHomeSearchFinalStateMobile state="empty" /> },
  searchError: { node: <SMRevisionHomeSearchFinalStateMobile state="error" /> },
  searchNew: { node: <SMRevisionHomeSearchFinalNoInputMobile /> },
  teamBrowse: { node: <SMRevisionTeamBrowseMobileSM5 /> },
  teamBrowseDetail: { node: <SMRevisionTeamBrowseDetailSM5 /> },
  teamBrowseEmpty: { node: <SMRevisionTeamBrowseSearchMobileSM5 state="empty" /> },
  teamBrowseError: { node: <SMRevisionTeamBrowseSearchMobileSM5 state="error" /> },
  teamBrowseFilter: { node: <SMRevisionTeamBrowseFilterSheetSM5 /> },
  teamMatchCreateComplete: { node: <SMRevisionTeamMatchCreateShareCompleteSMFinal /> },
  teamMatchCreateConfirm: { node: <SMRevisionTeamMatchCreateConfirmStepSMFinal /> },
  teamMatchCreateCondition: { node: <SMRevisionTeamMatchCreateConditionStepSMFinal /> },
  teamMatchCreateInfo: { node: <SMRevisionTeamMatchCreateInfoStepSMFinal /> },
  teamMatchCreatePlaceTime: { node: <SMRevisionTeamMatchCreatePlaceTimeStepSMFinal /> },
  teamMatchCreateSport: { node: <SMRevisionTeamMatchCreateSportStepSMFinal /> },
  teamMatchCreateTeam: { node: <SMRevisionTeamMatchCreateTeamStepSMFinal /> },
  teamMatchDetail: { node: <SMRevisionTeamMatchDetailMobileSM2 /> },
  teamMatchEdit: { node: <SMRevisionTeamMatchEditSMFinal /> },
  teamMatchEmpty: { node: <SMRevisionTeamMatchSM4EmptyTextState /> },
  teamMatchError: { node: <SMRevisionTeamMatchSM4SearchErrorToastState /> },
  teamMatchFilter: { node: <SMRevisionTeamMatchSM4FilterSheetOption /> },
  teamMatchList: { node: <SMRevisionTeamMatchListMobileSM4 /> },
};

export function FirstDesignPage({ screen }: { screen: FirstDesignScreen }) {
  const item = screenMap[screen];
  return <DesignFrame>{item.node}</DesignFrame>;
}
