/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Cards (cards28)'];

  // Find all .item elements inside the block in DOM order
  let items = Array.from(element.querySelectorAll('.item'));

  // Edge case: fallback if .item not found
  if (!items.length) {
    // Try to find .mediaRptSec as separate card containers
    items = Array.from(element.querySelectorAll('.mediaRptSec'));
  }

  // Deduplicate based on card content (title + description)
  const seen = new Set();
  const rows = [];

  items.forEach(item => {
    // Accept both .item and .mediaRptSec as card roots
    const card = item.classList.contains('mediaRptSec') ? item : item.querySelector('.mediaRptSec');
    if (!card) return;

    // Get image/icon: prefer <img>, fallback to .mediaBanner
    const banner = card.querySelector('.mediaBanner');
    let img = banner ? banner.querySelector('img') : null;
    if (img) {
      // Ensure the src is set and absolute
      let src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (src && src.startsWith('//')) src = 'https:' + src;
      if (src) img.setAttribute('src', src);
    }

    // Get text content: all children of .mediaTxtSec
    const txtSec = card.querySelector('.mediaTxtSec');
    if (!txtSec) return;
    // Use the actual element, not a clone
    // But move the element out of the source, so future rows don't lose content
    // Create a div, and move all child nodes from txtSec into it
    const txtDiv = document.createElement('div');
    while (txtSec.firstChild) {
      txtDiv.appendChild(txtSec.firstChild);
    }

    // Dedupe by combining text content
    const key = txtDiv.textContent.trim();
    if (seen.has(key)) return;
    seen.add(key);

    rows.push([
      img ? img : (banner || ''),
      txtDiv
    ]);
  });

  if (rows.length) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
