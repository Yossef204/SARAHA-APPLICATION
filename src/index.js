import express from "express";
import { connectDB } from "./DB/index.js";
import { authRouter, userRouter } from "./modules/index.js";
const app = express();
connectDB();
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);

// global middleware error
app.use((error, req, res, next) => {
  return res
    .status(error.cause || 500)
    .json({
      message: error.message,
      details: error.details?.length == 0 ? undefined : error.details,
      stack: error.stack,
      success: false,
    });
});
const port = 3000;
app.listen(port, () => console.log(`Saraha app listening on port ${port}!`));
