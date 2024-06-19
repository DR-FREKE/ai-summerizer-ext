"use server";

import prisma from "@/lib/db";

/** function to get article by ID */
export const getArticleById = async (id: number) => {
  return true;
};

export const rateArticle = async (article_id: number, rate: number) => {
  // check if article exist by calling getArticleById and passing it the params
  const article = await getArticleById(article_id);

  if (article) {
    try {
      const add_rate = await prisma.ratings.create({
        data: {
          article_id,
          rate,
        },
      });
      return add_rate;
    } catch (error) {}
  }
};
