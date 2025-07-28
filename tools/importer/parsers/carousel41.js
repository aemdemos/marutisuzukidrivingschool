/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the image element
  function getImageElement(box) {
    const img = box.querySelector('.howGetLicenceImg img');
    if (!img) return '';
    let src = img.getAttribute('src') || img.getAttribute('data-src');
    if (src && src.startsWith('//')) src = 'https:' + src;
    if (src) img.src = src;
    return img;
  }
  // Helper to get text content (title, description, cta)
  function getTextContent(box) {
    const contentCell = [];
    const contentWrap = box.querySelector('.howGetLicenceContent, .myblog-content');
    if (contentWrap) {
      Array.from(contentWrap.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H3') {
          const h2 = document.createElement('h2');
          h2.textContent = node.textContent;
          contentCell.push(h2);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.classList && node.classList.contains('blogcontentSummary')) {
          const p = document.createElement('p');
          p.textContent = node.textContent;
          contentCell.push(p);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          contentCell.push(span);
        }
      });
    }
    // CTA link after summary if present (outside contentWrap in box)
    const cta = box.querySelector('a.readMoreLink');
    if (cta) {
      contentCell.push(cta);
    }
    if (!contentCell.length) return '';
    if (contentCell.length === 1) return contentCell[0];
    return contentCell;
  }
  // Locate carousel items (not .cloned)
  const carousel = element.querySelector('.owl-carousel');
  if (!carousel) return;
  const stage = carousel.querySelector('.owl-stage');
  if (!stage) return;
  const items = Array.from(stage.children).filter(
    (owlItem) => owlItem.classList.contains('owl-item') && !owlItem.classList.contains('cloned')
  );
  // Table rows: first row is a single cell header, then each row is a two-cell (image, content)
  const rows = [
    ['Carousel (carousel41)']
  ];
  items.forEach((owlItem) => {
    const item = owlItem.querySelector('.item');
    if (!item) return;
    const box = item.querySelector('.howGetLicenceBox');
    if (!box) return;
    const imgEl = getImageElement(box);
    const textContent = getTextContent(box);
    rows.push([
      imgEl || '',
      textContent
    ]);
  });
  // Now build the correct table, setting the header row with colspan = 2
  const table = document.createElement('table');
  // Header row with single th and proper colspan
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = rows[0][0];
  headerTh.colSpan = 2;
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);
  // Data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const tr = document.createElement('tr');
    for (let j = 0; j < 2; j++) {
      const td = document.createElement('td');
      const cell = row[j];
      if (Array.isArray(cell)) {
        td.append(...cell);
      } else if (cell instanceof Element) {
        td.append(cell);
      } else if (cell) {
        td.textContent = cell;
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  element.replaceWith(table);
}
