import { TPage } from "./fetchAvailablePages";
import { getMissingPages, getPid } from "./utils";

export const checkBook = async (pages: TPage[]) => {
  const [allFrontPgsIds, allBodyPgsIds] = pages.reduce(
    (acc, curr) => {
      if (curr.pid.startsWith("PR")) acc[0]!.push(getPid(curr.pid));
      else if (curr.pid.startsWith("PA")) acc[1]!.push(getPid(curr.pid));
      return acc;
    },
    [[], []] as number[][]
  );

  // remove duplicates and find missing pages
  const frontPgsIds = [...new Set(allFrontPgsIds)] as number[];
  const frPgMax = Math.max(...frontPgsIds);
  const frPgMin = Math.min(...frontPgsIds);
  const missingFrontPgs = getMissingPages(frontPgsIds, frPgMin, frPgMax);

  const bodyPgsIds = [...new Set(allBodyPgsIds)] as number[];
  const bodyPgMax = Math.max(...bodyPgsIds);
  const bodyPgMin = Math.min(...bodyPgsIds);
  const missingBodyPgs = getMissingPages(bodyPgsIds, bodyPgMin, bodyPgMax);

  return {
    missingFrontPgs,
    missingBodyPgs,
    totalFrontPgs: frPgMax,
    totalBodyPgs: bodyPgMax,
  };
};
