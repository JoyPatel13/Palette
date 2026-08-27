import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "palette-api" });
});

app.listen(PORT, () => {
  console.log(`🎨 Palette API running on http://localhost:${PORT}`);
});

export default app;
