import express from 'express';
import SignupFlowConfigModel from './models/SignupFlowConfig';

const router = express.Router();

// GET route to fetch Signup Flow Configs
router.get('/signupFlow', async (req, res) => {
  const signupFlowConfigs = await SignupFlowConfigModel.find().sort('order');

  res.status(200).json(signupFlowConfigs);
});

export default router;
