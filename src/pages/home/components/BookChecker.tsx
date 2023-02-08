import { useAtom } from "jotai";
import { FC, useEffect } from "react";
import { FormEvent, useRef, useState } from "react";
import { api } from "../../../utils/api";
import { bookIdAtom, checkResultsAtom } from "../store";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  FormHelperText,
  LinearProgress,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";

export const BookChecker: FC = ({}) => {
  const [bookId, setBookId] = useAtom(bookIdAtom);
  const [inputValue, setInputValue] = useState(bookId);
  const { data, refetch, isFetching, error, isError } =
    api.books.checkBook.useQuery({ bookId }, { enabled: false });
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue) return;
    setBookId(inputValue);
    refetch();
  };
  const [_, setCheckResults] = useAtom(checkResultsAtom);
  useEffect(() => {
    if (data) setCheckResults(data);
    else setCheckResults(null);
  }, [data]);
  return (
    <>
      <form onSubmit={onSubmit}>
        <Box display="flex" alignItems="flex-end" justifyContent="flex-start">
          <Box mr={1}>
            <TextField
              defaultValue={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
              placeholder="Enter book ID"
              label="Book ID"
              variant="standard"
              autoComplete="off"
            />
            {isFetching ? (
              <Box width="100%">
                <LinearProgress />
              </Box>
            ) : (
              <Box height={4} />
            )}
          </Box>
          <Button variant="contained" type="submit" endIcon={<SearchIcon />}>
            Check
          </Button>
        </Box>
      </form>
      {isError ? <FormHelperText error>{error?.message}</FormHelperText> : null}
    </>
  );
};
