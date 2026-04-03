const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

// ROOT
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "NAWALA API RUNNING"
  });
});

/**
 * 🔥 ENDPOINT DOMAIN
 * contoh:
 * /check/google.com
 */
app.get("/check/:domain", async (req, res) => {
  try {
    const domain = req.params.domain;

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: "DOMAIN REQUIRED"
      });
    }

    const formData = new URLSearchParams();
    formData.append("website_url", domain);

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
      domain: domain,
      result: (response.data.result_message || "UNKNOWN").toUpperCase()
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "FAILED TO CHECK DOMAIN"
    });
  }
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT " + PORT);
});
