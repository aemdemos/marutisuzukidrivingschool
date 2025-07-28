/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards14)'];
  
  // Get the image element from the card (first image)
  const imgEl = element.querySelector('.addressImg img');
  
  // Get the text section
  const details = element.querySelector('.addressDetails');
  const addressTxtSec = details && details.querySelector('.addressTxtSec');
  const directionCallNumber = details && details.querySelector('.directionCallNumber');
  
  // Compose the text cell
  const textDiv = document.createElement('div');
  if (addressTxtSec) {
    // Title (span, styled as <strong>)
    const titleSpan = addressTxtSec.querySelector('span');
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textDiv.appendChild(strong);
      textDiv.appendChild(document.createElement('br'));
    }
    // Company name (h2)
    const h2 = addressTxtSec.querySelector('h2');
    if (h2 && h2.textContent.trim()) {
      const companySpan = document.createElement('span');
      companySpan.textContent = h2.textContent.trim();
      textDiv.appendChild(companySpan);
      textDiv.appendChild(document.createElement('br'));
    }
    // Address (p)
    const p = addressTxtSec.querySelector('p');
    if (p) {
      const addressSpan = document.createElement('span');
      addressSpan.innerHTML = p.innerHTML; // retain <br> structure if present
      textDiv.appendChild(addressSpan);
    }
  }
  // Phone (optional)
  if (directionCallNumber) {
    const phoneLink = directionCallNumber.querySelector('a[href^="tel:"]');
    if (phoneLink) {
      // Only add a <br> if there is already some text content
      if (textDiv.childNodes.length > 0) {
        textDiv.appendChild(document.createElement('br'));
      }
      // Display as link, no icon
      const tel = document.createElement('a');
      tel.href = phoneLink.getAttribute('href');
      tel.textContent = phoneLink.textContent.trim();
      textDiv.appendChild(tel);
    }
  }

  // Compose the table as specified
  const cells = [
    headerRow,
    [imgEl, textDiv]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
