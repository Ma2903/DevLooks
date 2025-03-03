const images = import.meta.glob('./*.{jpg,jpeg,png}', { eager: true });

export default images;