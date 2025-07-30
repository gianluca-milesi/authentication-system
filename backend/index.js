const express = require("express");
const authRouter = require("./routers/authRouter.js");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use("/api", authRouter);

app.get("/", (req, res) => {
    res.json("Root");
});

app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta:${PORT}`);
});