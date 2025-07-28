/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the immediate columns (children of .row)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // The header row must have exactly one column with the block name
  const headerRow = ['Columns (columns29)'];

  // The content row: one cell per column
  const contentRow = columns.map((col) => {
    // Grab the main content holder (.footerLink), or fallback to column div
    const mainContent = col.querySelector(':scope > .footerLink') || col;
    return mainContent;
  });

  // Compose the cells so that header is a single cell, and content is N-wide
  const cells = [
    headerRow,
    contentRow
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
