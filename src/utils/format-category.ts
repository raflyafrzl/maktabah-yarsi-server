import { Category } from 'src/schemas/category.schema';

type SubCategories = {
  id: string;
  name: string;
  subcategories?: SubCategories[] | null;
};

export const buildCategoryTree = (categories: Category[]): SubCategories[] => {
  const mapCat = new Map<string, SubCategories>();
  const tree: SubCategories[] = [];

  categories.forEach((category) => {
    const categoryId = category['_id'].toString();
    const parentId = category.category ? category.category.toString() : null;

    const currentCategory: SubCategories = {
      id: categoryId,
      name: category.name,
      subcategories: [],
    };

    mapCat.set(categoryId, currentCategory);

    if (!parentId) {
      tree.push(currentCategory);
    } else {
      const parentCategory = mapCat.get(parentId);
      if (parentCategory) {
        parentCategory.subcategories.push(currentCategory);
      }
    }
  });

  return tree;
};
