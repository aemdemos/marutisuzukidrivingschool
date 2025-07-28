/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel wrapper
  const mainSlider = element.querySelector('.owl-carousel');
  if (!mainSlider) return;
  // Only consider non-cloned slides
  const slides = Array.from(mainSlider.querySelectorAll('.owl-item'))
    .filter((slide) => !slide.classList.contains('cloned'));

  const rows = [];
  rows.push(['Carousel (carousel38)']);

  slides.forEach((slide) => {
    const item = slide.querySelector('.item');
    if (!item) return;

    // --- Image cell ---
    let imgEl = null;
    let picture = item.querySelector('picture');
    if (!picture && item.querySelector('a picture')) {
      picture = item.querySelector('a picture');
    }
    if (picture) {
      imgEl = picture.querySelector('img');
      if (imgEl && !imgEl.getAttribute('src') && imgEl.getAttribute('data-src')) {
        imgEl.setAttribute('src', imgEl.getAttribute('data-src'));
      }
    }

    // --- Text/Content cell ---
    let textCell = '';
    // Prefer all content from .carousel-caption > .container, fallback to .carousel-caption
    let captionNode = item.querySelector('.carousel-caption .container');
    if (captionNode && captionNode.textContent.trim()) {
      // If content exists, use all children as content
      if (captionNode.children.length > 0) {
        textCell = Array.from(captionNode.children);
      } else {
        textCell = captionNode.textContent.trim();
      }
    } else {
      captionNode = item.querySelector('.carousel-caption');
      if (captionNode && captionNode.textContent.trim()) {
        if (captionNode.children.length > 0) {
          textCell = Array.from(captionNode.children);
        } else {
          textCell = captionNode.textContent.trim();
        }
      } else {
        // Fallback to any headings, paragraphs, and spans directly in the item, but not inside picture
        const fallbackElems = Array.from(item.children).filter(n => {
          if (picture && picture.contains(n)) return false;
          return ['H1','H2','H3','H4','H5','H6','P','SPAN','STRONG','A'].includes(n.tagName) && n.textContent.trim();
        });
        if (fallbackElems.length) {
          textCell = fallbackElems;
        }
      }
    }

    // Add row
    rows.push([imgEl || '', textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
