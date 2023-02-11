import { useAtom } from "jotai";
import { FC } from "react";
import { TBookCheckSummary } from "../../../server/api/routers/books";
import { api } from "../../../utils/api";
import { bookIdAtom } from "../store";
import { pageQualityModes, TFetchPageSettings, tlds } from "./PageFetcherSettings";

interface IPageSrcsFetcher {
  settings: TFetchPageSettings;
  bookSummary: TBookCheckSummary;
}

export const PageSrcsFetcher: FC<IPageSrcsFetcher> = (props) => {
  const { settings, bookSummary } = props;
  const [bookId, _] = useAtom(bookIdAtom);
  const {
    data: prLinks,
    refetch: prRefetch,
    isFetching,
  } = api.books.fetchAvailablePages.useQuery(
    { bookId, bookSummary, pageType: "PR", ...settings },
    { enabled: false }
  );

  return <div>PagesFetcher</div>;
};
