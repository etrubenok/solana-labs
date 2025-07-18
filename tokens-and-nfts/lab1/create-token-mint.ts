import { Connection, clusterApiUrl } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";
import { createMint } from "@solana/spl-token";
import { get } from "http";


const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const payer = getKeypairFromEnvironment("SECRET_KEY");

const tokenMint = await createMint(connection, payer, payer.publicKey, null, 2);
const link = getExplorerLink("address", tokenMint.toString(), "devnet");
console.log(`Token mint created: ${link}`);