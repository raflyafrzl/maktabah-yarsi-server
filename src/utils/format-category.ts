import { Category } from 'src/schemas/category.schema';

type SubCategories = {
  id: string;
  name: string;
  total: number;
  subcategories?: SubCategories[] | null;
};

export const buildCategoryTree = (categories: Category[]): SubCategories[] => {
  const mapCat = new Map<string, any>();
  categories.forEach((category) => {
    mapCat.set(category['_id'].toString(), {
      id: category['_id'].toString(),
      name: category.name,
      total: category.total,
      subcategories: [],
    });
  });

  for (const category of categories) {
    const parentId = category.category ? category.category.toString() : null;
    if (parentId) {
      const parentCategorySub: SubCategories = mapCat.get(parentId);
      if (parentCategorySub) {
        const ChildCategorySub: SubCategories = mapCat.get(
          category['_id'].toString(),
        );
        if (ChildCategorySub) {
          parentCategorySub.subcategories.push(ChildCategorySub);
        }
      }
    }
  }

  return Array.from(mapCat.values());
};
