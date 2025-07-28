/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: one cell as required
  const headerRow = ['Columns (columns4)'];

  // Find the main container and form
  const container = element.querySelector('.container');
  if (!container) return;
  const form = container.querySelector('form');
  if (!form) return;

  // Get all input fields (Name, Mobile, Email, City, Dealer)
  const inputFields = Array.from(form.querySelectorAll('.inputFieldMain'));
  // Heading
  const heading = container.querySelector('h4');

  // Column 1: Heading + Name field
  const col1 = document.createElement('div');
  if (heading) col1.appendChild(heading);
  if (inputFields[0]) col1.appendChild(inputFields[0]);

  // Column 2: Mobile
  const col2 = document.createElement('div');
  if (inputFields[1]) col2.appendChild(inputFields[1]);

  // Column 3: Email
  const col3 = document.createElement('div');
  if (inputFields[2]) col3.appendChild(inputFields[2]);

  // Column 4: City, Dealer, Enquire Now button
  const col4 = document.createElement('div');
  if (inputFields[3]) col4.appendChild(inputFields[3]);
  if (inputFields[4]) col4.appendChild(inputFields[4]);
  // Only the first visible Enquire Now button
  const button = form.querySelector('input.btnEnquireNow[type="button"]');
  if (button) col4.appendChild(button);

  // Compose the main columns row (all fields distributed, no empty cells)
  const columnsRow = [col1, col2, col3, col4];

  // Agreebox as a separate row (spanning all columns)
  const agreebox = form.querySelector('.agreebox');
  const agreeRow = agreebox ? [agreebox] : null;

  // Close button as a separate row (spanning all columns)
  const closeBtn = element.querySelector('.enquireClose');
  const closeRow = closeBtn ? [closeBtn] : null;

  // Compose table with no empty cells or columns
  const cells = [headerRow, columnsRow];
  if (agreeRow) cells.push(agreeRow);
  if (closeRow) cells.push(closeRow);

  // Create and replace in the DOM
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
