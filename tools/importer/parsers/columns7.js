/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Columns (columns7)'];

  // Find the columns: left (main article), right (articles sidebar)
  const leftCol = element.querySelector('.col-lg-8');
  const rightCol = element.querySelector('.col-lg-4');

  // Left column content: reference and preserve original structure
  let leftContent = [];
  if (leftCol) {
    const mediaDetailSec = leftCol.querySelector('.mediaDetailSec');
    if (mediaDetailSec) leftContent.push(mediaDetailSec);
  }
  if (leftContent.length === 0) leftContent.push(document.createElement('div'));

  // Right column content: reference and preserve original structure
  let rightContent = [];
  if (rightCol) {
    // All content: Related Articles accordion and Recent Article
    const accordion = rightCol.querySelector('#accordionTab1');
    if (accordion) rightContent.push(accordion);
    const recent = rightCol.querySelector('.mediaRecentArticle');
    if (recent) rightContent.push(recent);
  }
  if (rightContent.length === 0) rightContent.push(document.createElement('div'));

  // Table structure per Columns block requirements: header, then columns row
  const tableRows = [
    headerRow,
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
