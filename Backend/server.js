const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/contact', async (req, res) => {
  const { name, email, service, message, website, captcha } = req.body;

  if (!name || !email || !service || !message || !captcha) {
    return res.status(400).json({ status: 'error', message: 'All fields are required.' });
  }
  console.log(name, email);

  if (website) {
    return res.status(400).json({ status: 'error', message: 'Spam detected.' });
  }

  try {
    const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captcha}`;
    const captchaResponse = await fetch(captchaVerifyUrl, { method: 'POST' });
    const captchaResult = await captchaResponse.json();

    if (!captchaResult.success) {
      return res.status(400).json({ status: 'error', message: 'CAPTCHA verification failed.' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Inquiry: ${service}`,
      text: `Name: ${name}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Email send failed:', err);
        return res.status(500).json({ status: 'error', message: 'Email sending failed.' });
      }

      const submission = { name, email, service, message, date: new Date().toISOString() };
      const filePath = 'submissions.json';
      let submissions = [];

      if (fs.existsSync(filePath)) {
        try {
          const data = fs.readFileSync(filePath);
          submissions = JSON.parse(data);
        } catch (e) {
          submissions = [];
        }
      }

      submissions.push(submission);
      fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));

      return res.status(200).json({ status: 'success', message: 'Your message has been sent!' });
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
