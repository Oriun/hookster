import React from "react";

export type Query = { [key: string]: string | number };

export default function <
  S extends HTMLElement = HTMLElement,
  T extends Query = Query
>(queries: T): [{ [key in keyof T]: boolean }, React.RefObject<S>];
