/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each card/testimonial is structured under a .e-con-inner, as seen in the two cards
  const cardContainers = Array.from(element.querySelectorAll('.e-con-inner'));
  if (cardContainers.length > 0) {
    cardContainers.forEach(container => {
      // The left (image and name/title) is the .elementor-widget-image-box (grab the whole widget)
      const imgBox = container.querySelector('.elementor-widget-image-box');
      // The right (testimonial) is the .elementor-widget-text-editor (grab the whole widget)
      const textWidget = container.querySelector('.elementor-widget-text-editor');
      // Defensive: skip if neither found
      if (!imgBox && !textWidget) return;
      // Ensure both cells exist, but allow empty if missing
      rows.push([
        imgBox || '',
        textWidget || ''
      ]);
    });
  } else {
    // Fallback: handle if structure is flat (not expected for these HTMLs, but for robustness)
    const imgBoxes = element.querySelectorAll('.elementor-widget-image-box');
    const textWidgets = element.querySelectorAll('.elementor-widget-text-editor');
    const maxLen = Math.max(imgBoxes.length, textWidgets.length);
    for (let i = 0; i < maxLen; i++) {
      rows.push([
        imgBoxes[i] || '',
        textWidgets[i] || ''
      ]);
    }
  }

  // Create the block table using the rows array
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}