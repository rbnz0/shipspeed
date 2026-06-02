---
title: tRPC
description: Uso do tRPC
layout: ../../../layouts/docs.astro
lang: pt
---

O tRPC nos permite escrever APIs seguras de ponta a ponta sem nenhuma geração de código ou sobrecarga de tempo de execução. Ele usa a grande inferência do TypeScript para inferir as definições de tipo do seu roteador de API e permite que você chame seus procedimentos de API de seu front-end com total segurança de tipo e preenchimento automático. Ao usar tRPC, seu front-end e back-end parecem mais próximos do que nunca, permitindo uma excelente experiência de desenvolvedor.

<blockquote className="w-full relative border-l-4 italic bg-ss-gray-200 dark:text-ss-gray-50 text-zinc-900 dark:bg-ss-gray-300/20 p-2 rounded-md text-sm my-3 border-neutral-500 quote">
  <div className="relative w-fit flex items-center justify-center p-1">
    <p className="mb-4 text-lg">
      <span aria-hidden="true">&quot;</span>Criei o tRPC para permitir que as pessoas se movam mais rapidamente, removendo a necessidade de uma camada de API tradicional, enquanto ainda tenho a confiança de que nossos aplicativos não serão interrompidos à medida que iteramos rapidamente.<span aria-hidden="true">&quot;</span>
    </p>
  </div>
  <cite className="flex items-center justify-end pr-4 pb-2">
    <img
      alt="Avatar of @alexdotjs"
      className="w-12 rounded-full bg-neutral-500 [margin-inline-end:16px]"
      src="https://avatars.githubusercontent.com/u/459267?v=4"
    />
    <div className="flex flex-col items-start not-italic">
      <span className=" text-sm font-semibold">Alex - criador do tRPC</span>
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

## Como eu uso o tRPC?

<div class="embed">
<iframe width="560" height="315" src="https://www.youtube.com/embed/2LYM8gf184U" title="Making typesafe APIs easy with tRPC" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

o contribuidor do tRPC [trashh_dev](https://twitter.com/trashh_dev) fez [uma fala esplêndida na Next.js Conf](https://www.youtube.com/watch?v=2LYM8gf184U) sobre o tRPC. É altamente recomendável que você assista, caso ainda não o tenha feito.

Com tRPC, você escreve funções TypeScript em seu back-end e, em seguida, as chama de seu front-end. Um procedimento tRPC simples poderia ser assim:

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

Este é um procedimento tRPC (equivalente a um manipulador de rota em um back-end tradicional) que primeiro valida a entrada usando Zod (que é a mesma biblioteca de validação que usamos para [variáveis de ambiente](./env-variables)) - neste caso , é garantir que a entrada seja uma string. Se a entrada não for uma string, ela enviará um erro informativo.

Após a entrada, encadeamos uma função de resolução que pode ser uma [consulta](https://trpc.io/docs/v10/react-queries), [mutação](https://trpc.io/docs/v10/react-mutations) ou uma [assinatura](https://trpc.io/docs/v10/subscriptions). Em nosso exemplo, o resolvedor chama nosso banco de dados usando nosso cliente [prisma](./prisma) e retorna o usuário cujo `id` corresponde ao que passamos.

Você define seus procedimentos em `routers` que representam uma coleção de procedimentos relacionados com um namespace compartilhado. Você pode ter um roteador para `users`, um para `posts` e outro para `messages`. Esses roteadores podem ser mesclados em um único `appRouter` centralizado:

```ts:server/api/root.ts
const appRouter = createTRPCRouter({
  users: userRouter,
  posts: postRouter,
  messages: messageRouter,
});

export type AppRouter = typeof appRouter;
```

Observe que precisamos apenas exportar as definições de tipo do nosso roteador, o que significa que nunca importaremos nenhum código de servidor em nosso cliente.

Agora vamos chamar o procedimento em nosso frontend. tRPC fornece um wrapper para o `@tanstack/react-query` que permite que você utilize todo o poder dos hooks que eles fornecem, mas com o benefício adicional de ter suas chamadas de API digitadas e inferidas. Podemos chamar nossos procedimentos de nosso front-end assim:

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

Você notará imediatamente como o preenchimento automático e a segurança de tipo são bons. Assim que você escrever `api.`, seus roteadores aparecerão no preenchimento automático, e quando você selecionar um roteador, seus procedimentos também aparecerão. Você também receberá um erro de TypeScript se sua entrada não corresponder ao validador definido no back-end.

## Inferindo erros

Por padrão, `create-shipspeed` configura um [formatador de erros](https://trpc.io/docs/error-formatting) que permite que você infira os erros do Zod se você receber erros de validação no back-end.

Exemplo de uso:

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
        {/** `mutate` retornado com um erro no `title` */}
        <span className="mb-8 text-red-500">
          {error.data.zodError.fieldErrors.title}
        </span>
      )}

      ...
    </form>
  );
}
```

## Arquivos

O tRPC requer bastante do template que o `create-shipspeed` configura para você. Vamos ver os arquivos que são gerados:

### 📄 `pages/api/trpc/[trpc].ts`

Este é o ponto de entrada para sua API que expõe o roteador tRPC. Normalmente, você não mexerá muito nesse arquivo, mas se precisar, por exemplo, habilitar o middleware CORS ou similar, é útil saber que o `createNextApiHandler` exportado é um [handler da API do Next.js](https://nextjs.org/docs/api-routes/introduction) que recebe uma [request](https://developer.mozilla.org/en-US/docs/Web/API/Request) e [response](https://developer.mozilla.org/en-US/docs/Web/API/Response). Isso significa que você pode agrupar o `createNextApiHandler` em qualquer middleware que desejar. Veja abaixo um [trecho de exemplo](#ativando-o-cors) da adição de CORS.

### 📄 `server/api/trpc.ts`

Este arquivo é dividido em duas partes, criação de contexto e inicialização do tRPC:

1. Definimos o contexto que é passado para seus procedimentos tRPC. O contexto são dados aos quais todos os seus procedimentos tRPC terão acesso, e é um ótimo lugar para colocar coisas como conexões com banco de dados, informações de autenticação, etc. Em create-shipspeed, usamos duas funções, para habilitar o uso de um subconjunto do contexto quando não temos acesso ao objeto de solicitação.

- `createInnerTRPCContext`: É aqui que você define o contexto que não depende da solicitação, por exemplo sua conexão com o banco de dados. Você pode usar esta função para [teste de integração](#exemplo-de-teste-de-integração) ou [ssg-helpers](https://trpc.io/docs/v10/ssg-helpers) onde você não tem um objeto de solicitação/request.

- `createTRPCContext`: É aqui que você define o contexto que depende da solicitação, por exemplo a sessão do usuário. Você solicita a sessão usando o objeto `opts.req` e, em seguida, passa a sessão para a função `createContextInner` para criar o contexto final.

2. Inicializamos o tRPC e definimos [procedures](https://trpc.io/docs/v10/procedures) e [middlewares](https://trpc.io/docs/v10/middlewares) reutilizáveis. Por convenção, você não deve exportar o objeto inteiro t, mas sim criar procedures e middlewares reutilizáveis e exportá-los.

Você perceberá que usamos 'superjson' como [transformador de dados](https://trpc.io/docs/v10/data-transformers). Isso faz com que seus tipos de dados sejam preservados quando eles chegam ao cliente, então, por exemplo, se você enviar um objeto `Date`, o cliente retornará um `Date` e não uma string, que é o caso para a maioria das APIs.

### 📄 `server/api/routers/*.ts`

Aqui é onde você define as rotas e procedimentos da sua API. Por convenção, você cria [rotas separados](https://trpc.io/docs/v10/router) para procedimentos relacionados.

### 📄 `server/api/root.ts`

Aqui [mesclamos](https://trpc.io/docs/v10/merging-routers) todos as sub-rotas definidas em `routers/**` em um único roteador de aplicativo.

### 📄 `utils/api.ts`

Este é o ponto de entrada do front-end para tRPC. É aqui que você importará a **definição de tipo** do roteador e criará seu cliente tRPC junto com os hooks do react-query. Como habilitamos `superjson` como nosso transformador de dados no back-end, precisamos habilitá-lo também no front-end. Isso ocorre porque os dados serializados do back-end são "desserializados" no front-end.

Você definirá seus [links tRPC](https://trpc.io/docs/v10/links) aqui, que determinarão o fluxo de solicitação do cliente para o servidor. Usamos o "padrão" [`httpBatchLink`](https://trpc.io/docs/v10/links/httpBatchLink) que permite [solicitar lotes](https://cloud.google.com/compute/docs/api/how-tos/batch), bem como um [`loggerLink`](https://trpc.io/docs/v10/links/loggerLink) que gera logs de solicitação úteis durante o desenvolvimento.

Por fim, exportamos um [tipo auxiliar](https://trpc.io/docs/v10/infer-types#additional-dx-helper-type) que você pode usar para inferir seus tipos no frontend.

<div class="embed">
<iframe width="560" height="315" src="https://www.youtube.com/embed/x4mu-jOiA0Q" title="How tRPC really works" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Contribuidor do ShipSpeed [Christopher Ehrlich](https://twitter.com/ccccjjjjeeee) fez [um vídeo sobre fluxos de dados em tRPC](https://www.youtube.com/watch?v=x4mu-jOiA0Q). Este vídeo é recomendado se você já usou o tRPC, mas ainda se sente um pouco incerto sobre como ele funciona.

## Como faço para chamar minha API externamente?

Com APIs regulares, você pode chamar seus endpoints usando qualquer cliente HTTP, como `curl`, `Postman`, `fetch`, `Insomnia` ou diretamente do seu navegador. Com tRPC, é um pouco diferente. Se você deseja chamar seus procedimentos sem o cliente tRPC, há duas maneiras recomendadas de fazer isso:

### Expor um único procedimento externamente

Se você deseja expor um único procedimento externamente, está procurando por [chamadas do lado do servidor](https://trpc.io/docs/v10/server-side-calls). Isso permitiria que você criasse um terminal de API Next.js normal, mas reutilizasse a parte do resolvedor de seu procedimento tRPC.

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

### Expondo cada procedimento como um endpoint REST

Se você deseja expor todos os procedimentos externamente, verifique o plug-in criado pela comunidade [trpc-openapi](https://github.com/jlalmes/trpc-openapi/tree/master). Ao fornecer alguns metadados extras para seus procedimentos, você pode gerar uma API REST compatível com OpenAPI a partir de seu roteador tRPC.

### São apenas Requests HTTP

O tRPC se comunica por meio de HTTP, portanto, também é possível chamar seus procedimentos tRPC usando solicitações HTTP "regulares". No entanto, a sintaxe pode ser complicada devido ao [protocolo RPC](https://trpc.io/docs/v10/rpc) que o tRPC usa. Se você estiver curioso, pode verificar como são as solicitações e respostas tRPC na guia de rede do seu navegador, mas sugerimos fazer isso apenas como um exercício educacional e aderir a uma das soluções descritas acima.

## Comparação com um endpoint da API Next.js

Vamos comparar um endpoint da API Next.js com um procedimento tRPC. Digamos que queremos buscar um objeto de usuário de nosso banco de dados e retorná-lo ao frontend. Poderíamos escrever uma rota de API Next.js como esta:

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

Compare isso com o exemplo tRPC acima e você verá algumas das vantagens do tRPC:

- Em vez de especificar um URL para cada rota, o que pode ser irritante de depurar se você mover algo, todo o seu roteador é um objeto com preenchimento automático.
- Você não precisa validar qual método HTTP foi usado.
- Você não precisa validar se a consulta ou o corpo da solicitação contém os dados corretos no procedimento, pois o Zod cuida disso.
- Em vez de criar uma resposta, você pode lançar erros e retornar um valor ou objeto como faria em qualquer outra função TypeScript.
- Chamar o procedimento no frontend fornece preenchimento automático e segurança de tipo.

## Snippets úteis

Aqui estão alguns snippets que podem ser úteis.

### Ativando o CORS

Se você precisar consumir sua API de um domínio diferente, por exemplo, em um monorepo que inclua um aplicativo React Native, talvez seja necessário habilitar o CORS:

```ts:pages/api/trpc/[trpc].ts
import { type NextApiRequest, type NextApiResponse } from "next";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import cors from "nextjs-cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ativar CORS
  await cors(req, res);

  // Criar e chamar o handler do tRPC
  return createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
  })(req, res);
};

export default handler;
```

### Atualizações otimistas

As atualizações otimistas ocorrem quando atualizamos a interface do usuário antes que a chamada da API seja concluída. Isso dá ao usuário uma experiência melhor porque ele não precisa esperar que a chamada da API termine antes que a interface do usuário reflita o resultado de sua ação. No entanto, aplicativos que valorizam muito a exatidão dos dados devem evitar atualizações otimistas, pois não são uma representação "verdadeira" do estado de back-end. Você pode ler mais na [documentação do React Query](https://tanstack.com/query/v4/docs/guides/optimistic-updates).

```tsx
const MyComponent = () => {
  const listPostQuery = api.post.list.useQuery();

  const utils = api.useContext();
  const postCreate = api.post.create.useMutation({
    async onMutate(newPost) {
      // Cancele as requisições de saída (para que não substituam nossa atualização otimista)
      await utils.post.list.cancel();

      // Obtenha os dados do queryCache
      const prevData = utils.post.list.getData();

      // Atualizar os dados de forma otimista com nosso novo post
      utils.post.list.setData(undefined, (old) => [...old, newPost]);

      // Retornar os dados anteriores para que possamos reverter se algo der errado
      return { prevData };
    },
    onError(err, newPost, ctx) {
      // Se a mutation falhar, usar o valor de contexto de onMutate
      utils.post.list.setData(undefined, ctx.prevData);
    },
    onSettled() {
      // Sincronizar com o servidor assim que a mutação for estabelecida
      utils.post.list.invalidate();
    },
  });
};
```

### Exemplo de teste de integração

Aqui está um exemplo de teste de integração que usa [Vitest](https://vitest.dev) para verificar se seu roteador tRPC está funcionando conforme o esperado, se o analisador de entrada infere o tipo correto e se os dados retornados correspondem à saída esperada.

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

Se seu procedimento estiver protegido, você pode passar um objeto `session` mockado quando criar o contexto:

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

## Recursos Úteis

| Recurso                     | Link                                                    |
| --------------------------- | ------------------------------------------------------- |
| Documentação do tRPC        | https://www.trpc.io                                     |
| Muitos exemplos de tRPC     | https://github.com/trpc/trpc/tree/next/examples         |
| Documentação do React Query | https://tanstack.com/query/v4/docs/adapters/react-query |
