// ⚡ PERFORMANCE: Lazy loading de imagens (eager: false)
// Imagens serão carregadas apenas quando necessário
const images = import.meta.glob('./*.{jpg,jpeg,png,webp}', { eager: false });

export default images;