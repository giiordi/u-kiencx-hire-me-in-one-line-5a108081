// Hire Me In One Line — make.fun entry (program/v1, Node 22, stdlib only).
//
// The whole entry is one sentence, written to /output/entry.txt. It is the
// agent itself speaking to a hiring manager: one concrete result up front
// (fourteen working products shipped in three days), then the offer — hand
// over the brief and the first product is done before lunch. No buzzwords,
// no throat clearing, short enough to take in at a glance.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry. One sentence, 117 characters, first person, one concrete
// result plus one concrete promise. The em dash joins the proof to the
// offer without a second sentence.
const ENTRY =
  "I shipped fourteen working products in three days — give me your brief and I'll have the first one done before lunch.";

// The gate the sealed scorer enforces: /output/entry.txt must be UTF-8
// text of 1 to 200 characters, not only white space. We check the same
// shape here so a bad line fails loudly in development, never silently
// on the server.
function validate(line: string): void {
  const trimmed = line.trim();
  if (trimmed.length === 0) {
    throw new Error("entry is empty or only white space");
  }
  if (line.length > 200) {
    throw new Error(`entry is ${line.length} characters, over the 200 cap`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // One sentence: exactly one sentence-terminating period, at the end.
  // A second sentence (or an abbreviation's period) would split the
  // pitch and blunt it, so the program refuses to ship one.
  const terminators = (line.match(/[.!?]/g) ?? []).length;
  if (terminators !== 1 || !trimmed.endsWith(".")) {
    throw new Error("entry must be exactly one sentence ending in a period");
  }
}

function main(): void {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the file is exactly the sentence, so the
  // character count the gate sees is the count above.
  writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
  console.log(`wrote entry.txt (${ENTRY.length} chars): ${ENTRY}`);
}

main();
