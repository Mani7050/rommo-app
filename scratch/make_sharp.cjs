const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to match any rounded class, including responsive and state variants like sm:rounded-[48px]
// matches things like: rounded, rounded-md, rounded-[32px], sm:rounded-full, rounded-t-[32px], etc.
const roundedRegex = /\b(sm:|md:|lg:|hover:|focus:|active:|dark:)?rounded(-[a-zA-Z0-9\-\[\]]+)?\b/g;

const matches = content.match(roundedRegex);
console.log(`Found ${matches ? matches.length : 0} rounded occurrences.`);

// Replace all occurrences with rounded-none
content = content.replace(roundedRegex, (match) => {
  // If it's already rounded-none, keep it
  if (match.endsWith('-none')) return match;
  // Preserve responsive/state prefix if present, e.g. sm:rounded-[48px] -> sm:rounded-none
  const prefix = match.split('rounded')[0];
  return `${prefix}rounded-none`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully removed all rounded corners in App.tsx');
