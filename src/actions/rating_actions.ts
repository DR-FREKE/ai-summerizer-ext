"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

/** function to get article by ID */
export const getArticleById = async (id: number) => {
  try {
    const article = await prisma.article.findUnique({ where: { id } });
    return article;
  } catch (error) {
    return error;
  }
};

export const rateArticle = async (article_id: number, rate: number, pathname: string) => {
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
    } catch (error) {
      return { error };
    }
  }
  revalidatePath(pathname);
};
