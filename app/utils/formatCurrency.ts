/**
 * Format sebuah nilai menjadi string yang mengindikasikan mata uang Rupiah (IDR)
 *
 * @param {number} value Nilai yang akan diformat
 * @return {string} Nilai yang telah diformat menjadi string "RpX" atau "RpX.xxx" tergantung apakah nilai tersebut memiliki pecahan atau tidak
 */
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}