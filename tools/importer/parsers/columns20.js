/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell
  const headerRow = ['Columns (columns20)'];

  // Find the intro (heading + image) content
  let introCell = '';
  const introDiv = element.querySelector(':scope > .col-12');
  if (introDiv) {
    const introBox = introDiv.querySelector('.innersitemapbox');
    introCell = introBox || introDiv;
  }

  // Find the four column blocks
  const columnDivs = Array.from(element.querySelectorAll(':scope > .col-6, :scope > .col-md-3')).map(div => {
    const box = div.querySelector('.innersitemapbox');
    return box || div;
  });

  // Second row: The intro content in the first cell, then the four columns (for 5 columns total)
  const secondRow = [introCell, ...columnDivs];

  // Compose the rows as per the example: header row (single cell), then the column row (5 cells)
  const cells = [headerRow, secondRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
