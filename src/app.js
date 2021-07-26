const { promisify } = require("util");

const express = require("express");
const app = express();

const api = require("./routes/api");

const render = promisify(app.render);

app.use("/api/v1", api);

app.get("/", (req, res) => {
    res.sendFile("pages/index.html")
})

app.listen(process.env.PORT || 8090, () => {
    console.log(`Running on port ${process.env.PORT || 8090}`);
})
