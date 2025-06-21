import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ConnectMongoDB } from './MongoDBConnection.js';
import {
  createUser,
  fetchUserByEmail,
  updateUserDetails
} from './user.controller.js';
import { SendMail } from './sendMail.controller.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: false
}));



await ConnectMongoDB();

app.post('/api/user/create', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await fetchUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/user/update', async (req, res) => {
  try {
    const { email, ...updates } = req.body;
    const user = await updateUserDetails(email, updates);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/sendmail', async (req, res) => {
  try {
    const mailResponse = await SendMail(req.body);
    if (mailResponse.success) {
      res.status(200).json(mailResponse);
    } else {
      res.status(500).json(mailResponse);
    }
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to send mail" });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
