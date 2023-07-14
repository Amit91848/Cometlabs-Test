import "dotenv/config";
import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;
const MONGOOSE_URI = process.env.MONGOOSE_URI;

if (!MONGOOSE_URI) throw new Error("Cannot find mongodb uri");

mongoose
  .connect(MONGOOSE_URI)
  .then(() => {
    console.log("Database connected");
    main();
  })
  .catch((err) => {
    console.error("Error connecting to database: \n", err);
  });

async function main() {
  try {
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("Error running the server: \n ", err);
  }
}

process.on("SIGINT", async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from the database");
    process.exit(0);
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
    process.exit(1);
  }
});
