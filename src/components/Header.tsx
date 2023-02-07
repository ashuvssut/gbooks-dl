import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { FC } from "react";

export const Header: FC = () => {
  return (
    <>
      <header className="shadow-1xl fixed top-0 left-0 flex w-full flex-row items-center justify-between gap-4 bg-[#0059B2]/50 p-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">
          Google <span className="text-[#67B3FF]">Books</span> Downloader
        </h1>

        <AuthShowcase />
      </header>
    </>
  );
};

export const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <div className="flex items-center justify-center gap-4">
      <p className="text-1xl text-center text-white">
        {sessionData && <span>{sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
