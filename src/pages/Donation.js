import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Grid,
  Alert,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";

const Display = ({ newWaste }) => {
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    fetchWasteData();
  }, []);

  useEffect(() => {
    if (newWaste) {
      console.log("🔄 Adding new waste item:", newWaste);
      setWasteData((prevData) => [newWaste, ...prevData]);
    }
  }, [newWaste]);

  const fetchWasteData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get("http://localhost:5000/waste", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Fetched Waste Data:", response.data);
      setWasteData(response.data);
      setError("");
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError("⚠️ Failed to fetch waste data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (destination) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=&destination=${encodeURIComponent(destination)}`;
    window.open(mapsUrl, "_blank");
  };

  const handleApprove = async (id) => {
    const userName = prompt("Please enter your name to approve this food item:");
    if (!userName) {
      alert("Approval cancelled. Name is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/waste/${id}/approve`,
        { approvedBy: userName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedItem = res.data;

      // Decrease quantity by 10% before updating the state
      updatedItem.foodQuantity = (updatedItem.foodQuantity * 0.9).toFixed(2);

      // Update the waste data with the new quantity
      setWasteData((prev) =>
        prev.map((item) =>
          item._id === id ? updatedItem : item
        )
      );

      alert(`✅ ${updatedItem.foodItem} approved by ${userName} and quantity updated to ${updatedItem.foodQuantity}!`);
    } catch (err) {
      console.error("❌ Error approving food item:", err);
      alert("⚠️ Failed to approve the food item. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}
      >
        📊 Food Waste Records
      </Typography>

      <TextField
        fullWidth
        label="Search by Location"
        variant="outlined"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        sx={{ mb: 3, backgroundColor: "white", color: "black" }}
        InputProps={{
          style: { color: "black" },
          startAdornment: (
            <InputAdornment position="start">
              <span role="img" aria-label="search">🔍</span>
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : wasteData.length > 0 ? (
        <Grid container spacing={3} justifyContent="center">
          {wasteData
            .filter((item) =>
              item.location.toLowerCase().includes(searchLocation.toLowerCase())
            )
            .map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    boxShadow: 3,
                    borderRadius: "10px",
                    p: 1,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  {item.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.foodItem}
                      sx={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                  )}

                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#d32f2f" }}
                    >
                      🍔 {item.foodItem}
                    </Typography>
                    <Typography>
                      ⚖️ <b>Quantity:</b> {item.foodQuantity}
                    </Typography>
                    <Typography>
                      ❌ <b>Reason:</b> {item.foodReason}
                    </Typography>
                    <Typography>
                      📅 <b>Date:</b>{" "}
                      {new Date(item.foodWasteDate).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      📍 <b>Location:</b> {item.location}
                    </Typography>
                    {item.approvedBy && (
                      <Typography color="green">
                        ✅ <b>Approved By:</b> {item.approvedBy}
                      </Typography>
                    )}

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mt: 2, mr: 1 }}
                        onClick={() => handleGetDirections(item.location)}
                      >
                        Get Directions 📍
                      </Button>

                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => handleApprove(item._id)}
                      >
                        Approve Food ✅
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      ) : (
        <Typography
          sx={{ textAlign: "center", mt: 3, fontStyle: "italic", color: "#757575" }}
        >
          No food waste records found. Start adding now!
        </Typography>
      )}
    </div>
  );
};

export default Display;
