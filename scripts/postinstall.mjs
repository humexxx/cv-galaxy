import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);

async function main() {
  try {
    console.log("📦 Starting postinstall script...");
    console.log("   Platform:", process.platform);
    console.log("   Node version:", process.version);

    // Resolve chromium package location
    const chromiumResolvedPath = import.meta.resolve("@sparticuz/chromium");
    console.log("   Chromium package resolved:", chromiumResolvedPath);

    // Convert file:// URL to regular path
    const chromiumPath = chromiumResolvedPath.replace(/^file:\/\/\//, "");
    console.log("   Chromium path:", chromiumPath);

    // Get the package root directory (goes up from build/esm/index.js to package root)
    const chromiumDir = dirname(dirname(dirname(chromiumPath)));
    const binDir = join(chromiumDir, "bin");
    
    console.log("   Bin directory:", binDir);
    console.log("   Bin exists:", existsSync(binDir));

    if (!existsSync(binDir)) {
      console.log(
        "⚠️  Chromium bin directory not found, skipping archive creation"
      );
      return;
    }

    // Create tar archive in public folder
    const publicDir = join(projectRoot, "public");
    const outputPath = join(publicDir, "chromium-pack.tar");

    console.log("📦 Creating chromium tar archive...");
    console.log("   Source:", binDir);
    console.log("   Output:", outputPath);

    // Tar the contents of bin/ directly (without bin prefix)
    // Use cross-platform commands
    if (process.platform === "win32") {
      console.log("   Using Windows commands...");
      execSync(`if not exist "${publicDir}" mkdir "${publicDir}"`, { stdio: "inherit", cwd: projectRoot });
      execSync(`tar -cf "${outputPath}" -C "${binDir}" .`, { stdio: "inherit", cwd: projectRoot });
    } else {
      console.log("   Using Unix commands...");
      execSync(`mkdir -p "${publicDir}"`, { stdio: "inherit", cwd: projectRoot });
      execSync(`tar -cf "${outputPath}" -C "${binDir}" .`, { stdio: "inherit", cwd: projectRoot });
    }

    if (existsSync(outputPath)) {
      console.log("✅ Chromium archive created successfully!");
      console.log("   File size:", (await import("node:fs")).statSync(outputPath).size, "bytes");
    } else {
      console.error("❌ Archive file was not created!");
    }
  } catch (error) {
    console.error("❌ Failed to create chromium archive:", error.message);
    console.log("⚠️  This is not critical for local development");
    process.exit(0); // Don't fail the install
  }
}

main();
