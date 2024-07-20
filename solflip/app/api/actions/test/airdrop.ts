import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

type AirdropSolParam = {
  toAddress: string;
  amount: number;
  // to: string
};

export const AirdropSol = async (
  params: AirdropSolParam
): Promise<Transaction> => {
  const { toAddress, amount } = params;

  const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

  const toPubkey = new PublicKey(toAddress); // static receiver

  const connection = new Connection(
    process.env.SOLANA_RPC! || clusterApiUrl("devnet")
  );

  const LAMPORTS_TO_SEND = 1 * LAMPORTS_PER_SOL;

  const transaction = new Transaction();
  
  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey,
    lamports: LAMPORTS_TO_SEND,
  });

  transaction.add(sendSolInstruction);

  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  return transaction;
};
