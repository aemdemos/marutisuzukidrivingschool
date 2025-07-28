/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get the two column elements
  const columns = row.querySelectorAll(':scope > div');
  if (columns.length !== 2) return;
  const leftCol = columns[0];
  const rightCol = columns[1];

  // LEFT: get the content block containing all text
  let leftContent = leftCol.querySelector('.aboutFirsTxtInn') || leftCol;

  // RIGHT: get the main image only (not its wrapper)
  let rightContent = null;
  const img = rightCol.querySelector('img');
  if (img) {
    rightContent = img;
  } else {
    rightContent = rightCol;
  }

  // Table structure: header row is a single cell, next row is two columns
  const cells = [
    ['Columns (columns48)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
