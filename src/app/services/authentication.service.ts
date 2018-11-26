
import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
declare const Buffer;
@Injectable()
export class AuthenticationService {

  constructor() { }

  encodeEncryptionKey = (authorization_method, user_id, signature_time, signature) => `${authorization_method} ${new Buffer(user_id + '::' + signature_time + '::' + signature).toString('base64')}`;
  generateSignature = (user_id, appsecret, host, date, normalized_content) => {
    let algorithm = 'sha512';

    let hmac = crypto.HmacSHA512(`${host}:${user_id}`, appsecret);
    let host_user_secret = hmac.toString();

    hmac = crypto.HmacSHA512(host_user_secret, date);
    let with_date = hmac.toString();
    console.log(with_date);
    hmac = crypto.HmacSHA512(normalized_content, with_date);
    let encode = crypto.enc.Base64;

    let with_content = hmac.toString();


    // hmac = crypto.createHmac(algorithm, date);
    // hmac.write(host_user_secret);
    // hmac.end();
    // let with_date = hmac.read();
    //
    // hmac = crypto.createHmac(algorithm, with_date);
    // hmac.setEncoding('hex');
    // hmac.write(normalized_content);
    // hmac.end();
    // let with_content = hmac.read();
    //
    // return with_content;
  };
}
