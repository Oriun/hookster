import React from "react";

export type Query = { [key: string]: string | number };

export default function <T extends Query, S extends HTMLElement = HTMLElement>(
  queries: T
): [{ [key in keyof T]: boolean }, React.RefObject<S>];
