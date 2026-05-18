-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "V1AccountStatus" AS ENUM ('active', 'suspended', 'blocked', 'withdrawal_pending', 'deleted');

-- CreateEnum
CREATE TYPE "V1OnboardingStatus" AS ENUM ('not_started', 'terms_done', 'signup_done', 'sport_done', 'level_done', 'region_done', 'completed', 'deferred');

-- CreateEnum
CREATE TYPE "V1AuthProvider" AS ENUM ('kakao', 'naver', 'email');

-- CreateEnum
CREATE TYPE "V1AuthIdentityStatus" AS ENUM ('active', 'unlinked', 'blocked');

-- CreateEnum
CREATE TYPE "V1TermsDocumentStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "V1TermsKind" AS ENUM ('terms', 'privacy', 'marketing');

-- CreateEnum
CREATE TYPE "V1NoticeAudience" AS ENUM ('public', 'users', 'admins');

-- CreateEnum
CREATE TYPE "V1NoticeStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "V1TrustState" AS ENUM ('verified', 'estimated', 'sample', 'none');

-- CreateEnum
CREATE TYPE "V1MatchStatus" AS ENUM ('recruiting', 'closed', 'cancelled', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "V1MatchApplicationStatus" AS ENUM ('requested', 'approved', 'rejected', 'withdrawn', 'cancelled_by_host', 'expired');

-- CreateEnum
CREATE TYPE "V1MatchParticipantRole" AS ENUM ('host', 'participant');

-- CreateEnum
CREATE TYPE "V1MatchParticipantStatus" AS ENUM ('active', 'removed', 'cancelled', 'no_show', 'completed');

-- CreateEnum
CREATE TYPE "V1TeamStatus" AS ENUM ('active', 'suspended', 'archived');

-- CreateEnum
CREATE TYPE "V1TeamJoinPolicy" AS ENUM ('approval_required', 'closed');

-- CreateEnum
CREATE TYPE "V1TeamMembershipRole" AS ENUM ('owner', 'manager', 'member');

-- CreateEnum
CREATE TYPE "V1TeamMembershipStatus" AS ENUM ('active', 'removed', 'left');

-- CreateEnum
CREATE TYPE "V1TeamJoinApplicationStatus" AS ENUM ('requested', 'approved', 'rejected', 'withdrawn', 'expired');

-- CreateEnum
CREATE TYPE "V1TeamMatchStatus" AS ENUM ('recruiting', 'matched', 'cancelled', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "V1TeamMatchApplicationStatus" AS ENUM ('requested', 'approved', 'rejected', 'withdrawn', 'expired');

-- CreateEnum
CREATE TYPE "V1ChatRoomStatus" AS ENUM ('active', 'archived');

-- CreateEnum
CREATE TYPE "V1ChatParticipantStatus" AS ENUM ('active', 'left');

-- CreateEnum
CREATE TYPE "V1ChatMessageStatus" AS ENUM ('sent', 'hidden', 'deleted');

-- CreateEnum
CREATE TYPE "V1NotificationTargetType" AS ENUM ('match', 'team', 'team_match', 'chat', 'notice', 'system');

-- CreateEnum
CREATE TYPE "V1AdminRole" AS ENUM ('owner', 'ops', 'support');

-- CreateEnum
CREATE TYPE "V1AdminStatus" AS ENUM ('active', 'suspended', 'revoked');

-- CreateEnum
CREATE TYPE "V1StatusActorType" AS ENUM ('user', 'admin', 'system');

-- CreateTable
CREATE TABLE "v1_runtime_checks" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_runtime_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "account_status" "V1AccountStatus" NOT NULL DEFAULT 'active',
    "onboarding_status" "V1OnboardingStatus" NOT NULL DEFAULT 'not_started',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "v1_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_auth_identities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "V1AuthProvider" NOT NULL,
    "provider_user_key" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT,
    "status" "V1AuthIdentityStatus" NOT NULL DEFAULT 'active',
    "last_login_at" TIMESTAMP(3),
    "unlinked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_auth_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "profile_image_url" TEXT,
    "bio" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "display_name" TEXT,
    "display_region" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "v1_user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_user_onboarding_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "current_step" TEXT NOT NULL DEFAULT 'terms',
    "draft_json" JSONB,
    "completed_at" TIMESTAMP(3),
    "deferred_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_user_onboarding_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_terms_documents" (
    "id" TEXT NOT NULL,
    "kind" "V1TermsKind" NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "V1TermsDocumentStatus" NOT NULL DEFAULT 'draft',
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_terms_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_user_terms_consents" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "terms_document_id" TEXT NOT NULL,
    "accepted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_user_terms_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_sports" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_sport_levels" (
    "id" TEXT NOT NULL,
    "sport_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_sport_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_regions" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_notices" (
    "id" TEXT NOT NULL,
    "audience" "V1NoticeAudience" NOT NULL DEFAULT 'public',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "V1NoticeStatus" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_user_sport_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "sport_id" TEXT NOT NULL,
    "sport_level_id" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_user_sport_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_user_regions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_user_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_user_reputation_summaries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "trust_state" "V1TrustState" NOT NULL DEFAULT 'sample',
    "manner_score" DECIMAL(4,2),
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "source_label" TEXT,
    "calculated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_user_reputation_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_matches" (
    "id" TEXT NOT NULL,
    "host_user_id" TEXT NOT NULL,
    "sport_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "place_name" TEXT NOT NULL,
    "place_address" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3),
    "max_participants" INTEGER NOT NULL,
    "level_note" TEXT,
    "gender_rule" TEXT,
    "cost_note" TEXT,
    "status" "V1MatchStatus" NOT NULL DEFAULT 'recruiting',
    "cancelled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "v1_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_match_applications" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "applicant_user_id" TEXT NOT NULL,
    "status" "V1MatchApplicationStatus" NOT NULL DEFAULT 'requested',
    "message" TEXT,
    "reviewed_by_user_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "withdrawn_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_match_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_match_participants" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "application_id" TEXT,
    "role" "V1MatchParticipantRole" NOT NULL DEFAULT 'participant',
    "status" "V1MatchParticipantStatus" NOT NULL DEFAULT 'active',
    "approved_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_match_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_teams" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "sport_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "V1TeamStatus" NOT NULL DEFAULT 'active',
    "join_policy" "V1TeamJoinPolicy" NOT NULL DEFAULT 'approval_required',
    "member_count" INTEGER NOT NULL DEFAULT 1,
    "manager_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "v1_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_team_profiles" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "logo_url" TEXT,
    "cover_image_url" TEXT,
    "description" TEXT,
    "activity_note" TEXT,
    "skill_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "v1_team_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_team_memberships" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "V1TeamMembershipRole" NOT NULL DEFAULT 'member',
    "status" "V1TeamMembershipStatus" NOT NULL DEFAULT 'active',
    "joined_at" TIMESTAMP(3),
    "left_at" TIMESTAMP(3),
    "removed_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_team_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_team_join_applications" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "applicant_user_id" TEXT NOT NULL,
    "status" "V1TeamJoinApplicationStatus" NOT NULL DEFAULT 'requested',
    "message" TEXT,
    "reviewed_by_user_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "withdrawn_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_team_join_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_team_trust_scores" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "trust_state" "V1TrustState" NOT NULL DEFAULT 'sample',
    "manner_score" DECIMAL(4,2),
    "match_count" INTEGER NOT NULL DEFAULT 0,
    "source_label" TEXT,
    "calculated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_team_trust_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_team_matches" (
    "id" TEXT NOT NULL,
    "host_team_id" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,
    "sport_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "place_name" TEXT NOT NULL,
    "place_address" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3),
    "format_note" TEXT,
    "gender_rule" TEXT,
    "cost_note" TEXT,
    "status" "V1TeamMatchStatus" NOT NULL DEFAULT 'recruiting',
    "approved_applicant_team_id" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "v1_team_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_team_match_applications" (
    "id" TEXT NOT NULL,
    "team_match_id" TEXT NOT NULL,
    "applicant_team_id" TEXT NOT NULL,
    "applied_by_user_id" TEXT NOT NULL,
    "status" "V1TeamMatchApplicationStatus" NOT NULL DEFAULT 'requested',
    "message" TEXT,
    "reviewed_by_user_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "withdrawn_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_team_match_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_chat_rooms" (
    "id" TEXT NOT NULL,
    "match_id" TEXT,
    "team_match_id" TEXT,
    "status" "V1ChatRoomStatus" NOT NULL DEFAULT 'active',
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_chat_room_participants" (
    "id" TEXT NOT NULL,
    "chat_room_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "V1ChatParticipantStatus" NOT NULL DEFAULT 'active',
    "pinned_at" TIMESTAMP(3),
    "last_read_message_id" TEXT,
    "left_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_chat_room_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_chat_messages" (
    "id" TEXT NOT NULL,
    "chat_room_id" TEXT NOT NULL,
    "sender_user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "V1ChatMessageStatus" NOT NULL DEFAULT 'sent',
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hidden_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_notifications" (
    "id" TEXT NOT NULL,
    "recipient_user_id" TEXT NOT NULL,
    "target_type" "V1NotificationTargetType" NOT NULL,
    "target_id" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "deep_link" TEXT,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_notification_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "important_enabled" BOOLEAN NOT NULL DEFAULT true,
    "activity_enabled" BOOLEAN NOT NULL DEFAULT true,
    "marketing_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_admin_users" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "admin_role" "V1AdminRole" NOT NULL,
    "status" "V1AdminStatus" NOT NULL DEFAULT 'active',
    "granted_by_admin_user_id" TEXT,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_admin_action_logs" (
    "id" TEXT NOT NULL,
    "admin_user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "reason" TEXT,
    "before_json" JSONB,
    "after_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "v1_admin_action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_status_change_logs" (
    "id" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "from_status" TEXT,
    "to_status" TEXT NOT NULL,
    "actor_type" "V1StatusActorType" NOT NULL,
    "actor_user_id" TEXT,
    "admin_user_id" TEXT,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "v1_status_change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "v1_runtime_checks_key_key" ON "v1_runtime_checks"("key");

-- CreateIndex
CREATE UNIQUE INDEX "v1_users_email_key" ON "v1_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "v1_users_phone_key" ON "v1_users"("phone");

-- CreateIndex
CREATE INDEX "v1_users_account_status_idx" ON "v1_users"("account_status");

-- CreateIndex
CREATE INDEX "v1_users_onboarding_status_idx" ON "v1_users"("onboarding_status");

-- CreateIndex
CREATE INDEX "v1_users_created_at_idx" ON "v1_users"("created_at");

-- CreateIndex
CREATE INDEX "v1_auth_identities_user_id_idx" ON "v1_auth_identities"("user_id");

-- CreateIndex
CREATE INDEX "v1_auth_identities_status_idx" ON "v1_auth_identities"("status");

-- CreateIndex
CREATE UNIQUE INDEX "v1_auth_identities_provider_provider_user_key_key" ON "v1_auth_identities"("provider", "provider_user_key");

-- CreateIndex
CREATE UNIQUE INDEX "v1_user_profiles_user_id_key" ON "v1_user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "v1_user_profiles_nickname_idx" ON "v1_user_profiles"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "v1_user_onboarding_progress_user_id_key" ON "v1_user_onboarding_progress"("user_id");

-- CreateIndex
CREATE INDEX "v1_terms_documents_status_idx" ON "v1_terms_documents"("status");

-- CreateIndex
CREATE INDEX "v1_terms_documents_created_at_idx" ON "v1_terms_documents"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "v1_terms_documents_kind_version_key" ON "v1_terms_documents"("kind", "version");

-- CreateIndex
CREATE INDEX "v1_user_terms_consents_terms_document_id_idx" ON "v1_user_terms_consents"("terms_document_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_user_terms_consents_user_id_terms_document_id_key" ON "v1_user_terms_consents"("user_id", "terms_document_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_sports_code_key" ON "v1_sports"("code");

-- CreateIndex
CREATE INDEX "v1_sports_is_active_sort_order_idx" ON "v1_sports"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "v1_sport_levels_sport_id_is_active_sort_order_idx" ON "v1_sport_levels"("sport_id", "is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "v1_sport_levels_sport_id_code_key" ON "v1_sport_levels"("sport_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "v1_regions_code_key" ON "v1_regions"("code");

-- CreateIndex
CREATE INDEX "v1_regions_parent_id_idx" ON "v1_regions"("parent_id");

-- CreateIndex
CREATE INDEX "v1_regions_level_is_active_sort_order_idx" ON "v1_regions"("level", "is_active", "sort_order");

-- CreateIndex
CREATE INDEX "v1_notices_audience_status_published_at_idx" ON "v1_notices"("audience", "status", "published_at");

-- CreateIndex
CREATE INDEX "v1_notices_created_at_idx" ON "v1_notices"("created_at");

-- CreateIndex
CREATE INDEX "v1_user_sport_preferences_sport_id_idx" ON "v1_user_sport_preferences"("sport_id");

-- CreateIndex
CREATE INDEX "v1_user_sport_preferences_sport_level_id_idx" ON "v1_user_sport_preferences"("sport_level_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_user_sport_preferences_user_id_sport_id_key" ON "v1_user_sport_preferences"("user_id", "sport_id");

-- CreateIndex
CREATE INDEX "v1_user_regions_region_id_idx" ON "v1_user_regions"("region_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_user_regions_user_id_region_id_key" ON "v1_user_regions"("user_id", "region_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_user_reputation_summaries_user_id_key" ON "v1_user_reputation_summaries"("user_id");

-- CreateIndex
CREATE INDEX "v1_user_reputation_summaries_trust_state_idx" ON "v1_user_reputation_summaries"("trust_state");

-- CreateIndex
CREATE INDEX "v1_matches_host_user_id_idx" ON "v1_matches"("host_user_id");

-- CreateIndex
CREATE INDEX "v1_matches_sport_id_region_id_status_start_at_idx" ON "v1_matches"("sport_id", "region_id", "status", "start_at");

-- CreateIndex
CREATE INDEX "v1_matches_status_idx" ON "v1_matches"("status");

-- CreateIndex
CREATE INDEX "v1_matches_start_at_idx" ON "v1_matches"("start_at");

-- CreateIndex
CREATE INDEX "v1_matches_created_at_idx" ON "v1_matches"("created_at");

-- CreateIndex
CREATE INDEX "v1_match_applications_applicant_user_id_status_idx" ON "v1_match_applications"("applicant_user_id", "status");

-- CreateIndex
CREATE INDEX "v1_match_applications_status_idx" ON "v1_match_applications"("status");

-- CreateIndex
CREATE INDEX "v1_match_applications_created_at_idx" ON "v1_match_applications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "v1_match_applications_match_id_applicant_user_id_key" ON "v1_match_applications"("match_id", "applicant_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_match_participants_application_id_key" ON "v1_match_participants"("application_id");

-- CreateIndex
CREATE INDEX "v1_match_participants_user_id_status_idx" ON "v1_match_participants"("user_id", "status");

-- CreateIndex
CREATE INDEX "v1_match_participants_role_status_idx" ON "v1_match_participants"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "v1_match_participants_match_id_user_id_key" ON "v1_match_participants"("match_id", "user_id");

-- CreateIndex
CREATE INDEX "v1_teams_owner_user_id_idx" ON "v1_teams"("owner_user_id");

-- CreateIndex
CREATE INDEX "v1_teams_sport_id_region_id_status_idx" ON "v1_teams"("sport_id", "region_id", "status");

-- CreateIndex
CREATE INDEX "v1_teams_status_idx" ON "v1_teams"("status");

-- CreateIndex
CREATE INDEX "v1_teams_created_at_idx" ON "v1_teams"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "v1_team_profiles_team_id_key" ON "v1_team_profiles"("team_id");

-- CreateIndex
CREATE INDEX "v1_team_memberships_user_id_status_idx" ON "v1_team_memberships"("user_id", "status");

-- CreateIndex
CREATE INDEX "v1_team_memberships_team_id_role_status_idx" ON "v1_team_memberships"("team_id", "role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "v1_team_memberships_team_id_user_id_key" ON "v1_team_memberships"("team_id", "user_id");

-- CreateIndex
CREATE INDEX "v1_team_join_applications_applicant_user_id_status_idx" ON "v1_team_join_applications"("applicant_user_id", "status");

-- CreateIndex
CREATE INDEX "v1_team_join_applications_status_idx" ON "v1_team_join_applications"("status");

-- CreateIndex
CREATE INDEX "v1_team_join_applications_created_at_idx" ON "v1_team_join_applications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "v1_team_join_applications_team_id_applicant_user_id_key" ON "v1_team_join_applications"("team_id", "applicant_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_team_trust_scores_team_id_key" ON "v1_team_trust_scores"("team_id");

-- CreateIndex
CREATE INDEX "v1_team_trust_scores_trust_state_idx" ON "v1_team_trust_scores"("trust_state");

-- CreateIndex
CREATE INDEX "v1_team_matches_host_team_id_idx" ON "v1_team_matches"("host_team_id");

-- CreateIndex
CREATE INDEX "v1_team_matches_created_by_user_id_idx" ON "v1_team_matches"("created_by_user_id");

-- CreateIndex
CREATE INDEX "v1_team_matches_sport_id_region_id_status_start_at_idx" ON "v1_team_matches"("sport_id", "region_id", "status", "start_at");

-- CreateIndex
CREATE INDEX "v1_team_matches_approved_applicant_team_id_idx" ON "v1_team_matches"("approved_applicant_team_id");

-- CreateIndex
CREATE INDEX "v1_team_matches_status_idx" ON "v1_team_matches"("status");

-- CreateIndex
CREATE INDEX "v1_team_matches_start_at_idx" ON "v1_team_matches"("start_at");

-- CreateIndex
CREATE INDEX "v1_team_matches_created_at_idx" ON "v1_team_matches"("created_at");

-- CreateIndex
CREATE INDEX "v1_team_match_applications_applicant_team_id_status_idx" ON "v1_team_match_applications"("applicant_team_id", "status");

-- CreateIndex
CREATE INDEX "v1_team_match_applications_applied_by_user_id_idx" ON "v1_team_match_applications"("applied_by_user_id");

-- CreateIndex
CREATE INDEX "v1_team_match_applications_status_idx" ON "v1_team_match_applications"("status");

-- CreateIndex
CREATE INDEX "v1_team_match_applications_created_at_idx" ON "v1_team_match_applications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "v1_team_match_applications_team_match_id_applicant_team_id_key" ON "v1_team_match_applications"("team_match_id", "applicant_team_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_chat_rooms_match_id_key" ON "v1_chat_rooms"("match_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_chat_rooms_team_match_id_key" ON "v1_chat_rooms"("team_match_id");

-- CreateIndex
CREATE INDEX "v1_chat_rooms_status_idx" ON "v1_chat_rooms"("status");

-- CreateIndex
CREATE INDEX "v1_chat_rooms_last_message_at_idx" ON "v1_chat_rooms"("last_message_at");

-- CreateIndex
CREATE INDEX "v1_chat_rooms_created_at_idx" ON "v1_chat_rooms"("created_at");

-- CreateIndex
CREATE INDEX "v1_chat_room_participants_user_id_status_idx" ON "v1_chat_room_participants"("user_id", "status");

-- CreateIndex
CREATE INDEX "v1_chat_room_participants_last_read_message_id_idx" ON "v1_chat_room_participants"("last_read_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_chat_room_participants_chat_room_id_user_id_key" ON "v1_chat_room_participants"("chat_room_id", "user_id");

-- CreateIndex
CREATE INDEX "v1_chat_messages_chat_room_id_sent_at_idx" ON "v1_chat_messages"("chat_room_id", "sent_at");

-- CreateIndex
CREATE INDEX "v1_chat_messages_sender_user_id_idx" ON "v1_chat_messages"("sender_user_id");

-- CreateIndex
CREATE INDEX "v1_chat_messages_status_idx" ON "v1_chat_messages"("status");

-- CreateIndex
CREATE INDEX "v1_notifications_recipient_user_id_read_at_created_at_idx" ON "v1_notifications"("recipient_user_id", "read_at", "created_at");

-- CreateIndex
CREATE INDEX "v1_notifications_target_type_target_id_created_at_idx" ON "v1_notifications"("target_type", "target_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "v1_notification_preferences_user_id_key" ON "v1_notification_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_admin_users_user_id_key" ON "v1_admin_users"("user_id");

-- CreateIndex
CREATE INDEX "v1_admin_users_admin_role_status_idx" ON "v1_admin_users"("admin_role", "status");

-- CreateIndex
CREATE INDEX "v1_admin_users_granted_by_admin_user_id_idx" ON "v1_admin_users"("granted_by_admin_user_id");

-- CreateIndex
CREATE INDEX "v1_admin_action_logs_admin_user_id_created_at_idx" ON "v1_admin_action_logs"("admin_user_id", "created_at");

-- CreateIndex
CREATE INDEX "v1_admin_action_logs_target_type_target_id_created_at_idx" ON "v1_admin_action_logs"("target_type", "target_id", "created_at");

-- CreateIndex
CREATE INDEX "v1_status_change_logs_target_type_target_id_created_at_idx" ON "v1_status_change_logs"("target_type", "target_id", "created_at");

-- CreateIndex
CREATE INDEX "v1_status_change_logs_actor_user_id_idx" ON "v1_status_change_logs"("actor_user_id");

-- CreateIndex
CREATE INDEX "v1_status_change_logs_admin_user_id_idx" ON "v1_status_change_logs"("admin_user_id");

-- AddForeignKey
ALTER TABLE "v1_auth_identities" ADD CONSTRAINT "v1_auth_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_user_profiles" ADD CONSTRAINT "v1_user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_user_onboarding_progress" ADD CONSTRAINT "v1_user_onboarding_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_user_terms_consents" ADD CONSTRAINT "v1_user_terms_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_user_terms_consents" ADD CONSTRAINT "v1_user_terms_consents_terms_document_id_fkey" FOREIGN KEY ("terms_document_id") REFERENCES "v1_terms_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_sport_levels" ADD CONSTRAINT "v1_sport_levels_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "v1_sports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_regions" ADD CONSTRAINT "v1_regions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "v1_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_user_sport_preferences" ADD CONSTRAINT "v1_user_sport_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_user_sport_preferences" ADD CONSTRAINT "v1_user_sport_preferences_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "v1_sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_user_sport_preferences" ADD CONSTRAINT "v1_user_sport_preferences_sport_level_id_fkey" FOREIGN KEY ("sport_level_id") REFERENCES "v1_sport_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_user_regions" ADD CONSTRAINT "v1_user_regions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_user_regions" ADD CONSTRAINT "v1_user_regions_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "v1_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_user_reputation_summaries" ADD CONSTRAINT "v1_user_reputation_summaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_matches" ADD CONSTRAINT "v1_matches_host_user_id_fkey" FOREIGN KEY ("host_user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_matches" ADD CONSTRAINT "v1_matches_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "v1_sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_matches" ADD CONSTRAINT "v1_matches_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "v1_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_match_applications" ADD CONSTRAINT "v1_match_applications_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "v1_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_match_applications" ADD CONSTRAINT "v1_match_applications_applicant_user_id_fkey" FOREIGN KEY ("applicant_user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_match_applications" ADD CONSTRAINT "v1_match_applications_reviewed_by_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "v1_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_match_participants" ADD CONSTRAINT "v1_match_participants_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "v1_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_match_participants" ADD CONSTRAINT "v1_match_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_match_participants" ADD CONSTRAINT "v1_match_participants_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "v1_match_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_teams" ADD CONSTRAINT "v1_teams_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_teams" ADD CONSTRAINT "v1_teams_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "v1_sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_teams" ADD CONSTRAINT "v1_teams_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "v1_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_profiles" ADD CONSTRAINT "v1_team_profiles_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "v1_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_memberships" ADD CONSTRAINT "v1_team_memberships_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "v1_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_memberships" ADD CONSTRAINT "v1_team_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_memberships" ADD CONSTRAINT "v1_team_memberships_removed_by_user_id_fkey" FOREIGN KEY ("removed_by_user_id") REFERENCES "v1_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_join_applications" ADD CONSTRAINT "v1_team_join_applications_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "v1_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_join_applications" ADD CONSTRAINT "v1_team_join_applications_applicant_user_id_fkey" FOREIGN KEY ("applicant_user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_join_applications" ADD CONSTRAINT "v1_team_join_applications_reviewed_by_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "v1_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_trust_scores" ADD CONSTRAINT "v1_team_trust_scores_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "v1_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_matches" ADD CONSTRAINT "v1_team_matches_host_team_id_fkey" FOREIGN KEY ("host_team_id") REFERENCES "v1_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_matches" ADD CONSTRAINT "v1_team_matches_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_matches" ADD CONSTRAINT "v1_team_matches_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "v1_sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_matches" ADD CONSTRAINT "v1_team_matches_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "v1_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_matches" ADD CONSTRAINT "v1_team_matches_approved_applicant_team_id_fkey" FOREIGN KEY ("approved_applicant_team_id") REFERENCES "v1_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_match_applications" ADD CONSTRAINT "v1_team_match_applications_team_match_id_fkey" FOREIGN KEY ("team_match_id") REFERENCES "v1_team_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_match_applications" ADD CONSTRAINT "v1_team_match_applications_applicant_team_id_fkey" FOREIGN KEY ("applicant_team_id") REFERENCES "v1_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_match_applications" ADD CONSTRAINT "v1_team_match_applications_applied_by_user_id_fkey" FOREIGN KEY ("applied_by_user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_team_match_applications" ADD CONSTRAINT "v1_team_match_applications_reviewed_by_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "v1_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_chat_rooms" ADD CONSTRAINT "v1_chat_rooms_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "v1_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_chat_rooms" ADD CONSTRAINT "v1_chat_rooms_team_match_id_fkey" FOREIGN KEY ("team_match_id") REFERENCES "v1_team_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_chat_room_participants" ADD CONSTRAINT "v1_chat_room_participants_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "v1_chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_chat_room_participants" ADD CONSTRAINT "v1_chat_room_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_chat_room_participants" ADD CONSTRAINT "v1_chat_room_participants_last_read_message_id_fkey" FOREIGN KEY ("last_read_message_id") REFERENCES "v1_chat_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_chat_messages" ADD CONSTRAINT "v1_chat_messages_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "v1_chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_chat_messages" ADD CONSTRAINT "v1_chat_messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_notifications" ADD CONSTRAINT "v1_notifications_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "v1_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_notification_preferences" ADD CONSTRAINT "v1_notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_admin_users" ADD CONSTRAINT "v1_admin_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "v1_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_admin_users" ADD CONSTRAINT "v1_admin_users_granted_by_admin_user_id_fkey" FOREIGN KEY ("granted_by_admin_user_id") REFERENCES "v1_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_admin_action_logs" ADD CONSTRAINT "v1_admin_action_logs_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "v1_admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_status_change_logs" ADD CONSTRAINT "v1_status_change_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "v1_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_status_change_logs" ADD CONSTRAINT "v1_status_change_logs_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "v1_admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddCheckConstraint
ALTER TABLE "v1_chat_rooms"
  ADD CONSTRAINT "v1_chat_rooms_exactly_one_target_check"
  CHECK (
    ("match_id" IS NOT NULL AND "team_match_id" IS NULL)
    OR ("match_id" IS NULL AND "team_match_id" IS NOT NULL)
  );
