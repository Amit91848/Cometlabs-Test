import { AxiosInterceptorManager } from "axios";
import { File } from "buffer";

export interface ICreateSubmission {
  problemId: string;
  source: string;
  compilerId: string;
  compilerVersionId?: string;
  tests?: string;
  files?: File[];
}

export enum Status {
  Waiting = 0,
  Compilation = 1 | 2,
  Execution = 3,
  CompilationError = 11,
  RuntimeError = 12,
  TLE = 13,
  WrongAnswer = 14,
  Accepted = 15,
  MemoryLimitExeceeded = 17,
  IllegalSystemCall = 19,
  InternalError = 20,
}

export interface IGetSubmissionInfo {
  ids: string[];
}

export interface SubmissionStatus {
  code: Status;
  name: string;
}

export interface ISubmission {
  id: string;
  executing: boolean;
  problem: {
    id: string;
    code: string;
    name: string;
    uri: string;
  };
  result: {
    status: SubmissionStatus;
    score: number;
    time: number;
    memory: number;
    signal: number;
    signal_desc: string;
    streams: {
      source: sizeUri | null;
      output: sizeUri | null;
      error: sizeUri | null;
      cmpinfo: sizeUri | null;
    };
    testcases: {
      number: number;
      status: SubmissionStatus;
      score: number;
      time: number;
      memory: number;
      signal: number;
      signal_desc: string;
    }[];
  };
}

interface sizeUri {
  size: number;
  uri: string;
}

export interface SubmissionResponse {
  items: ISubmission[];
}
