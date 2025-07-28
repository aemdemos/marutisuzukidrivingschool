/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate children by selector
  function getChildrenBySelector(scope, selector) {
    return Array.from(scope.querySelectorAll(`:scope > ${selector}`));
  }

  // Get left/main column: the main article content
  const mainCol = element.querySelector('.col-lg-8.col-md-12');
  // Get right/sidebar column: related articles and recent article
  const sideCol = element.querySelector('.col-lg-4.col-md-12');

  // For this page layout, the best mapping to three columns is:
  // 1. Main news/article body (mainContent)
  // 2. Related Articles (accordion)
  // 3. Recent Article (sidebar bottom)

  // 1. Get main news/article body as the left column
  let mainContent = null;
  if (mainCol) {
    mainContent = mainCol.querySelector('.mediaDetailSec');
  }

  // 2. Get 'Related Articles' - this is the accordion of cards
  let relatedArticles = null;
  if (sideCol) {
    relatedArticles = sideCol.querySelector('.mediaDetailList');
  }

  // 3. Get 'Recent Article' - this is .mediaRecentArticle
  let recentArticle = null;
  if (sideCol) {
    recentArticle = sideCol.querySelector('.mediaRecentArticle');
  }

  // Fill in with empty divs if missing (to always have 3 columns)
  const col1 = mainContent || document.createElement('div');
  const col2 = relatedArticles || document.createElement('div');
  const col3 = recentArticle || document.createElement('div');

  // Prepare the block table with a single header cell and then a three-column row
  const header = ['Columns (columns3)'];
  const row = [col1, col2, col3];
  const table = WebImporter.DOMUtils.createTable([
    header,
    row
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
