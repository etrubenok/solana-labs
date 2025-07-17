import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();
console.log(`Public Key: `, keypair.publicKey.toBase58());
console.log(`Secret Key: `, keypair.secretKey);
console.log(`Keypair generated successfully.`);