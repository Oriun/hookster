import React from "react";

export default function <T extends { [key: string]: string | number }>(
  queries: T
): [{ [key in keyof T]: boolean }, React.Ref<HTMLElement>];
