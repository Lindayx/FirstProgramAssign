"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Pie } from "react-chartjs-2";
import { db } from "@/lib/firebaseConfig";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderDistribution = () => {
  const [genderData, setGenderData] = useState(null);

  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Pets"));
        const genderCounts = {};
        querySnapshot.forEach((doc) => {
          const pet = doc.data();
          const gender = pet.sex || "Unknown"; // Default to "Unknown" if gender is missing
          genderCounts[gender] = (genderCounts[gender] || 0) + 1;
        });
        const formattedData = Object.entries(genderCounts).map(([key, value]) => ({
          label: key,
          value: value,
        }));
        setGenderData(formattedData);
      } catch (error) {
        console.error("Error fetching gender data:", error);
      }
    };
    fetchGenderData();
  }, []);

  if (!genderData) {
    return <p>Loading gender data...</p>;
  }

  const chartData = {
    labels: genderData.map((item) => item.label),
    datasets: [
      {
        data: genderData.map((item) => item.value),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8A2BE2"],
      },
    ],
  };

  return (
    <div>
      <h2>Gender Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default GenderDistribution;