import type { LoaderFunction, ActionFunction } from "remix";
import { Link, useLoaderData, redirect } from "remix";
import type { Joke } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = {
  joke: Joke
};

// params用于获取路由参数
export const loader: LoaderFunction = async ({
  params,
}) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) throw new Error("Joke not found");
  const data: LoaderData = { joke };
  return data;
};

export const action: ActionFunction = async ({
  params,
}) => {
  const jokeId = params.jokeId;
  await db.joke.delete({
    where: { id: jokeId },
  });
  return redirect("/jokes");
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
      <form method="post">
        <button type="submit" className="button">
          Delete
        </button>
      </form>
    </div>
  );
}