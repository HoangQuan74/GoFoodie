import { ECriteriaType, EBannerDisplayType, EBannerType } from '../enums';
import { EAppType } from '../enums/config.enum';

export const BANNER_TYPES = Object.freeze([
  { label: 'Static', value: EBannerType.Static, positions: [] },
  { label: 'Popup', value: EBannerType.Popup, positions: [] },
  { label: 'Slider', value: EBannerType.Slider, positions: [] },
]);

export const APP_TYPES = Object.freeze([
  { label: 'Goo+Tài xế', value: EAppType.AppDriver },
  { label: 'Goo+Đối Tác', value: EAppType.AppMerchant },
  { label: 'Goo+', value: EAppType.AppClient },
]);

export const BANNER_DISPLAY_TYPES = Object.freeze([
  { label: 'Hình ảnh', value: EBannerDisplayType.Image },
  { label: 'Video', value: EBannerDisplayType.Video },
]);

export const CRITERIA_TYPES = Object.freeze([
  {
    label: 'Khu vực',
    value: ECriteriaType.Area,
    options: [],
  },
]);
