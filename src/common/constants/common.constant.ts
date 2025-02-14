export const APPROVE_PATH = {
  storeDetail: (id: number) => `stores/edit/${id}`,
  driverDetail: (id: number) => `drivers/edit/${id}`,
  requestProduct: (id: number) => `requests/products/${id}`,
  requestDriver: (id: number) => `requests/drivers/${id}`,
  requestStore: (id: number) => `requests/stores/${id}`,
};

export const STORE_CONFIRM_TIME = 5 * 60 * 1000;
