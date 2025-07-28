/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns: main content and right sidebar
  const container = element.querySelector('.container');
  if (!container) return;
  const row = container.querySelector('.row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;
  const mainCol = cols[0];
  const sidebarCol = cols[1];

  // Get the main content block (media details)
  let mainContent = mainCol.querySelector('.mediaDetailSec');
  if (!mainContent) mainContent = mainCol;

  // Sidebar content is the whole right column
  let sidebarContent = sidebarCol;

  // Build the columns table as per Columns (columns53)
  // Header row must be exactly 'Columns (columns53)'
  const cells = [
    ['Columns (columns53)'],
    [mainContent, sidebarContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
