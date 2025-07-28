/* global WebImporter */
export default function parse(element, { document }) {
  // Get the left content column
  const left = element.querySelector('.coursesTxtBlock');
  // Get the right image column
  const right = element.querySelector('.courseSecImg');

  // Defensive: If either is missing, fallback to empty div
  const leftCell = left || document.createElement('div');
  const rightCell = right || document.createElement('div');

  // Table header as per the block name in instructions
  const headerRow = ['Columns (columns27)'];
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
