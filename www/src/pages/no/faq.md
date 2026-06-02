---
title: FAQ
description: Ofte stilte spørsmål om ShipSpeed
layout: ../../layouts/docs.astro
lang: no
---

Her er noen ofte stilte spørsmål om ShipSpeed.

## Hva nå? Hvordan lager jeg en app med dette?

Vi prøver å holde dette prosjektet så enkelt som mulig, slik at du kan starte med bare det grunnleggende rammeverket vi har laget for deg. Du kan legge til flere ting senere etter hvert som de blir nødvendige.

Hvis du ikke er kjent med de forskjellige teknologiene som brukes i dette prosjektet, vennligst se den relevante dokumentasjonen. Hvis du har flere spørsmål kan du bli med i våre [Discussions](https://github.com/rbnog/shipspeed/discussions) og be om hjelp.

- [Next.js](https://nextjs.org/)
- [Better Auth](https://www.better-auth.com)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Drizzle](https://orm.drizzle.team/docs/overview)

## Hvordan holder jeg appen min oppdatert?

ShipSpeed er et scaffolding-verktøy, ikke et rammeverk. Dette betyr at når du initialiserer en app, er den din. Det finnes ikke noe postinstall CLI-verktøy for å hjelpe deg med å holde deg oppdatert. Hvis du vil holde deg oppdatert med forbedringene vi gjør til malen, kan du [aktivere varsler for utgivelser](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository) i vårt repository.

## Hvilke læringsressurser er tilgjengelige for øyeblikket?

Vårt samfunn anbefaler at du bare begynner å bruke stakken og bygger med den mens du lærer.

Hvis du vurderer ShipSpeed, er sjansen stor for at du allerede har brukt noen av delene av stakken. Så hvorfor ikke bare hoppe inn i det og lære de andre delene mens du bygger noe?

## Hvorfor er det `.js`-filer i prosjektet?

I henhold til vårt [typesafety-prinsipp](/no/introduction#typesafety-isnt-optional), anser vi _typesafety_ som en førsteklasses borger. Dessverre støtter ikke alle rammeverk og plugins TypeScript, noe som betyr at noen av konfigurasjonsfilene nødvendigvis må være `.js`-filer.

Vi forsøker å understreke at disse filene er JavaScript for en grunn, ved å eksplisitt deklarere hver filtype (`cjs` eller `mjs`) avhengig av hva som støttes av biblioteket den brukes av. Dessuten er alle `js`-filene i dette prosjektet fortsatt typesjekket ved bruk av checkJs-alternativet i kompilatoren (tsconfig).

## Jeg sliter med å legge til i18n i applikasjonen min. Er det noen referanse jeg kan bruke?

Vi har bestemt oss for å ikke inkludere i18n som standard i ShipSpeed fordi det er et emne omgitt av mange meninger og det er mange måter å implementere det på.

## Bør jeg bruke `/app` eller `/pages`?

Du har muligheten til å velge `/app`-katalogstrukturen når du oppretter en app med ShipSpeed. På skrivende tidspunkt regnes denne funksjonen generelt som moden nok til å brukes i produksjon.

Likevel, hvis du sterkt foretrekker å bruke det eldre `/pages`-paradigmet, er det fortsatt et alternativ. Å overføre den eksisterende ruteren kan være en stor innsats, så ikke føl et unødvendig press for å gjøre det.
