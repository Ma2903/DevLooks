// server/config/database.ts

import mongoose from "mongoose";

class connectDB {
  private static instance: connectDB;

  // Impede instância direta com new
  private constructor() {
      (async () => {
        // Pega a URI do banco de dados das variáveis de ambiente
        const dbUri = process.env.MONGO_URI;

        // Verifica se a variável MONGO_URI foi definida no arquivo .env
        if (!dbUri) {
          console.error("❌ ERRO: A variável MONGO_URI não foi definida no seu arquivo .env");
          process.exit(1); // Encerra a aplicação se a URI não for encontrada
        }

        try {
          // Conecta ao MongoDB usando a URI do .env
          await mongoose.connect(dbUri);
          console.log("✅ Conectado ao MongoDB!");
        } catch (error) {
          console.error("❌ Erro ao conectar ao MongoDB:", error);
          process.exit(1);
        }
      })();
  }

  // Método para acessar a instância (Singleton)
  public static getInstance(): connectDB {
    if (!connectDB.instance) {
      connectDB.instance = new connectDB();
    }
    return connectDB.instance;
  }
}

export default connectDB;