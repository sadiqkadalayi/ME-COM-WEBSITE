// Utility functions for URL generation

/**
 * Converts product name to a URL-friendly slug
 * @param {string} productName - The product name to convert
 * @returns {string} - URL-friendly slug
 */
export const createProductSlug = (productName) => {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
};

/**
 * Generates product URL with title slug and ID
 * @param {Object} product - Product object with _id and product_name
 * @returns {string} - Complete product URL
 */
export const getProductUrl = (product) => {
  const slug = createProductSlug(product.product_name);
  return `/product/${slug}/${product._id}`;
};

/**
 * Creates category URL from category name or slug
 * @param {string} categoryName - Category name or slug
 * @returns {string} - Category URL
 */
export const getCategoryUrl = (categoryName) => {
  const slug = categoryName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return `/category/${slug}`;
};