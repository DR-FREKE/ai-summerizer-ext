CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "video_id" TEXT NOT NULL,
    "video_name" TEXT NOT NULL,
    "general_topic" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "video_url" TEXT,
    "category" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("video_id")
);

-- CreateTable
CREATE TABLE "Thumbnail" (
    "id" SERIAL NOT NULL,
    "video_id" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,

    CONSTRAINT "Thumbnail_pkey" PRIMARY KEY ("id")
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
    "start_time" INTEGER NOT NULL,
    "tldr" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "TimestampSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyIdeas" (
    "id" SERIAL NOT NULL,
    "idea" TEXT,
    "timestamp_id" TEXT NOT NULL,

    CONSTRAINT "KeyIdeas_pkey" PRIMARY KEY ("id")
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
    "article_id" INTEGER NOT NULL,

    CONSTRAINT "Ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAnswer" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "QuestionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_video_id_key" ON "Article"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "Video_video_id_key" ON "Video"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "Video_slug_key" ON "Video"("slug");

-- CreateIndex
CREATE INDEX "Video_video_id_video_name_idx" ON "Video"("video_id", "video_name");

-- CreateIndex
CREATE INDEX "Video_created_at_idx" ON "Video"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Video_video_name_key" ON "Video"("video_name");

-- CreateIndex
CREATE INDEX "Thumbnail_video_id_idx" ON "Thumbnail"("video_id");

-- CreateIndex
CREATE INDEX "Transcripts_video_id_idx" ON "Transcripts"("video_id");

-- CreateIndex
CREATE INDEX "TimestampSummary_id_idx" ON "TimestampSummary"("id");

-- CreateIndex
CREATE INDEX "TimestampSummary_video_id_idx" ON "TimestampSummary"("video_id");

-- CreateIndex
CREATE INDEX "KeyIdeas_timestamp_id_idx" ON "KeyIdeas"("timestamp_id");

-- CreateIndex
CREATE INDEX "Insight_video_id_idx" ON "Insight"("video_id");

-- CreateIndex
CREATE INDEX "InsightPoint_insight_id_idx" ON "InsightPoint"("insight_id");

-- CreateIndex
CREATE INDEX "Ratings_article_id_idx" ON "Ratings"("article_id");

-- CreateIndex
CREATE INDEX "QuestionAnswer_video_id_idx" ON "QuestionAnswer"("video_id");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thumbnail" ADD CONSTRAINT "Thumbnail_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcripts" ADD CONSTRAINT "Transcripts_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimestampSummary" ADD CONSTRAINT "TimestampSummary_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyIdeas" ADD CONSTRAINT "KeyIdeas_timestamp_id_fkey" FOREIGN KEY ("timestamp_id") REFERENCES "TimestampSummary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightPoint" ADD CONSTRAINT "InsightPoint_insight_id_fkey" FOREIGN KEY ("insight_id") REFERENCES "Insight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;
