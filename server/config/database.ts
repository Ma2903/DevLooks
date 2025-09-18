// server/config/database.ts
import mongoose from "mongoose";

const connectDB = async () => {
    const dbUri = process.env.MONGO_URI;

    if (!dbUri) {
        console.error("❌ ERRO: A variável MONGO_URI não foi definida no seu arquivo .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(dbUri);
        console.log("✅ Conectado ao MongoDB!");
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;