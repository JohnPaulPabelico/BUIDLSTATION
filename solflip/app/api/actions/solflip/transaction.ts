import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";

type TransferSolTransactionParam = {
  toAddress: string;
  amount: number;
  // to: string
};

export const transferSolTransaction = async (
  params: TransferSolTransactionParam
): Promise<Transaction> => {
  const { toAddress, amount } = params;

  const fromPubkey = new PublicKey(
    "DHcX83dJ6uTupo9kdBHutvfJJQDc7YjTCUAzptRxgwG1"
  );
  const toPubkey = new PublicKey(toAddress); // static receiver

  const connection = new Connection(
    process.env.SOLANA_RPC! || clusterApiUrl("devnet")
  );

  const minimumBalance = await connection.getMinimumBalanceForRentExemption(
    0 // note: simple accounts that just store native SOL have `0` bytes of data
  );
  if (amount * LAMPORTS_PER_SOL < minimumBalance) {
    throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
  }

  const randomOutcome = Math.random() < 0.5 ? amount * 2 : 0;

  const transaction = new Transaction();
  transaction.feePayer = fromPubkey;

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: toPubkey,
      lamports: randomOutcome * LAMPORTS_PER_SOL,
    })
  );

  

  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  return transaction;
};
