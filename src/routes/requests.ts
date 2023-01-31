import express from 'express';
import { RequestsController } from "../controllers/RequestsController";
import {InMemoryRateLimiterService} from "../rateLimiter/InMemoryRateLimiterService";
const router = express.Router();

const requestsController = new RequestsController();

router.get('/requests', requestsController.getRequests.bind(requestsController));

export default router;