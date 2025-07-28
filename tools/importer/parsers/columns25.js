/* global WebImporter */
export default function parse(element, { document }) {
  // Find the top-level left/right container
  const quizLeftRight = element.querySelector('.quizLeftRightContainer');
  if (!quizLeftRight) return;

  // LEFT: Gather all content (including text nodes) from quizLeftMain
  const quizLeft = quizLeftRight.querySelector('.quizLeftMain');
  let leftCellContents = [];
  if (quizLeft) {
    // Collect all direct children including meaningful text nodes
    leftCellContents = Array.from(quizLeft.childNodes).filter(n =>
      n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
    );
    // If the left cell has nothing, fallback to the container itself
    if (leftCellContents.length === 0) leftCellContents = [quizLeft];
  } else {
    leftCellContents = [document.createElement('div')];
  }

  // RIGHT: Find the currently visible quizRightMain. If none is visible, use the first.
  let quizRight = null;
  const rightBlocks = quizLeftRight.querySelectorAll('.quizRightMain');
  for (const blk of rightBlocks) {
    // Display none is not visible; treat no style/display as visible
    if (!blk.hasAttribute('style') || !blk.style.display || blk.style.display === '' || blk.style.display === 'block') {
      quizRight = blk;
      break;
    }
  }
  if (!quizRight && rightBlocks.length > 0) quizRight = rightBlocks[0];

  let rightCellContents = [];
  if (quizRight) {
    rightCellContents = Array.from(quizRight.childNodes).filter(n =>
      n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
    );
    if (rightCellContents.length === 0) rightCellContents = [quizRight];
  } else {
    rightCellContents = [document.createElement('div')];
  }

  // Compose the block table; header matches exactly
  const cells = [
    ['Columns (columns25)'],
    [leftCellContents, rightCellContents]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
