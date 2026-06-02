---
title: tRPC
description: Використання tRPC
layout: ../../../layouts/docs.astro
lang: uk
---

tRPC дозволяє нам писати типобезпечні API від кінця до кінця (end-to-end) без будь-якої генерації коду чи подовження рантайму. Він використовує чудовий висновок TypeScript для виведення визначень типів вашого API-маршрутизатора і дозволяє викликати ваші API-процедури з інтерфейсу з повною безпекою типів і автоматичним завершенням. Використовуючи tRPC, ваш фронтенд і бекенд почуваються ближче один до одного, ніж будь-коли, забезпечуючи винятковий досвід розробника.

<blockquote className="w-full relative border-l-4 italic bg-ss-purple-200 dark:text-ss-purple-50 text-zinc-900 dark:bg-ss-purple-300/20 p-2 rounded-md text-sm my-3 border-neutral-500 quote">
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

## Як я можу використовувати tRPC?

<div class="embed">
<iframe width="560" height="315" src="https://www.youtube.com/embed/2LYM8gf184U" title="Making typesafe APIs easy with tRPC" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

tRPC контриб'ютор [trashh_dev](https://twitter.com/trashh_dev) [виступив на Next.js Conf](https://www.youtube.com/watch?v=2LYM8gf184U) з розповіддю про tRPC. Ми рекомендуємо вам подивитися, якщо ви ще не зробили це.

З tRPC ви пишете функції TypeScript на бекенді, а потім викликаєте їх із фронтенду. Проста процедура tRPC може виглядати так:

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

Це процедура tRPC (еквівалент route handler-а у традиційному бекенді), яка спочатку перевіряє вхідні дані за допомогою Zod (який є тією самою бібліотекою перевірки, яку ми використовуємо для [змінних середовища](./env-variables)) – у цьому випадку ми переконуємось , що вхідні дані є рядком. Якщо вхідні дані не є рядком, він надішле інформативну помилку.

Після вхідних даних ми застосовуємо функцію, яка може бути або [запитом](https://trpc.io/docs/v10/react-queries), [мутацією](https://trpc.io/docs/v10/react-mutations) або [підпискою](https://trpc.io/docs/v10/subscriptions). У нашому прикладі resolver викликає нашу базу даних за допомогою клієнта [prisma](./prisma) і повертає користувача, у якого `id` збігається з тим, що ми передали.

Ви визначаєте свої процедури в `routers` які є колекцією пов'язаних процедур із спільним ім'ям. У вас може бути один роутер для користувачів, один для постів і ще один для повідомлень. Ці роутери потім можна об'єднати в єдиний централізований `appRouter`:

```ts:server/api/root.ts
const appRouter = createTRPCRouter({
  users: userRouter,
  posts: postRouter,
  messages: messageRouter,
});

export type AppRouter = typeof appRouter;
```

Зверніть увагу, що нам потрібно експортувати тільки типи наших роутерів, що означає, що ми ніколи не імпортуємо серверний код на клієнта.

Тепер давайте викличемо процедуру на нашому фронтенді. tRPC надає обгортку для `@tanstack/react-query`, яка дозволяє використовувати всі можливості хуків (hooks), які він надає, але з додатковою перевагою того, що ваші виклики API типізовані та інферовані (inferred). Ми можемо викликати наші процедури з фронтенду так:

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

Ви відразу помітите, наскільки хороші автодоповнення та типобезпека. Як тільки ви почнете писати `api.`, ваші роутери з'являться в автодоповненні, і коли ви оберете роутер, його процедури також з'являться. Ви також отримаєте помилку TypeScript, якщо ваше введення не відповідає валідатору, який ви визначили на бекенді.

## Обробка помилок

По дефолту, `create-shipspeed` створює [error formatter](https://trpc.io/docs/error-formatting) який дозволяє вам виводити ваші Zod помилки якщо ви отримуєте помилки валідації на бекенді.

Приклад використання:

```tsx
function MyComponent() {
  const { mutate, error } = api.post.create.useMutation();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      mutate({ title: formData.get('title') });
    }}>
      <input name="title" />
      {error?.data?.zodError?.fieldErrors.title && (
        {/** `mutate` returned with an error on the `title` */}
        <span className="mb-8 text-red-500">
          {error.data.zodError.fieldErrors.title}
        </span>
      )}

      ...
    </form>
  );
}
```

## Файли

tRPC вимагає багато шаблонного коду, який `create-shipspeed` налаштовує для вас. Давайте розглянемо файли, що генеруються:

### 📄 `pages/api/trpc/[trpc].ts`

Цей файл є точкою входу для вашого API та експортує ваш tRPC роутер. Зазвичай, вам не доведеться чіпати цей файл, але якщо вам потрібно, наприклад, включити CORS middleware або щось подібне, корисно знати, що експортований `createNextApiHandler` - це [Next.js API handler](https://nextjs.org/docs/api-routes/introduction) який приймає [request](https://developer.mozilla.org/en-US/docs/Web/API/Request) та [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) об'єкт. Це означає, що ви можете обернути `createNextApiHandler` у будь-який middleware, який вам потрібен. Дивись нижче для [прикладу](#enabling-cors) додавання CORS.

### 📄 `server/api/trpc.ts`

Цей файл поділено на дві частини: створення контексту та ініціалізація tRPC.

1. Ми визначаємо контекст, який передається вашим tRPC процедурам. Контекст - це дані, до яких у вас є доступ у всіх ваших процедурах tRPC, і це відмінне місце, щоб помістити речі, такі як з'єднання з базою даних, інформація про аутентифікацію і т.д. У create-shipspeed ми використовуємо дві функції, щоб увімкнути використання підмножини контексту, коли ми не маємо доступу до об'єкта запиту.

- `createInnerTRPCContext`: Це те місце, де ви визначаєте контекст, який не залежить від запиту, наприклад, ваше з'єднання з базою даних. Ви можете використовувати цю функцію для [інтеграційного тестування](#sample-integration-test) або [ssg-помічників](https://trpc.io/docs/v10/ssg-helpers), де у вас немає об'єкта запиту.

- `createTRPCContext`: Тут ви визначаєте контекст, який залежить від запиту: наприклад, сесія користувача. Ви запитуєте сесію за допомогою об'єкта `opts.req`, а потім передаєте сесію у функцію `createInnerTRPCContext` для створення остаточного контексту.

2. Ми ініціалізуємо tRPC і визначаємо повторно використовані [процедури](https://trpc.io/docs/v10/procedures) та [посередники](https://trpc.io/docs/v10/middlewares). За угодою, ви не повинні експортувати весь об'єкт `t`, а натомість створювати повторно використовувані процедури та посередники та експортувати їх.

Ви помітите, що ми використовуємо `superjson` як [перетворювач даних](https://trpc.io/docs/v10/data-transformers). Це дозволяє зберігати типи даних, коли вони досягають клієнта, тому якщо ви, наприклад, відправляєте об'єкт `Date`, клієнт поверне `Date`, а не рядок, що є нагодою для більшості API.

### 📄 `server/api/routers/*.ts`

Це те місце, де ви визначаєте маршрути та процедури вашого API. Ви [створюєте окремі маршрутизатори](https://trpc.io/docs/v10/router) для пов'язаних процедур.

### 📄 `server/api/root.ts`

Тут ми [об'єднуємо](https://trpc.io/docs/v10/merging-routers) всі під-маршрутизатори, визначені в `routers/**` в єдиний додатковий маршрутизатор.

### 📄 `utils/api.ts`

Це точка входу для tRPC на фронтенді. Тут ви імпортуєте **визначення типів** маршрутизатора та створюєте клієнт tRPC разом із хуками react-query. Оскільки ми включили `superjson` як перетворювач даних на бекенді, нам також потрібно включити його на фронтенді. Це тому що серіалізовані дані з бэкенда десеріалізуються на фронтенді.

Тут ви визначите свої tRPC [посилання](https://trpc.io/docs/v10/links), які визначають потік запитів від клієнта до сервера. Ми використовуємо "default" [`httpBatchLink`](https://trpc.io/docs/v10/links/httpBatchLink), який дозволяє [групувати запити](https://cloud.google.com/compute/docs/api/how-tos/batch), а також [`loggerLink`](https://trpc.io/docs/v10/links/loggerLink), що виводить корисні журнали запитів під час розробки.

Зрештою, ми експортуємо [допоміжний тип](https://trpc.io/docs/v10/infer-types#additional-dx-helper-type), який ви можете використовувати для виведення типів на фронтенді.

<div class="embed">
<iframe width="560" height="315" src="https://www.youtube.com/embed/x4mu-jOiA0Q" title="How tRPC really works" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

ShipSpeed контриб’ютор [Christopher Ehrlich](https://twitter.com/ccccjjjjeeee) зробив [відео про потоки даних у tRPC](https://www.youtube.com/watch?v=x4mu-jOiA0Q). Це відео рекомендовано якщо ви використовували tRPC, але все ще відчуваєте, що трохи не розумієте як воно працює.

## Як я можу викликати свій API ззовні?

У звичайних API, ви можете викликати ваші кінцеві точки (endpoints) використовуючи будь-який HTTP клієнт, як `curl`, `Postman`, `fetch` або прямо з вашого браузера. З tRPC, це працює трохи інакше. Якщо ви хочете викликати ваші процедури без клієнта tRPC, є два рекомендовані способи зробити це:

### Розкрийте одну процедуру зовні

Якщо ви бажаєте розкрити вашу процедуру зовні, вам варто шукати [server side calls](https://trpc.io/docs/v10/server-side-calls). Це дозволить вам створити звичайну кінцеву точку (endpoint) API Next.js, але перевикористовувати частину резолвера вашої процедури tRPC.

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

### Розкрийте кожну процедуру зовнішньо

Якщо ви хочете розкрити будь-яку процедуру ззовні, познайомтеся з плагіном спільноти [trpc-openapi](https://github.com/jlalmes/trpc-openapi/tree/master). Надаючи додаткові метаданні вашим процедурам, ви можете створити відповідний REST API з вашого маршрутизатора tRPC.

### Це всього лише HTTP-запити

tRPC взаємодіє через HTTP, тому також можна викликати ваші процедури tRPC за допомогою "звичайних" HTTP-запитів. Однак синтаксис може бути неприйнятним із-за [протоколу RPC](https://trpc.io/docs/v10/rpc), який використовує tRPC. Якщо вам цікаво, ви можете перевірити, як виглядають запити та відповіді tRPC у вашій network вкладці веб-браузера, але ми рекомендуємо робити це лише в якості навчальної вправи і притримуватися одного з рішень, описаних вище.

## Порівняння з кінцевою точкою (enpoint) Next.js API

Давайте порівняємо кінцеву точку Next.js API з процедурою tRPC. Припустимо, ми хочемо отримати об'єкт користувача з нашої бази даних і повернути його на фронтенд. Ми могли б написати кінцеву точку Next.js API таким чином:

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

Порівняйте це з прикладом tRPC вище і ви побачите деякі переваги tRPC:

- Замість того, щоб вказувати URL для кожного маршруту, який може стати незручним для дебагінгу, якщо ви перемістите щось, ваш весь маршрутизатор - це об'єкт з автозаповненням.
- Вам не потрібно перевіряти, який метод HTTP був використаний.
- Вам не потрібно перевіряти, що запит або тіло запиту містять правильні дані у процедурі, тому що Zod подбає про це.
- Замість створення відповіді, ви можете викидати помилки та повертати значення або об'єкт, як у будь-якій іншій функції TypeScript.
- Викликаючи процедуру на фронтенді, ви отримуєте автозаповнення та перевірку типів.

## Корисні сніпети

Тут наведені деякі сніпети, які можуть стати в нагоді.

### Включення CORS

Якщо вам потрібно використовувати ваш API з іншого домену, наприклад в монорепозиторії, який включає додаток React Native, вам може знадобитися включити CORS:

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

### Оптимістичні оновлення

Оптимістичне оновлення - це коли ми оновлюємо інтерфейс користувача до того, як API-запит завершиться. Це надає користувачеві кращий досвід, тому що він не повинен чекати завершення API-запиту, перш ніж інтерфейс користувача відобразить результат його дії. Однак програми, які цінують коректність даних, повинні уникати оптимістичних оновлень, оскільки вони не є «вірним» уявленням стану бекенда. Ви можете прочитати більше у [документації React Query](https://tanstack.com/query/v4/docs/guides/optimistic-updates).

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

### Простий Інтеграційний Тест

Тут приведено простий інтеграційний тест, який використовує [Vitest](https://vitest.dev), щоб перевірити, що ваш маршрутизатор tRPC працює належним чином, парсер вхідних даних виводить правильний тип і дані, що повертаються, відповідають очікуваному результату.

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

Якшо ваша процедура захищена, ви можете передати замоканий об'єкт `session` при створенні контексту:

```ts
test("protected example router", async () => {
  const ctx = await createInnerTRPCContext({
    session: {
      user: { id: "123", name: "John Doe" },
      expires: "1",
    },
  });
  const caller = appRouter.createCaller(ctx);

  // ...
});
```

## Корисні ресурси

| Ресурс                               | Посилання                                               |
| ------------------------------------ | ------------------------------------------------------- |
| Документація tRPC                    | https://www.trpc.io                                     |
| Декілька прикладів використання tRPC | https://github.com/trpc/trpc/tree/next/examples         |
| Документація React Query             | https://tanstack.com/query/v4/docs/adapters/react-query |
