/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Prepare the table header row as in the example
  const cells = [['Table (bordered)']];

  // 2. Find the main table block which holds the tabular data
  // The main data is inside .mediaDetailSec > .mediaDetailTxtBox
  let contentRoot = element.querySelector('.mediaDetailSec');
  if (!contentRoot) contentRoot = element;

  // Gather all major content: h1, .mediaImg, and all of .mediaDetailTxtBox
  const blockContent = [];
  // Heading
  const h1 = contentRoot.querySelector('h1');
  if (h1) blockContent.push(h1);
  // Main image
  const mediaImg = contentRoot.querySelector('.mediaImg');
  if (mediaImg) blockContent.push(mediaImg);
  // Main text & tables
  const txtBox = contentRoot.querySelector('.mediaDetailTxtBox');
  if (txtBox) {
    // We want to preserve all content within .mediaDetailTxtBox,
    // including paragraphs, tables, and notes.
    Array.from(txtBox.childNodes).forEach(node => {
      // Only skip empty text nodes
      if (
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
      ) {
        blockContent.push(node);
      }
    });
  }

  // If for some reason .mediaDetailTxtBox is missing, fallback to all children of contentRoot
  if (!txtBox || blockContent.length === 0) {
    Array.from(contentRoot.childNodes).forEach(node => {
      if (
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
      ) {
        blockContent.push(node);
      }
    });
  }

  // Safeguard: if still empty, use all childNodes of original element
  if (blockContent.length === 0) {
    Array.from(element.childNodes).forEach(node => {
      if (
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
      ) {
        blockContent.push(node);
      }
    });
  }

  // 3. Insert all extracted content as a single cell in the 2nd row
  cells.push([blockContent]);

  // 4. Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
