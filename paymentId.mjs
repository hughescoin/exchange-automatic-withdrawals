/**
 * Copyright 2022 - 2023 Coinbase Global, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import crypto from 'crypto';
import fetch from 'node-fetch';
import 'dotenv/config';
const timestamp = Date.now() / 1000; // in ms
const passphrase = process.env.COINBASE_EXCHANGE_PASSPHRASE;
const accessKey = process.env.COINBASE_EXCHANGE_ACCESSKEY;
const secret = process.env.COINBASE_EXCHANGE_SECRET;
const baseURL = process.env.COINBASE_EXCHANGE_URL;

const requestPath = '/payment-methods/';
const method = 'GET';
const url = baseURL + requestPath;

const message = timestamp + method + requestPath;
const key = Buffer.from(secret, 'base64');
const hmac = crypto.createHmac('sha256', key);
const signature = hmac.update(message).digest('base64');

//Return the id of the payment method used for cash withdrawls
async function getPaymentId() {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'CB-ACCESS-KEY': accessKey,
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-PASSPHRASE': passphrase,
      },
    });
    const data = await response.json(); //if empty array return add payment method
    const bankDetails = { id: data[0].id, details: data[0].picker_data };
    const paymentId = bankDetails.id;
    return paymentId;
  } catch (error) {
    console.log(error);
  }
}

getPaymentId();

export { getPaymentId };
