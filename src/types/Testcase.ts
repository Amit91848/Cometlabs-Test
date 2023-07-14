export interface IAllTestcase {
  problemId: string;
}

export interface IAddTestcase {
  problemId: string;
  input?: string;
  output?: string;
  timeLimit?: string;
  active?: boolean;
  judgeId: number;
}

export interface IUpdateTestcase {
  number?: string;
  problemId?: string;
  input?: string;
  output?: string;
  timeLimit?: string;
  active?: boolean;
  judgeId?: string;
}
