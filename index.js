const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROOT
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "NAWALA API RUNNING"
  });
});

// MAIN API
app.post("/check", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "URL REQUIRED"
      });
    }

    const formData = new URLSearchParams();
    formData.append("website_url", url);

    const response = await axios.post(
      "https://stgapi.nigmaengine.com/health_check/v1/check/nawala/url",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    return res.json({
      success: true,
      url: url,
      result: response.data.result_message || "UNKNOWN"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "FAILED TO CHECK"
    });
  }
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT " + PORT);
});
