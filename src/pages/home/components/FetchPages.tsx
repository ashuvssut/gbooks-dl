import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import React, { FC, useState } from "react";
import { api } from "../../../utils/api";
import { bookIdAtom, checkResultsAtom } from "../store";

type TPageQuality = "High" | "Medium" | "Low";
export const FetchPages: FC = () => {
  const [bookSummary, _] = useAtom(checkResultsAtom);
  const [bookId, __] = useAtom(bookIdAtom);
  const [pageQuality, setPageQuality] = useState<TPageQuality>("High");
  const [tld, setTld] = useState("com.sg");
  const [usePlaceholder, setUsePlaceholder] = useState(true); // use blank placeholder pages for missing pages

  const { data, refetch, isFetching, error, isError } =
    api.books.fetchAvailablePages.useQuery(
      // @ts-ignore: bookSummary is not null. But zod will reject request when its null.
      // TODO: fix bookSummary type to not be null
      { bookId, bookSummary, pageQuality, usePlaceholder, tld, pageType: "PR" },
      { enabled: false }
    );

  if (!bookSummary)
    return (
      <Typography color="text.secondary" mt={1}>
        N/A
      </Typography>
    );

  const tlds = ["com.sg", "com", "co.in", "de"];
  return (
    <Box>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <FormControl sx={{ display: "block" }}>
            <InputLabel id="page-quality-label">Page Quality</InputLabel>
            <Select
              labelId="page-quality-label"
              id="page-quality"
              value={pageQuality}
              label="Page Quality"
              onChange={(e) => setPageQuality(e.target.value as TPageQuality)}
              sx={{ width: 200 }}
              required
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ display: "block", mt: 1 }}>
            <InputLabel id="tld-label">TLD of page image URLs</InputLabel>
            <Select
              labelId="tld-label"
              id="tld"
              value={tld}
              label="TLD of page image URLs"
              onChange={(e) => setTld(e.target.value)}
              sx={{ width: 200 }}
              required
            >
              {tlds.map((tld) => (
                <MenuItem value={tld} key={tld}>
                  .{tld}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={usePlaceholder}
                onChange={(e) => setUsePlaceholder(e.target.checked)}
              />
            }
            label="Use blank pages for missing pages"
          />
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => refetch()}>
            Fetch
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
