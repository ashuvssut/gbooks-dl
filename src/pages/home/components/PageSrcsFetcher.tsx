import { Autorenew, DataObject, ExpandMore } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  CircularProgress,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useAtom } from "jotai";
import { FC, useState } from "react";
import {
  TBookCheckSummary,
  TFetchAvailPagesInput,
} from "../../../server/api/routers/books";
import { api } from "../../../utils/api";
import { bookIdAtom } from "../store";
import { TFetchPageSettings } from "./PageFetcherSettings";

interface IPageSrcsFetcher {
  settings: TFetchPageSettings;
  bookSummary: TBookCheckSummary;
}
export const PageSrcsFetcher: FC<IPageSrcsFetcher> = (props) => {
  // hacky approach to stop refetching by unmounting the Fetcher
  // see `trpc: { abortOnUnmount: true }`
  const [remountKey1, setRemountKey1] = useState(false);
  const [remountKey2, setRemountKey2] = useState(false);
  const remounter1 = () => setRemountKey1((prev) => !prev);
  const remounter2 = () => setRemountKey2((prev) => !prev);
  return (
    <>
      <Typography variant="h6" mt={1}>
        Fetch and Download Page Sources JSON
      </Typography>
      <FetchAccordion
        title="Front Matter"
        pageType="PR"
        {...props}
        key={remountKey1 ? "PR-re1" : "PR-re2"}
        remounter={remounter1}
      />
      <FetchAccordion
        title="Body"
        pageType="PA"
        {...props}
        key={remountKey2 ? "PA-re1" : "PA-re2"}
        remounter={remounter2}
      />
    </>
  );
};

interface IFetchAccordion extends IPageSrcsFetcher {
  title: string;
  pageType: TFetchAvailPagesInput["pageType"];
  remounter: () => void;
}
const FetchAccordion: FC<IFetchAccordion> = (props) => {
  const { title, pageType, settings, bookSummary, remounter } = props;
  const [bookId, _] = useAtom(bookIdAtom);
  const {
    data: d,
    refetch,
    isFetching,
    error,
    isError,
  } = api.books.fetchAvailablePages.useQuery(
    { bookId, pageType, bookSummary, ...settings },
    { enabled: false, trpc: { abortOnUnmount: true } }
  );

  return (
    <Accordion disableGutters sx={{ "&:before": { display: "none" } }}>
      <AccordionSummary
        expandIcon={
          d && d.failedPages.length !== 0 ? <ExpandMore /> : undefined
        }
        aria-controls="fetcher-content"
        id="fetcher-header"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box display="flex" gap={1} alignItems="center">
            <Typography variant="h6">Fetch {title} pages</Typography>
            <LoadingButton
              size="small"
              variant="outlined"
              onClick={() => {
                isFetching ? remounter() : refetch();
              }}
              startIcon={
                isFetching ? <CircularProgress size={15} /> : <Autorenew />
              }
            >
              {!isFetching ? "Fetch JSON" : "Cancel Fetch"}
            </LoadingButton>
            <Button
              size="small"
              variant="contained"
              disabled={d === undefined}
              onClick={() => {
                const blob = new Blob([JSON.stringify(d)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");

                a.href = url;
                a.download = `${bookId}-${pageType}-pageLinks.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              startIcon={<DataObject />}
            >
              Download JSON
            </Button>
          </Box>

          {d && (
            <Typography variant="overline" color="text.secondary">
              {Object.keys(d.pageLinks).length} Page image links fetched
            </Typography>
          )}
        </Box>
      </AccordionSummary>
      {isError ? <FormHelperText error>{error?.message}</FormHelperText> : null}
      {d && d.failedPages.length !== 0 && (
        <AccordionDetails>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle1">Failed Pages</Typography>
            <Chip label={d.failedPages.length} color="secondary" size="small" />
          </Box>
          <Typography variant="body2">{d.failedPages.join(", ")}</Typography>
        </AccordionDetails>
      )}
    </Accordion>
  );
};
