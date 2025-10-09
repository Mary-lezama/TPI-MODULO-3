const fs = require('fs');

function readJSON(path) {
  const data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

function writeJSON(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = { readJSON, writeJSON };