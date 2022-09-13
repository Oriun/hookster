import React from "react";

export type HistoricalRef<T> = React.MutableRefObject<T | null> & {
  ref: React.MutableRefObject<T | null>;
  last: React.MutableRefObject<(T | null)[]>["current"];
};

export default function useHistoryRef<T>(defaultValue: T | null = null): HistoricalRef<T> 