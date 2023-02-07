import { TRPCError } from "@trpc/server";
import axios from "axios";
import { TPage } from ".";
import { getMissingPages, getPid } from "./utils";

export const checkBook = async (bookId: string) => {
  const url =
    "https://books.google.com.sg/books?id=" +
    bookId +
    "&lpg=PR1&pg=PA2&source=entity_page&jscmd=click3";
  const response = await axios.get(url);

  if (response.status !== 200)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Error! Either the Book is not available or the Book ID is incorrect.",
      cause: response.statusText,
    });

  const { page: pages }: { page: TPage[] } = response.data;

  const [allPrefaceIds, allPageIds] = pages.reduce(
    (acc, curr) => {
      if (curr.pid.startsWith("PR")) acc[0]!.push(getPid(curr.pid));
      else if (curr.pid.startsWith("PA")) acc[1]!.push(getPid(curr.pid));
      return acc;
    },
    [[], []] as number[][]
  );

  // remove duplicates and find missing pages
  const prefaceIds = [...new Set(allPrefaceIds)] as number[];
  const prfcMax = Math.max(...prefaceIds);
  const prfcMin = Math.min(...prefaceIds);
  const missingPrefaces = getMissingPages(prefaceIds, prfcMin, prfcMax);

  const pageIds = [...new Set(allPageIds)] as number[];
  const pageMax = Math.max(...pageIds);
  const pageMin = Math.min(...pageIds);
  const missingPages = getMissingPages(pageIds, pageMin, pageMax);

  return {
    missingPrefaces,
    missingPages,
    totalPrefaces: prfcMax,
    totalPages: pageMax,
  };
};
