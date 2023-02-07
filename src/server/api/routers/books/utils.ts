export const getPid = (pid: string): number => {
  return parseInt(pid.replace(/\D/g, ""));
};

export const getMissingPages = (
  pageIds: number[],
  min: number,
  max: number
) => {
  const missingPages: number[] = [];
  for (let i = min; i <= max; i++)
    if (!pageIds.includes(i)) missingPages.push(i);
  return missingPages;
};
