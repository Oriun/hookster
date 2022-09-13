import { HistoricalRef } from "@oriun/use-historical-ref";

export const enum DIRECTIONS {
  Horizontal = 0,
  Vertical = 1
}
export type OnMoveParams = {
  element: HTMLElement;
  start: number;
  current: number;
  end: number;
};

export type OnMoveFunction = (params: OnMoveParams) => void;
export type OnCancelFunction = (params: {
  element: HTMLElement;
  end: HistoricalRef<number>;
}) => void;

export type useSwipeParams = {
  direction?: DIRECTIONS;
  minThreeshold?: number;
  onMove?: OnMoveFunction | null;
  onCancel?: OnCancelFunction | null;
  activated?: boolean;
  fps?: number;
};

export default function useSwipe<T extends HTMLElement>({
  direction = DIRECTIONS.Horizontal,
  minThreeshold = 3,
  onMove = null,
  onCancel = null,
  activated = true,
  fps = 60
}: useSwipeParams): HistoricalRef<T>;
