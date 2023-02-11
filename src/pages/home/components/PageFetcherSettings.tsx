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
import { NotAvailable } from "../../../components/NotAvailable";
import { bookSummaryAtom } from "../store";
import { PageSrcsFetcher } from "./PageSrcsFetcher";

export const pageQualityModes = ["High", "Medium", "Low"] as const;
export const tlds = ["com.sg", "com", "co.in", "de"] as const;
export type TFetchPageSettings = {
  pageQual: (typeof pageQualityModes)[number];
  tld: (typeof tlds)[number];
  usePlaceholder: boolean;
};
export const PageFetcherSettings: FC = () => {
  const [bookSummary, _] = useAtom(bookSummaryAtom);
  const [settings, setSettings] = useState<TFetchPageSettings>({
    pageQual: "Medium",
    tld: "com.sg",
    usePlaceholder: true, // use blank placeholder pages for missing pages
  });
  const [showFetcher, setShowFetcher] = useState(false);

  if (!bookSummary) return <NotAvailable />;
  return (
    <Box>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Query Settings
          </Typography>
          <FormControl sx={{ display: "block", mt: 1 }}>
            <InputLabel id="page-quality-label">Page Quality</InputLabel>
            <Select
              labelId="page-quality-label"
              id="page-quality"
              value={settings.pageQual}
              label="Page Quality"
              onChange={(e) =>
                setSettings({ ...settings, pageQual: e.target.value as any })
              }
              sx={{ width: 200 }}
              required
            >
              {pageQualityModes.map((mode) => (
                <MenuItem value={mode} key={mode}>
                  {mode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ display: "block", mt: 1 }}>
            <InputLabel id="tld-label">TLD of page image URLs</InputLabel>
            <Select
              labelId="tld-label"
              id="tld"
              value={settings.tld}
              label="TLD of page image URLs"
              onChange={(e) =>
                setSettings({ ...settings, tld: e.target.value as any })
              }
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
                checked={settings.usePlaceholder}
                onChange={(e) =>
                  setSettings({ ...settings, usePlaceholder: e.target.checked })
                }
              />
            }
            label="Use blank pages for missing pages"
          />
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setShowFetcher(true)}>
            Start Fetching
          </Button>
        </CardActions>
      </Card>
      {showFetcher && (
        <PageSrcsFetcher settings={settings} bookSummary={bookSummary} />
      )}
    </Box>
  );
};
