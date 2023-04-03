import CryptoJS from "crypto-js"

const SECRET_KEY = "potatotomato"

export const encrypt = (encryptVar) => {

    return CryptoJS.AES.encrypt(JSON.stringify(encryptVar), SECRET_KEY).toString()

}

export const decrypt = (decryptVar) => {

    return JSON.parse(CryptoJS.AES.decrypt(decryptVar, SECRET_KEY).toString(CryptoJS.enc.Utf8))

}