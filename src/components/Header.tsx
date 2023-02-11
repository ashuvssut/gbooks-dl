import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { Avatar, Stack, Tooltip } from "@mui/material";
import { Session } from "next-auth";

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
      {sessionData ? <UserAvatar user={sessionData.user} /> : null}
      <Button
        variant="contained"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </Stack>
  );
};

export const UserAvatar: FC<{ user: Session["user"] }> = ({ user }) => {
  const src = user?.image || undefined;
  return (
    <Tooltip title={user?.name || ""}>
      <Avatar alt={user?.name || ""} src={src} sx={{ mr: 1 }} />
    </Tooltip>
  );
};
