/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as in the example - single cell
  const headerRow = ['Table (striped, bordered)'];

  // Find the gallery container (may be nested)
  const galleryContainer = element.querySelector('.elementor-gallery__container');

  // Prepare data rows array
  const dataRows = [];

  if (galleryContainer) {
    // Get all items (each anchor represents one)
    const items = Array.from(galleryContainer.querySelectorAll('a.e-gallery-item'));
    
    // Only proceed if there are items
    if (items.length > 0) {
      // Header for the tabular data, as appropriate for image galleries
      dataRows.push(['Image', 'File Name', 'URL']);
      
      items.forEach(link => {
        // Find the image URL (prefer data-thumbnail if available, fall back to href)
        const imgDiv = link.querySelector('.e-gallery-image');
        let imgUrl = link.href;
        if (imgDiv) {
          const thumb = imgDiv.getAttribute('data-thumbnail');
          if (thumb) imgUrl = thumb;
        }
        // File name from URL
        const fileName = imgUrl.split('/').pop();
        // Create <img> element referencing the existing resource
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = fileName || '';
        // Create link element
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.href;
        a.target = '_blank';
        // Data row: [img, file name, link]
        dataRows.push([img, fileName, a]);
      });
    }
  }

  // Compose the block cells array
  // If dataRows is empty (no gallery), we still output only the block header row
  // If dataRows has content, output header row, then each table row
  let cells = [headerRow];
  if (dataRows.length > 0) {
    cells = [headerRow, ...dataRows];
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
