/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the question/title from the .card-header > button
  let button = element.querySelector('.card-header button');
  let titleText = '';
  if (button) {
    titleText = button.childNodes[0] ? button.childNodes[0].textContent.trim() : button.textContent.trim();
    titleText = titleText.replace(/\s*[\-\+]+$/, '').trim();
  }

  // Find the .card-body
  let body = element.querySelector('.card-body');

  // If there is no answer/content, fallback to an empty paragraph
  let answerElements = [];
  if (body) {
    answerElements = Array.from(body.children);
  } else {
    answerElements = [document.createElement('p')];
  }

  // Create a heading for the question/title
  let heading = document.createElement('strong');
  heading.textContent = titleText;

  // Compose the card text cell: heading, then content
  let textCell = [heading];
  if (answerElements.length > 0) {
    textCell.push(document.createElement('br'));
    textCell = textCell.concat(answerElements);
  }

  // Block table: header row (single column), then content row (two columns)
  const cells = [
    ['Cards (cards12)'], // header row: ONLY ONE COLUMN
    ['', textCell]       // card row: TWO columns
  ];

  // Create the block table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
