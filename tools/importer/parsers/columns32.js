/* global WebImporter */
export default function parse(element, { document }) {
  // Find carousel track
  const stage = element.querySelector('.owl-stage');
  let items = [];
  if (stage) {
    // Use .owl-item.active for the columns shown in the screenshot (2 columns)
    const activeItems = Array.from(stage.querySelectorAll('.owl-item.active .item'));
    if (activeItems.length >= 2) {
      items = activeItems;
    } else {
      // Fallback: Get first two .item blocks
      items = Array.from(stage.querySelectorAll('.item')).slice(0, 2);
    }
  }
  if (!items.length) {
    items = Array.from(element.querySelectorAll('.item')).slice(0, 2);
  }
  // If .item structure not found, fallback to top-level child divs (should not be needed here)
  if (!items.length) {
    items = Array.from(element.querySelectorAll(':scope > div')).slice(0, 2);
  }

  // Only proceed if two items found
  if (items.length !== 2) return;

  // For each column, collect all direct children of .coursesRptSec (preserving text content, tags, and semantics)
  const columns = items.map(item => {
    // Find .coursesRptSec inside .item, fallback to item itself
    const contentRoot = item.querySelector('.coursesRptSec') || item;
    // To preserve text and element nodes, gather all childNodes
    const parts = [];
    contentRoot.childNodes.forEach(node => {
      // Only include if it's not empty text
      if (node.nodeType === 3 && node.textContent.trim() === '') return;
      parts.push(node);
    });
    // If only one node, just return it, else return an array
    return parts.length === 1 ? parts[0] : parts;
  });

  // Build the correct table: header row (single cell only), then second row with both columns
  const rows = [
    ['Columns (columns32)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
