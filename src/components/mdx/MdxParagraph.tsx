import type { ComponentProps } from "react";

export function MdxParagraph({ children }: ComponentProps<"p">) {
  return <p className="text-body my-5 leading-8">{children}</p>;
}
