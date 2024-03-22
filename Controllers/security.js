import  Jwt  from "jsonwebtoken"
import crypto from "crypto"

const algorithm = 'aes-256-cbc'; 
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { key: key, iv: iv.toString('hex'), encode: encrypted.toString('hex') };
}

export function decrypt(text) {
    let iv2 = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encode, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(text.key), iv2);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export function copyUserObject(data) {
    var ex1 = {};
        ex1._id = data._id;
        ex1.fname = data.fname;
        ex1.lname = data.lname;
        ex1.gender = data.gender;
        ex1.email = data.gender;
        ex1.password = data.password;
        ex1.userType = data.userType;
        ex1.cashType = data.cashType;
        ex1.joinedOn = data.joinedOn;
        ex1.message = data.message;
        ex1.category = data.category;
        ex1.type = data.type;
        ex1.method = data.method.map((item)=>{
            return {name:item.name,type:item.type,bank:item.bank?item.bank:"",amount:decrypt(item.amount)}
        })
        return ex1;
}