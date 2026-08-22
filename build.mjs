import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const commonOptions = {
  bundle: true,
  sourcemap: true,
  target: ["firefox109", "chrome109"],
  format: "iife",
};

const entries = [
  { in: "src/background.ts", out: "dist/background.js" },
  { in: "src/content.ts", out: "dist/content.js" },
  { in: "popup/popup.ts", out: "popup/popup.js" },
];

async function run() {
  const contexts = await Promise.all(
    entries.map((e) =>
      esbuild.context({
        ...commonOptions,
        entryPoints: [e.in],
        outfile: e.out,
      })
    )
  );

  if (watch) {
    await Promise.all(contexts.map((c) => c.watch()));
    console.log("Watching for changes...");
  } else {
    for (const c of contexts) {
      await c.rebuild();
      await c.dispose();
    }
    console.log("Build complete.");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
