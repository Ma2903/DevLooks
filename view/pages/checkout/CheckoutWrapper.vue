<template>
  <div class="min-h-screen bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200 py-16 px-4">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-4xl font-bold text-white text-center mb-10">Finalizar Compra</h1>

      <div class="flex justify-center items-center mb-12">
        <div class="flex items-center" :class="$route.path.includes('address') ? 'text-white' : 'text-gray-400'">
          <div class="rounded-full h-8 w-8 flex items-center justify-center text-lg" :class="$route.path.includes('address') ? 'bg-white text-[#4e44e1]' : 'bg-gray-700'">1</div>
          <span class="ml-2 font-bold">Endereço</span>
        </div>
        <div class="flex-1 h-0.5 mx-4" :class="$route.path.includes('review') ? 'bg-white' : 'bg-gray-700'"></div>
        <div class="flex items-center" :class="$route.path.includes('review') ? 'text-white' : 'text-gray-400'">
          <div class="rounded-full h-8 w-8 flex items-center justify-center text-lg" :class="$route.path.includes('review') ? 'bg-white text-[#4e44e1]' : 'bg-gray-700'">2</div>
          <span class="ml-2 font-bold">Revisão</span>
        </div>
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckoutWrapper",
};
</script>