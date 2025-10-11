const fs = require('fs');
const path = require('path');

function readJSON(fileName) {
  const filePath = path.join(__dirname, `../data/${fileName}`);
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data || '[]');
}

function writeJSON(fileName, data) {
  const filePath = path.join(__dirname, `../data/${fileName}`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getById(fileName, id) {
  const items = readJSON(fileName);
  return items.find(item => item.id == id);
}

function saveItem(fileName, newItem) {
  const items = readJSON(fileName);
  items.push(newItem);
  writeJSON(fileName, items);
  return newItem;
}

function updateItem(fileName, id, updatedData) {
  const items = readJSON(fileName);
  const index = items.findIndex(item => item.id == id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updatedData };
  writeJSON(fileName, items);
  return items[index];
}

function deleteItem(fileName, id) {
  const items = readJSON(fileName);
  const filtered = items.filter(item => item.id != id);
  writeJSON(fileName, filtered);
  return items.length !== filtered.length;
}

module.exports = {
  readJSON,
  writeJSON,
  getById,
  saveItem,
  updateItem,
  deleteItem
};
