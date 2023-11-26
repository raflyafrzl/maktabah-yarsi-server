import { Category } from 'src/schemas/category.schema';

type CategoryNode = {
  id: string;
  name: string;
  total: number;
  subcategories?: CategoryNode[] | null;
};

export const buildCategoryTree = (categories: Category[]): CategoryNode[] => {
  const categoryMap = new Map<string, any>();
  categories.forEach((category) => {
    categoryMap.set(category['_id'].toString(), {
      id: category['_id'].toString(),
      name: category.name,
      total: category.total,
      subcategories: [],
    });
  });

  for (const category of categories) {
    const parentId = category.category ? category.category.toString() : null;
    if (parentId) {
      const parentNode: CategoryNode = categoryMap.get(parentId);
      if (parentNode) {
        const childNode = categoryMap.get(category['_id'].toString());
        if (childNode) {
          parentNode.subcategories.push(childNode);
        }
      }
    }
  }

  return Array.from(categoryMap.values());
};
