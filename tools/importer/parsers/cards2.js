/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in the spec
  const cells = [['Cards (cards2)']];

  // Each card is a direct child <div> of the block root
  const cardContainers = Array.from(element.querySelectorAll(':scope > div'));

  cardContainers.forEach((card) => {
    // Try to detect the main card content/structure
    // 1. Icon/Image (first cell):
    let iconOrImage = null;
    // Priority: <img> > colored empty square-like div > first non-empty block
    const img = card.querySelector('img');
    if (img) {
      iconOrImage = img;
    } else {
      // Typical icon: a div with no children (colored background)
      // Find a non-container, non-widget div descendant that's empty
      const allDivs = Array.from(card.querySelectorAll('div'));
      const coloredDiv = allDivs.find(div =>
        div.childElementCount === 0 &&
        // Likely an icon: has a background or is high up in the card
        (getComputedStyle(div).backgroundColor !== 'rgba(0, 0, 0, 0)' || getComputedStyle(div).backgroundColor === 'rgb(255, 255, 255)')
      );
      if (coloredDiv) {
        iconOrImage = coloredDiv;
      }
    }
    // Fallback - to preserve table structure
    if (!iconOrImage) {
      iconOrImage = document.createElement('span');
    }

    // 2. Text Content (second cell):
    // Find the widget that contains the card's main text
    // It's typically a .elementor-widget-text-editor that has at least two <p> children
    let textBlock = null;
    const textEditors = Array.from(card.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container'));
    textBlock = textEditors.find(te => te.querySelector('p')) || textEditors[0];
    if (!textBlock) {
      // fallback: Try to find the first <p> directly
      textBlock = card.querySelector('p') || document.createElement('span');
    }

    // 3. CTA (optional): a text-editor with exact text 'Learn More'
    let ctaBlock = null;
    const textEditorParents = Array.from(card.querySelectorAll('.elementor-widget-text-editor'));
    for (const te of textEditorParents) {
      if (te.textContent && te.textContent.trim() === 'Learn More') {
        ctaBlock = te;
        break;
      }
    }
    // Compose second cell: title/desc (textBlock), plus CTA if present
    let cellContent;
    if (ctaBlock) {
      // Only add ctaBlock if not already included
      cellContent = [textBlock, ctaBlock];
    } else {
      cellContent = textBlock;
    }
    cells.push([iconOrImage, cellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
