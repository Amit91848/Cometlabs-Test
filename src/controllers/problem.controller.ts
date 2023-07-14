import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { RequestParams, UserRole } from "../types";
import { DEFAULT_LIMIT, DEFAULT_OFFSET, generatePagination } from "../utils";
import {
  IAddQuestion,
  IDeleteProblem,
  IUpdateProblem,
} from "../types/Question";
import { Question } from "../models";
import QuestionModel from "../models/Question.model";

const SPHERE_PROBLEMS_URL = process.env.SPHERE_ENGINE_PROBLEM_URL;
const SPHERE_ENGINE_PROBLEM_TOKEN = process.env.SPHERE_ENGINE_PROBLEM_TOKEN;
const API_URL = "http://localhost:" + process.env.PORT + "/sphere";

/**
 * Fetch all questions from Sphere Engine API
 * @requires offset, limit inside req.query for pagination
 * @returns List of questions
 */
export const allQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role != UserRole.Admin) {
    return res.status(403).json({ message: "You are not authorized" });
  }
  const offset = req.query.offset || DEFAULT_OFFSET;
  const limit = req.query.limit || DEFAULT_LIMIT;
  try {
    const { data } = await axios.get(
      `${SPHERE_PROBLEMS_URL}/problems?access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}&offset=${offset}&limit=${limit}`
    );

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 *
 * Add question to Questions Table
 * @requires name, description, masterJudgeId(by default 1001)
 * @returns name, description, sphereEngineQuestion id
 */
export const addQuestion = async (
  req: RequestParams<IAddQuestion, any, any>,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role != UserRole.Admin)
    return res.status(403).json({ message: "You are not authorized" });

  const { description, masterJudgeId = "1001", name } = req.body;

  if (!description || !masterJudgeId || !name)
    return res.status(403).json({
      message: "Description, masterJudgeId and name fields are required",
    });

  try {
    const { data } = await axios.post(
      `${SPHERE_PROBLEMS_URL}/problems?access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}`,
      {
        name: name,
        body: description,
        masterjudgeId: masterJudgeId,
      }
    );

    const question: Question = {
      body: description,
      masterJudgeId,
      name,
      sphereQuestionId: data.id,
    };
    await QuestionModel.create(question);

    return res.json(data);
  } catch (err) {
    console.log(err.data);
    next(err.data);
  }
};

/**
 * Delete a Question
 * @requires problemId
 */
export const deleteQuestion = async (
  req: RequestParams<IDeleteProblem, any, any>,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role != UserRole.Admin)
    return res.status(403).json({ message: "You are not authorized" });

  const { problemId } = req.body;

  if (!problemId)
    return res.status(403).json({
      message: "Question Id required",
    });

  try {
    const { data } = await axios.delete(
      `${SPHERE_PROBLEMS_URL}/problems/${problemId}?access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}`
    );

    await QuestionModel.deleteOne({ sphereQuestionId: problemId });

    res.status(201).json({ data });
  } catch (err) {
    next(err.data);
  }
};

/**
 * Get questions added by admin
 * @requies offset, limit for pagination
 * @returns List of questions, nextPageUrl, previousPageUrl
 */
export const getAddedQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role != UserRole.Admin)
    return res.status(403).json({ message: "You are not authorized" });

  const offset = (req.query.offset as string) || DEFAULT_OFFSET;
  const limit = (req.query.limit as string) || DEFAULT_LIMIT;

  const totalCount = await QuestionModel.countDocuments();

  try {
    const questions = await QuestionModel.find({})
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    const questionIds = questions.map((q) => q.sphereQuestionId);

    const questionsPromise = questionIds.map((id) => {
      console.log("getting: ", id);
      return axios
        .get(
          `${SPHERE_PROBLEMS_URL}/problems/${id}?access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}`
        )
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          console.log(err.data);
          throw err;
        });
    });

    const questionsList = await Promise.all(questionsPromise);

    console.log(req.originalUrl);
    const pagi = generatePagination(
      totalCount,
      parseInt(offset),
      parseInt(limit),
      API_URL + "/addedQuestion"
    );

    res.status(200).json({ data: questionsList, ...pagi });

    res.json(questions);
  } catch (err) {
    next(err.data);
  }
};

/**
 * Update question details
 * @requires problemId, body, name
 * @returns updated question
 */
export const updateQuestion = async (
  req: RequestParams<IUpdateProblem, any, any>,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role != UserRole.Admin)
    return res.status(401).json({ message: "You are not authorized" });

  const { body, name, problemId } = req.body;

  if (!problemId)
    return res.status(400).json({ message: "problemId field cannot be empty" });

  const question = await QuestionModel.findOne({ sphereQuestionId: problemId });
  if (!question)
    res.status(400).json({ message: "Please select a valid question" });

  const requestData: { body?: string; name?: string } = {};

  if (body) {
    requestData.body = body;
  }
  if (name) {
    requestData.name = name;
  }

  try {
    const { data } = await axios.put(
      `${SPHERE_PROBLEMS_URL}/problems/${problemId}?access_token=${SPHERE_ENGINE_PROBLEM_TOKEN}`,
      requestData
    );

    await QuestionModel.updateOne(
      {
        sphereQuestionId: problemId,
      },
      requestData
    );

    return res.status(201).json(data);
  } catch (err) {
    next(err.data);
  }
};
