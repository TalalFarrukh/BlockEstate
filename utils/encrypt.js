import CryptoJS from "crypto-js"

export const encrypt = (encryptVar) => {

    const SECRET_KEY = "potatotomato"

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(encryptVar), SECRET_KEY).toString()

    return encrypted

}