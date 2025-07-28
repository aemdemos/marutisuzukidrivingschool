/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the two main columns: left (main content) and right (sidebar)
  // The page structure is: .container > .row > .col-lg-8 (main), .col-lg-4 (sidebar)
  const container = element.querySelector('.container');
  let leftCol = null;
  let rightCol = null;
  if (container) {
    const row = container.querySelector('.row');
    if (row) {
      const children = Array.from(row.children);
      leftCol = children.find(child => child.classList.contains('col-lg-8'));
      rightCol = children.find(child => child.classList.contains('col-lg-4'));
    }
  }

  // Fallback: if not found, just use direct children of element
  if (!leftCol || !rightCol) {
    const children = Array.from(element.children);
    leftCol = leftCol || children.find(child => child.classList.contains('col-lg-8'));
    rightCol = rightCol || children.find(child => child.classList.contains('col-lg-4'));
  }

  // Prepare the header row and content row
  const headerRow = ['Columns (columns50)'];
  const cells = [];
  // Only add columns that exist
  if (leftCol && rightCol) {
    cells.push([leftCol, rightCol]);
  } else if (leftCol) {
    cells.push([leftCol]);
  } else if (rightCol) {
    cells.push([rightCol]);
  } else {
    // If no columns found, use the whole element
    cells.push([element]);
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cells
  ], document);

  element.replaceWith(table);
}
