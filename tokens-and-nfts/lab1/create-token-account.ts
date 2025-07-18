import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const payer = getKeypairFromEnvironment("SECRET_KEY");

const tokenMintAccount = new PublicKey("DiQ9Z9YVCATg56x3GyXy2c1v8L1NpqjPxGTvCjGJLfVL");

// Dev Phantom Wallet address for testing
const recepient = new PublicKey("FvBurThAJJk3ZcXMp1k9ZcNYUQwdEmVn1Yeo5ZfQF7s3");

const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    tokenMintAccount,
    recepient,
);

console.log(`Token account created: ${tokenAccount.address.toBase58()}`);

const link = getExplorerLink("address", tokenAccount.address.toBase58(), "devnet");

console.log(`Token account link: ${link}`);