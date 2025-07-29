const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3030;

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'https://crm.afoozo.com', 'https://crm.afoozo.com:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Origin', 'Content-Type', 'X-Requested-With', 'Accept', 'Authorization'],
    preflightContinue: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Import routes
const loginRoutes = require("./routes/loginApi");
const masterRoutes = require("./routes/Masters/masterRoutes");
const feedbackRoutes = require("./routes/Feedback/feedbackRoutes");
const commonRoutes = require("./routes/common/commonRoutes");
const dashboardRoutes = require("./routes/Feedback/dashboardRoutes");
const checklistRoutes = require("./routes/CheckList/checklistRoutes");


// Use routes
app.use("/api", loginRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/common", commonRoutes);
app.use("/api/dash", dashboardRoutes);
app.use("/api/checklist", checklistRoutes);
