export const APPROVE_PATH = {
  storeDetail: (id: number) => `stores/edit/${id}`,
  driverDetail: (id: number) => `drivers/edit/${id}`,
  requestProduct: (id: number) => `requests/products/${id}`,
  requestDriver: (id: number) => `requests/drivers/${id}`,
  requestStore: (id: number) => `requests/stores/${id}`,
};

export const STORE_CONFIRM_TIME = 5; // 5 minutes
export const REMIND_CONFIRM_TIME = 2; // 2 minutes
export const SCAN_DRIVER_TIME = 5; // 5 minutes
export const DRIVER_SPEED = 30; // 30 km/h
export const ORDER_GROUP_FULL = 5;
export const RADIUS_OF_ORDER_DISPLAY_LOOKING_FOR_DRIVER = 5000; // 5000 meters
export const ORDER_BURST_THRESHOLD = 10 // 10 order
export const ORDER_BURST_DURATION_MIN = 10 // 10 minutes
