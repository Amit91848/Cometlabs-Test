import express, { urlencoded, json } from "express";
import {
  problemRoute,
  submissionRoute,
  testcaseRoute,
  userRoute,
} from "./router";

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/user", userRoute);
app.use("/problem", problemRoute);
app.use("/testcase", testcaseRoute);
app.use("/submission", submissionRoute);

export default app;
