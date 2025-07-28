/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: ensure image has src populated from data-src
  function ensureImgSrc(img) {
    if (!img) return null;
    if (!img.getAttribute('src')) {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) img.setAttribute('src', dataSrc);
    }
    return img;
  }

  // Get all cards in proper order, dedupe by title
  const allCardRoots = Array.from(element.querySelectorAll('.owl-item .item .drivingTipsSec'));
  const seenTitles = new Set();
  const cards = [];

  allCardRoots.forEach(cardRoot => {
    // Find image section and ensure image has src
    let img = null;
    const imgSection = cardRoot.querySelector('.drivingTipsBanner');
    if (imgSection) {
      img = imgSection.querySelector('img');
      img = ensureImgSrc(img);
    }

    // Find text section (title, desc, cta)
    let txtSection = cardRoot.querySelector('.drivingTipsTxtSec');
    if (!txtSection) {
      // Sometimes .drivingTipsTxtSec could be before or after; fallback to cardRoot
      txtSection = cardRoot;
    }
    // Remove upDownArrow for clarity
    txtSection.querySelectorAll('.upDownArrow').forEach(e => e.remove());
    // Remove CTA arrow images, keep only link text
    txtSection.querySelectorAll('a.readMoreLink img').forEach(e => e.remove());
    // Remove empty <small> in CTA if any
    txtSection.querySelectorAll('a.readMoreLink small').forEach(e => { if (!e.textContent.trim()) e.remove(); });
    
    // De-duplication by title
    let title = txtSection.querySelector('h3');
    let titleText = title ? title.textContent.trim() : '';
    if (!titleText || seenTitles.has(titleText)) return;
    seenTitles.add(titleText);

    // Extract all child nodes for right cell (preserve formatting, links, etc.)
    const rightCell = [];
    Array.from(txtSection.childNodes).forEach(node => {
      // Only add elements or text nodes with actual content
      if (node.nodeType === 3 && node.textContent.trim() !== '') {
        // text node
        rightCell.push(document.createTextNode(node.textContent));
      }
      if (node.nodeType === 1) {
        rightCell.push(node);
      }
    });
    // Remove empty strings
    const filteredRightCell = rightCell.filter(n => {
      if (typeof n === 'string') return n.trim() !== '';
      if (n.nodeType === 3) return n.textContent.trim() !== '';
      if (n.nodeType === 1) return true;
      return false;
    });

    cards.push([img ? img : '', filteredRightCell]);
  });

  if (cards.length > 0) {
    const rows = [
      ['Cards (cards35)'],
      ...cards
    ];
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
