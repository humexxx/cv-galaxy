import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync, statSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);

// The archive is a repack of the `bin/` payload shipped by @sparticuz/chromium.
// A healthy pack is tens of MB; anything smaller means tar produced garbage.
const MIN_EXPECTED_BYTES = 1024 * 1024;

/**
 * Explicit, narrow reasons for skipping the pack build. Everything that is not
 * one of these is a genuine failure and must exit non-zero, otherwise a broken
 * install ships and /api/pdf only blows up at runtime in production.
 */
function resolveChromiumPackageDir() {
  // Opt-out for environments that intentionally do not build the pack
  // (e.g. a Docker layer that copies a prebuilt public/chromium-pack.tar).
  if (process.env.SKIP_CHROMIUM_PACK === "1") {
    return { skip: "SKIP_CHROMIUM_PACK=1 is set" };
  }

  // @sparticuz/chromium is a devDependency. Production-only installs
  // (`npm ci --omit=dev`) legitimately do not have it: those deployments read
  // the committed public/chromium-pack.tar instead of rebuilding it.
  try {
    const resolved = import.meta.resolve("@sparticuz/chromium");
    const entry = fileURLToPath(resolved);
    // .../@sparticuz/chromium/build/esm/index.js -> .../@sparticuz/chromium
    return { dir: dirname(dirname(dirname(entry))) };
  } catch {
    return {
      skip: "@sparticuz/chromium is not installed (production-only install?)",
    };
  }
}

function main() {
  console.log("📦 postinstall: preparing chromium pack...");

  const { dir: chromiumDir, skip } = resolveChromiumPackageDir();

  if (skip) {
    console.log(`⏭️  Skipping chromium archive creation: ${skip}`);
    return;
  }

  const binDir = join(chromiumDir, "bin");

  if (!existsSync(binDir)) {
    // @sparticuz/chromium IS installed but its payload is missing: that is a
    // corrupt install, not a legitimate skip.
    throw new Error(
      `@sparticuz/chromium resolved to "${chromiumDir}" but "${binDir}" does not exist. ` +
        `The package is installed but incomplete - reinstall dependencies.`
    );
  }

  const publicDir = join(projectRoot, "public");
  const outputPath = join(publicDir, "chromium-pack.tar");

  mkdirSync(publicDir, { recursive: true });

  console.log(`📦 Creating chromium archive at ${outputPath}...`);

  // execFileSync (no shell) keeps this identical on win32 and POSIX; `tar` is
  // available on Windows 10+ as well as every CI image we use.
  execFileSync("tar", ["-cf", outputPath, "-C", binDir, "."], {
    stdio: "inherit",
    cwd: projectRoot,
  });

  if (!existsSync(outputPath)) {
    throw new Error(`tar reported success but ${outputPath} was not created.`);
  }

  const { size } = statSync(outputPath);
  if (size < MIN_EXPECTED_BYTES) {
    throw new Error(
      `${outputPath} is only ${size} bytes (expected at least ${MIN_EXPECTED_BYTES}). ` +
        `The chromium pack looks truncated or empty.`
    );
  }

  console.log(
    `✅ Chromium archive created successfully (${(size / 1024 / 1024).toFixed(1)} MB).`
  );
}

try {
  main();
} catch (error) {
  console.error("❌ postinstall: failed to create the chromium archive.");
  console.error("   /api/pdf will not work without it. Aborting install.");
  console.error(error instanceof Error ? (error.stack ?? error.message) : error);
  process.exit(1);
}
