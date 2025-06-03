<template>
  <div class="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-800 rounded-xl shadow-lg mb-8 max-w-5xl mx-auto">
    <div class="relative flex-1 w-full">
      <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#04d1b0]"></i>
      <input
        type="text"
        class="w-full pl-12 pr-4 py-3 bg-gray-900 text-gray-200 rounded-lg border border-[#04d1b0] focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition"
        placeholder="Buscar produto por nome ou descrição..."
        v-model="searchQuery"
        @input="emitSearch"
        aria-label="Buscar produto"
      />
    </div>
    <div class="relative w-full md:w-64">
      <i class="fas fa-th-list absolute left-4 top-1/2 transform -translate-y-1/2 text-[#04d1b0]"></i>
      <select
        v-model="selectedCategory"
        @change="emitSearch"
        class="w-full pl-12 pr-4 py-3 bg-gray-900 text-gray-200 rounded-lg border border-[#04d1b0] focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition"
        aria-label="Filtrar por categoria"
      >
        <option value="">Todas as categorias</option>
        <option value="avatares">Avatares</option>
        <option value="skins">Skins</option>
        <option value="acessorios">Acessórios</option>
        <option value="presentes">Presentes</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    value: String,
    category: String
  },
  data() {
    return {
      searchQuery: this.value || "",
      selectedCategory: this.category || ""
    };
  },
  watch: {
    value(val) {
      this.searchQuery = val;
    },
    category(val) {
      this.selectedCategory = val;
    }
  },
  methods: {
    emitSearch() {
      this.$emit("update:search", this.searchQuery);
      this.$emit("update:category", this.selectedCategory);
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

input, select {
  font-size: 1.1rem;
  background: #1f2937;
  color: #e5e7eb;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  font-family: 'Fira Code', monospace;
}
input:focus, select:focus {
  border: 2px solid #04d1b0;
}
</style>