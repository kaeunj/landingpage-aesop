const { writeFileSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const content = `export const supabaseUrl = ${JSON.stringify(supabaseUrl)};\nexport const supabaseKey = ${JSON.stringify(supabaseKey)};\n`;

writeFileSync(join(root, 'js', 'config.js'), content, 'utf8');
console.log('Generated js/config.js');
