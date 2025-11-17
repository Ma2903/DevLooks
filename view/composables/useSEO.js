// 🔍 SEO: Gerenciamento dinâmico de meta tags
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

/**
 * Hook para gerenciar meta tags dinamicamente
 * @param {Object} options - Opções de SEO
 * @param {string} options.title - Título da página
 * @param {string} options.description - Descrição da página
 * @param {string} options.keywords - Palavras-chave separadas por vírgula
 * @param {string} options.image - URL da imagem para Open Graph
 * @param {string} options.url - URL canônica da página
 */
export function useSEO(options = {}) {
  const route = useRoute();
  
  const defaultOptions = {
    title: 'DevLooks - E-commerce para Desenvolvedores',
    description: 'Projeto acadêmico de e-commerce desenvolvido com Vue.js, Node.js e MongoDB. Produtos para desenvolvedores com pagamento via Mercado Pago.',
    keywords: 'ecommerce, devlooks, vue, nodejs, mongodb, mercado pago, projeto acadêmico',
    image: '/og-image.jpg',
    url: window.location.href,
    type: 'website',
    siteName: 'DevLooks',
    locale: 'pt_BR',
    author: 'Mayara Silva'
  };

  const seoOptions = { ...defaultOptions, ...options };

  const updateMetaTags = () => {
    // Título da página
    document.title = seoOptions.title;

    // Meta tags básicas
    updateOrCreateMetaTag('description', seoOptions.description);
    updateOrCreateMetaTag('keywords', seoOptions.keywords);
    updateOrCreateMetaTag('author', seoOptions.author);
    updateOrCreateMetaTag('robots', 'index, follow');

    // Open Graph (Facebook, LinkedIn)
    updateOrCreateMetaTag('og:title', seoOptions.title, 'property');
    updateOrCreateMetaTag('og:description', seoOptions.description, 'property');
    updateOrCreateMetaTag('og:image', seoOptions.image, 'property');
    updateOrCreateMetaTag('og:url', seoOptions.url, 'property');
    updateOrCreateMetaTag('og:type', seoOptions.type, 'property');
    updateOrCreateMetaTag('og:site_name', seoOptions.siteName, 'property');
    updateOrCreateMetaTag('og:locale', seoOptions.locale, 'property');

    // Twitter Card
    updateOrCreateMetaTag('twitter:card', 'summary_large_image');
    updateOrCreateMetaTag('twitter:title', seoOptions.title);
    updateOrCreateMetaTag('twitter:description', seoOptions.description);
    updateOrCreateMetaTag('twitter:image', seoOptions.image);

    // Canonical URL
    updateOrCreateLink('canonical', seoOptions.url);
  };

  const updateOrCreateMetaTag = (name, content, attribute = 'name') => {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  const updateOrCreateLink = (rel, href) => {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  };

  onMounted(() => {
    updateMetaTags();
  });

  // Atualiza meta tags quando a rota mudar
  watch(() => route.path, () => {
    updateMetaTags();
  });

  return {
    updateSEO: (newOptions) => {
      Object.assign(seoOptions, newOptions);
      updateMetaTags();
    }
  };
}

/**
 * Schema.org structured data para produtos
 */
export function generateProductSchema(product) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "DevLooks"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "BRL",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  if (product.reviews && product.reviews.length > 0) {
    const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": avgRating.toFixed(1),
      "reviewCount": product.reviews.length
    };
  }

  return schema;
}

/**
 * Injeta Schema.org structured data no head
 */
export function injectStructuredData(schema) {
  // Remove schema anterior se existir
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Cria novo script com schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
