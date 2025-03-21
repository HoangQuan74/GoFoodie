export const CLIENT_NOTIFICATION_TITLE = {
  ORDER_PENDING: 'Đang chờ quán xác nhận',
  ORDER_FINDING_DRIVER: 'Đang tìm tài xế',
  ORDER_DRIVER_ARRIVING: 'Tài xế đang tới lấy đơn',
  ORDER_DRIVER_DELIVERING: 'Tài xế đang giao',
  ORDER_DELIVERED: 'Giao hàng thành công',
  ORDER_CANCELLED: 'Đơn hàng đã bị hủy',
};

export const CLIENT_NOTIFICATION_CONTENT = {
  ORDER_PENDING: 'Bạn đã đặt đơn thành công và đang chờ {{from}} xác nhận.',
  ORDER_FINDING_DRIVER: '{{from}} đã xác nhận đơn và đang chuẩn bị món để tài xế đến lấy',
  ORDER_DRIVER_ARRIVING: 'Đã tìm thấy tài xế. Tài xế đang trên đường tới quán {{from}}.',
  ORDER_DRIVER_DELIVERING: 'Tài xế đã lấy đơn và đang giao đến bạn. Chờ ít phút nhé!',
  ORDER_DELIVERED: 'GOO+ chúc bạn ngon miệng, đừng quên đánh giá đơn hàng nhé!',
  ORDER_CANCELLED: (reason: string) =>
    `Đơn hàng của bạn tại quán {{from}} đã bị hủy vì lý do ${reason}. GOO+ rất tiếc vì sự bất tiện này.`,
};

export const STORE_NOTIFICATION_TITLE = {
  ORDER_NEW: 'Đơn hàng mới',
  PRE_ORDER_NEW: 'Đơn đặt trước',
  ORDER_CANCELLED: 'Đơn hàng bị hủy',
  ORDER_COMPLETED: 'Đơn hàng có sự thay đổi',
  ORDER_CONFIRMED: 'Đơn hàng có sự thay đổi',

  WITHDRAWAL_SUCCESS: 'Rút tiền thành công',
  WITHDRAWAL_FAILED: 'Rút tiền thất bại',
  PRODUCT_APPROVED: 'Kết quả xét duyệt món',
  PRODUCT_REJECTED: 'Kết quả xét duyệt món',
};

export const STORE_NOTIFICATION_CONTENT = {
  ORDER_NEW: (orderCode: string) => `Bạn có đơn hàng cần xác nhận. Mã đơn hàng: ${orderCode}.`,
  PRE_ORDER_NEW: (orderCode: string) => `Bạn có đơn đặt trước. Mã đơn hàng: ${orderCode}.`,
  ORDER_CANCELLED: (from: string, orderCode: string) => `Đơn hàng đã bị huỷ bởi ${from}, mã đơn hàng ${orderCode}.`,
  ORDER_COMPLETED: (orderCode: string) => `Đơn hàng đã được giao thành công, mã đơn hàng: ${orderCode}.`,
  ORDER_CONFIRMED: (orderCode: string) => `Đơn hàng đã được xác nhận, mã đơn hàng: ${orderCode}.`,

  WITHDRAWAL_SUCCESS: (amount: number) => `Yêu cầu rút ${amount}đ đã được xử lý thành công.`,
  WITHDRAWAL_FAILED: (amount: number) => `Yêu cầu rút ${amount}đ không thành công. Vui lòng thử lại sau.`,

  PRODUCT_APPROVED: (name: string) => `Món ${name} đã được phê duyệt và hiển thị trên cửa hàng!`,
  PRODUCT_REJECTED: (name: string) => `Món ${name} không được phê duyệt. Vui lòng kiểm tra và cập nhật lại.`,
};
