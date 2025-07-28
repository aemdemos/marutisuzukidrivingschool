/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table cells: header row first
  const cells = [
    ['Cards (cards30)']
  ];

  // Find the carousel containing the cards
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;
  // .owl-stage contains all card slides
  const stage = carousel.querySelector('.owl-stage');
  if (!stage) return;

  // Get all .owl-item > .item (cards)
  const items = stage.querySelectorAll('.owl-item .item');
  items.forEach(item => {
    const box = item.querySelector('.valueAddedBox');
    if (!box) return;
    // Get the image/icon in the first cell
    let imageEl = null;
    const span = box.querySelector('span');
    if (span) {
      imageEl = span.querySelector('img');
    }
    // Get the card text content (title and description)
    const content = box.querySelector('.valueAddBoxContent');
    // We'll reference the <h3> and <p> directly in a div
    const textDiv = document.createElement('div');
    if (content) {
      const title = content.querySelector('h3');
      const desc = content.querySelector('p');
      if (title) textDiv.appendChild(title);
      if (desc) textDiv.appendChild(desc);
    }
    // Add the card row: [image, text content]
    cells.push([
      imageEl ? imageEl : '',
      textDiv
    ]);
  });

  // Create and insert the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
