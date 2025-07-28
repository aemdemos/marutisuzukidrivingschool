/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Accordion block - must be single column array
  const headerRow = ['Accordion (accordion21)'];

  // Extract the accordion title from the card-header > h2 (text only, no icons)
  let title = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    const h2 = cardHeader.querySelector('h2');
    if (h2) {
      let foundIcon = false;
      h2.childNodes.forEach((node) => {
        if (!foundIcon) {
          if (node.nodeType === Node.TEXT_NODE) {
            title += node.textContent;
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'i') {
            foundIcon = true;
          }
        }
      });
      title = title.trim();
    }
  }

  // Extract the content for the accordion body (everything inside .card-body)
  let contentElem = null;
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    contentElem = cardBody;
  }

  // Prepare the rows: first row is header (1 col), subsequent rows are 2 columns (title, content)
  const rows = [];
  rows.push(headerRow); // header row, single column
  rows.push([title || '', contentElem || '']); // data row, two columns

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the newly created table
  element.replaceWith(table);
}
