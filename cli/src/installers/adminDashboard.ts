import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type AvailableDependencies } from "~/installers/dependencyVersionMap.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";
import { logger } from "~/utils/logger.js";

export const adminDashboardInstaller: Installer = ({ projectDir, appRouter, packages }) => {
  const isAppRouter = appRouter ?? true;

  if (!isAppRouter) {
    logger.warn("Admin dashboard is only supported with Next.js App Router. Skipping admin dashboard files.");
    return;
  }

  const extrasDir = path.join(PKG_ROOT, "template/extras");

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

  // Copy middleware for admin route protection
  const middlewareSrc = path.join(extrasDir, "src/middleware.ts");
  const middlewareDest = path.join(projectDir, "src/middleware.ts");
  if (fs.existsSync(middlewareSrc)) {
    fs.copySync(middlewareSrc, middlewareDest);
  }

  // Ensure all admin dependencies are installed
  const adminDeps: AvailableDependencies[] = [
    "@radix-ui/react-dialog",
    "@radix-ui/react-avatar",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
  ];

  addPackageDependency({
    projectDir,
    dependencies: adminDeps,
    devMode: false,
  });

  // If shadcn/ui is not selected, copy the minimal UI components
  // that the admin dashboard needs to function
  if (!packages?.shadcn.inUse) {
    const uiComponentsDir = path.join(extrasDir, "src/components/ui");
    const destUiDir = path.join(projectDir, "src/components/ui");

    const requiredComponents = [
      "badge.tsx",
      "button.tsx",
      "card.tsx",
      "input.tsx",
      "label.tsx",
      "skeleton.tsx",
      "table.tsx",
      "dialog.tsx",
      "avatar.tsx",
      "dropdown-menu.tsx",
      "select.tsx",
      "separator.tsx",
    ];

    for (const component of requiredComponents) {
      const src = path.join(uiComponentsDir, component);
      const dest = path.join(destUiDir, component);
      if (fs.existsSync(src)) {
        fs.ensureDirSync(path.dirname(dest));
        fs.copySync(src, dest);
      }
    }

    // Also copy lib/utils.ts and theme-provider if not present
    const utilsSrc = path.join(extrasDir, "src/lib/utils.ts");
    const utilsDest = path.join(projectDir, "src/lib/utils.ts");
    if (!fs.existsSync(utilsDest)) {
      fs.copySync(utilsSrc, utilsDest);
    }

    const themeProviderSrc = path.join(
      extrasDir,
      "src/components/theme-provider.tsx"
    );
    const themeProviderDest = path.join(
      projectDir,
      "src/components/theme-provider.tsx"
    );
    if (!fs.existsSync(themeProviderDest)) {
      fs.copySync(themeProviderSrc, themeProviderDest);
    }

    // Also copy globals.css with CSS variables if not already copied by tailwind
    const cssSrc = path.join(extrasDir, "src/styles/globals-shadcn.css");
    const cssDest = path.join(projectDir, "src/styles/globals.css");
    fs.copySync(cssSrc, cssDest);
  }
};
