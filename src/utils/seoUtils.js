// SEO utilities for generating meta tags and structured data

/**
 * Generate SEO meta tags for product pages
 */
export const generateProductSEO = (product) => {
  if (!product) return {};

  const productTitle = product.product_name;
  const productDescription = product.product_description || `${productTitle} - High quality ${product.category} from ME Gift Packs`;
  const productImage = product.images?.[0]?.cloudinary_url || '';
  const productPrice = product.price || 0;
  const productSKU = product.sku || '';
  const productBrand = product.brand || 'ME Gift Packs';

  return {
    title: `${productTitle} | ME Gift Packs - Corporate Gifts Qatar`,
    description: productDescription.substring(0, 160), // Google prefers 150-160 chars
    keywords: `${productTitle}, ${product.category || ''}, corporate gifts, promotional gifts, Qatar, ${productBrand}`,
    image: productImage,
    url: window.location.href,
    price: productPrice,
    sku: productSKU,
    brand: productBrand,
    availability: product.current_stock > 0 ? 'InStock' : 'OutOfStock'
  };
};

/**
 * Generate structured data (JSON-LD) for products
 */
export const generateProductStructuredData = (product) => {
  if (!product) return null;

  const seo = generateProductSEO(product);
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.product_name,
    "description": product.product_description || seo.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": seo.brand
    },
    "category": product.category,
    "image": seo.image ? [seo.image] : [],
    "offers": {
      "@type": "Offer",
      "price": seo.price,
      "priceCurrency": "QAR",
      "availability": `https://schema.org/${seo.availability}`,
      "seller": {
        "@type": "Organization",
        "name": "ME Gift Packs",
        "url": "https://megiftpacks.com"
      }
    },
    "manufacturer": {
      "@type": "Organization", 
      "name": "ME Gift Packs"
    }
  };
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

/**
 * Update document head with SEO meta tags
 */
export const updateDocumentHead = (seoData) => {
  // Update title
  document.title = seoData.title;

  // Update or create meta tags
  const metaTags = [
    { name: 'description', content: seoData.description },
    { name: 'keywords', content: seoData.keywords },
    { property: 'og:title', content: seoData.title },
    { property: 'og:description', content: seoData.description },
    { property: 'og:image', content: seoData.image },
    { property: 'og:url', content: seoData.url },
    { property: 'og:type', content: 'product' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoData.title },
    { name: 'twitter:description', content: seoData.description },
    { name: 'twitter:image', content: seoData.image },
    { rel: 'canonical', href: seoData.url }
  ];

  metaTags.forEach(tag => {
    let element = null;
    
    if (tag.name) {
      element = document.querySelector(`meta[name="${tag.name}"]`);
    } else if (tag.property) {
      element = document.querySelector(`meta[property="${tag.property}"]`);
    } else if (tag.rel) {
      element = document.querySelector(`link[rel="${tag.rel}"]`);
    }

    if (element) {
      if (tag.content) element.setAttribute('content', tag.content);
      if (tag.href) element.setAttribute('href', tag.href);
    } else {
      element = document.createElement(tag.rel ? 'link' : 'meta');
      if (tag.name) element.setAttribute('name', tag.name);
      if (tag.property) element.setAttribute('property', tag.property);
      if (tag.rel) element.setAttribute('rel', tag.rel);
      if (tag.content) element.setAttribute('content', tag.content);
      if (tag.href) element.setAttribute('href', tag.href);
      document.head.appendChild(element);
    }
  });
};

/**
 * Add structured data to page
 */
export const addStructuredData = (structuredData) => {
  // Remove existing structured data
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());

  // Add new structured data
  if (structuredData) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
};