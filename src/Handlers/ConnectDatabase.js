import mongoose from "mongoose";

export async function LoadDatabase(uri, options = {}) {
  try {
    await mongoose.connect(uri, options);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB bağlantı hatası:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB bağlantısı kesildi.");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB bağlantısı kapatıldı.");
      process.exit(0);
    });

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB'ye bağlanırken bir hata oluştu:", error);
    throw error;
  }
}
