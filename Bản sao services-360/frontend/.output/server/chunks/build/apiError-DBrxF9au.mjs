function getApiValidationErrors(error) {
  const apiError = error;
  const raw = apiError?.data?.errors;
  if (!raw || typeof raw !== "object") return null;
  if (Object.keys(raw).length === 0) return null;
  const isValidationShape = Object.values(raw).every(
    (v) => Array.isArray(v) && v.every((item) => typeof item === "string")
  );
  return isValidationShape ? raw : null;
}
function getApiErrorMessage(error, fallback = "Thao tác thất bại") {
  const apiError = error;
  return apiError?.data?.message ?? fallback;
}
function getApiErrorStatus(error) {
  const apiError = error;
  return apiError?.status ?? apiError?.statusCode;
}
function getApiErrorCode(error) {
  const apiError = error;
  return apiError?.data?.error_code;
}
const STATUS_MESSAGES = {
  403: { title: "Không có quyền truy cập", description: "Bạn không có quyền xem nội dung này. Vui lòng liên hệ quản trị viên." },
  404: { title: "Không tìm thấy", description: "Nội dung bạn tìm không tồn tại hoặc đã bị xoá." },
  500: { title: "Lỗi hệ thống", description: "Đã xảy ra lỗi từ máy chủ. Vui lòng thử lại sau." },
  503: { title: "Hệ thống đang bảo trì", description: "Vui lòng thử lại sau ít phút." }
};
function formatPageError(error) {
  const status = getApiErrorStatus(error);
  if (status && STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status];
  }
  return { title: "Lỗi", description: "Không thể tải dữ liệu. Vui lòng thử lại sau." };
}

export { getApiValidationErrors as a, getApiErrorStatus as b, getApiErrorCode as c, formatPageError as f, getApiErrorMessage as g };
//# sourceMappingURL=apiError-DBrxF9au.mjs.map
