---
title: الأسئلة الشائعة
description: الأسئلة المتكررة حول إنشاء تطبيق ShipSpeed
layout: ../../layouts/docs.astro
lang: ar
dir: rtl
---

إليك ما يَكثُر من سٌؤاله عن ShipSpeed.

## ماذا بعد؟ كيف استعمل `create-shipspeed` لإنشاء تطبيق؟

نحن نحاول أن نُبقي هذا المشروع بَسيطاًً قدر الإمكان، لذلك فَقد وضعنا حَجر الأساس لك، ويمكن إضافة ما تريد وقتما تُريد.

إذا كًنت غير مُلم ببعض التقنيات المُستخدمة في هذا المَشروع فأتجه إلى الـ Docs المَعنية بها، فإذا واجهتك مُشكلة ما فالرجاء الانضمام إلى سيرفر الديسكورد [Discord](https://github.com/rbnog/shipspeed/discussions) وأطلب المُساعدة.

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## ما هي مصادر التعلم المتاحة في الوقت الحالي؟

بالرغم من أن المصادر المذكورة في الأسفل هي من أفضل المصادر الموجودة لتعلم مسار ShipSpeed، فإننا (و [Theo](https://youtu.be/rzwaaWH0ksk?t=1436)) ننصحك أن تبدأ باستخدام الـ Stack وتَعلمه عن طريق أن تبني شيئاَ به.

إذا كُنت تخطط لاستخدام ShipSpeed فَربما تكون دِراية ببعض أجزاء هذا الـ Stack، فلماذا لا تَستغل مَعرفتك تِلك لتبدأ العمل مباشرة.

نَحن نُدرك أن هذا المسار لا يَصلح للجميع. لِذلك ، إذا كنت تشعر أنك قد جَربت ما أوصيناك به وما زلت ترغب في المزيد من مصادر التَعلم، أو في حال أن لم تكن واثقًا من قَدرتك علي ذلك وَحدك، فراجع هذه البرامج التعليمية الرائعة عن ShipSpeed:

### مقالات

- [Build a full stack app with ShipSpeed](https://www.nexxel.dev/blog/ShipSpeed-guestbook)
- [A first look at ShipSpeed](https://dev.to/ajcwebdev/a-first-look-at-create-shipspeed-1i8f)
- [Migrating your ShipSpeed into a Turborepo](https://www.jumr.dev/blog/t3-turbo)

### فيديوهات

- [Build a Blog With the ShipSpeed Stack - tRPC, TypeScript, Next.js, Prisma & Zod](https://www.youtube.com/watch?v=syEWlxVFUrY)
- [Build a Live Chat Application with the ShipSpeed Stack - TypeScript, Tailwind, tRPC](https://www.youtube.com/watch?v=dXRRY37MPuk)
- [The ShipSpeed Stack - How We Built It](https://www.youtube.com/watch?v=H-FXwnEjSsI)
- [An overview of the ShipSpeed (Next, Typescript, Tailwind, tRPC, Next-Auth)](https://www.youtube.com/watch?v=VJH8dsPtbeU)

## لماذا هُناك ملفات بامتداد `.js` في هذا المشروع؟

وِفقًا لـ [ShipSpeed-Axiom #3](/en/introduction#typesafety-isnt-optional) ، نَحن نَعتبر Typesafety مواطناََ مِن الدرجة الأولى. لِسوء الحَظ، لا يُدعم TypeScript في بَعض الـ Frameworks والاضافات مما يعني ضرورى أن تكتب بعض ملفات للإعدادات (configuration) بلغة JS وهو مُر لابُد منة.

نُحن نُحاول التأكيد على أن هذه الملفات هي `Javascript` لأسباب خَارجة عن إرادتنا وذلك عن طريق إستخدام (cjs أو mjs)، لكن لا تزال جميع البيانات في ملفات js في هذا المشروع، تخضع لفحص باستخدام تعليق `@ts-check` في الأعلى.

## أجد صعوبة في إضافة i18n إلى تطبيقي. هل هناك أي مرجع يمكنني الرجوع إلية؟

لقد قررنا عدم تضمين i18n افتراضيًا في ShipSpeed وذلك لأنه موضوع شائك للغاية وهناك العديد من الطرق لتنفيذه.
ومع ذلك، إذا كنان لابُد من تَنفيذه وترغب في رؤية مشروع مَرجعي، فلدينا [مَرجع](https://github.com/juliusmarminge/t3-i18n) يُوضح كيف يمكنك إضافة i18n إلى تَطبيق ShipSpeed باستخدام [next-i18next](https://github.com/i18next/next-i18next).

## لماذا نستخدم `/pages` وليس `/app` في Next.js 13؟

كما ذكرنا مُسبقا في [ShipSpeed-Axiom #2](/en/introduction#bleed-responsibly)، نحن نُحب الأشياء المتطورة لكننا نُقدر الاستقرار، فمن الصعب تَحويل الـ router إلي النظام الجديد، شاهد [not a great place to bleed](https://youtu.be/mnwUbtieOuI?t=1662).
فإن `/app` [مُجرد لَمحة من المستقبل](https://youtu.be/rnsC-12PVlM?t=818)، فهو ليس جاهزًا للإنتاج؛ غير إن (API) في مَرحلة تجريبية ومن المتوقع أن تحدث له تغييرات جذرية.

لمعرفة الميزات المدعومة والمخطط العمل عليها في dir المسمى `/app`، زر [beta Next.js docs](https://beta.nextjs.org/docs/app-directory-roadmap#supported-and-planned-features).
