import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createPostResponse,
} from "@solana/actions";
import { transferSolTransaction } from "./transaction";

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
  const transaction = await transferSolTransaction({
    from: body.account,
    amount: 1,
  });

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
