/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .row containing the two primary columns
  const rowDiv = element.querySelector('.row');
  if (!rowDiv) return;
  // Get the two main columns: left (main content), right (sidebar)
  const columns = rowDiv.querySelectorAll(':scope > div');
  if (columns.length < 2) return;
  const leftCol = columns[0];
  const rightCol = columns[1];

  // The Columns block should have header: 'Columns (columns1)'
  // For Columns, combine main (left) and sidebar (right) in two cells
  const cells = [
    ['Columns (columns1)'],
    [leftCol, rightCol]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
