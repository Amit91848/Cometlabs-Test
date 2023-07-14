import { NextFunction, Request, Response } from "express";
import axios from "axios";
import {
  IAddTestcase,
  IAllTestcase,
  IUpdateTestcase,
  RequestParams,
  UserRole,
} from "../types";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "../utils";

const SPHERE_PROBLEMS_URL = process.env.SPHERE_ENGINE_PROBLEM_URL;
const SPHERE_ENGINE_PROBLEM_TOKEN = process.env.SPHERE_ENGINE_PROBLEM_TOKEN;

export const allTestCase = async (
  req: RequestParams<IAllTestcase, any, any>,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role != UserRole.Admin)
    return res.status(403).json({ message: "You are not authorized" });

  const { problemId } = req.body;

  if (!problemId)
    return res.status(400).json({ message: "problemId field cannot be empty" });

  const offset = req.query.offset || DEFAULT_OFFSET;
  const limit = req.query.limit || DEFAULT_LIMIT;

  try {
    const { data } = await axios.get(
      `${SPHERE_PROBLEMS_URL}/problems/${problemId}/testcases?access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}&limit=${limit}&offset=${offset}`
    );
    return res.status(200).json(data);
  } catch (err) {
    next(err.data);
  }
};

export const addTestcase = async (
  req: RequestParams<IAddTestcase, any, any>,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role != UserRole.Admin)
    return res.status(403).json({ message: "You are not authorized" });

  const { problemId, input, output, active, timeLimit, judgeId = 1 } = req.body;

  if (!problemId)
    return res.status(400).json({ message: "ProblemId field is required" });

  try {
    const addData: IAddTestcase = {
      problemId,
      judgeId,
    };

    if (input) addData.input = input;
    if (output) addData.output = output;
    if (active) addData.active = active;
    if (timeLimit) addData.timeLimit = timeLimit;

    const { data } = await axios.post(
      `${SPHERE_PROBLEMS_URL}/problems/${problemId}/testcases?access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}`,
      addData
    );

    return res.status(200).json(data);
  } catch (err) {
    next(err.data);
  }
};

export const updateTestCase = async (
  req: RequestParams<IUpdateTestcase, any, any>,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role != UserRole.Admin)
    return res.status(403).json({ message: "You are not authorized" });

  const { number, problemId, active, input, judgeId, output, timeLimit } =
    req.body;

  if (!number || !problemId)
    return res
      .status(400)
      .json({ message: "ProblemId and number fields are required" });

  try {
    const updateData: IUpdateTestcase = {};
    if (input) updateData.input = input;
    if (output) updateData.output = output;
    if (active) updateData.active = active;
    if (timeLimit) updateData.timeLimit = timeLimit;
    if (judgeId) updateData.judgeId = judgeId;

    const { data } = await axios.put(
      `${SPHERE_PROBLEMS_URL}/problems/${problemId}/testcases/${number}?access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}`,
      updateData
    );
    console.log(data);

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    next(err.data);
  }
};
