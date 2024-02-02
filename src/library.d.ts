import { DefineComponent } from "vue";

type TextureResource = string | Blob | HTMLImageElement;
type ColorStr = string;
type Anchor = [x: number, y: number];

export const PersonalCard: DefineComponent<{
  cardSize: [width: number, height: number];
  devicePixelRatio?: number;
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
  textAlign?: CanvasTextAlign;
  titleAnchor?: Anchor;
  subtitleAnchor?: Anchor;
  avatar?: TextureResource;
  avatarSize?: number;
  avatarAnchor?: Anchor;
}>;

export const pxRatio: number;
