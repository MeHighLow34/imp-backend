import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import morgan from "morgan";

//db and authentication
import connectDB from "./db/connect.js";

//routes
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
//middleware
import errorHandleMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "It Works" });
});

//routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/profiles", profileRouter);

//middleware
app.use(notFoundMiddleware);
app.use(errorHandleMiddleware);

//Initialization
const port = process.env.PORT || 4000;
async function start() {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });

    console.log("Server is Working");
  } catch (error) {
    console.log(error);
  }
}

start();
