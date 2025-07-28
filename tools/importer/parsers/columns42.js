/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per requirement
  const headerRow = ['Columns (columns42)'];

  // Find the two main columns. Structure: .row > div.col-* ...
  const row = element.querySelector(':scope > .row');
  let colDivs = [];
  if (row) {
    colDivs = row.querySelectorAll(':scope > div');
  }

  // Defensive: Prepare two cells, even if content is missing
  let imageCell = '';
  let textCell = '';

  // First column: image
  if (colDivs[0]) {
    // Find the first <img> descendant
    const img = colDivs[0].querySelector('img');
    if (img) imageCell = img;
  }

  // Second column: text content
  if (colDivs[1]) {
    // Find the aboutMsilSec, which holds the main heading and all text
    const aboutSec = colDivs[1].querySelector('.aboutMsilSec');
    if (aboutSec) {
      textCell = aboutSec;
    } else {
      // fallback: use full column
      textCell = colDivs[1];
    }
  }

  // Compose the columns block table
  const tableRows = [
    headerRow,
    [imageCell, textCell],
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
