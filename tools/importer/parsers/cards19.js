/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the carousel stage containing the cards
  const stage = element.querySelector('.owl-stage');
  if (!stage) return;

  // 2. Deduplicate by heading + description
  const seen = new Set();
  const cards = [];
  stage.querySelectorAll('.owl-item .item .whyUsIconTxtSec').forEach(cardEl => {
    const img = cardEl.querySelector('img');
    const h3 = cardEl.querySelector('h3');
    const p = cardEl.querySelector('p');
    const textKey = (h3 ? h3.textContent.trim() : '') + '|' + (p ? p.textContent.trim() : '');
    if (!seen.has(textKey)) {
      seen.add(textKey);
      cards.push(cardEl);
    }
  });

  // 3. Build output table: header row first
  const cells = [['Cards (cards19)']];
  // 4. For each card, create a row: [image, text block]
  cards.forEach(cardEl => {
    // First cell: reference the <img> element directly if it exists
    let imgEl = '';
    const imgWrap = cardEl.querySelector('span');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imgEl = img;
    }
    // Second cell: combine heading and description (reference existing elements, not clones)
    const textEls = [];
    const h3 = cardEl.querySelector('h3');
    if (h3) textEls.push(h3);
    const p = cardEl.querySelector('p');
    if (p) textEls.push(p);
    cells.push([
      imgEl,
      textEls.length === 1 ? textEls[0] : textEls,
    ]);
  });

  // 5. Create and insert table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
