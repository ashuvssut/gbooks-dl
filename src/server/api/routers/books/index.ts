import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { checkBook } from "./checkBook";

export type TPage = {
  pid: string;
  src?: string;
};
export const booksRouter = createTRPCRouter({
  checkBook: protectedProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ input }) => {
      return await checkBook(input.bookId);
    }),
});
