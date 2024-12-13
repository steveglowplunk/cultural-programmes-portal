import express from "express";
import bodyParser from "body-parser";
import { setAuthRoutes } from "./routes/authRoutes";

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setAuthRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
