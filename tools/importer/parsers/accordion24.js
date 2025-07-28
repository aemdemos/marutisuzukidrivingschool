/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the question (title) from the button inside the card-header
  let titleCell = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    const h3 = cardHeader.querySelector('h3');
    if (h3) {
      const btn = h3.querySelector('button');
      if (btn) {
        // Remove icon <em> elements for clean title
        btn.querySelectorAll('em').forEach(em => em.remove());
        titleCell = btn.textContent.trim();
      }
    }
  }

  // Extract the content (answer) from the card-body inside collapse
  let contentCell = '';
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      contentCell = cardBody;
    }
  }

  // Header row: single cell. Data row: 2 cells (question+answer)
  const rows = [];
  // Header row: must be a single cell (one array entry)
  rows.push(['Accordion (accordion24)']);
  // Data row: [question, answer]
  rows.push([titleCell, contentCell]);

  const table = WebImporter.DOMUtils.createTable(rows, document);

  // If the createTable implementation does NOT set colspan for the header row,
  // set it here so that the header row spans all columns
  const trHeader = table.querySelector('tr:first-child');
  const thHeader = trHeader ? trHeader.querySelector('th') : null;
  if (thHeader && table.rows[1] && table.rows[1].cells.length > 1) {
    thHeader.setAttribute('colspan', table.rows[1].cells.length);
  }

  element.replaceWith(table);
}
