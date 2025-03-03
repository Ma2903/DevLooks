<template>
    <div class="flex justify-center p-2 max-w-screen-lg mx-auto">
        <input
            type="text"
            class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
            v-model="searchQuery"
        />
        <select v-model="selectedCategory" class="ml-2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" selected>Select Category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
        </select>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchQuery: ''
        };
    }
};
</script>

<style scoped>
</style>