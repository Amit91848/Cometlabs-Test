import { Request } from "express";

export type RequestParams<ReqBody, QueryParams, ReqParams> = Request<
  ReqParams,
  any,
  ReqBody,
  QueryParams
>;
