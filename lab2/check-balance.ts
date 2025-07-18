import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { resolve } from '@bonfida/spl-name-service';

const network = process.argv[2];
const publicKeyStr = process.argv[3];
if (!network || !publicKeyStr) {
    console.error('Usage: node check-balance.js <network> <publicKey>');
    console.error('Example: node check-balance.js mainnet toly.sol');
    process.exit(1);
}
if (network !== 'devnet' && network !== 'mainnet') {
    console.error('Network must be either "devnet" or "mainnet".');
    process.exit(1);
}

let url = 'https://api.mainnet-beta.solana.com';
if (network === 'devnet') {
    url = 'https://api.devnet.solana.com';
}

try {
    const connection = new Connection(url, 'confirmed');
    const publicKey = await resolvePublicKey(publicKeyStr, connection);
    const balance = await connection.getBalance(publicKey);
    console.log(`Balance for ${publicKey.toBase58()}: ${balance} lamports, ${balance / LAMPORTS_PER_SOL} SOL`);
} catch (error) {
    console.error('Error fetching balance:', error);
    process.exit(1);
}

async function resolvePublicKey(publicKeyOrDomain: string, connection: Connection): Promise<PublicKey> {
    if (isValidPublicKey(publicKeyOrDomain)) {
        return new PublicKey(publicKeyOrDomain);
    } else if (isDomain(publicKeyOrDomain)) {
        return resolveDomainToPublicKey(publicKeyOrDomain, connection);
    } else {
        throw new Error('Invalid public key or domain: ' + publicKeyOrDomain);
    }
}

function isDomain(domain: string): boolean {
    return domain.endsWith('.sol');
}

function isValidPublicKey(publicKeyStr: string): boolean {
    try {
        new PublicKey(publicKeyStr);
        return true;
    } catch {
        return false;
    }
}

async function resolveDomainToPublicKey(domain: string, connection: Connection): Promise<PublicKey> {
    try {
        return await resolve(connection, domain);
    } catch {
        throw new Error('Failed to resolve domain: ' + domain);
    }
}
