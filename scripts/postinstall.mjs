import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);

async function main() {
  try {
    console.log("📦 Starting postinstall script...");

    const chromiumResolvedPath = import.meta.resolve("@sparticuz/chromium");
    const chromiumPath = chromiumResolvedPath.replace(/^file:\/\/\//, "");
    const chromiumDir = dirname(dirname(dirname(chromiumPath)));
    const binDir = join(chromiumDir, "bin");

    if (!existsSync(binDir)) {
      console.log(
        "⚠️  Chromium bin directory not found, skipping archive creation"
      );
      return;
    }

    const publicDir = join(projectRoot, "public");
    const outputPath = join(publicDir, "chromium-pack.tar");

    console.log("📦 Creating chromium archive...");

    if (process.platform === "win32") {
      execSync(`if not exist "${publicDir}" mkdir "${publicDir}"`, { stdio: "inherit", cwd: projectRoot });
      execSync(`tar -cf "${outputPath}" -C "${binDir}" .`, { stdio: "inherit", cwd: projectRoot });
    } else {
      execSync(`mkdir -p "${publicDir}"`, { stdio: "inherit", cwd: projectRoot });
      execSync(`tar -cf "${outputPath}" -C "${binDir}" .`, { stdio: "inherit", cwd: projectRoot });
    }

    console.log("✅ Chromium archive created successfully!");
  } catch (error) {
    console.error("❌ Failed to create chromium archive:", error.message);
    console.log("⚠️  This is not critical for local development");
    process.exit(0); // Don't fail the install
  }
}

main();
