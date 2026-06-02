---
title: Preguntas Frecuentes
description: Preguntas frecuentes acerca de ShipSpeed
layout: ../../layouts/docs.astro
lang: es
---

Aquí hay algunas preguntas frecuentes sobre ShipSpeed.

## ¿Qué sigue? ¿Cómo hago una aplicación con esto?

Tratamos de mantener este proyecto lo más simple posible, para que puedas comenzar solo con el esqueleto que configuramos para ti y agregar cosas adicionales más adelante cuando sea necesario.

Si no estás familiarizado con las diferentes tecnologías utilizadas en este proyecto, consulta la documentación respectiva. Si todavía no estás seguro, únete a nuestro [Discussions](https://github.com/rbnog/shipspeed/discussions) y solicita ayuda.

- [Next.js](https://nextjs.org/)
- [Better Auth](https://www.better-auth.com)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Drizzle](https://orm.drizzle.team/docs/overview)

## ¿Cómo mantengo mi aplicación actualizada?

ShipSpeed es una herramienta de scaffolding, no un framework. Esto significa que una vez que inicializas una aplicación, es tuya. No hay una herramienta CLI de postinstall que te ayude a mantenerla actualizada. Si quieres seguir las mejoras que hagamos en la plantilla, puedes [activar las notificaciones de versiones](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository) en nuestro repositorio.

## ¿Qué recursos de aprendizaje están disponibles actualmente?

La comunidad recomienda que comiences a usar el stack y aprendas en el camino construyendo con él.

Si estás considerando ShipSpeed, es probable que ya hayas usado algunas de las partes del stack. Entonces, ¿por qué no simplemente sumergirse en el y aprender las otras partes mientras construyes algo?

## ¿Por qué hay archivos `.js` en el proyecto?

De acuerdo con nuestro [principio de typesafety](/es/introduction#typesafety-isnt-optional), tomamos la seguridad de tipos como un ciudadano de primera clase. Desafortunadamente, no todos los frameworks y complementos admiten TypeScript, lo que significa que algunos de los archivos de configuración deben ser archivos `.js`.

Intentamos enfatizar que estos archivos son javascript por una razón, declarando explícitamente el tipo de cada archivo (`cjs` o `mjs`) dependiendo de lo que admita la librería que lo utiliza. Además, todos los archivos `js` en este proyecto aún tienen verificación de tipos usando un checkJs en el compilador (tsconfig).

## Tengo problemas para agregar i18n a mi aplicación. ¿Hay alguna referencia que pueda usar?

Hemos decidido no incluir i18n por defecto en ShipSpeed porque es un tema muy opinionado y hay muchas formas de implementarlo.

## ¿Debo usar `/app` o `/pages` de Next.js?

Tienes la opción de optar por la estructura de directorios `/app` al crear una aplicación con ShipSpeed. A la fecha de redacción de este documento, esta función se considera lo suficientemente madura para usarse en producción.

Sin embargo, si prefieres fuertemente usar el paradigma `/pages` más antiguo, esa sigue siendo una opción. Portar tu router existente puede ser un esfuerzo monumental, así que no sientas una presión innecesaria para hacerlo.
