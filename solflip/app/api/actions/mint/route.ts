import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createPostResponse,
} from "@solana/actions";
import { clusterApiUrl } from "@solana/web3.js";
import { publicKey, transactionBuilder } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fetchCandyMachine,
  mplCandyMachine,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { useMemo } from "react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  toWeb3JsLegacyTransaction,
  toWeb3JsTransaction,
} from "@metaplex-foundation/umi-web3js-adapters";

const candyMachineAddress = process.env.CANDY_MACHINE_ADDRESS;
const ENDPOINT = process.env.NEXT_PUBLIC_RPC || clusterApiUrl("devnet");
const treasury = publicKey(process.env.NEXT_PUBLIC_TREASURY ?? "");

export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    title: "Pay for homework!",
    icon: "https://i.imgur.com/6E8O6NN.png",
    description: "Pay for answers",
    label: "Get Answers",
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  const body: ActionPostRequest = await req.json();

  const umi = useMemo(() => {
    return createUmi(ENDPOINT).use(mplCandyMachine()).use(mplTokenMetadata());
  });

  const payload = await createPostResponse({
    // fields: {
    // transaction: toWeb3JsLegacyTransaction(
    //   transactionBuilder().build(createUmi())
    // ),
    transaction: "",
    message: `Helo There`,
    // },
  });

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};
