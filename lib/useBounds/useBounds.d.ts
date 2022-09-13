import React from "react";

export type useBoundsParams = {
  defaultValue?: number;
  min?: number;
  max?: number;
};

export default function useBounds({
  defaultValue,
  max = 100,
  min = 0
}: useBoundsParams): [number, React.Dispatch<React.SetStateAction<number>>];
export default useBounds;
