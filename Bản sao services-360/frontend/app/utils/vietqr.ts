/**
 * VietQR payload builder (NAPAS standard, compatible with mọi ngân hàng VN).
 *
 * Tạo chuỗi EMV QR Code để máy quét của ứng dụng ngân hàng nhận biết thông tin
 * người nhận + số tiền. Có thể dùng làm `value` cho `SharedQrCode`.
 *
 * Tham khảo: EMVCo "EMV QR Code Specification for Payment Systems"
 * và NAPAS VietQR technical specification.
 */

export interface VietQrOptions {
  /** Bank BIN (6 chữ số). Ví dụ MB Bank: "970422". */
  bankBin: string
  /** Số tài khoản thụ hưởng. */
  accountNumber: string
  /** Số tiền (VND). Bỏ trống cho QR tĩnh (không có số tiền). */
  amount?: number | null
  /** Nội dung chuyển khoản (tối đa ~25 ký tự ASCII, không dấu). */
  description?: string | null
}

export interface VietnamBank {
  /** BIN code (6 digits) — dùng để build VietQR. */
  bin: string
  /** Mã viết tắt (dùng làm value cho USelect). */
  code: string
  /** Tên hiển thị đầy đủ. */
  name: string
  /** Tên gọi ngắn gọn. */
  shortName: string
}

/**
 * Danh sách ngân hàng VN phổ biến có hỗ trợ VietQR (cập nhật 2026).
 * Sắp xếp theo `code` alphabet để dropdown hiển thị nhất quán.
 */
export const VIETNAM_BANKS: VietnamBank[] = [
  { bin: '970416', code: 'ACB', name: 'Ngân hàng TMCP Á Châu', shortName: 'ACB' },
  { bin: '970405', code: 'AGR', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn', shortName: 'Agribank' },
  { bin: '970409', code: 'BAB', name: 'Ngân hàng TMCP Bắc Á', shortName: 'BacABank' },
  { bin: '970418', code: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', shortName: 'BIDV' },
  { bin: '970438', code: 'BVB', name: 'Ngân hàng TMCP Bảo Việt', shortName: 'BaoVietBank' },
  { bin: '970446', code: 'COOPBANK', name: 'Ngân hàng Hợp tác xã Việt Nam', shortName: 'Co-opBank' },
  { bin: '970415', code: 'CTG', name: 'Ngân hàng TMCP Công thương Việt Nam', shortName: 'VietinBank' },
  { bin: '970431', code: 'EIB', name: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam', shortName: 'Eximbank' },
  { bin: '970437', code: 'HDB', name: 'Ngân hàng TMCP Phát triển TP. HCM', shortName: 'HDBank' },
  { bin: '970442', code: 'HLO', name: 'Ngân hàng TNHH MTV Hong Leong Việt Nam', shortName: 'Hong Leong Bank' },
  { bin: '970452', code: 'KLB', name: 'Ngân hàng TMCP Kiên Long', shortName: 'KienlongBank' },
  { bin: '970422', code: 'MB', name: 'Ngân hàng TMCP Quân đội', shortName: 'MB Bank' },
  { bin: '970426', code: 'MSB', name: 'Ngân hàng TMCP Hàng Hải Việt Nam', shortName: 'MSB' },
  { bin: '970428', code: 'NAB', name: 'Ngân hàng TMCP Nam Á', shortName: 'Nam Á Bank' },
  { bin: '970419', code: 'NCB', name: 'Ngân hàng TMCP Quốc Dân', shortName: 'NCB' },
  { bin: '970448', code: 'OCB', name: 'Ngân hàng TMCP Phương Đông', shortName: 'OCB' },
  { bin: '970429', code: 'SCB', name: 'Ngân hàng TMCP Sài Gòn', shortName: 'SCB' },
  { bin: '970440', code: 'SEAB', name: 'Ngân hàng TMCP Đông Nam Á', shortName: 'SeABank' },
  { bin: '970443', code: 'SHB', name: 'Ngân hàng TMCP Sài Gòn Hà Nội', shortName: 'SHB' },
  { bin: '970403', code: 'STB', name: 'Ngân hàng TMCP Sài Gòn Thương Tín', shortName: 'Sacombank' },
  { bin: '970407', code: 'TCB', name: 'Ngân hàng TMCP Kỹ thương Việt Nam', shortName: 'Techcombank' },
  { bin: '970423', code: 'TPB', name: 'Ngân hàng TMCP Tiên Phong', shortName: 'TPBank' },
  { bin: '970433', code: 'VAB', name: 'Ngân hàng TMCP Việt Á', shortName: 'VietABank' },
  { bin: '970436', code: 'VCB', name: 'Ngân hàng TMCP Ngoại thương Việt Nam', shortName: 'Vietcombank' },
  { bin: '970454', code: 'VCCB', name: 'Ngân hàng TMCP Bản Việt', shortName: 'Bản Việt' },
  { bin: '970441', code: 'VIB', name: 'Ngân hàng TMCP Quốc tế Việt Nam', shortName: 'VIB' },
  { bin: '970432', code: 'VPB', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', shortName: 'VPBank' }
]

export function findBankByBin(bin: string | null | undefined): VietnamBank | undefined {
  if (!bin) return undefined
  return VIETNAM_BANKS.find(b => b.bin === bin)
}

export interface VietQrImageOptions {
  bankBin: string
  accountNumber: string
  accountName?: string | null
  amount?: number | null
  description?: string | null
  /** Template name. `compact2` bao gồm VietQR + Napas247 + logo ngân hàng + tên TK + số TK + số tiền. */
  template?: 'compact' | 'compact2' | 'qr_only' | 'print'
}

/**
 * Build URL ảnh QR branded từ dịch vụ img.vietqr.io.
 * Khác với `buildVietQrPayload` (payload EMV thuần để render bằng thư viện QR client-side),
 * hàm này trả về URL trỏ tới ảnh JPG đã render sẵn có logo VietQR, Napas247, ngân hàng.
 */
export function buildVietQrImageUrl(opts: VietQrImageOptions): string {
  const { bankBin, accountNumber, accountName, amount, description, template = 'compact2' } = opts
  if (!bankBin || !accountNumber) return ''
  const path = `${bankBin}-${accountNumber}-${template}.jpg`
  const params = new URLSearchParams()
  if (accountName) params.set('accountName', accountName)
  if (typeof amount === 'number' && amount > 0) params.set('amount', String(Math.round(amount)))
  if (description) params.set('addInfo', sanitizeQrDescription(description))
  const q = params.toString()
  return `https://img.vietqr.io/image/${path}${q ? `?${q}` : ''}`
}

/**
 * Chuẩn hoá nội dung chuyển khoản: loại bỏ dấu tiếng Việt, chỉ giữ ký tự ASCII
 * in được, giới hạn 25 ký tự (khuyến nghị của đa số ứng dụng ngân hàng).
 */
export function sanitizeQrDescription(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')

    .replace(/[^\x20-\x7E]/g, '')
    .trim()
    .slice(0, 25)
}

function tlv(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0')
  return `${id}${length}${value}`
}

/**
 * CRC16-CCITT-FALSE (poly 0x1021, init 0xFFFF, no reflection, no final XOR).
 * Dùng cho field 63 của EMV QR payload.
 */
function crc16ccitt(data: string): string {
  let crc = 0xFFFF
  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) & 0xFF) << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }
      crc &= 0xFFFF
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/**
 * Build EMV payload string theo chuẩn VietQR. Nếu `amount` có giá trị,
 * QR sẽ là "dynamic" (có sẵn số tiền). Nếu không, là QR "static" để khách
 * tự nhập số tiền.
 */
export function buildVietQrPayload(opts: VietQrOptions): string {
  const { bankBin, accountNumber, amount, description } = opts

  if (!bankBin || !accountNumber) {
    return ''
  }

  const hasAmount = typeof amount === 'number' && amount > 0

  // Field 38 — Merchant Account Information
  const beneficiary = tlv('00', bankBin) + tlv('01', accountNumber)
  const merchantInfo
    = tlv('00', 'A000000727') // VietQR GUID
      + tlv('01', beneficiary)
      + tlv('02', 'QRIBFTTA') // Service: Account-transfer

  // Field 62 — Additional Data Field Template (nội dung CK)
  const cleanedDesc = description ? sanitizeQrDescription(description) : ''
  const additionalData = cleanedDesc
    ? tlv('62', tlv('08', cleanedDesc))
    : ''

  // Field 54 — Transaction Amount
  const amountField = hasAmount
    ? tlv('54', Math.round(amount as number).toString())
    : ''

  const payloadBase
    = tlv('00', '01') // Payload Format Indicator
      + tlv('01', hasAmount ? '12' : '11') // Point of Initiation Method
      + tlv('38', merchantInfo)
      + tlv('53', '704') // Currency: VND
      + amountField
      + tlv('58', 'VN') // Country
      + additionalData
      + '6304' // CRC tag + length, placeholder

  return payloadBase + crc16ccitt(payloadBase)
}
