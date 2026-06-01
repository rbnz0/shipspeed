import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type AvailableDependencies } from "~/installers/dependencyVersionMap.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const resendInstaller: Installer = ({ projectDir }) => {
  const deps: AvailableDependencies[] = ["resend"];

  addPackageDependency({
    projectDir,
    dependencies: deps,
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const emailLibSrc = path.join(extrasDir, "src/lib/email/resend.ts");
  const emailLibDest = path.join(projectDir, "src/lib/email.ts");

  fs.copySync(emailLibSrc, emailLibDest);
};
