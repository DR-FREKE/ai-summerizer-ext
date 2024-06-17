CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "Video" (
    "video_id" TEXT NOT NULL,
    "video_name" TEXT NOT NULL,
    "general_topic" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "video_thumbnail" TEXT NOT NULL,
    "video_url" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("video_id")
);

-- CreateTable
CREATE TABLE "Transcripts" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "video_id" TEXT NOT NULL,
    "vector" vector,

    CONSTRAINT "Transcripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimestampSummary" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "key_ideas" TEXT NOT NULL,
    "start_time" INTEGER NOT NULL,
    "tldr" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "TimestampSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightPoint" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "insight_id" TEXT NOT NULL,

    CONSTRAINT "InsightPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ratings" (
    "id" SERIAL NOT NULL,
    "total_rate" INTEGER NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "Ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_video_id_key" ON "Video"("video_id");

-- CreateIndex
CREATE INDEX "Video_video_id_video_name_idx" ON "Video"("video_id", "video_name");

-- CreateIndex
CREATE UNIQUE INDEX "Video_video_name_key" ON "Video"("video_name");

-- CreateIndex
CREATE INDEX "TimestampSummary_video_id_start_time_idx" ON "TimestampSummary"("video_id", "start_time");

-- CreateIndex
CREATE INDEX "Insight_video_id_idx" ON "Insight"("video_id");

-- AddForeignKey
ALTER TABLE "Transcripts" ADD CONSTRAINT "Transcripts_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimestampSummary" ADD CONSTRAINT "TimestampSummary_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightPoint" ADD CONSTRAINT "InsightPoint_insight_id_fkey" FOREIGN KEY ("insight_id") REFERENCES "Insight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;
