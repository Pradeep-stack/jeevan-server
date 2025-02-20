import { TronWeb } from 'tronweb';
console.log(TronWeb); 

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: process.env.CRIPTO_PRIVATE, // Ensure this key is set
});

console.log("TronWeb instance created:", tronWeb);

export default tronWeb;
