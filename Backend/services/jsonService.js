const fs = require('fs');

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data || '[]');
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getById(filePath, id) {
  const items = readJSON(filePath);
  return items.find(item => item.id == id);
}

function saveItem(filePath, newItem) {
  const items = readJSON(filePath);
  items.push(newItem);
  writeJSON(filePath, items);
  return newItem;
}

function updateItem(filePath, id, updatedData) {
  const items = readJSON(filePath);
  const index = items.findIndex(item => item.id == id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updatedData };
  writeJSON(filePath, items);
  return items[index];
}

function deleteItem(filePath, id) {
  const items = readJSON(filePath);
  const filtered = items.filter(item => item.id != id);
  writeJSON(filePath, filtered);
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
