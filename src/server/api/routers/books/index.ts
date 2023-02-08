import { inferRouterInputs, inferRouterOutputs, TRPCError } from "@trpc/server";
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

        // TODO: detect when Google Books is blocking the request and ask user to change network
        if (axios.isAxiosError(errors)) {
          console.log(errors.status);
          throw new TRPCError({
            code: "BAD_REQUEST",
            cause: error,
            message:
              "Error! Either Book ID is incorrect or Google Books is blocking the request.",
          });
        } else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error,
          });
      }
    }),
  fetchAvailablePages: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        bookSummary: z.object({
          missingPrefaces: z.array(z.number()),
          missingPages: z.array(z.number()),
          totalPrefaces: z.number(),
          totalPages: z.number(),
        }),
        pageQuality: z.union([z.literal("High"), z.literal("Medium")]),
        usePlaceholder: z.boolean(),
      })
    )
    .query(async ({ input }) => {
      const quality = input.pageQuality ? "&w=1280" : "";

      try {
      } catch (error: unknown) {
        const errors = error as Error | AxiosError;
        if (axios.isAxiosError(errors)) {
          console.log(errors.status);
          throw new TRPCError({
            code: "BAD_REQUEST",
            cause: error,
            message:
              "Error! Either Book ID is incorrect or Google Books is blocking the request.",
          });
        } else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error,
          });
      }
    }),
});

type TRouterOutput = inferRouterOutputs<typeof booksRouter>;
export type TCheckResults = TRouterOutput["checkBook"];

type TRouterInput = inferRouterInputs<typeof booksRouter>;
export type TFetchAvailPagesInput = TRouterInput["fetchAvailablePages"];

// 2 possible ways to get the data
// curl "https://books.google.com.sg/books\?id\=bERxDwAAQBAJ\&newbks\=0\&lpg\=PR1\&pg\=PR15\&source\=entity_page\&jscmd\=click3" -H "Accept: application/json"
// curl https://books.google.co.in/books\?id\=bERxDwAAQBAJ\&lpg\=PR1\&pg\=PR1\&source\=entity_page\&jscmd\=click3 -H "Accept: application/json"

// OLD SAVED LINKS
// 1. for images 1280 width
// https://books.google.co.in/books/publisher/content?id=bERxDwAAQBAJ&pg=PR13&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U0owslKXscadcY8RxQW-khypYO6Pg&w=1280
//
// curl command for https://books.google.com.sg/books?id=bERxDwAAQBAJ&lpg=PR293&pg=PA294&source=entity_page&jscmd=click3 is
// curl -X GET "https://books.google.com.sg/books?id=bERxDwAAQBAJ&lpg=PR293&pg=PA294&source=entity_page&jscmd=click3" -H "accept: */*"
