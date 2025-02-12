export const APPROVE_PATH = {
  storeDetail: (id: number) => `stores/manager/edit/${id}`,
  driverDetail: (id: number) => `drivers/manager/edit/${id}`,
  requestProduct: (id: number) => `requests/products/${id}`,
  requestDriver: (id: number) => `requests/drivers/${id}`,
  requestStore: (id: number) => `requests/stores/${id}`,
};
