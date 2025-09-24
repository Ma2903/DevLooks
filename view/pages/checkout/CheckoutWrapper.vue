<template>
  <div class="min-h-screen bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200 py-16 px-4">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-4xl font-bold text-white text-center mb-10">Finalizar Compra</h1>

      <div class="flex justify-center items-center mb-12">
        <div class="flex items-center" :class="getStepClass('address')">
          <div class="step-dot" :class="getStepDotClass('address')">1</div>
          <span class="ml-2 font-bold">Endereço</span>
        </div>

        <div class="step-line" :class="getStepLineClass('review')"></div>

        <div class="flex items-center" :class="getStepClass('review')">
          <div class="step-dot" :class="getStepDotClass('review')">2</div>
          <span class="ml-2 font-bold">Revisão</span>
        </div>

        <div class="step-line" :class="getStepLineClass('payment')"></div>

        <div class="flex items-center" :class="getStepClass('payment')">
          <div class="step-dot" :class="getStepDotClass('payment')">3</div>
          <span class="ml-2 font-bold">Pagamento</span>
        </div>
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckoutWrapper",
  methods: {
    isStepActive(step) {
      const path = this.$route.path;
      if (step === 'address') return true;
      if (step === 'review') return path.includes('review') || path.includes('payment');
      if (step === 'payment') return path.includes('payment');
      return false;
    },
    isStepCurrent(step) {
      return this.$route.path.includes(step);
    },
    getStepClass(step) {
      return this.isStepActive(step) ? 'text-white' : 'text-gray-400';
    },
    getStepDotClass(step) {
      return this.isStepCurrent(step) ? 'bg-white text-[#4e44e1]' : (this.isStepActive(step) ? 'bg-white text-[#4e44e1]' : 'bg-gray-700');
    },
    getStepLineClass(step) {
      return this.isStepActive(step) ? 'bg-white' : 'bg-gray-700';
    }
  }
};
</script>

<style scoped>
.step-dot {
  border-radius: 9999px; /* rounded-full */
  height: 2rem; /* h-8 */
  width: 2rem; /* w-8 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem; /* text-lg */
  line-height: 1.75rem;
}
.step-line {
  flex: 1 1 0%; /* flex-1 */
  height: 0.125rem; /* h-0.5 */
  margin-left: 1rem; /* mx-4 */
  margin-right: 1rem; /* mx-4 */
}
</style>