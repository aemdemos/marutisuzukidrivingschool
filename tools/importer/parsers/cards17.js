/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards17)'];

  // Get all visible card containers
  const cardNodes = Array.from(element.querySelectorAll('.listboxes')).filter(lb => lb.style.display !== 'none');

  const rows = cardNodes.map(cardBox => {
    const brick = cardBox.querySelector('.brick');
    if (!brick) return null;

    // Image: first img in .mediaBanner
    let imageEl = null;
    const banner = brick.querySelector('.mediaBanner');
    if (banner) {
      const img = banner.querySelector('img');
      if (img) imageEl = img;
    }

    // Text content: title, desc, CTA, date
    const txtSec = brick.querySelector('.mediaTxtSec');
    const txtContent = [];
    if (txtSec) {
      // Title
      const h3 = txtSec.querySelector('h3');
      if (h3) {
        const strong = document.createElement('strong');
        strong.innerHTML = h3.innerHTML;
        txtContent.push(strong);
      }
      // Description
      const p = txtSec.querySelector('p');
      if (p && p.innerHTML.trim()) {
        if (txtContent.length > 0) txtContent.push(document.createElement('br'));
        txtContent.push(p);
      }
      // CTA and Date
      const readNdateSec = txtSec.querySelector('.readNdateSec');
      if (readNdateSec) {
        // CTA link
        const link = readNdateSec.querySelector('a.readMoreLink');
        if (link) {
          if (txtContent.length > 0) txtContent.push(document.createElement('br'));
          txtContent.push(link);
        }
        // Date
        const dateDiv = readNdateSec.querySelector('.datesR');
        if (dateDiv && dateDiv.textContent.trim()) {
          txtContent.push(document.createElement('br'));
          txtContent.push(dateDiv);
        }
      }
    }
    // Clean trailing brs
    while (txtContent.length && txtContent[txtContent.length-1].tagName === 'BR') txtContent.pop();
    return [imageEl, txtContent];
  }).filter(Boolean);

  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
