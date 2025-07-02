const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectToDB = require("./db/db");
const cors = require("cors");
const app = express();
const authRouter = require("./routes/auth.route");
const projectRouter = require("./routes/project.route")
const taskRouter = require("./routes/task.route");

connectToDB();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: ["https://taskify-official.vercel.app","http://localhost:5173"], // frontend origin
    credentials: true
}));

app.use("/api/auth",authRouter);
app.use("/api/projects",projectRouter);
app.use("/api/task",taskRouter);

module.exports = app ;