import axios from "axios";
import { TFetchAvailPagesInput } from "./";

export type TPage = {
  pid: string;
  src?: string;
};
export async function getPageSources(input: TFetchAvailPagesInput) {
  const { bookId, bookSummary, pageQual, tld, pageType } = input;

  const { missingPrefaces, missingPages, totalPrefaces, totalPages } =
    bookSummary;
  const missingTypePages = pageType === "PR" ? missingPrefaces : missingPages;
  const totalTypePages = pageType === "PR" ? totalPrefaces : totalPages;

  const widthParam =
    pageQual === "High" ? "&w=4208" : pageQual === "Medium" ? "&w=1280" : "";

  const pageSrcURL = (pid: string, sig: string) =>
    `https://books.google.${tld}/books/publisher/content?id=${bookId}&pg=${pid}&sig=${sig}${widthParam}&img=1&zoom=3`;

  const availablePages: number[] = [];
  for (let i = 1; i <= totalTypePages; i++)
    if (!missingTypePages.includes(i)) availablePages.push(i);

  const pageLinks: Record<string, string> = {};

  let previousAvailablePagesLength = availablePages.length;
  let fetchRepeatCount = 0;
  let tryIndex = 0; // TODO: randomize tryIndex instead of 0
  while (availablePages.length !== 0) {
    if (tryIndex >= availablePages.length) tryIndex = 0;

    if (previousAvailablePagesLength === availablePages.length) {
      fetchRepeatCount++;
      if (fetchRepeatCount > 5) {
        console.log("fetchRepeatCount > 5");
        break;
      }
    } else fetchRepeatCount = 0;

    const jsonURL = `https://books.google.${tld}/books?jscmd=click3&id=${bookId}&pg=${pageType}${availablePages[tryIndex]}`;
    const response = await axios.get(jsonURL);
    const pages: TPage[] = response.data.page;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]!;

      const pidType = page.pid.slice(0, 2) as typeof pageType;
      if (pidType !== pageType) continue;

      if (page.src) {
        const url = new URL(page.src);
        const sig = url.searchParams.get("sig")!;
        const cleanImageLink = pageSrcURL(page.pid, sig);
        pageLinks[page.pid] = cleanImageLink;

        // search for pid number in availablePages and remove it
        const pidNumber = parseInt(page.pid.replace(pageType, ""));
        const index = availablePages.indexOf(pidNumber);
        if (index > -1) availablePages.splice(index, 1);
        previousAvailablePagesLength--;
      } else break;
    }
  }

  return { pageLinks, failedPages: availablePages };
}
