import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const content = `export const supabaseUrl = '${supabaseUrl}';\nexport const supabaseKey = '${supabaseKey}';\n`;

writeFileSync(join(root, 'js', 'config.js'), content, 'utf8');
console.log('Generated js/config.js');
