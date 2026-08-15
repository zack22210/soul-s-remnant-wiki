"use client";

import { createContext, useContext, useRef, type MutableRefObject, type ReactNode } from "react";

const ParagraphIndexRefContext = createContext<MutableRefObject<number> | null>(null);

export function ArticleMdxScope({ children }: { children: ReactNode }) {
  const indexRef = useRef(0);
  return <ParagraphIndexRefContext.Provider value={indexRef}>{children}</ParagraphIndexRefContext.Provider>;
}

export function useArticleParagraphIndex() {
  return useContext(ParagraphIndexRefContext);
}
