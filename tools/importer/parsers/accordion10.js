/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should have exactly one cell with the block name
  const headerRow = ['Accordion (accordion10)'];
  const rows = [];

  // Get the title as the first cell of content row
  let titleCell = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    const btn = cardHeader.querySelector('button');
    if (btn) {
      // Clean up by removing icons, but reference the existing button element
      btn.querySelectorAll('i').forEach(i => i.remove());
      titleCell = btn;
    }
  }

  // Get the content as the second cell of content row
  let contentCell = '';
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    if (cardBody.children.length === 1) {
      contentCell = cardBody.firstElementChild;
    } else if (cardBody.children.length > 1) {
      contentCell = Array.from(cardBody.children);
    } else {
      contentCell = cardBody;
    }
  }

  // Add the content row ONLY if both cells exist
  if (titleCell && contentCell) {
    rows.push([titleCell, contentCell]);
  }

  // Build the table: header row (1 cell), then each row with 2 cells
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  
  element.replaceWith(table);
}
