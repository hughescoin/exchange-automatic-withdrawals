/**
 * Copyright 2023-present Coinbase Global, Inc.
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
import { getProfileId } from './profileId.mjs';
import { getPaymentId } from './paymentId.mjs';

const timestamp = Date.now() / 1000; // in ms
const secret = process.env.COINBASE_EXCHANGE_SECRET;
const profileId = await getProfileId();
const paymentMethod = await getPaymentId();
const baseURL = process.env.COINBASE_EXCHANGE_URL;

const requestPath = '/withdrawals/payment-method/';
const transferAmount = '3'; //Amount to be transfered to your bank account
const method = 'POST';

const url = baseURL + requestPath;
const data = JSON.stringify({
  profile_id: profileId,
  amount: transferAmount,
  payment_method_id: paymentMethod,
  currency: 'USD',
});

const message = timestamp + method + requestPath + data;
const key = Buffer.from(secret, 'base64');
const hmac = crypto.createHmac('sha256', key);
const signature = hmac.update(message).digest('base64');

async function withdrawToBankAccount() {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'CB-ACCESS-KEY': process.env.COINBASE_EXCHANGE_ACCESSKEY,
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-PASSPHRASE': process.env.COINBASE_EXCHANGE_PASSPHRASE,
      },
      body: data,
    });
    const res = await response.json();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
withdrawToBankAccount();
