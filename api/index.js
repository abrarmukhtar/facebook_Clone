const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const authRoute = require("./routes/auth");
const conversationsRoute = require("./routes/conversations");
const messagesRoute = require("./routes/messages");
const multer = require("multer");
const path = require("path");
dotenv.config();

// mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, ()=>{
//     console.log("connected")
// });

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("connection succesfully");
  })
  .catch((err) => {
    console.log("no connection");
  });

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
// app.use(helmet());
// app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/conversations", conversationsRoute);
app.use("/api/messages", messagesRoute);

app.listen(8800, () => {
  console.log("Backend Server ready");
});
