import mongoose from "mongoose";
class connectDB {
  private static instance: connectDB;

  // Impede instância direta com new
  private constructor() {
      (async () => {
        try {
          // await mongoose.connect("mongodb+srv://manoelaps2022:0401@cluster0.sw7hdna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
          await mongoose.connect("mongodb://localhost:27017/playerstore")
          console.log("✅ Conectado ao MongoDB!");
        } catch (error) {
          console.error("❌ Erro ao conectar ao MongoDB:", error);
          process.exit(1);
        }
      })();
  }

  // Método para acessar a instância
  public static getInstance(): connectDB {
    if (!connectDB.instance) {
      connectDB.instance = new connectDB();
    }
    return connectDB.instance;
  }
}

export default connectDB;
