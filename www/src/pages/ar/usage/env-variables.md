---
title: Environment Variables
description: بدء الاستخدام مع create-shipspeed
layout: ../../../layouts/docs.astro
lang: ar
dir: rtl
---

إن `create-shipspeed` تستخدم [Zod](https://github.com/colinhacks/zod) للتأكد من صلاحية الـ environment variables أثناء الـ runtime عن طريق توفير بعض الملفات الاضافة

📁 src/env

┫ 📄 client.mjs

┫ 📄 schema.mjs

┫ 📄 server.mjs

قد يبدو محتوى هذه الملفات مخيفًا للوهلة الأولى ، لكن لا تقلق ، فهو ليس معقدًا كما يبدو. دعنا نلقي نظرة عليها واحدة تلو الأخرى ، ونسير خلال عملية إضافة environment variables إضافية.

إذا كنت تريد إضافة environment variable جديد ، فيجب عليك إضافته إلى كل من ".env" وكذلك في `env / schema.mjs`.\_

## ملف schema.mjs

هذا هو الملف الذي ستعمل علية. يَحتوي على مُخططين ، أحدهما environment variables من جانب الخادم والآخر من جانب العميل بالإضافة إلى Object الـ "clientEnv".

```ts:env/schema.mjs
export const serverSchema = z.object({
  // DATABASE_URL: z.string().url(),
});

export const serverEnv = {
  // DATABASE_URL: process.env.DATABASE_URL,
};

export const clientSchema = z.object({
  // NEXT_PUBLIC_WS_KEY: z.string(),
});

export const clientEnv = {
  // NEXT_PUBLIC_WS_KEY: process.env.NEXT_PUBLIC_WS_KEY,
};
```

### الـ Server Schema

أنشئ الـ environment variables schema من جانب الخادم هنا.
تأكد أن لا تضيف `NEXT_PUBLIC` قبل اسم المتغير، سيفشل الـ Validation إذا ما فعلت هذا.

### الـ Client Schema

أنشئ الـ client-side environment variables هنا، حتى تجعلهم متاحيت للـ client أضف `NEXT_PUBLIC` قبل الاسم.

### الـ clientEnv Object

هُنا حيثُ تقوم بعمل Destruct لـ `process.env`
تحتاج Zod الي Object لتكون قادرة على تصحيح المُدخلات وبسبب طريقة عمل Next.js فلن نستطيع فعل هذا تلقائيا لذلك يجب أن تتم هذة العملية يدويا، لا تقلق فـ Typescript تقوم بتحذيرك إذا ارتكبت خطاّ.

```ts
// ❌ This doesn't work, we need to destruct it manually
const schema = z.object({
  NEXT_PUBLIC_WS_KEY: z.string(),
});

const validated = schema.parse(process.env);
```

## الـ server.mjs & client.mjs

هذا هو المكان الذي يتم فيه التحقق من الـ Object ومن ثم تصديرها. لن تحتاج إلى تعديل هذه الملفات.

## إستخدام الـ Environment Variables

إذا أردت إستخدام الـ env vars فيمكنك إستيراد` env.js` واستعمالهم طبيعيا. إذا إستيرادت الملف في Client وحولت استعمال قيم الserver-side، ستنذر بوجود خطأ في run-time.

```ts:pages/api/hello.ts
import { env } from "../../env.js";

// `env` is fully typesafe and provides autocompletion
const dbUrl = env.DATABASE_URL;
```

## الـ .env.example

بما أن ملف `.env` ليس مُضمناَ في الـ version control، فقد أضفنا ملف `.env.example` والذي يمكنك أن تتركه، وأضياََ ننصحك أن تُبقي هذا الملف متزامنا مع الملف الاساسي حتي تحصل علي أفضل تجربة تطوير ممكنة

## أضف Environment Variables

حتى نتأكد من أنك ستضيف الـ environment variables، يجب عليك أن تضيفها في مكانين مختلفين

📄 ملف `.env`: هنا نضيف المتغيرات بشكل طبيعي كانك تتعامل مع ملف `.env` عادي

📄 ملف `schema.mjs`: هنا تضيف الـ Logic التي ستستخدمة Zod لفحص صلاحية المتغيرات

📄 ملف `.env.example`: هنا تضيف المتغيرات لكن بدون أي كلمات سرية للحفاظ على أمانك

### أمثلة

1. أضف the environment variable الي `.env`:

```
TWITTER_API_TOKEN=1234567890
```

2. أضف environment variable to `schema.mjs`:

```ts
export const serverSchema = z.object({
  // ...
  TWITTER_API_TOKEN: z.string(),
});

export const serverEnv = {
  // ...
  TWITTER_API_TOKEN: process.env.TWITTER_API_TOKEN,
};
```

**ملحوطة:** أضف إسم المُتغيير `TWITTER_API_TOKEN` في example.env ولكن لا تُضف الـ token

```
TWITTER_API_TOKEN=
```
