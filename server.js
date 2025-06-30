const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const foodRoutes = require('./foodRoute');

const GOOGLE_CLIENT_ID = '640464062291-fv1cr45pc5hvt61d83q4q6f6hlmee57b.apps.googleusercontent.com';

const app = express();
const PORT = process.env.PORT || 5000;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(cors());
app.use(bodyParser.json());

require('./db');

app.use('/api/food', foodRoutes); 

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    res.status(200).json({
      success: true,
      user: { email, name, picture }
    });
  } catch (error) {
    console.error("Google login failed:", error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
