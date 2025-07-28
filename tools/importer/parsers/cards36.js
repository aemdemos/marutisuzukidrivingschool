/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel's stage containing testimonials
  const carousel = element.querySelector('.owl-carousel .owl-stage');
  if (!carousel) return;

  // Only select .owl-item that are NOT .cloned
  const items = Array.from(carousel.querySelectorAll('.owl-item')).filter(item => !item.classList.contains('cloned'));

  // Deduplicate based on unique testimonial content
  const seen = new Set();
  const cardRows = [];

  for (const item of items) {
    const tbox = item.querySelector('.testimonialBox');
    if (!tbox) continue;
    const txtSec = tbox.querySelector('.testimonialTxtSec');
    if (!txtSec) continue;

    // Get image element if present, otherwise empty string
    let imgEl = '';
    const imgDiv = txtSec.querySelector('.testimonialImg');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) {
        // Fix src if only data-src present
        if (!img.src && img.getAttribute('data-src')) {
          let src = img.getAttribute('data-src');
          img.src = src.startsWith('http') ? src : 'https:' + src;
        }
        imgEl = img;
      }
    }

    // Compose text cell: keep all text and structure from txtSec except the image
    // Reference the actual elements from the source, not clones
    // We'll construct a <div> and move (not clone) the needed child nodes
    const txtCell = document.createElement('div');
    // Move h3, h4, all non-empty p, and captionNameLocation (in order)
    const h3 = txtSec.querySelector('h3');
    if (h3) txtCell.appendChild(h3);
    const h4 = txtSec.querySelector('h4');
    if (h4) txtCell.appendChild(h4);
    Array.from(txtSec.querySelectorAll('p')).forEach(p => {
      if (p.textContent.trim()) txtCell.appendChild(p);
    });
    const caption = txtSec.querySelector('.captionNameLocation');
    if (caption) {
      // Enhance: Name bold, location normal, using the original caption element
      const name = caption.childNodes[0] && caption.childNodes[0].textContent ? caption.childNodes[0].textContent.trim() : '';
      const locationSpan = caption.querySelector('span');
      caption.innerHTML = '';
      if (name) {
        const strong = document.createElement('strong');
        strong.textContent = name;
        caption.appendChild(strong);
      }
      if (locationSpan) {
        caption.appendChild(document.createTextNode(' '));
        caption.appendChild(locationSpan);
      }
      txtCell.appendChild(caption);
    }

    // Use all text of the text cell for deduplication
    const dedupKey = txtCell.textContent.trim();
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    cardRows.push([imgEl, txtCell]);
  }

  if (!cardRows.length) return;
  // First row: block name header, exactly as specified
  const rows = [['Cards (cards36)'], ...cardRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
