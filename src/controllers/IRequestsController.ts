import {Request, Response} from "express";

interface IRequestsController {
  getRequests: (req: Request, res: Response) => Promise<Response>;
}

export { IRequestsController };