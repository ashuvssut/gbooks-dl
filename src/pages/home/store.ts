import { atom } from "jotai";
import { TCheckResults } from "../../server/api/routers/books";

export const bookIdAtom = atom("bERxDwAAQBAJ");

export const checkResultsAtom = atom<TCheckResults | null>(null);
