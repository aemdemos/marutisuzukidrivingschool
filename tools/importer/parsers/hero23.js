/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly matching the block name
  const headerRow = ['Hero (hero23)'];

  // --- Row 2: Background image (single cell) ---
  // Use the <img> from <picture>
  let backgroundImgEl = '';
  const picture = element.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      backgroundImgEl = img;
    } else {
      // fallback: if there's no <img>, use the <picture> element itself
      backgroundImgEl = picture;
    }
  }
  const row2 = [backgroundImgEl];

  // --- Row 3: Title and other text ---
  // Find .innerBannerTxt > .container, then gather all non-empty children
  let contentCellElements = [];
  const bannerTxt = element.querySelector('.innerBannerTxt');
  if (bannerTxt) {
    const container = bannerTxt.querySelector('.container');
    if (container) {
      Array.from(container.children).forEach(child => {
        // Only add meaningful elements (text content that is not blank)
        if (child.textContent && child.textContent.trim() !== '') {
          contentCellElements.push(child);
        }
      });
    }
  }
  const row3 = [contentCellElements.length ? contentCellElements : ''];

  // Combine rows
  const cells = [
    headerRow,
    row2,
    row3
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with the new table block
  element.replaceWith(table);
}
