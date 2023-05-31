import crypto from 'crypto';
import fetch from 'node-fetch';
import 'dotenv/config';
import { userInfo } from 'os';

const timestamp = Date.now() / 1000;
const secret = process.env.COINBASE_EXCHANGE_SECRET;
const method = 'GET';
const requestPath = '/accounts';
const message = timestamp + method + requestPath;
const key = Buffer.from(secret, 'base64');
const hmac = crypto.createHmac('sha256', key);
const signature = hmac.update(message).digest('base64');
const exchange_url = 'https://api.exchange.coinbase.com/accounts';

let config = {
  method: method,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'cb-access-key': process.env.COINBASE_EXCHANGE_ACCESSKEY,
    'cb-access-passphrase': process.env.COINBASE_EXCHANGE_PASSPHRASE,
    'cb-access-sign': signature,
    'cb-access-timestamp': timestamp,
  },
};

async function getAccounts() {
  try {
    const response = await fetch(exchange_url, config);
    const data = await response.json();
    const accounts = new Array(...data);
    return accounts;
  } catch (error) {
    console.log(error);
  }
}

async function usdAccount() {
  const arr = await getAccounts();
  let usdAccount;
  arr.forEach((element) => {
    element.currency === 'USD' ? (usdAccount = element) : false;
  });
  return usdAccount;
}

export { usdAccount };
