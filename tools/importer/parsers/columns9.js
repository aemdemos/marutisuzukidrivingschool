/* global WebImporter */
export default function parse(element, { document }) {
  // Find the four column blocks (MAIN LINKS, MORE FROM US, USEFUL LINKS, DOWNLOAD APP)
  let columns = [];
  const footerLinkMain = element.querySelector('.footerLinkMain');
  if (footerLinkMain) {
    const container = footerLinkMain.querySelector(':scope > .container');
    if (container) {
      const row = container.querySelector(':scope > .row');
      if (row) {
        columns = Array.from(row.children).filter(el => el.matches('.col-6.col-sm-3'));
      }
    }
  }

  // Ensure we always have 4 columns for the columns9 block
  while (columns.length < 4) {
    columns.push('');
  }

  // Collect .whyusnote notes (in order), if any, and put them in a single cell (first column, full width row)
  const notes = Array.from(element.querySelectorAll('.whyusnote'));
  const notesRow = notes.length ? [notes, '', '', ''] : null;

  // Copyright (bottom gray bar)
  let copyrightRow = null;
  const copyrightTxt = element.querySelector('.copyrightTxt');
  if (copyrightTxt) {
    copyrightRow = [copyrightTxt, '', '', ''];
  }

  // Build the cells array
  const headerRow = ['Columns (columns9)']; // ONLY one cell in the header row
  const colsRow   = [columns[0], columns[1], columns[2], columns[3]];

  const cells = [headerRow, colsRow];
  if (notesRow) {
    cells.push(notesRow);
  }
  if (copyrightRow) {
    cells.push(copyrightRow);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
