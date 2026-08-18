// Print Typecast paste from content/desk/uploads/{nn-sku}/script.json
//   pnpm desk:print-script -- --file=content/desk/uploads/02-arm-nb-f80/script.json

import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  formatTypecastStudioBlock,
  formatYoutubeUploadBlock,
  parseShortformScript,
} from '../../src/data/shortform-script';

function fileArg(argv: string[]): string {
  for (const arg of argv) {
    if (arg.startsWith('--file=')) return arg.slice('--file='.length);
  }
  throw new Error('Usage: pnpm desk:print-script -- --file=content/desk/uploads/NN-sku/script.json');
}

const file = path.resolve(process.cwd(), fileArg(process.argv.slice(2)));
const script = parseShortformScript(JSON.parse(readFileSync(file, 'utf8')));
process.stdout.write(
  `== Typecast ==\n${formatTypecastStudioBlock(script)}\n\n== YouTube ==\n${formatYoutubeUploadBlock(script)}\n`,
);
