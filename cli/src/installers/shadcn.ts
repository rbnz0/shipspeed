import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type AvailableDependencies } from "~/installers/dependencyVersionMap.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const shadcnInstaller: Installer = ({ projectDir, appRouter }) => {
  const deps: AvailableDependencies[] = [
    "tailwind-merge",
    "clsx",
    "class-variance-authority",
    "lucide-react",
    "next-themes",
    "@radix-ui/react-dialog",
    "@radix-ui/react-avatar",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
    "@radix-ui/react-tabs",
    "sonner",
  ];

  addPackageDependency({
    projectDir,
    dependencies: deps,
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  // components.json config
  const componentsJsonSrc = path.join(extrasDir, "config/components.json");
  const componentsJsonDest = path.join(projectDir, "components.json");

  // lib/utils.ts (cn helper)
  const utilsSrc = path.join(extrasDir, "src/lib/utils.ts");
  const utilsDest = path.join(projectDir, "src/lib/utils.ts");

  // theme provider
  const themeProviderSrc = path.join(
    extrasDir,
    "src/components/theme-provider.tsx"
  );
  const themeProviderDest = path.join(
    projectDir,
    "src/components/theme-provider.tsx"
  );

  // globals.css with CSS variables
  const cssSrc = path.join(extrasDir, "src/styles/globals-shadcn.css");
  const cssDest = path.join(projectDir, "src/styles/globals.css");

  fs.copySync(componentsJsonSrc, componentsJsonDest);
  fs.copySync(utilsSrc, utilsDest);
  fs.copySync(themeProviderSrc, themeProviderDest);
  fs.copySync(cssSrc, cssDest);

  // Copy basic UI components
  const uiComponentsDir = path.join(extrasDir, "src/components/ui");
  const destUiDir = path.join(projectDir, "src/components/ui");

  if (fs.existsSync(uiComponentsDir)) {
    fs.copySync(uiComponentsDir, destUiDir);
  }

  // Inject ThemeProvider into the App Router layout if applicable
  const isAppRouter = appRouter ?? true;
  if (isAppRouter) {
    const layoutPath = path.join(projectDir, "src/app/layout.tsx");
    if (fs.existsSync(layoutPath)) {
      let layoutContent = fs.readFileSync(layoutPath, "utf8");

      // Add ThemeProvider import if not present
      if (!layoutContent.includes("ThemeProvider")) {
        layoutContent = `import { ThemeProvider } from "~/components/theme-provider";\n${layoutContent}`;
      }

      // Wrap children with ThemeProvider if not already wrapped
      if (!layoutContent.includes("<ThemeProvider")) {
        layoutContent = layoutContent.replace(
          /<body([^>]*)>([\s\S]*?)<\/body>/,
          `<body$1><ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>$2</ThemeProvider></body>`
        );
      }

      // Add suppressHydrationWarning to html tag if not present
      if (!layoutContent.includes("suppressHydrationWarning")) {
        layoutContent = layoutContent.replace(
          /<html lang="en"/, 
          `<html lang="en" suppressHydrationWarning`
        );
      }

      fs.writeFileSync(layoutPath, layoutContent, "utf8");
    }
  }
};
