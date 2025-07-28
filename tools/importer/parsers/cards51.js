/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section containing the cards
  const section = element.querySelector('.blogBannerSec');
  if (!section) return;
  const carousel = section.querySelector('.owl-carousel');
  if (!carousel) return;

  // Only use visible cards in the DOM: .owl-item.active > .item, but fallback to all .owl-item > .item if none found
  let cardNodes = Array.from(carousel.querySelectorAll('.owl-item.active > .item'));
  if (cardNodes.length === 0) {
    cardNodes = Array.from(carousel.querySelectorAll('.owl-item > .item'));
  }
  if (cardNodes.length === 0) return;

  // Build the rows for the table
  const rows = [['Cards (cards51)']];

  cardNodes.forEach((cardNode) => {
    const box = cardNode.querySelector('.blogHomeBox');
    if (!box) return;

    // FIRST COLUMN: IMAGE
    let img = box.querySelector('.blogHomeImg img');
    if (img && !img.getAttribute('src')) {
      const ds = img.getAttribute('data-src');
      if (ds) img.setAttribute('src', ds);
    }
    const cardImg = img || '';

    // SECOND COLUMN: ALL TEXTUAL CONTENT INCLUDING CTA
    // We'll preserve all content and its semantics by using the .blogContent block directly
    let cardText;
    const content = box.querySelector('.blogContent');
    if (content) {
      cardText = content;
    } else {
      // fallback: gather all text from blogHomeBox if .blogContent missing
      cardText = document.createElement('div');
      cardText.textContent = box.textContent.trim();
    }

    rows.push([cardImg, cardText]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
