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

type TPageQuality = "High" | "Medium";
export const FetchPages: FC = () => {
  const [bookSummary, _] = useAtom(checkResultsAtom);
  const [bookId, __] = useAtom(bookIdAtom);
  const [pageQuality, setPageQuality] = useState<TPageQuality>("High");
  const [addPlaceholderPages, setAddPlaceholderPages] = useState(true);

  const { data, refetch, isFetching, error, isError } =
    api.books.fetchAvailablePages.useQuery(
      // @ts-ignore: bookSummary is not null. But zod will reject request when its null.
      // TODO: fix bookSummary type to not be null
      { bookId, bookSummary, pageQuality, usePlaceholder: addPlaceholderPages },
      { enabled: false }
    );

  if (!bookSummary)
    return (
      <Typography color="text.secondary" mt={1}>
        N/A
      </Typography>
    );

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
              sx={{ width: 150 }}
              required
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={addPlaceholderPages}
                onChange={(e) => setAddPlaceholderPages(e.target.checked)}
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
