<template>
    <div class="add-produto">
        <h1>Adicionar Produto</h1>
        <form @submit.prevent="adicionarProduto">
            <div class="form-group">
                <label for="nome">Nome do Produto:</label>
                <input
                    type="text"
                    id="nome"
                    v-model="produto.nome"
                    placeholder="Digite o nome do produto"
                    required
                />
            </div>

            <div class="form-group">
                <label for="descricao">Descrição:</label>
                <textarea
                    id="descricao"
                    v-model="produto.descricao"
                    placeholder="Digite a descrição do produto"
                    required
                ></textarea>
            </div>

            <div class="form-group">
                <label for="preco">Preço:</label>
                <input
                    type="number"
                    id="preco"
                    v-model="produto.preco"
                    placeholder="Digite o preço do produto"
                    required
                />
            </div>

            <div class="form-group">
                <label for="imagem">URL da Imagem:</label>
                <input
                    type="url"
                    id="imagem"
                    v-model="produto.imagem"
                    placeholder="Digite a URL da imagem do produto"
                />
            </div>

            <button type="submit">Adicionar Produto</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            produto: {
                nome: '',
                descricao: '',
                preco: null,
                imagem: '',
            },
        };
    },
    methods: {
        adicionarProduto() {
            console.log('Produto adicionado:', this.produto);
            // Aqui você pode adicionar a lógica para salvar o produto, como uma chamada à API
            alert('Produto adicionado com sucesso!');
            this.produto = {
                nome: '',
                descricao: '',
                preco: null,
                imagem: '',
            };
        },
    },
};
</script>

<style scoped>
.add-produto {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input,
textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>