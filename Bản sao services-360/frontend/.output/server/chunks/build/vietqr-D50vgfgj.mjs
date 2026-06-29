const VIETNAM_BANKS = [
  { bin: "970416", code: "ACB", name: "Ngân hàng TMCP Á Châu", shortName: "ACB" },
  { bin: "970405", code: "AGR", name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn", shortName: "Agribank" },
  { bin: "970409", code: "BAB", name: "Ngân hàng TMCP Bắc Á", shortName: "BacABank" },
  { bin: "970418", code: "BIDV", name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", shortName: "BIDV" },
  { bin: "970438", code: "BVB", name: "Ngân hàng TMCP Bảo Việt", shortName: "BaoVietBank" },
  { bin: "970446", code: "COOPBANK", name: "Ngân hàng Hợp tác xã Việt Nam", shortName: "Co-opBank" },
  { bin: "970415", code: "CTG", name: "Ngân hàng TMCP Công thương Việt Nam", shortName: "VietinBank" },
  { bin: "970431", code: "EIB", name: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam", shortName: "Eximbank" },
  { bin: "970437", code: "HDB", name: "Ngân hàng TMCP Phát triển TP. HCM", shortName: "HDBank" },
  { bin: "970442", code: "HLO", name: "Ngân hàng TNHH MTV Hong Leong Việt Nam", shortName: "Hong Leong Bank" },
  { bin: "970452", code: "KLB", name: "Ngân hàng TMCP Kiên Long", shortName: "KienlongBank" },
  { bin: "970422", code: "MB", name: "Ngân hàng TMCP Quân đội", shortName: "MB Bank" },
  { bin: "970426", code: "MSB", name: "Ngân hàng TMCP Hàng Hải Việt Nam", shortName: "MSB" },
  { bin: "970428", code: "NAB", name: "Ngân hàng TMCP Nam Á", shortName: "Nam Á Bank" },
  { bin: "970419", code: "NCB", name: "Ngân hàng TMCP Quốc Dân", shortName: "NCB" },
  { bin: "970448", code: "OCB", name: "Ngân hàng TMCP Phương Đông", shortName: "OCB" },
  { bin: "970429", code: "SCB", name: "Ngân hàng TMCP Sài Gòn", shortName: "SCB" },
  { bin: "970440", code: "SEAB", name: "Ngân hàng TMCP Đông Nam Á", shortName: "SeABank" },
  { bin: "970443", code: "SHB", name: "Ngân hàng TMCP Sài Gòn Hà Nội", shortName: "SHB" },
  { bin: "970403", code: "STB", name: "Ngân hàng TMCP Sài Gòn Thương Tín", shortName: "Sacombank" },
  { bin: "970407", code: "TCB", name: "Ngân hàng TMCP Kỹ thương Việt Nam", shortName: "Techcombank" },
  { bin: "970423", code: "TPB", name: "Ngân hàng TMCP Tiên Phong", shortName: "TPBank" },
  { bin: "970433", code: "VAB", name: "Ngân hàng TMCP Việt Á", shortName: "VietABank" },
  { bin: "970436", code: "VCB", name: "Ngân hàng TMCP Ngoại thương Việt Nam", shortName: "Vietcombank" },
  { bin: "970454", code: "VCCB", name: "Ngân hàng TMCP Bản Việt", shortName: "Bản Việt" },
  { bin: "970441", code: "VIB", name: "Ngân hàng TMCP Quốc tế Việt Nam", shortName: "VIB" },
  { bin: "970432", code: "VPB", name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", shortName: "VPBank" }
];
function findBankByBin(bin) {
  if (!bin) return void 0;
  return VIETNAM_BANKS.find((b) => b.bin === bin);
}
function buildVietQrImageUrl(opts) {
  const { bankBin, accountNumber, accountName, amount, description, template = "compact2" } = opts;
  if (!bankBin || !accountNumber) return "";
  const path = `${bankBin}-${accountNumber}-${template}.jpg`;
  const params = new URLSearchParams();
  if (accountName) params.set("accountName", accountName);
  if (typeof amount === "number" && amount > 0) params.set("amount", String(Math.round(amount)));
  if (description) params.set("addInfo", sanitizeQrDescription(description));
  const q = params.toString();
  return `https://img.vietqr.io/image/${path}${q ? `?${q}` : ""}`;
}
function sanitizeQrDescription(input) {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^\x20-\x7E]/g, "").trim().slice(0, 25);
}
function tlv(id, value) {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}
function crc16ccitt(data) {
  let crc = 65535;
  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) & 255) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 32768) !== 0) {
        crc = crc << 1 ^ 4129;
      } else {
        crc <<= 1;
      }
      crc &= 65535;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
function buildVietQrPayload(opts) {
  const { bankBin, accountNumber, amount, description } = opts;
  if (!bankBin || !accountNumber) {
    return "";
  }
  const hasAmount = typeof amount === "number" && amount > 0;
  const beneficiary = tlv("00", bankBin) + tlv("01", accountNumber);
  const merchantInfo = tlv("00", "A000000727") + tlv("01", beneficiary) + tlv("02", "QRIBFTTA");
  const cleanedDesc = description ? sanitizeQrDescription(description) : "";
  const additionalData = cleanedDesc ? tlv("62", tlv("08", cleanedDesc)) : "";
  const amountField = hasAmount ? tlv("54", Math.round(amount).toString()) : "";
  const payloadBase = tlv("00", "01") + tlv("01", hasAmount ? "12" : "11") + tlv("38", merchantInfo) + tlv("53", "704") + amountField + tlv("58", "VN") + additionalData + "6304";
  return payloadBase + crc16ccitt(payloadBase);
}

export { VIETNAM_BANKS as V, buildVietQrPayload as a, buildVietQrImageUrl as b, findBankByBin as f, sanitizeQrDescription as s };
//# sourceMappingURL=vietqr-D50vgfgj.mjs.map
