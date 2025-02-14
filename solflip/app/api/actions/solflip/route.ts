import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";
import { transferSolTransaction } from "./transaction";

export async function GET(request: Request) {

  const payload: ActionGetResponse = {
    icon: "https://i.imgur.com/7MyHf55.png",
    description: "Choose a side",
    title: "SOLFLIP",
    label: "Pick your side",
    links: {
      actions: [
        {
          label: "Flip",
          href: `${baseHref}&amount={amount}`,
          parameters: [
            {
              name: "amount", // parameter name in the `href` above
              label: "Enter the amount of SOL to gamble", // placeholder of the text input
            },
          ],
        },
      ],
    },
    error: { message: "Error message" },
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
    status: 200,
  });
}

export async function POST(request: Request) {
  const postRequest: ActionPostRequest = await request.json();
  const userPubKey = postRequest.account;
  console.log(userPubKey);

  const transaction = await transferSolTransaction({
    toAddress: userPubKey,
    amount: 1,
  });

  const payload: ActionPostResponse = {
    transaction: "",
    message: "Hello there " + userPubKey,
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
    status: 200,
  });
}

export const OPTIONS = GET;
