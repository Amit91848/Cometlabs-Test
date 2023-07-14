import { Router } from "express";
import { TestcaseController } from "../controllers";
import { AuthenticateRequest } from "../utils";

const testcaseRoute = Router();

testcaseRoute.post("/all", AuthenticateRequest, TestcaseController.allTestCase);
testcaseRoute.post("/", AuthenticateRequest, TestcaseController.addTestcase);
testcaseRoute.put("/", AuthenticateRequest, TestcaseController.updateTestCase);

export { testcaseRoute };
