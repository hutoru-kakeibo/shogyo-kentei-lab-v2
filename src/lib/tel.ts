/**
 * 申し込みフォームの電話番号。ブラウザ側の入力チェックとサーバー側の再チェックで共通に使う。
 */

/** 全角数字をそろえ、ハイフン・空白・かっこなど数字以外を取り除く（「090-1234-5678」→「09012345678」） */
export function normalizeTel(value: string) {
  return value
    .replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
    .replace(/\D/g, "");
}

/** 0から始まる10桁（固定電話）か11桁（携帯電話）なら正しい形とみなす */
export function isValidTel(value: string) {
  return /^0\d{9,10}$/.test(normalizeTel(value));
}
