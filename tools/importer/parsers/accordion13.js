/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be exactly one cell, as per requirements
  const headerRow = ['Accordion (accordion13)'];

  // Helper to extract the accordion title and content from a single .card element
  function extractAccordionItem(card) {
    // Title = .card-header > h3 > button, remove <i> icons for semantic correctness
    let cardHeader = card.querySelector('.card-header');
    let button = cardHeader ? cardHeader.querySelector('button') : null;
    let titleCell;
    if (button) {
      // Remove <i> icons for semantic correctness, keep text formatting/HTML
      let btnChildNodes = Array.from(button.childNodes).filter(node => !(node.nodeType === 1 && node.tagName.toLowerCase() === 'i'));
      // Use a span to group the button's content
      const span = document.createElement('span');
      btnChildNodes.forEach(n => span.appendChild(n));
      titleCell = span;
    } else {
      titleCell = document.createTextNode('');
    }

    // Body cell: reference the .card-body's children, preserving HTML
    let cardBody = card.querySelector('.card-body');
    let contentCell;
    if (cardBody) {
      let nodes = Array.from(cardBody.childNodes).filter(n => !(n.nodeType === 3 && !n.textContent.trim()));
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else {
        const div = document.createElement('div');
        nodes.forEach(n => div.appendChild(n));
        contentCell = div;
      }
    } else {
      contentCell = document.createTextNode('');
    }

    return [titleCell, contentCell];
  }

  // Determine if we're processing multiple .card siblings or just one
  let cards;
  if (element.classList.contains('card')) {
    // Look for all sibling .card elements in parent
    let siblingCards = Array.from(element.parentNode.children).filter(e => e.classList && e.classList.contains('card'));
    if (siblingCards.length > 1) {
      cards = siblingCards;
    } else {
      cards = [element];
    }
  } else {
    cards = [element];
  }

  // Compose the rows array: header row is one cell, then each item row is two cells
  const rows = [headerRow];
  cards.forEach(card => {
    rows.push(extractAccordionItem(card));
  });

  // Create the table and insert it in the DOM, replacing the original accordion block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  if (cards.length > 1) {
    // Replace all .card elements in their parent with the table
    const parent = cards[0].parentNode;
    cards.forEach(c => parent.removeChild(c));
    parent.insertBefore(table, parent.firstChild);
  } else {
    element.replaceWith(table);
  }
}
