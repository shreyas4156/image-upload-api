const express = require("express");
const app = express();
const users = require("./routes/users");
const upload = require("./routes/upload");
app.use(express.json());
app.use(express.static("public"));
app.use("/api/users", users);
app.use("/api/upload", upload);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening to port ${port}`));
