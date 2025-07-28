/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel wrapper
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Select all unique card items by finding all .item containers
  const allItems = Array.from(carousel.querySelectorAll('.item'));

  // Use a set to prevent duplicate entries based on heading text + image src
  const seen = new Set();
  const uniqueItems = [];
  for (const item of allItems) {
    const h3 = item.querySelector('h3');
    const heading = h3 ? h3.textContent.trim() : '';
    const img = item.querySelector('.mediaBanner img');
    let imgSrc = '';
    if (img) {
      imgSrc = img.getAttribute('src') || img.getAttribute('data-src') || '';
      imgSrc = imgSrc.split('?')[0];
    }
    const key = heading + '|' + imgSrc;
    if (heading && !seen.has(key)) {
      seen.add(key);
      uniqueItems.push(item);
    }
  }

  // Table header as required by the spec
  const rows = [['Cards (cards45)']];

  uniqueItems.forEach((item) => {
    // --- First cell: image ---
    let img = item.querySelector('.mediaBanner img');
    if (img && !img.getAttribute('src') && img.getAttribute('data-src')) {
      img.setAttribute('src', img.getAttribute('data-src'));
    }
    // --- Second cell: All text content from .mediaTxtSec ---
    const textSec = item.querySelector('.mediaTxtSec');
    const textFragments = [];
    if (textSec) {
      // Collect all meaningful direct children (h3, p, .readNdateSec, etc)
      Array.from(textSec.children).forEach(child => {
        // Only include if it contains text or links (avoid empty divs)
        if ((child.textContent && child.textContent.trim()) || child.querySelector('a,span,small')) {
          textFragments.push(child);
        }
      });
    }
    // Only add a row if at least one cell has content
    if (img || textFragments.length) {
      rows.push([
        img || '',
        textFragments.length > 0 ? textFragments : ''
      ]);
    }
  });

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
