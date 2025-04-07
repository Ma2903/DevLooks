import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://manoelaps2022:0401@cluster0.sw7hdna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("✅ Conectado ao MongoDB!");
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
