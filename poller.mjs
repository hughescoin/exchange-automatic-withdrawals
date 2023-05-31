import { usdAccount } from './exchange.mjs';

const usdAccountInfo = await usdAccount();
console.log(usdAccountInfo);
