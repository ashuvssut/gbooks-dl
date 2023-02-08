import { inferRouterOutputs, TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";
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
      try {
        const url =
          "https://books.google.com.sg/books?id=" +
          input.bookId +
          "&lpg=PR1&pg=PA294&source=entity_page&jscmd=click3";
        console.log(url);
        const response = await axios.get(url);
        return await checkBook(response.data.page);
      } catch (error: unknown) {
        const errors = error as Error | AxiosError;
        if (axios.isAxiosError(errors))
          throw new TRPCError({
            code: "BAD_REQUEST",
            cause: error,
            message:
              "Error! Either the Book is not available or the Book ID is incorrect.",
          });
        else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error,
          });
      }
    }),
  
});

type TRouterOutput = inferRouterOutputs<typeof booksRouter>;
export type TCheckResults = TRouterOutput["checkBook"];
