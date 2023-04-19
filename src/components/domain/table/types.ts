export type Dimensions = "XS" | "default";

export type TableResponsiveConfig = {
  limits: number[];
  newMatchButton: string;
  revealCardsButton: string;
};

export type TableResponsiveConfigs = Record<Dimensions, TableResponsiveConfig>;

export enum TableModulePosition {
  BOTTOM = "bottom",
  TOP = "top",
  LEFT = "left",
  RIGHT = "right",
}
