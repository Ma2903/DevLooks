<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <div class="container mx-auto py-16 px-4">
      <h1 class="text-4xl font-bold text-purple-400 text-center mb-10">
        Finalizar Compra
      </h1>
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-white mb-6">Resumo do Pedido</h2>
        <p class="text-lg text-gray-300 mb-4">
          Total de Itens: {{ totalItems }}
        </p>
        <p class="text-lg text-gray-300 mb-4">
          Total: R$ {{ totalPrice.toFixed(2) }}
        </p>
        <div class="mt-6">
          <p class="text-gray-300 mb-4">
            Esta é uma página de exemplo para o processo de checkout. Futuramente, será integrada com uma API de pagamento.
          </p>
          <router-link
            to="/products"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Voltar para a Loja
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Checkout",
  computed: {
    totalItems() {
      const cart = localStorage.getItem("cart");
      const cartItems = cart ? JSON.parse(cart) : [];
      return cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    totalPrice() {
      const cart = localStorage.getItem("cart");
      const cartItems = cart ? JSON.parse(cart) : [];
      return cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

body {
  font-family: 'Fira Code', monospace;
}

button:hover {
  transform: scale(1.05);
}
</style>
