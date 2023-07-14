import { Document, Model, Schema, model } from "mongoose";

export interface Question {
  name: string;
  body: string;
  masterJudgeId: string;
  sphereQuestionId: string;
}

interface QuestionBaseDocument extends Question, Document {}

interface QuestionModel extends Model<QuestionBaseDocument> {}

const QuestionSchema = new Schema<QuestionBaseDocument, QuestionModel>({
  name: String,
  body: String,
  masterJudgeId: String,
  sphereQuestionId: String,
});

export default model<QuestionBaseDocument, QuestionModel>(
  "Question",
  QuestionSchema
);
