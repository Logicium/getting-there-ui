// Filtering utilities for DOM manipulation

export function filterElementsByCategory(
  selector: string,
  filter: string,
  categoryDataAttribute: string = 'category'
): void {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    const htmlElement = element as HTMLElement;
    const category = htmlElement.dataset[categoryDataAttribute] || '';

    if (filter === 'all' || category.toLowerCase() === filter.toLowerCase()) {
      htmlElement.style.display = 'block';
    } else {
      htmlElement.style.display = 'none';
    }
  });
}

export function filterElementsByCategoryAndSearch(
  selector: string,
  filter: string,
  searchTerm: string,
  categoryDataAttribute: string = 'category',
  titleDataAttribute: string = 'title'
): void {
  const elements = document.querySelectorAll(selector);
  const search = searchTerm.toLowerCase();

  elements.forEach(element => {
    const htmlElement = element as HTMLElement;
    const category = (htmlElement.dataset[categoryDataAttribute] || '').toLowerCase();
    const title = (htmlElement.dataset[titleDataAttribute] || '').toLowerCase();

    // Category filter: match if 'all' or if the category matches the filter
    const matchesCategory = filter === 'all' || category === filter.toLowerCase();
    
    // Search filter: match if empty search, or if search term is found in title OR category
    const matchesSearch = search === '' || title.includes(search) || category.includes(search);

    if (matchesCategory && matchesSearch) {
      htmlElement.style.display = 'block';
    } else {
      htmlElement.style.display = 'none';
    }
  });
}
