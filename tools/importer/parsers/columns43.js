/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell with block name
  const headerRow = ['Columns (columns43)'];

  // Get all immediate child column divs
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, gather its content as a single cell
  const contentRow = columnDivs.map(colDiv => {
    const box = colDiv.querySelector('.innersitemapbox') || colDiv;
    const colContent = [];
    const span = box.querySelector('span');
    if (span) colContent.push(span);
    const h3 = box.querySelector('h3');
    if (h3) colContent.push(h3);
    const ul = box.querySelector('ul');
    if (ul && ul.children.length > 0) colContent.push(ul);
    // Defensive: If no content, add empty string
    if (colContent.length === 0) colContent.push('');
    return colContent;
  });

  // The table rows: single header cell, then one content row with N columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
