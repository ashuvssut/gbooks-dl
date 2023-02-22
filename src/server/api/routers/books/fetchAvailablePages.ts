import axios from "axios";
import { TFetchAvailPagesInput } from "./";

export type TPage = {
  pid: string;
  src?: string;
};
export async function getPageSources(input: TFetchAvailPagesInput) {
  const { bookId, bookSummary, pageQual, tld, pageType } = input;
  console.log("fetching page sources", JSON.stringify(input, null, 2));
  const { missingFrontPgs, missingBodyPgs, totalFrontPgs, totalBodyPgs } =
    bookSummary;

  const missingTypePages = pageType === "PR" ? missingFrontPgs : missingBodyPgs;
  const totalTypePages = pageType === "PR" ? totalFrontPgs : totalBodyPgs;

  const widthParam =
    pageQual === "High" ? "&w=4208" : pageQual === "Medium" ? "&w=1280" : "";

  const pageSrcURL = (pid: string, sig: string) =>
    `https://books.google.${tld}/books/publisher/content?id=${bookId}&pg=${pid}&sig=${sig}${widthParam}&img=1&zoom=3`;

  const getJsonURL = (page: number) =>
    `https://books.google.${tld}/books?jscmd=click3&id=${bookId}&pg=${pageType}${page}`;

  async function getPageLinks() {
    const failedPages: number[] = [];
    const availablePages: number[] = [];
    for (let i = 1; i <= totalTypePages; i++)
      if (!missingTypePages.includes(i)) availablePages.push(i);

    const pageLinks: Record<string, string> = {};

    for (let i = 0; i < availablePages.length; i++) {
      console.log("loop count" + i, availablePages[i], availablePages);
      const jsonURL = getJsonURL(availablePages[i]!);
      const response = await axios.get(jsonURL);
      const pages: TPage[] = response.data.page;

      // get page object with pid that matched
      const page = pages.find((page) => page.pid === pageType + i);
      if (!page) continue;

      if (page.src) {
        const url = new URL(page.src);
        const sig = url.searchParams.get("sig")!;
        const cleanImageLink = pageSrcURL(page.pid, sig);
        pageLinks[page.pid] = cleanImageLink;
      } else failedPages.push(availablePages[i]!);

      console.log("pageLinks length", Object.keys(pageLinks).length);
      console.log("failedPages length", failedPages.length);
    }
    return { pageLinks, failedPages };
  }
  const { pageLinks, failedPages } = await getPageLinks();

  return { pageLinks, failedPages };
}
