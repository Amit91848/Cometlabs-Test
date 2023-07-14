export interface IAddQuestion {
  name: string;
  description: string;
  masterJudgeId: string;
}

export interface IDeleteProblem {
  problemId: string;
}

export interface IUpdateProblem {
  problemId: string;
  name: string;
  body: string;
}
