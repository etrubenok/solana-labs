import { mintTo, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const user = getKeypairFromEnvironment('SECRET_KEY');
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const tokenMintAccount = new PublicKey("DiQ9Z9YVCATg56x3GyXy2c1v8L1NpqjPxGTvCjGJLfVL");

//const recepientAssoiatedTokenAccount = new PublicKey("GH4C1Qtufq7GdjAKZZaV7Gtos9HpSvd2XpoH32iQbCY5");

// const recepient = new PublicKey("FvBurThAJJk3ZcXMp1k9ZcNYUQwdEmVn1Yeo5ZfQF7s3");  // Dev Phantom Wallet address for testing
const recepient = user.publicKey;

const recepientAssoiatedTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAccount,
    recepient,
);

const transactionSignature = await mintTo(
    connection,
    user,
    tokenMintAccount,
    recepientAssoiatedTokenAccount.address,
    user,
    20 * MINOR_UNITS_PER_MAJOR_UNITS, // Minting 20 tokens
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");
console.log(`Minted 20 tokens to ${recepientAssoiatedTokenAccount.address.toBase58()}: link: ${link}`);