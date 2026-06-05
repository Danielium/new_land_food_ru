const fs = require('fs');

const mappingText = fs.readFileSync('url_mapping.txt', 'utf8');
const lines = mappingText.split('\n');

const mapping = {};
let currentName = '';
for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.startsWith('http')) {
        mapping[currentName] = line;
    } else {
        currentName = line;
    }
}

let recipesContent = fs.readFileSync('recipes.js', 'utf8');

for (const [name, url] of Object.entries(mapping)) {
    // Find the recipe object by name
    const regex = new RegExp(`(name:\\s*['"]${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"],)`, 'g');
    recipesContent = recipesContent.replace(regex, `$1\n    url: '${url}',`);
}

fs.writeFileSync('recipes.js', recipesContent);
console.log('Done mapping URLs!');
