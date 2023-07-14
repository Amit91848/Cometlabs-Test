import { Router } from "express";
import { SubmissionController } from "../controllers";
import { AuthenticateRequest } from "../utils";

const submissionRoute = Router();

submissionRoute.post(
  "/",
  AuthenticateRequest,
  SubmissionController.createSubmission
);
submissionRoute.get(
  "/",
  AuthenticateRequest,
  SubmissionController.getAllSubmissionInfo
);

export { submissionRoute };
