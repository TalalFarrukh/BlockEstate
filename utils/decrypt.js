import CryptoJS from "crypto-js"

export const decrypt = (decryptVar) => {

    const SECRET_KEY = "potatotomato"

    const decrypted = JSON.parse(CryptoJS.AES.decrypt(decryptVar, SECRET_KEY).toString(CryptoJS.enc.Utf8))

    return decrypted

}