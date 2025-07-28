/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in example
  const headerRow = ['Columns (columns31)'];

  // There are two columns: left is text/button, right is image
  // We want existing elements, not clones, and preserve semantic meaning

  // LEFT COLUMN: .corporateTrainingTxt
  const txtCol = element.querySelector('.corporateTrainingTxt');
  const leftColContent = [];
  if (txtCol) {
    // Add h2
    const h2 = txtCol.querySelector('h2');
    if (h2) leftColContent.push(h2);
    // Add p
    const p = txtCol.querySelector('p');
    if (p) leftColContent.push(p);
    // Add CTA button (a tag)
    const ctaDiv = txtCol.querySelector('.blueButton');
    if (ctaDiv) {
      const a = ctaDiv.querySelector('a');
      if (a) leftColContent.push(a);
    }
  }

  // RIGHT COLUMN: Desktop image preferred, fallback to mobile
  let img = element.querySelector('.col-lg-7.d-none.d-lg-block .corporateTrainingImg img');
  if (!img || !(img.src || img.getAttribute('data-src'))) {
    img = element.querySelector('.col-lg-7.d-block.d-lg-none .corporateTrainingImg img');
  }
  if (img) {
    // If only data-src is set, set src so the importer uses it
    if (!img.src && img.getAttribute('data-src')) {
      img.src = img.getAttribute('data-src');
    }
  }

  // Table structure: header, then 1 row with 2 columns
  const cells = [
    headerRow,
    [leftColContent, img].map(cell => (Array.isArray(cell) && cell.length === 1 ? cell[0] : cell)),
  ];

  // Create table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
