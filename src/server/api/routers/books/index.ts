import { inferRouterOutputs, TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { checkBook } from "./checkBook";
import { getPageSources } from "./fetchAvailablePages";

const fetchAvailablePagesSchema = z.object({
  bookId: z.string(),
  bookSummary: z.object({
    missingFrontPgs: z.array(z.number()),
    missingBodyPgs: z.array(z.number()),
    totalFrontPgs: z.number(),
    totalBodyPgs: z.number(),
  }),
  pageQual: z.union([z.literal("High"), z.literal("Medium"), z.literal("Low")]),
  usePlaceholder: z.boolean(),
  tld: z.string(),
  pageType: z.union([z.literal("PR"), z.literal("PA")]),
});
export type TFetchAvailPagesInput = z.infer<typeof fetchAvailablePagesSchema>;
export const booksRouter = createTRPCRouter({
  checkBook: protectedProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ input }) => {
      try {
        const url = `https://books.google.com.sg/books?jscmd=click3&id=${input.bookId}&pg=PR1`;
        const response = await axios.get(url);
        return await checkBook(response.data.page);
      } catch (error: unknown) {
        const errors = error as Error | AxiosError;

        // TODO: detect when Google Books is blocking the request and ask user to change network with FORBIDDEN
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
    .input(fetchAvailablePagesSchema)
    .query(async ({ input }) => {
      try {
        const { pageLinks, failedPages } = await getPageSources(input);

        return { pageLinks, failedPages };
      } catch (error: unknown) {
        const errors = error as Error | AxiosError;
        if (axios.isAxiosError(errors)) {
          console.log(errors.status);
          throw new TRPCError({
            code: "BAD_REQUEST",
            cause: error,
            message: "",
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
export type TBookCheckSummary = TRouterOutput["checkBook"];
