import { Component } from "vue";

type TextureResource = string | Blob | HTMLImageElement;
type ColorStr = string;

export const PersonalCard: Component<{
  cardSize: [width: number, height: number];
  distancePassive?: number;
  distanceHover?: number;
  background: TextureResource;
  foil?: TextureResource;
  glow?: ColorStr;
  title?: string;
  subtitle?: string;
  textColor?: ColorStr;
  textShadowColor?: ColorStr;
  textStrokeWidth?: number;
  textStrokeColor?: ColorStr;
  avatar?: TextureResource;
  avatarSize?: number;
}>;

export const pxRatio: number;
