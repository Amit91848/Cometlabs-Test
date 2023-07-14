import { NextFunction, Response, Request } from "express";
import {
  ICreateSubmission,
  ISubmission,
  RequestParams,
  Status,
  SubmissionResponse,
  UserRole,
} from "../types";
import axios from "axios";
import { sendSesEmail } from "../service";

const SPHERE_PROBLEMS_URL = process.env.SPHERE_ENGINE_PROBLEM_URL;
const SPHERE_ENGINE_PROBLEM_TOKEN = process.env.SPHERE_ENGINE_PROBLEM_TOKEN;

export const createSubmission = async (
  req: RequestParams<ICreateSubmission, any, any>,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role != UserRole.Admin) {
    return res.status(403).json({ message: "You are not authorized" });
  }

  const { compilerId, problemId, source, compilerVersionId, files, tests } =
    req.body;

  if (!compilerId || !problemId || !source)
    return res
      .status(400)
      .json({ message: "Fields compilerId, problemId and source are needed" });

  try {
    const createData: ICreateSubmission = {
      compilerId,
      problemId,
      source,
    };
    if (compilerVersionId) createData.compilerVersionId = compilerVersionId;
    if (files) createData.files = files;
    if (tests) createData.tests = tests;

    const { data } = await axios.post(
      `${SPHERE_PROBLEMS_URL}/submissions?access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}`,
      createData
    );

    const submissionData = await pollSubmissionStatus(data.id);
    const { result, problem } = submissionData;
    const sendEmail = sendSesEmail("samit091848@gmail.com", submissionData);
    return res.status(200).json({
      problem,
      status: result.status.name,
      sourceCode: result.streams.source,
      cmpinfo: result.streams.cmpinfo,
      error: result.streams.error,
      testcases: result.testcases,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const pollSubmissionStatus = async (
  submissionId: string
): Promise<ISubmission | null> => {
  const startTime = Date.now();
  const timeLimit = 10_000;
  let submissionData: ISubmission | null = null;

  while (!submissionData && Date.now() - startTime < timeLimit) {
    try {
      const { data } = await axios.get<ISubmission>(
        `${SPHERE_PROBLEMS_URL}/submissions/${submissionId}?access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}`
      );

      if (data && !data.executing) {
        submissionData = data;
        break;
      }
    } catch (err) {
      console.error(err);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return submissionData;
};

export const getAllSubmissionInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role != UserRole.Admin) {
    return res.status(403).json({ message: "You are not authorized" });
  }

  const { ids } = req.query;

  if (!ids) return res.status(400).json({ message: "Field ids is required" });

  try {
    const { data } = await axios.get<SubmissionResponse>(
      `${SPHERE_PROBLEMS_URL}/submissions?ids=${ids}&access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}`
    );

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    next(err.data);
  }
};
