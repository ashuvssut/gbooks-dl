import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import React, { FC } from "react";
import { NotAvailable } from "../../../components/NotAvailable";
import { bookIdAtom, bookSummaryAtom } from "../store";

export const CheckResults: FC = () => {
  const [checkResults, _] = useAtom(bookSummaryAtom);
  const [bookId, __] = useAtom(bookIdAtom);

  if (!checkResults) return <NotAvailable />;
  const { totalBodyPgs, totalFrontPgs, missingBodyPgs, missingFrontPgs } =
    checkResults;
  const availableBodyPgsCnt = totalBodyPgs - missingBodyPgs.length;
  const availableFrontPgsCnt = totalFrontPgs - missingFrontPgs.length;
  const availableBookPages = availableBodyPgsCnt + availableFrontPgsCnt;
  return (
    <Box>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            Book Found
          </Typography>
          <Typography variant="h4">Book ID: {bookId}</Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Total Pages: {totalBodyPgs + totalFrontPgs}
          </Typography>

          <Typography variant="h5">Summary</Typography>
          <Typography variant="subtitle1">
            {availableBookPages} out of {totalBodyPgs + totalFrontPgs} pages are
            available.
            {availableBookPages !== 0 &&
              " Others might need manual downloading using a VPN"}
          </Typography>

          <PageTypeSummary
            type="Front Matter"
            availablePages={availableFrontPgsCnt}
            totalPages={totalFrontPgs}
            missingPages={missingFrontPgs}
          />
          <PageTypeSummary
            type="Body"
            availablePages={availableBodyPgsCnt}
            totalPages={totalBodyPgs}
            missingPages={missingBodyPgs}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

interface IPageTypeSummary {
  availablePages: number;
  totalPages: number;
  missingPages: number[];
  type: string;
}
const PageTypeSummary: FC<IPageTypeSummary> = ({
  availablePages,
  totalPages,
  type,
  missingPages,
}) => {
  return (
    <Accordion disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h6">{type} pages</Typography>
          <Typography variant="overline" color="text.secondary">
            {availablePages} out of {totalPages} available
          </Typography>
        </Box>
      </AccordionSummary>
      {missingPages.length !== 0 && (
        <AccordionDetails>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle1">Missing Pages</Typography>
            <Chip label={missingPages.length} color="secondary" size="small" />
          </Box>
          <Typography variant="body2">{missingPages.join(", ")}</Typography>
        </AccordionDetails>
      )}
    </Accordion>
  );
};
