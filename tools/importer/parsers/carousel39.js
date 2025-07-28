/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;

  // Get all the blogHomeBox items in order of appearance
  const blogBoxes = carousel.querySelectorAll('.owl-item .item .blogHomeBox');

  // Prepare the rows for the table
  const rows = [];
  rows.push(['Carousel (carousel39)']); // Table header as in the example

  blogBoxes.forEach((box) => {
    // First cell: image
    let img = box.querySelector('.blogHomeImg img');
    let imgEl = '';
    if (img) {
      // Set src if not present but data-src is present
      if (!img.getAttribute('src') && img.getAttribute('data-src')) {
        img.setAttribute('src', img.getAttribute('data-src'));
      }
      imgEl = img;
    }
    // Second cell: text content
    const content = box.querySelector('.blogContent');
    const contentEls = [];
    if (content) {
      // Heading (h3)
      const h3 = content.querySelector('h3');
      if (h3) contentEls.push(h3);
      // Description (div.blogcontentSummary)
      const summary = content.querySelector('.blogcontentSummary');
      if (summary && summary.textContent.trim()) {
        // Use a <p> for description
        const p = document.createElement('p');
        p.textContent = summary.textContent.trim();
        contentEls.push(p);
      }
      // CTA (a.readMoreLink)
      const cta = content.querySelector('a.readMoreLink');
      if (cta) {
        // Make a new anchor referencing the existing one but with only text
        const a = document.createElement('a');
        a.href = cta.href;
        // Only get the main CTA text (which is in a <span> inside the CTA)
        const span = cta.querySelector('span');
        a.textContent = span ? span.textContent.trim() : cta.textContent.trim();
        contentEls.push(a);
      }
    }
    rows.push([
      imgEl,
      contentEls.length ? contentEls : ''
    ]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
