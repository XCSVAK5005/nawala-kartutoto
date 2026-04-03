const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

// ROOT
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "NAWALA API BULK READY"
  });
});

// 🔹 SINGLE DOMAIN
app.get("/check/:domain", async (req, res) => {
  try {
    const domain = req.params.domain;

    const formData = new URLSearchParams();
    formData.append("website_url", domain);

    const response = await axios.post(
      "https://stgapi.nigmaengine.com/health_check/v1/check/nawala/url",
      formData
    );

    res.json({
      success: true,
      domain,
      result: (response.data.result_message || "UNKNOWN").toUpperCase()
    });

  } catch {
    res.status(500).json({ success: false });
  }
});

// 🔥 BULK DOMAIN
app.get("/bulk", async (req, res) => {
  try {
    const { domains } = req.query;

    if (!domains) {
      return res.status(400).json({
        success: false,
        error: "DOMAINS PARAM REQUIRED"
      });
    }

    const domainList = domains.split(",").map(d => d.trim()).filter(Boolean);

    // PARALLEL CHECK
    const results = await Promise.all(
      domainList.map(async (domain) => {
        try {
          const formData = new URLSearchParams();
          formData.append("website_url", domain);

          const response = await axios.post(
            "https://stgapi.nigmaengine.com/health_check/v1/check/nawala/url",
            formData
          );

          return {
            domain,
            result: (response.data.result_message || "UNKNOWN").toUpperCase()
          };

        } catch {
          return {
            domain,
            result: "ERROR"
          };
        }
      })
    );

    res.json({
      success: true,
      total: results.length,
      results
    });

  } catch {
    res.status(500).json({
      success: false,
      error: "FAILED BULK CHECK"
    });
  }
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT " + PORT);
});
