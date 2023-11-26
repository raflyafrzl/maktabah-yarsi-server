import { Category } from 'src/schemas/category.schema';

type CategoryTree = Category & { _id: string };
type ChildCategories = Omit<CategoryTree, 'category'> & {
  subcategory?: ChildCategories;
};

export const buildCategoryTree = (categories: Category[], parentId = null) => {
  const tree = [];

  for (const category of categories as unknown as ReadonlyArray<CategoryTree>) {
    const categoryId = category.category ? category.category.toString() : null;
    if (categoryId === parentId) {
      const subtree: ChildCategories = {
        _id: category._id.toString(),
        name: category.name,
        total: category.total,
      };

      const children = buildCategoryTree(categories, category._id.toString());
      if (children.length > 0) {
        subtree.subcategory = children as unknown as ChildCategories;
      }

      tree.push(subtree);
    }
  }

  return tree;
};
