import { atom } from "jotai";
import { TBookCheckSummary } from "../../server/api/routers/books";

export const bookIdAtom = atom("bERxDwAAQBAJ");

export const bookSummaryAtom = atom<TBookCheckSummary | null>(null);
