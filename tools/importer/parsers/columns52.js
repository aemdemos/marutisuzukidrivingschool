/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing columns
  const row = element.querySelector('.row');
  if (!row) return;
  // Extract column elements
  const columns = Array.from(row.children).filter(col => col.classList.contains('col-12'));

  // Get each full blueBgNumbers block from each column
  const columnCells = columns.map(col => col.firstElementChild || document.createTextNode(''));

  // Header row: exactly one cell, matching the example
  const headerRow = ['Columns (columns52)'];

  // Build the table: single header row, then the data row
  const cells = [
    headerRow,
    columnCells
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
