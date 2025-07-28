/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the carousel containing the cards
  const carousel = element.querySelector('.owl-carousel, .expertCoaches_home_slider');
  if (!carousel) return;
  // Find the stage holding the card items
  const stage = carousel.querySelector('.owl-stage');
  if (!stage) return;

  // Gather unique card rows by coach name + city
  const seen = new Set();
  const cardRows = [];

  // Select all .owl-item .item elements (cards)
  const items = stage.querySelectorAll('.owl-item .item');
  items.forEach(item => {
    const mediaRptSec = item.querySelector('.mediaRptSec');
    if (!mediaRptSec) return;

    // Get image
    const imgWrap = mediaRptSec.querySelector('.coachImg');
    let imgEl = null;
    if (imgWrap) {
      imgEl = imgWrap.querySelector('img');
      if (imgEl && imgEl.getAttribute('data-src') && !imgEl.getAttribute('src')) {
        imgEl.setAttribute('src', imgEl.getAttribute('data-src'));
      }
    }

    // Get the text content block
    const content = mediaRptSec.querySelector('.coachContent');
    if (!content) return;
    // Deduplicate by name + city
    const name = content.querySelector('strong')?.textContent.trim() || '';
    const city = content.querySelector('span')?.textContent.trim() || '';
    if (!name) return;
    const dedupKey = name + '//' + city;
    if (seen.has(dedupKey)) return;
    seen.add(dedupKey);

    // Reference the .coachContent directly so all rich content (strong, span, h3, p, etc) is included
    cardRows.push([imgEl, content]);
  });

  if (cardRows.length === 0) return;

  // Compose the table as in the example (header is exactly as specified)
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
