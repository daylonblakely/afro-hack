import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from './models/User'; // Adjust the path as needed
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import authenticateJWT from './middlewares/authenticate-jwt';

const router = express.Router();
const googleClient = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');
const facebookAppId = 'YOUR_FACEBOOK_APP_ID';
const facebookAppSecret = 'YOUR_FACEBOOK_APP_SECRET';

// Google OAuth route
router.post('/google', async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: 'YOUR_GOOGLE_CLIENT_ID',
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Facebook OAuth route
router.post('/facebook', async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`
    );
    const { id, name, email } = response.data;

    let user = await User.findOne({ facebookId: id });
    if (!user) {
      user = new User({
        name,
        email,
        facebookId: id,
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/currentUser', authenticateJWT, (req: Request, res: Response) => {
  res.send(req.user);
});

export default router;
