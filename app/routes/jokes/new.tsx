/*
export一个action来写入到数据库，顺带使用服务端的表单验证

使用ActionData保证类型安全
action未被调用时会返回undefined要特别注意一下

You may also notice that I return the fields as well.
This is so that the form can be re-rendered with the values from the server
in the event that JavaScript fails to load for some reason.
That's what the defaultValue stuff is all about as well.

*/
import type { ActionFunction } from "remix";
import { redirect, useActionData, json } from "remix";

import { db } from "~/utils/db.server";

const validateJokeContent = (content: string) => {
  if (content.length < 10) {
    return "Joke content must be at least 10 characters long";
  }
}

const validateJokeName = (name: string) => {
  if (name.length < 3) {
    return "Joke name must be at least 3 characters long";
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({
  request,
}) => {
  const form = await request.formData();
  const name = form.get("name"); 
  const content = form.get("content");
  // （服务端的）类型检查
  if (
    typeof name !== "string" ||
    typeof content !== "string"
  ) {
    return badRequest({
      formError: "Invalid form data",
    });
  }

  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    });
  }

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              // aria-无障碍
              aria-invalid={
                Boolean(actionData?.fieldErrors?.name) ||
                undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.name
                  ? `error-name-${actionData.fieldErrors.name}`
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p
              className="form-validation-error"
              role="alert"
              id="name-error"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) ||
                undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.content
                  ? `error-content-${actionData.fieldErrors.content}`
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ): null}
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}