import express from 'express';
import {
  addMarketingCampaign,
  addMarketingPlan,
  getMarketingCampaignsByType,
  getMarketingPlansByType,
} from '../controllers/marketingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/campaigns', protect, addMarketingCampaign);
router.post('/plans', protect, addMarketingPlan);
router.get('/campaigns', protect, getMarketingCampaignsByType);
router.get('/plans', protect, getMarketingPlansByType);

export default router;
