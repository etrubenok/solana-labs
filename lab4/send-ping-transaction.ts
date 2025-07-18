import * as web3 from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
const PING_PROGRAM_DATA_ADDRESS = "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";

const payer = getKeypairFromEnvironment("SECRET_KEY");
if (!payer) {
    console.error("Payer keypair not found in environment variables.");
    process.exit(1);
}

const transaction = new web3.Transaction();
const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
const programDataAddress = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

const instruction = new web3.TransactionInstruction({
    keys: [
        { pubkey: programDataAddress, isSigner: false, isWritable: true },
    ],
    programId,
});
transaction.add(instruction);

console.log(`Sending ping transaction to program ${programId.toBase58()}...`);

const signature = await web3.sendAndConfirmTransaction(
    new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed"),
    transaction,
    [payer],
);

console.log(`Ping transaction sent successfully! Signature: ${signature}`);