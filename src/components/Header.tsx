import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { Stack } from "@mui/material";

export const Header: FC = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={600}
              sx={{ flexGrow: 1 }}
            >
              Google <span style={{ color: "#67B3FF" }}>Books</span> Downloader
            </Typography>
            <AuthShowcase />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};
export const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="body1" mx={1}>
        {sessionData && <span>{sessionData.user?.name}</span>}
      </Typography>
      <Button
        variant="contained"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </Stack>
  );
};
