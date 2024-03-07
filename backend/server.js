import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';



import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import sha256 from "sha256";
import uniqid from "uniqid";
import phonepeRoute from './routes/phonepeRoute.js';


dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

const app = express();
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.get("/api/keys/google", (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || "" });
});




app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

// Multer middleware for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form endpoint
app.post('/contact', upload.fields([{ name: 'invoice', maxCount: 1 }, { name: 'reviewScreenshot', maxCount: 1 }]), (req, res) => {
    const { customerName, email, message, productName, dateOfPurchase, address, pinCode, city, state, itemNumber, purchasedFrom } = req.body;
    const invoiceFile = req.files['invoice'][0];
    const reviewScreenshotFile = req.files['reviewScreenshot'][0];

    const mailOptions = {
      from: `${customerName} <email> `,
      to: process.env.EMAIL_USER1,
      subject: `New Message from Contact Form ${customerName}`,
      text: `CustomerName: ${customerName}\nEmail: ${email}\nProductName: ${productName}\nDateOfPurchase: ${dateOfPurchase}\nAddress: ${address}\nPinCode: ${pinCode}\nCity: ${city}\nState: ${state}\nItemNumber: ${itemNumber}\nPurchasedFrom: ${purchasedFrom}`,
      attachments: [
          {   // Attach invoice file
              filename: invoiceFile.originalname,
              path: invoiceFile.path
          },
          {   // Attach review screenshot file
              filename: reviewScreenshotFile.originalname,
              path: reviewScreenshotFile.path
          }
      ]
  };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).send('Error: Something went wrong.');
        } else {
            console.log('Email sent:', info.response);
            // Remove uploaded files after sending email
            fs.unlinkSync(invoiceFile.path);
            fs.unlinkSync(reviewScreenshotFile.path);
            res.status(200).send('Message sent successfully.'); // Send response indicating success
            
        }
    });
});


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", phonepeRoute);












const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
