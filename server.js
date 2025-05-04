const express = require('express');
const generateRoute = require("./routes/generateRoutes");
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use("/api", generateRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});