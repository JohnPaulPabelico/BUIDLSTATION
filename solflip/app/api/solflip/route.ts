import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";

export async function GET(request: Request) {
  const payload: ActionGetResponse = {
    icon: "https://i.imgur.com/7MyHf55.png",
    description: "Choose a side",
    title: "SOLFLIP",
    label: "Pick your side",
    links: {
      actions: [
        {
          label: "Heads",
          href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        {
          label: "Tails",
          href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
