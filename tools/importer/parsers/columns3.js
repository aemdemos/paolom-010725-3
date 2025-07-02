/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // If empty, just remove
  if (!columns.length) {
    element.remove();
    return;
  }
  // Header row: exactly one cell, as in the example
  const headerRow = ['Columns'];
  // Content row: one cell per column, referencing the main container
  const contentRow = columns.map(col => {
    const container = col.querySelector('.elementor-widget-container');
    return container ? container : col;
  });
  // Compose block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
