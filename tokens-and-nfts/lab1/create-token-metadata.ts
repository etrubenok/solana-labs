import { Connection, clusterApiUrl, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import "dotenv/config";
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";


const user = getKeypairFromEnvironment('SECRET_KEY');
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

const tokenMintAccout = new PublicKey("DiQ9Z9YVCATg56x3GyXy2c1v8L1NpqjPxGTvCjGJLfVL");

const metadata = {
    name: "Solana Training Token",
    symbol: "STT",
    uri: "https://arweave.net/1234abcde1234567890abcdef1234567890abcdef1234567890abcdef12345678",
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
};

const matadataPDAAndBump = await PublicKey.findProgramAddressSync(
    [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        tokenMintAccout.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
);

const metadataPDA = matadataPDAAndBump[0];

const transaction = new Transaction();
const createMetadataAccountInstruction = createCreateMetadataAccountV3Instruction(
    {
        metadata: metadataPDA,
        mint: tokenMintAccout,
        mintAuthority: user.publicKey,
        payer: user.publicKey,
        updateAuthority: user.publicKey,
    },
    {
        createMetadataAccountArgsV3: {
            data: metadata,
            isMutable: true,
            collectionDetails: null, // Optional, can be set if needed
        },
    },
);
transaction.add(createMetadataAccountInstruction);

const txSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [user],
);

const transactionLink = getExplorerLink("transaction", txSignature, "devnet");
console.log(`Token metadata created successfully! Transaction: ${transactionLink}`);

const tokenMintLink = getExplorerLink("address", tokenMintAccout.toString(), "devnet");
console.log(`Token mint address: ${tokenMintLink}`);