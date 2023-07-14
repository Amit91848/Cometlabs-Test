import { Router } from "express";
import { ProblemController } from "../controllers";
import { AuthenticateRequest } from "../utils";

const problemRoute = Router();

problemRoute.get(
  "/allQuestions",
  AuthenticateRequest,
  ProblemController.allQuestions
);

problemRoute.put(
  "/question",
  AuthenticateRequest,
  ProblemController.updateQuestion
);

problemRoute.get(
  "/addedQuestion",
  AuthenticateRequest,
  ProblemController.getAddedQuestion
);

problemRoute.post(
  "/addQuestion",
  AuthenticateRequest,
  ProblemController.addQuestion
);

problemRoute.delete(
  "/question",
  AuthenticateRequest,
  ProblemController.deleteQuestion
);

export { problemRoute };
