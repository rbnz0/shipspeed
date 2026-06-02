---
title: tRPC
description: Использование tRPC
layout: ../../../layouts/docs.astro
lang: ru
---

tRPC позволяет нам писать типобезопасные API от конца до конца (end-to-end) без какой-либо генерации кода или накладных расходов на выполнение. Он использует отличную инференцию TypeScript для вывода типов маршрутизатора вашего API и позволяет вызывать процедуры API из вашего фронтенда с полной типобезопасностью и автодополнением. Используя tRPC, ваш фронтенд и бэкенд чувствуют себя ближе друг к другу, чем когда-либо, обеспечивая исключительный опыт разработчика.

<blockquote className="w-full relative border-l-4 italic bg-t3-purple-200 dark:text-t3-purple-50 text-zinc-900 dark:bg-t3-purple-300/20 p-2 rounded-md text-sm my-3 border-neutral-500 quote">
  <div className="relative w-fit flex items-center justify-center p-1">
    <p className="mb-4 text-lg">
      <span aria-hidden="true">&quot;</span>I built tRPC to allow people to move faster by removing the need of a traditional API-layer, while still having confidence that our apps won't break as we rapidly iterate.<span aria-hidden="true">&quot;</span>
    </p>
  </div>
  <cite className="flex items-center justify-end pr-4 pb-2">
    <img
      alt="Avatar of @alexdotjs"
      className="w-12 rounded-full bg-neutral-500 [margin-inline-end:16px]"
      src="https://avatars.githubusercontent.com/u/459267?v=4"
    />
    <div className="flex flex-col items-start not-italic">
      <span className=" text-sm font-semibold">Alex - creator of tRPC</span>
      <a
        href="https://twitter.com/alexdotjs"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm"
      >
        @alexdotjs
      </a>
    </div>
  </cite>
</blockquote>

## Файлы

tRPC требует много шаблонного кода, который `create-shipspeed` настраивает для вас. Давайте рассмотрим файлы, которые генерируются:

### 📄 `pages/api/trpc/[trpc].ts`

Этот файл является точкой входа для вашего API и экспортирует ваш tRPC роутер. Обычно, вам не придется трогать этот файл, но если вам нужно, например, включить CORS middleware или что то подобное, полезно знать, что экспортируемый `createNextApiHandler` - это [Next.js API handler](https://nextjs.org/docs/api-routes/introduction) который принимает [request](https://developer.mozilla.org/en-US/docs/Web/API/Request) и [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) объект. Это означает, что вы можете обернуть `createNextApiHandler` в любой middleware, который вам нужен. См. ниже для [примера](#enabling-cors) добавления CORS.

### 📄 `server/api/trpc.ts`

Этот файл разделен на две части: создание контекста и инициализация tRPC.

1. Мы определяем контекст, который передается вашим tRPC процедурам. Контекст - это данные, к которым у вас есть доступ во всех ваших tRPC процедурах, и это отличное место, чтобы поместить вещи, такие как соединения с базой данных, информация об аутентификации и т.д. В create-shipspeed мы используем две функции, чтобы включить использование подмножества контекста, когда у нас нет доступа к объекту запроса.

- `createInnerTRPCContext`: Это то место, где вы определяете контекст, который не зависит от запроса, например, ваше соединение с базой данных. Вы можете использовать эту функцию для [интеграционного тестирования](#sample-integration-test) или [ssg-помощников](https://trpc.io/docs/v10/ssg-helpers), где у вас нет объекта запроса.

- `createTRPCContext`: Здесь вы определяете контекст, который зависит от запроса: например, сессия пользователя. Вы запрашиваете сессию с помощью объекта `opts.req`, а затем передаете сессию в функцию `createInnerTRPCContext` для создания окончательного контекста.

2. Мы инициализируем tRPC и определяем повторно используемые [процедуры](https://trpc.io/docs/v10/procedures) и [посредники](https://trpc.io/docs/v10/middlewares). По соглашению, вы не должны экспортировать весь объект `t`, а вместо этого создавать повторно используемые процедуры и посредники и экспортировать их.

Вы заметите что мы используем `superjson` как [преобразователь данных](https://trpc.io/docs/v10/data-transformers). Это позволяет сохранять типы данных, когда они достигают клиента, поэтому если вы, например, отправляете объект `Date`, клиент вернет `Date`, а не строку, что является случаем для большинства API.

### 📄 `server/api/routers/*.ts`

Это то место, где вы определяете маршруты и процедуры вашего API. Вы [создаете отдельные маршрутизаторы](https://trpc.io/docs/v10/router) для связанных процедур.

### 📄 `server/api/root.ts`

Здесь мы [объединяем](https://trpc.io/docs/v10/merging-routers) все под-маршрутизаторы, определенные в `routers/**` в единый маршрутизатор приложения.

### 📄 `utils/api.ts`

Это точка входа для tRPC на фронтенде. Здесь вы импортируете **определение типов** маршрутизатора и создаете клиент tRPC вместе с хуками react-query. Поскольку мы включили `superjson` в качестве преобразователя данных на бэкенде, нам также нужно включить его на фронтенде. Это связано с тем, что сериализованные данные с бэкенда десериализуются на фронтенде.

Здесь вы определите свои [ссылки](https://trpc.io/docs/v10/links) tRPC, которые определяют поток запросов от клиента к серверу. Мы используем "default" [`httpBatchLink`](https://trpc.io/docs/v10/links/httpBatchLink), который позволяет [группировать запросы](https://cloud.google.com/compute/docs/api/how-tos/batch), а также [`loggerLink`](https://trpc.io/docs/v10/links/loggerLink), который выводит полезные журналы запросов во время разработки.

В конце концов, мы экспортируем [вспомогательный тип](https://trpc.io/docs/v10/infer-types#additional-dx-helper-type), который вы можете использовать для вывода типов на фронтенде.

## Как я могу использовать tRPC?

<div class="embed">
<iframe width="560" height="315" src="https://www.youtube.com/embed/2LYM8gf184U" title="Making typesafe APIs easy with tRPC" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

tRPC контрибьютор [trashh_dev](https://twitter.com/trashh_dev) [выступил на Next.js Conf](https://www.youtube.com/watch?v=2LYM8gf184U) с рассказом о tRPC. Мы настоятельно рекомендуем вам посмотреть его, если вы еще не сделали это.

С tRPC вы пишете функции TypeScript на бэкенде, а затем вызываете их из фронтенда. Простая процедура tRPC может выглядеть так:

```ts:server/api/routers/user.ts
const userRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: input,
      },
    });
  }),
});
```

Это процедура tRPC (эквивалент обработчика маршрута в традиционном бэкенде), которая сначала проверяет входные данные с помощью Zod (который является той же библиотекой проверки, которую мы используем для [переменных окружения](./env-variables)) - в этом случае мы убеждаемся, что входные данные являются строкой. Если входные данные не являются строкой, он отправит информативную ошибку.

После входных данных мы применяем resolver функцию, которая может быть либо [запросом](https://trpc.io/docs/v10/react-queries), [мутацией](https://trpc.io/docs/v10/react-mutations) или [подпиской](https://trpc.io/docs/v10/subscriptions). В нашем примере resolver вызывает нашу базу данных с помощью клиента [prisma](./prisma) и возвращает пользователя, у которого `id` совпадает с тем, который мы передали.

Вы определяете свои процедуры в `роутерах` которые представляют собой коллекцию связанных процедур с общим пространством имен. У вас может быть один роутер для `пользователей`, один для `постов` и еще один для `сообщений`. Эти роутеры затем можно объединить в единый централизованный `appRouter`:

```ts:server/api/root.ts
const appRouter = createTRPCRouter({
  users: userRouter,
  posts: postRouter,
  messages: messageRouter,
});

export type AppRouter = typeof appRouter;
```

Обратите внимание на то, что нам нужно экспортировать только типы наших роутеров, что означает, что мы никогда не импортируем серверный код на клиенте.

Теперь давайте вызовим процедуру на нашем фронтенде. tRPC предоставляет обертку для `@tanstack/react-query`, которая позволяет вам использовать все возможности хуков (hooks), которые он предоставляет, но с дополнительным преимуществом того, что ваши вызовы API типизированы и инферированы (inferred). Мы можем вызывать наши процедуры с нашего фронтенда следующим образом:

```tsx:pages/users/[id].tsx
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const UserPage = () => {
  const { query } = useRouter();
  const userQuery = api.users.getById.useQuery(query.id);

  return (
    <div>
      <h1>{userQuery.data?.name}</h1>
    </div>
  );
};
```

Вы сразу заметите, насколько хороши автодополнение и типобезопасность. Как только вы начнете писать `trpc.`, ваши роутеры появятся в автодополнении, и когда вы выберете роутер, его процедуры также появятся. Вы также получите ошибку TypeScript, если ваш ввод не соответствует валидатору, который вы определили на бэкенде.

## Как я могу вызывать свой API извне?

В обычных API, вы можете вызвать ваши конечные точки (endpoints) используя любой HTTP клиент, как `curl`, `Postman`, `fetch` или прямо из вашего браузера. С tRPC, это немного иначе. Если вы хотите вызывать ваши процедуры без клиента tRPC, есть два рекомендуемых способа сделать это:

### Раскройте одну процедуру внешне

Если вы хотите раскрыть вашу процедуру внешне, вы ищете [server side calls](https://trpc.io/docs/v10/server-side-calls). Это позволит вам создать обычную конечную точку (endpoint) API Next.js, но переиспользовать часть резолвера вашей tRPC процедуры.

```ts:pages/api/users/[id].ts
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter, createCaller } from "../../../server/api/root";
import { createTRPCContext } from "../../../server/api/trpc";

const userByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = createCaller(ctx);
  try {
    const { id } = req.query;
    const user = await caller.user.getById(id);
    res.status(200).json(user);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occurred
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    // Another error occurred
    console.error(cause);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default userByIdHandler;
```

### Раскройте каждую процедуру внешне

Если вы хотите раскрыть каждую процедуру внешне, ознакомьтесь с плагином сообщества [trpc-openapi](https://github.com/jlalmes/trpc-openapi/tree/master). Предоставляя дополнительные метаданные вашим процедурам, вы можете сгенерировать соответствующее REST API из вашего tRPC роутера.

### Это всего лишь HTTP запросы

tRPC взаимодействует через HTTP, поэтому также возможно вызывать ваши процедуры tRPC используя "обычные" HTTP запросы. Однако синтаксис может быть неприятным из-за [RPC протокола](https://trpc.io/docs/v10/rpc), который использует tRPC. Если вам интересно, вы можете проверить, что tRPC запросы и ответы выглядят в вашей вкладке сети браузера, но мы рекомендуем делать это только в качестве образовательного упражнения и придерживаться одного из решений, описанных выше.

## Сравнение с конечной точкой (enpoint) Next.js API

Давайте сравним конечную точку (endpoint) Next.js API с процедурой tRPC. Допустим, мы хотим получить объект пользователя из нашей базы данных и вернуть его на фронтенд. Мы могли бы написать конечную точку (endpoint) Next.js API следующим образом:

```ts:pages/api/users/[id].ts
import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../../server/db";

const userByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id" });
  }

  const examples = await prisma.example.findFirst({
    where: {
      id,
    },
  });

  res.status(200).json(examples);
};

export default userByIdHandler;
```

```ts:pages/users/[id].tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const UserPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [id]);
};
```

Сравните это с примером tRPC выше и вы увидите некоторые преймущества tRPC:

- Вместо того, чтобы указывать URL для каждого маршрута, который может стать неудобным для отладки, если вы что-то переместите, ваш весь маршрутизатор - это объект с автозаполнением.
- Вам не нужно проверять, какой HTTP метод был использован.
- Вам не нужно проверять, что запрос или тело запроса содержат правильные данные в процедуре, потому что Zod позаботится об этом.
- Вместо создания ответа, вы можете выбрасывать ошибки и возвращать значение или объект, как в любой другой функции TypeScript.
- Вызывая процедуру на фронтенде, вы не получаете никакого автозаполнения или проверки типов.

## Полезные сниппеты

Здесь приведены некоторые сниппеты, которые могут пригодиться.

### Включение CORS

Если вам нужно использовать ваш API с другого домена, например в монорепозитории, который включает в себя приложение React Native, вам может потребоваться включить CORS:

```ts:pages/api/trpc/[trpc].ts
import { type NextApiRequest, type NextApiResponse } from "next";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import cors from "nextjs-cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Enable cors
  await cors(req, res);

  // Create and call the tRPC handler
  return createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
  })(req, res);
};

export default handler;
```

### Оптимистические обновления

Оптимистическое обновление - это когда мы обновляем пользовательский интерфейс до того, как API-запрос завершится. Это предоставляет пользователю лучший опыт, потому что он не должен ждать завершения API-запроса, прежде чем пользовательский интерфейс отобразит результат его действия. Однако приложения, которые ценят корректность данных, должны избегать оптимистические обновления, поскольку они не являются «истинным» представлением состояния бэкенда. Вы можете прочитать больше в [документации React Query](https://tanstack.com/query/v4/docs/guides/optimistic-updates).

```tsx
const MyComponent = () => {
  const listPostQuery = api.post.list.useQuery();

  const utils = api.useContext();
  const postCreate = api.post.create.useMutation({
    async onMutate(newPost) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.post.list.cancel();

      // Get the data from the queryCache
      const prevData = utils.post.list.getData();

      // Optimistically update the data with our new post
      utils.post.list.setData(undefined, (old) => [...old, newPost]);

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.post.list.setData(undefined, ctx.prevData);
    },
    onSettled() {
      // Sync with server once mutation has settled
      utils.post.list.invalidate();
    },
  });
};
```

### Простой Интеграционный Тест

Здесь преведен простой интеграционный тест, который использует [Vitest](https://vitest.dev), чтобы проверить, что ваш маршрутизатор tRPC работает должным образом, парсер входных данных выводит правильный тип и возвращаемые данные соответствуют ожидаемому результату.

```ts
import { type inferProcedureInput } from "@trpc/server";
import { expect, test } from "vitest";

import { appRouter, type AppRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

test("example router", async () => {
  const ctx = await createInnerTRPCContext({ session: null });
  const caller = appRouter.createCaller(ctx);

  type Input = inferProcedureInput<AppRouter["example"]["hello"]>;
  const input: Input = {
    text: "test",
  };

  const example = await caller.example.hello(input);

  expect(example).toMatchObject({ greeting: "Hello test" });
});
```

## Полезные ресурсы

| Ресурс                                | Ссылка                                                  |
| ------------------------------------- | ------------------------------------------------------- |
| Документация по tRPC                  | https://www.trpc.io                                     |
| Несколько примеров использования tRPC | https://github.com/trpc/trpc/tree/next/examples         |
| Документация React Query              | https://tanstack.com/query/v4/docs/adapters/react-query |
