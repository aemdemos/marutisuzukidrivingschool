/* global WebImporter */
export default function parse(element, { document }) {
  // Look for all card-bodies (supports multiple cards in one element, future-proofing)
  const cardBodies = element.querySelectorAll('.card-body');
  const rows = [['Cards (cards8)']];
  cardBodies.forEach(cardBody => {
    const blogRptSec = cardBody.querySelector('.blogRptSec');
    if (!blogRptSec) return;
    // Image: .blogBanner img
    const img = blogRptSec.querySelector('.blogBanner img');
    // Text content: .blogTxtSec
    const txtSec = blogRptSec.querySelector('.blogTxtSec');
    const textCellFragments = [];
    if (txtSec) {
      const title = txtSec.querySelector('h3');
      if (title) textCellFragments.push(title);
      const desc = txtSec.querySelector('.blogcontentSummary');
      if (desc) textCellFragments.push(desc);
      const cta = txtSec.querySelector('.readNdateSec a');
      if (cta) textCellFragments.push(cta);
    }
    rows.push([
      img || '',
      textCellFragments.length > 0 ? textCellFragments : ''
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
