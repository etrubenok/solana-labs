import { Connection, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, Signer, TransactionSignature, LAMPORTS_PER_SOL } from '@solana/web3.js';
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";


const to = process.argv[2] || null;
const lamports = process.argv[3];

if (!to || !lamports) {
    console.error('Usage: npx esrun transfer.js <to> <lamports>');
    console.error('NOTE: only work with devnet!')
    console.error('Example: npx esrun transfer.js w3vkQshGmxHVF3ZaZdxr424ahSGxN7iD2kMkUR7mH2c 1000000');
    process.exit(1);
}

if (isNaN(parseInt(lamports)) || parseInt(lamports) <= 0) {
    console.error('Lamports must be a positive integer.');
    process.exit(1);
}

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

if (!isValidPublicKey(to)) {
    console.error('Invalid public key format:', to);
    process.exit(1);
}

const toPubkey = new PublicKey(to);
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const solPrice = await getSolPriceJupiter();
const lamportsNum = parseInt(lamports);

console.log(`Transferring ${lamportsNum} lamports to ${toPubkey.toBase58()} (${lamportsNum * solPrice / LAMPORTS_PER_SOL} USD)...`);

const tx_signature = await sendToPubkey(connection, toPubkey, lamportsNum, senderKeypair);
console.log(`Transaction signature: ${tx_signature}`);

/**
 * Sends lamports to a specified public key.
 * @param {Connection} connection - The Solana connection object.
 * @param {PublicKey} to - The recipient's public key.
 * @param {number} lamports - The amount of lamports to send.
 * @param {Signer} senderKeypair - The sender's keypair.
 * @returns {Promise<TransactionSignature>} The transaction signature.
 */
function sendToPubkey(
    connection: Connection,
    to: PublicKey,
    lamports: number,
    senderKeypair: Signer,
): Promise<TransactionSignature> {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: senderKeypair.publicKey,
            toPubkey: to,
            lamports,
        })
    );

    return sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
}

/** * Checks if a string is a valid Solana public key.
 * @param publicKeyStr The public key string to validate.
 * TODO: It tries to create a PublicKey object, but returns boolean. 
 * It means that if it succeeds, the caller code most likely will construct a PublicKey object from the same string again, which is not efficient.
 * @returns {boolean} True if the string is a valid public, false otherwise.
 */
function isValidPublicKey(publicKeyStr: string): boolean {
    try {
        new PublicKey(publicKeyStr);
        return true;
    } catch {
        return false;
    }
}

/**
 * Fetches the current price of SOL in USD from Jupiter API.
 * TODO: Support other tokens.
 * @returns {Promise<number>} The price of SOL in USD.
 */
async function getSolPriceJupiter(): Promise<number> {
    try {
        const response = await fetch('https://lite-api.jup.ag/price/v3?ids=So11111111111111111111111111111111111111112');
        const data = await response.json();
        return data['So11111111111111111111111111111111111111112'].usdPrice;
    } catch (error) {
        console.error('Error fetching SOL price from Jupiter:', error);
        throw new Error('Unable to fetch SOL price from Jupiter');
    }
}