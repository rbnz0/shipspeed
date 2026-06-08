import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type AvailableDependencies } from "~/installers/dependencyVersionMap.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const polarInstaller: Installer = ({ projectDir, appRouter }) => {
  const deps: AvailableDependencies[] = ["@polar-sh/sdk", "@polar-sh/nextjs"];

  addPackageDependency({
    projectDir,
    dependencies: deps,
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const polarLibSrc = path.join(extrasDir, "src/lib/polar.ts");
  const polarLibDest = path.join(projectDir, "src/lib/polar.ts");

  fs.copySync(polarLibSrc, polarLibDest);

  if (appRouter ?? true) {
    const checkoutRouteSrc = path.join(extrasDir, "src/app/checkout/route.ts");
    const checkoutRouteDest = path.join(
      projectDir,
      "src/app/checkout/route.ts"
    );

    const portalRouteSrc = path.join(extrasDir, "src/app/portal/route.ts");
    const portalRouteDest = path.join(projectDir, "src/app/portal/route.ts");

    const webhookRouteSrc = path.join(
      extrasDir,
      "src/app/api/webhook/polar/route.ts"
    );
    const webhookRouteDest = path.join(
      projectDir,
      "src/app/api/webhook/polar/route.ts"
    );

    fs.copySync(checkoutRouteSrc, checkoutRouteDest);
    fs.copySync(portalRouteSrc, portalRouteDest);
    fs.copySync(webhookRouteSrc, webhookRouteDest);
  }
};
