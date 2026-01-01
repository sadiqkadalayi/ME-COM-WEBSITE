// Sitemap generation utility for SEO

import { getProductUrl, getCategoryUrl } from './urlUtils';

/**
 * Generate XML sitemap content
 */
export const generateSitemap = async (baseUrl = 'https://megiftpacks.com') => {
  try {
    // Fetch all products and categories from your API
    const productsResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/website/products/all`);
    const categoriesResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/categories/navigation`);
    
    const productsData = await productsResponse.json();
    const categoriesData = await categoriesResponse.json();
    
    const products = productsData.products || [];
    const categories = categoriesData.categories || [];
    
    // Start XML structure
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add homepage
    sitemap += `
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Add category pages
    categories.forEach(category => {
      const categoryUrl = getCategoryUrl(category.name);
      sitemap += `
  <url>
    <loc>${baseUrl}${categoryUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add product pages
    products.forEach(product => {
      const productUrl = getProductUrl(product);
      const lastmod = product.updated_at || product.created_at;
      const formattedDate = lastmod ? new Date(lastmod).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      
      sitemap += `
  <url>
    <loc>${baseUrl}${productUrl}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    // Add static pages
    const staticPages = [
      { path: '/cart', priority: '0.5' },
      { path: '/contact-us', priority: '0.7' },
      { path: '/login', priority: '0.3' },
      { path: '/register', priority: '0.3' }
    ];

    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Close XML structure
    sitemap += `
</urlset>`;

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return null;
  }
};

/**
 * Download sitemap as XML file
 */
export const downloadSitemap = async () => {
  const sitemapContent = await generateSitemap();
  
  if (sitemapContent) {
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = (baseUrl = 'https://megiftpacks.com') => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1`;
};