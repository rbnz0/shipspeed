import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type Installer } from "~/installers/index.js";

export const adminDashboardInstaller: Installer = ({ projectDir, appRouter }) => {
  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const isAppRouter = appRouter ?? true;

  if (isAppRouter) {
    const adminDir = path.join(extrasDir, "src/app/admin");
    const destAdminDir = path.join(projectDir, "src/app/admin");

    if (fs.existsSync(adminDir)) {
      fs.copySync(adminDir, destAdminDir);
    }

    const adminComponentsDir = path.join(
      extrasDir,
      "src/components/admin"
    );
    const destAdminComponentsDir = path.join(
      projectDir,
      "src/components/admin"
    );

    if (fs.existsSync(adminComponentsDir)) {
      fs.copySync(adminComponentsDir, destAdminComponentsDir);
    }
  }
};
