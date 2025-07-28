/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .mediaDetailSec which contains the hero image and content
  const mediaDetailSec = element.querySelector('.mediaDetailSec');
  let heroImg = null;
  let heroContent = [];

  if (mediaDetailSec) {
    // Get image
    const mediaImg = mediaDetailSec.querySelector('.mediaImg img');
    if (mediaImg) heroImg = mediaImg;

    // Get heading (h1)
    const h1 = mediaDetailSec.querySelector('h1');
    if (h1) heroContent.push(h1);

    // Get all rich content in text box (keep original elements to preserve structure)
    const mediaDetailTxtBox = mediaDetailSec.querySelector('.mediaDetailTxtBox');
    if (mediaDetailTxtBox) {
      // Gather only direct block-level children (preserves structure and ensures all text is included)
      const blocks = Array.from(mediaDetailTxtBox.querySelectorAll(
        ':scope > *:not(style):not(script)'
      ));
      if (blocks.length) {
        heroContent.push(...blocks);
      } else {
        heroContent.push(mediaDetailTxtBox);
      }
    }
  }

  // Fallback: if missing, pull from main element
  if (!heroImg) {
    const fallbackImg = element.querySelector('img');
    if (fallbackImg) heroImg = fallbackImg;
  }
  if (heroContent.length === 0) {
    // Use all block-level elements and text nodes under element
    heroContent = Array.from(element.querySelectorAll('h1,h2,h3,h4,h5,h6,p,div,section,center,ul,ol,li,strong,em,a,br'));
  }
  // Remove any empty nodes
  heroContent = heroContent.filter(el => {
    if (!el) return false;
    if (typeof el.textContent !== 'string') return true;
    return el.textContent.trim().length > 0;
  });

  // Build the table as 1 column, 3 rows as per spec
  const cells = [
    ['Hero (hero6)'],
    [heroImg ? heroImg : ''],
    [heroContent.length ? heroContent : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
