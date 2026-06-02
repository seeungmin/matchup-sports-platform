-- CreateEnum
CREATE TYPE "V1PostEventReviewSourceType" AS ENUM ('match', 'team_match');

-- CreateEnum
CREATE TYPE "V1PostEventReviewTargetType" AS ENUM ('user', 'team');

-- CreateEnum
CREATE TYPE "V1PostEventReviewStatus" AS ENUM ('submitted', 'hidden', 'removed');

-- CreateTable
CREATE TABLE "v1_post_event_reviews" (
    "id" TEXT NOT NULL,
    "reviewer_user_id" TEXT NOT NULL,
    "reviewer_team_id" TEXT,
    "source_type" "V1PostEventReviewSourceType" NOT NULL,
    "source_id" TEXT NOT NULL,
    "target_type" "V1PostEventReviewTargetType" NOT NULL,
    "target_user_id" TEXT,
    "target_team_id" TEXT,
    "rating" INTEGER NOT NULL,
    "status" "V1PostEventReviewStatus" NOT NULL DEFAULT 'submitted',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hidden_at" TIMESTAMP(3),
    "removed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v1_post_event_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v1_post_event_review_tags" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "tag_code" TEXT NOT NULL,
    "label_snapshot" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "v1_post_event_review_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "v1_post_event_reviews_reviewer_user_id_target_user_id_s_key" ON "v1_post_event_reviews"("reviewer_user_id", "target_user_id", "source_type", "source_id");

-- CreateIndex
CREATE UNIQUE INDEX "v1_post_event_reviews_reviewer_team_id_target_team_id_s_key" ON "v1_post_event_reviews"("reviewer_team_id", "target_team_id", "source_type", "source_id");

-- CreateIndex
CREATE INDEX "v1_post_event_reviews_reviewer_user_id_source_type_submit_idx" ON "v1_post_event_reviews"("reviewer_user_id", "source_type", "submitted_at");

-- CreateIndex
CREATE INDEX "v1_post_event_reviews_reviewer_team_id_source_type_submit_idx" ON "v1_post_event_reviews"("reviewer_team_id", "source_type", "submitted_at");

-- CreateIndex
CREATE INDEX "v1_post_event_reviews_target_user_id_submitted_at_idx" ON "v1_post_event_reviews"("target_user_id", "submitted_at");

-- CreateIndex
CREATE INDEX "v1_post_event_reviews_target_team_id_submitted_at_idx" ON "v1_post_event_reviews"("target_team_id", "submitted_at");

-- CreateIndex
CREATE INDEX "v1_post_event_reviews_source_type_source_id_idx" ON "v1_post_event_reviews"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "v1_post_event_reviews_target_type_idx" ON "v1_post_event_reviews"("target_type");

-- CreateIndex
CREATE INDEX "v1_post_event_reviews_status_idx" ON "v1_post_event_reviews"("status");

-- CreateIndex
CREATE UNIQUE INDEX "v1_post_event_review_tags_review_id_tag_code_key" ON "v1_post_event_review_tags"("review_id", "tag_code");

-- CreateIndex
CREATE INDEX "v1_post_event_review_tags_tag_code_idx" ON "v1_post_event_review_tags"("tag_code");

-- AddForeignKey
ALTER TABLE "v1_post_event_reviews" ADD CONSTRAINT "v1_post_event_reviews_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_post_event_reviews" ADD CONSTRAINT "v1_post_event_reviews_reviewer_team_id_fkey" FOREIGN KEY ("reviewer_team_id") REFERENCES "v1_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_post_event_reviews" ADD CONSTRAINT "v1_post_event_reviews_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "v1_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_post_event_reviews" ADD CONSTRAINT "v1_post_event_reviews_target_team_id_fkey" FOREIGN KEY ("target_team_id") REFERENCES "v1_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v1_post_event_review_tags" ADD CONSTRAINT "v1_post_event_review_tags_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "v1_post_event_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
