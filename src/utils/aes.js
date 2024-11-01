/**
 * 封装AES对称加密工具
 * 1、ZeroPadding：数据长度不对齐时使用0填充，否则不填充
 * 2、PKCS7Padding：假设数据长度需要n（n>0）个字符才对其，那么填充n个字符，每个字符都是n；如果数据本身就对齐了，则天聪一块长度为块大小的数据，每个数据都是块大小
 * 3、PKCS5Padding：PKCS7Padding的子集，块大小固定为8字节
 */
import CryptoJS from 'crypto-js'

/**
 * 加密
 * @param {string} word
 * @param {string} aesIv 十六位十六进制数作为密钥偏移量
 * @param {string} aesKey 十六位十六进制数作为密钥
 */
function encryptAesPassword(word, aesIv, aesKey) {
  const iv = CryptoJS.enc.Utf8.parse(aesIv)
  const key = CryptoJS.enc.Utf8.parse(aesKey)
  const encrypted = CryptoJS.AES.encrypt(word, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return encrypted.ciphertext.toString()
}

/**
 * 解密
 * @param {*} word
 * @param {*} aesIv
 * @param {*} aesKey
 */
function decryptAesPassword(word, aesIv, aesKey) {
  let decryptedStr = ''
  let decrypt = ''
  try {
    const iv = CryptoJS.enc.Utf8.parse(aesIv)
    const key = CryptoJS.enc.Utf8.parse(aesKey)
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    })
    decryptedStr = decrypt.toString(CryptoJS.enc.Utf8).toString()
  } catch (e) {
    console.log(e, '解密失败')
  }
  return decryptedStr
}

export { encryptAesPassword, decryptAesPassword }

// git base here 生成公钥和私钥
// 生成私钥：openssl genrsa -out private.pem 1024
// 生成公钥：openssl rsa -in private.pem -pubout -out public.pem
