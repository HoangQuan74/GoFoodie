import { ECriteriaType, EBannerDisplayType, EBannerType } from '../enums';
import { EAppType } from '../enums/config.enum';

export const BANNER_TYPES = Object.freeze([
  { label: 'Static', value: EBannerType.Static },
  { label: 'Popup', value: EBannerType.Popup },
  { label: 'Slider', value: EBannerType.Slider },
]);

export const APP_TYPES = Object.freeze([
  { label: 'Goo+Tài xế', value: EAppType.AppDriver },
  { label: 'Goo+Đối Tác', value: EAppType.AppMerchant },
  { label: 'Goo+', value: EAppType.AppClient },
]);

export const BANNER_DISPLAY_TYPES = Object.freeze([
  { label: 'Hình ảnh', value: EBannerDisplayType.Image },
  { label: 'Video', value: EBannerDisplayType.Video },
  { label: 'Text', value: EBannerDisplayType.Text },
  { label: 'Gif', value: EBannerDisplayType.Gif },
]);

export const CRITERIA_TYPES = Object.freeze([
  {
    label: 'Khu vực',
    value: ECriteriaType.Area,
    options: [],
  },
]);
