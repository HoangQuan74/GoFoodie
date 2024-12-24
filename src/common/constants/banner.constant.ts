import { ECriteriaType, EBannerDisplayType, EBannerType, EBannerPosition } from '../enums';
import { EAppType } from '../enums/config.enum';

export const BANNER_POSITIONS = Object.freeze([
  {
    label: 'Goo+Đối Tác-Onboarding',
    value: EBannerPosition.MerchantOnboarding,
  },
  {
    label: 'Goo+Đối Tác-Trang chủ-Vị trí số 1',
    value: EBannerPosition.MerchantHome1,
  },
  {
    label: 'Goo+Đối Tác-Trang chủ-Vị trí số 2',
    value: EBannerPosition.MerchantHome2,
  },
  {
    label: 'Goo+Tài xế-Onboarding',
    value: EBannerPosition.DriverOnboarding,
  },
]);

export const BANNER_TYPES = Object.freeze([
  { label: 'Static', value: EBannerType.Static, positions: BANNER_POSITIONS },
  { label: 'Popup', value: EBannerType.Popup, positions: BANNER_POSITIONS },
  { label: 'Slider', value: EBannerType.Slider, positions: BANNER_POSITIONS },
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
