/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards33)'];

  // Find the carousel with the cards
  const carousel = element.querySelector('.owl-carousel.road-safety');
  if (!carousel) return;

  // Only use visible (active) .owl-item elements to avoid duplicates
  const owlItems = carousel.querySelectorAll('.owl-item.active');

  const rows = [];
  owlItems.forEach((owlItem) => {
    // Find the card content block
    const imgTxt = owlItem.querySelector('.roadSafetyImgTxt');
    if (!imgTxt) return;

    // Reference the image element, ensure src is present and absolute
    const img = imgTxt.querySelector('img');
    if (img) {
      let src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (src && src.startsWith('//')) src = 'https:' + src;
      if (!img.getAttribute('src') && src) img.setAttribute('src', src);
    }

    // Extract text: grab all text content that's not part of the image
    // Most cards have a <span> for the label, but grab all non-img child nodes
    let cardTexts = [];
    Array.from(imgTxt.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'IMG') {
        // For <span> nodes, wrap content in <strong> for emphasis (per visual example)
        if (node.tagName === 'SPAN') {
          const strong = document.createElement('strong');
          strong.textContent = node.textContent.trim();
          cardTexts.push(strong);
        } else {
          cardTexts.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) cardTexts.push(document.createTextNode(text));
      }
    });
    if (cardTexts.length === 0 && imgTxt.textContent.trim()) {
      // Fallback: if all else fails, just add the raw text
      cardTexts.push(document.createTextNode(imgTxt.textContent.trim()));
    }

    rows.push([
      img,
      cardTexts.length === 1 ? cardTexts[0] : cardTexts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
