---
title: FAQ
description: Najczęściej zadawane pytania dotyczące ShipSpeed
layout: ../../layouts/docs.astro
lang: pl
---

Tu znajdziesz najczęściej zadawane pytania dotyczące ShipSpeed.

## Co dalej? Jak mam napisać aplikację?

Staramy się, aby projekt ten był jak najprostszy - możesz zacząć już korzystać z zawartego w nim szablonu a następnie stopniowo dodawać potrzebne Ci rzeczy.

Jeżeli nie znasz poszczególnych technologi użytych w projekcie, skorzystaj z odnośników do odpowiednich stron z dokumentacjami. Jeżeli dalej nie jesteś co do nich pewien, możesz dołączyć do naszych [Discussions](https://github.com/rbnog/shipspeed/discussions) i poprosić o pomoc.

- [Next.js](https://nextjs.org/)
- [Better Auth](https://www.better-auth.com)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Drizzle](https://orm.drizzle.team/docs/overview)

## Jak sprawić, by aplikacja była ciągle aktualna?

ShipSpeed to narzędzie do tworzenia szablonu, a nie framework. Oznacza to, że po inicjalizacji aplikacji jest ona już twoja. Nie istnieje żadne narzędzie CLI do wykorzystania po instalacji aplikacji, które utrzymałoby twoją aplikację aktualną. Jeżeli chcesz być na bieżąco z wprowadzanymi przez nas zmianami do szablonu, możesz [włączyć powiadomienia nowych wersji](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository) dla naszego repozytorium.

## Jakie zasoby do nauki są dostępne?

Społeczność poleca Ci zacząć po prostu z niego korzystać. W ten sposób podczas pisania aplikacji zdobędziesz potrzebną wiedzę.

Jeżeli zastanawiasz się nad korzystaniem z ShipSpeed, mogłeś już używać poszczególnych jego składowych w przeszłości. W takim przypadku spróbuj wskoczyć na głęboką wodę i nauczyć się innych jego części po drodze!

## Dlaczego w projekcie są pliki `.js`?

Tak jak opisano w naszym [principie typesafety](/pl/introduction#typesafety-isnt-optional), traktujemy typesafety za pierwszorzędną rzecz. Niestety nie wszystkie frameworki i pluginy posiadają wsparcie do TypeScripta, dlatego też niektóre pliki konfiguracyjne muszą mieć powyższe rozszerzenie.

Staramy się podkreślić, iż pliki te korzystają z TypeScripta nie bez powodu. Wyraźnie określamy rozszerzenia plików jako `cjs` lub `mjs`, zależnie od wsparcia przez daną bibliotekę. Dodatkowo, wszystkie pliki `.js` w naszym projekcie są w dalszym ciągu sprawdzane pod kątem poprawności typów - korzystamy do tego opcji `checkJs` w kompilatorze (tsconfig).

## Mam problem z dodaniem i18n do aplikacji. Czy istnieje jakiś projekt, do którego mógłbym się odnieść przy jej budowaniu?

Zdecydowaliśmy się nie umieszczać i18n w ShipSpeed, ponieważ jest to bardzo kontrowersyjny temat i istnieje wiele sposobów, aby element ten zaimplementować.

## Czy powinienem używać `/app` czy `/pages`?

Masz możliwość wyboru struktury katalogów `/app` podczas tworzenia aplikacji za pomocą ShipSpeed. W momencie pisania tego tekstu funkcja ta jest powszechnie uznawana za wystarczająco dojrzałą, aby można jej było używać w produkcji.

Niemniej jednak, jeśli zdecydowanie wolisz używać starszego paradygmatu `/pages`, nadal jest to opcja. Przeniesienie istniejącego routera może być ogromnym wysiłkiem, więc nie czuj niepotrzebnej presji, aby to robić.
