import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createPostResponse,
} from "@solana/actions";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  transactionBuilder,
  some,
  publicKey,
  createNoopSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";
import {
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { toWeb3JsLegacyTransaction } from "@metaplex-foundation/umi-web3js-adapters";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

const ENDPOINT = process.env.NEXT_PUBLIC_RPC || clusterApiUrl("devnet");
const candyMachineAddress = publicKey(
  "3vmJZBmhNUvrnrGmnzjvmUWuQnck2XhZEFoAWBd8q9d3"
);
const treasury = publicKey("9QZqqJfKRuoGKTaCgUvjQMMUNpaxhPC3fvn2y8iPZ4uU");

export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    title: "Mint a Spud Mate",
    icon: "https://spudsquad.vercel.app/Gallery%20Images/6.svg",
    description: "Join the Spud Squad now!",
    label: "Mint",
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  const body: ActionPostRequest = await req.json();

  const myPublicKey = publicKey(body.account);
  const mySigner = createNoopSigner(myPublicKey);

  const umiTransaction = async () => {
    const umi = createUmi(ENDPOINT)
      .use(signerIdentity(mySigner))
      .use(mplCandyMachine())
      .use(mplTokenMetadata());

    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    const candyGuard = await safeFetchCandyGuard(
      umi,
      candyMachine.mintAuthority
    );
    const connection = new Connection(ENDPOINT);
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    try {
      const nftMint = generateSigner(umi);

      const tx = await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            candyGuard: candyGuard?.publicKey,
            nftMint,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            mintArgs: {
              solPayment: some({ destination: treasury }),
            },
          })
        )
        .setBlockhash(blockhash)
        .build(umi);

      const web3JsTransaction = toWeb3JsLegacyTransaction(tx);
      // const mySigner = Keypair.generate();
      // web3JsTransaction.partialSign(mySigner);

      return web3JsTransaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  };

  const transaction = await umiTransaction();

  const payload: ActionPostResponse = await createPostResponse({
    fields: {
      transaction,
      message: `Send 1 SOL`,
    },
  });
  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};
