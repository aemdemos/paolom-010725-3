/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all card widgets for this block
  function getCards(root) {
    return Array.from(root.querySelectorAll('.elementor-widget-image-box'));
  }

  // Compose table header
  const cells = [['Cards (cards5)']];

  // Extract each card
  const cards = getCards(element);
  cards.forEach(card => {
    // Get the card image (first img inside figure)
    const img = card.querySelector('figure img');

    // Get the card content (the .elementor-image-box-content element)
    const content = card.querySelector('.elementor-image-box-content');

    // Only add row if both present
    if (img && content) {
      cells.push([
        img,
        content
      ]);
    }
  });

  // Only replace if there are card rows
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
