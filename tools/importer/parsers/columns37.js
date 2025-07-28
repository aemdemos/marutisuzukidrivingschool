/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to build the address cell
  function buildAddressCell() {
    const addressSec = element.querySelector('.addressSecMain');
    if (!addressSec) return '';
    const cellContent = [];
    // Get image
    const imgDiv = addressSec.querySelector('.addressImg');
    const img = imgDiv ? imgDiv.querySelector('img') : null;
    if (img) cellContent.push(img);

    // Get address text block
    const addressDetails = addressSec.querySelector('.addressDetails');
    if (addressDetails) {
      const addressTxtSec = addressDetails.querySelector('.addressTxtSec');
      if (addressTxtSec) {
        Array.from(addressTxtSec.children).forEach(child => {
          cellContent.push(child);
        });
      }
    }
    return cellContent;
  }

  // Helper to build the Toll-free column
  function buildTollFreeCell() {
    const tollFreeDivs = element.querySelectorAll('.tollFreeEmailBox .callEmailSec');
    if (!tollFreeDivs || tollFreeDivs.length < 1) return '';
    const tollFreeDiv = tollFreeDivs[0];
    const cellContent = [];
    const icon = tollFreeDiv.querySelector('span img');
    if (icon) cellContent.push(icon);
    const label = tollFreeDiv.querySelector('label');
    if (label) cellContent.push(label);
    const h3 = tollFreeDiv.querySelector('h3');
    if (h3) cellContent.push(h3);
    return cellContent;
  }

  // Helper to build the Email column
  function buildEmailCell() {
    const tollFreeDivs = element.querySelectorAll('.tollFreeEmailBox .callEmailSec');
    if (!tollFreeDivs || tollFreeDivs.length < 2) return '';
    const emailDiv = tollFreeDivs[1];
    const cellContent = [];
    const icon = emailDiv.querySelector('span img');
    if (icon) cellContent.push(icon);
    const label = emailDiv.querySelector('label');
    if (label) cellContent.push(label);
    const h3 = emailDiv.querySelector('h3');
    if (h3) cellContent.push(h3);
    return cellContent;
  }

  // Build the table structure
  const addressCell = buildAddressCell();
  const tollFreeCell = buildTollFreeCell();
  const emailCell = buildEmailCell();

  // Create the table manually to set th colspan
  const table = document.createElement('table');

  // Header row with correct colspan
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns (columns37)';
  headerTh.colSpan = 3; // Set colspan to match number of columns in content row
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Content row
  const rowTr = document.createElement('tr');
  [addressCell, tollFreeCell, emailCell].forEach(cellContent => {
    const td = document.createElement('td');
    if (Array.isArray(cellContent)) {
      td.append(...cellContent);
    } else if (cellContent) {
      td.append(cellContent);
    }
    rowTr.appendChild(td);
  });
  table.appendChild(rowTr);

  element.replaceWith(table);
}
