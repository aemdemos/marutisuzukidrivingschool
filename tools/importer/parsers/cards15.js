/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block table
  const headerRow = ['Cards (cards15)'];

  // Find all cards (quizScoreCourseBox) inside the provided element
  const cards = Array.from(element.querySelectorAll('.quizScoreCourseBox'));

  // Each card will form a row: [image, text content]
  const rows = cards.map(card => {
    // IMAGE: first cell
    let imgEl = null;
    const imgWrapper = card.querySelector('.quizScoreCourseImg');
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img'); // Reference existing img element
    }

    // TEXT CONTENT: second cell
    const textCell = [];
    const content = card.querySelector('.quizScoreCourseTxt');
    if (content) {
      // Title (h2)
      const h2 = content.querySelector('h2');
      if (h2) textCell.push(h2);
      // Description (p)
      const p = content.querySelector('p');
      if (p) textCell.push(p);
      // CTA (button/link)
      const btn = content.querySelector('.blueButton, .blueButton.callButton');
      if (btn) {
        const link = btn.querySelector('a');
        if (link) textCell.push(link);
      }
    }
    // If no image or text content, fallback to nulls (edge case)
    return [imgEl, textCell.length ? textCell : null];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
