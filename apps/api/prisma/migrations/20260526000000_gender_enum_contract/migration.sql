-- Normalize user profile gender to male/female and introduce MatchGender
-- for recruitment conditions.

UPDATE "users"
SET "gender" = NULL
WHERE "gender"::text NOT IN ('male', 'female');

ALTER TYPE "Gender" RENAME TO "Gender_old";
CREATE TYPE "Gender" AS ENUM ('male', 'female');

ALTER TABLE "users"
ALTER COLUMN "gender" TYPE "Gender"
USING (
  CASE
    WHEN "gender"::text IN ('male', 'female') THEN "gender"::text::"Gender"
    ELSE NULL
  END
);

DROP TYPE "Gender_old";

CREATE TYPE "MatchGender" AS ENUM ('any', 'male', 'female');

UPDATE "matches"
SET "gender" = 'any'
WHERE "gender" NOT IN ('any', 'male', 'female');

ALTER TABLE "matches"
ALTER COLUMN "gender" DROP DEFAULT;

ALTER TABLE "matches"
ALTER COLUMN "gender" TYPE "MatchGender"
USING "gender"::"MatchGender";

ALTER TABLE "matches"
ALTER COLUMN "gender" SET DEFAULT 'any';

ALTER TABLE "team_matches"
ADD COLUMN "gender" "MatchGender" NOT NULL DEFAULT 'any';
