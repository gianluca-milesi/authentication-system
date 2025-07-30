const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
    res.json("Root");
});

app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta:${PORT}`);
});