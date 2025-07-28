/* global WebImporter */
export default function parse(element, { document }) {
  // Find columns
  const row = element.querySelector(':scope > .row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;
  const leftCol = cols[0];
  const rightCol = cols[1];

  // --- LEFT COLUMN ---
  // Get .whyChooseSec for left side content
  const leftWhy = leftCol.querySelector('.whyChooseSec');
  // 1st cell: Heading, intro, list, button
  const leftTopCell = [];
  if (leftWhy) {
    // Heading
    const h1 = leftWhy.querySelector('h1');
    if (h1) leftTopCell.push(h1);
    // Intro paragraph (first <p> after h1)
    const p = leftWhy.querySelector('h1 ~ p');
    if (p) leftTopCell.push(p);
    // Bullet list from .studentFacultyDealerRow h3
    const ul = document.createElement('ul');
    leftWhy.querySelectorAll('.studentFacultyDealerRow h3').forEach(h3 => {
      if (h3 && h3.textContent.trim()) {
        const li = document.createElement('li');
        li.textContent = h3.textContent.trim();
        ul.appendChild(li);
      }
    });
    if (ul.children.length) leftTopCell.push(ul);
    // VIEW ALL button from right-section inside left
    const viewAllBtn = leftWhy.querySelector('.imgVideoSec.right .blueButton a');
    if (viewAllBtn) leftTopCell.push(viewAllBtn);
  }
  // 2nd cell: image (first .studentFacultyDealerImg > img)
  let leftImg = null;
  if (leftWhy) {
    const img = leftWhy.querySelector('.studentFacultyDealerRow .studentFacultyDealerImg img');
    if (img) leftImg = img;
  }

  // --- RIGHT COLUMN ---
  // Get .readyDriveSec for right side content
  const rightReady = rightCol.querySelector('.readyDriveSec');
  // 1st cell: image (first quiz stat icon)
  let rightImg = null;
  if (rightReady) {
    const quizImg = rightReady.querySelector('.readyDrivepoints img');
    if (quizImg) rightImg = quizImg;
  }
  // 2nd cell: text + button below
  const rightTextBtn = [];
  if (rightReady) {
    // Add all top-level <p> tags (not inside ul)
    Array.from(rightReady.children).forEach(child => {
      if (child.tagName && child.tagName.toLowerCase() === 'p') {
        rightTextBtn.push(child);
      }
    });
    // Button (Get Started)
    const btn = rightReady.querySelector('.blueButton a');
    if (btn) rightTextBtn.push(btn);
  }

  // Table structure per markdown example
  const cells = [
    ['Columns (columns44)'],
    [leftTopCell, rightImg],
    [leftImg, rightTextBtn]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
