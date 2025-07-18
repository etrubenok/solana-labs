import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";


const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const payer = getKeypairFromEnvironment("SECRET_KEY");

const recipient = new PublicKey("FvBurThAJJk3ZcXMp1k9ZcNYUQwdEmVn1Yeo5ZfQF7s3");

const tokenMintAccount = new PublicKey("DiQ9Z9YVCATg56x3GyXy2c1v8L1NpqjPxGTvCjGJLfVL");

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    tokenMintAccount,
    payer.publicKey,
);

const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    tokenMintAccount,
    recipient,
);

const signature = await transfer(
    connection,
    payer,
    sourceTokenAccount.address,
    destinationTokenAccount.address,
    payer,
    1 * MINOR_UNITS_PER_MAJOR_UNITS, // Transferring 1 token
);

const link = getExplorerLink("transaction", signature, "devnet");
console.log(`Transfer transaction sent successfully! Link: ${link}`);