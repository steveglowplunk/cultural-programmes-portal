import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; // 引入 cors 中間件
import { setAuthRoutes } from "./routes/authRoutes";

const app = express();
const PORT = 3001;

app.use(cors()); // 使用 cors 中間件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setAuthRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
