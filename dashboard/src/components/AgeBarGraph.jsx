"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// need all these for the bar chart to work
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AgeBarGraph() {
  const [ageData, setAgeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgeData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Pets"));
        const ageCounts = {};
        
        querySnapshot.forEach((doc) => {
          const pet = doc.data();
          const age = pet.age || "Unknown";
          // handle string vs number age values
          const ageNum = typeof age === "string" ? parseInt(age, 10) : age;
          
          if (!isNaN(ageNum)) {
            ageCounts[ageNum] = (ageCounts[ageNum] || 0) + 1;
          } else {
            ageCounts["Unknown"] = (ageCounts["Unknown"] || 0) + 1;
          }
        });
        
        // sort by age for the chart to look right
        const formattedData = Object.entries(ageCounts)
          .filter(([key]) => key !== "Unknown")
          .map(([key, value]) => ({
            age: parseInt(key, 10),
            count: value,
          }))
          .sort((a, b) => a.age - b.age);
          
        setAgeData(formattedData);
      } catch (err) {
        console.error("Error fetching age data:", err);
        setError(`Failed to load age data: ${err.message}`);
      }
    };
    
    fetchAgeData();
  }, []);

  if (error)
    return (
      <div className="w-full max-w-[600px] h-[300px] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  if (!ageData)
    return (
      <div className="w-full max-w-[600px] h-[300px] flex items-center justify-center">
        <p className="text-gray-300">Loading age data...</p>
      </div>
    );

  // create gradient colors that get darker with age
  const barColors = ageData.map((_, index) => {
    return `rgba(56, 178, 172, ${0.7 + index * 0.05})`;
  });

  const chartData = {
    labels: ageData.map((d) => d.age),
    datasets: [
      {
        label: "Number of Pets",
        data: ageData.map((d) => d.count),
        backgroundColor: barColors,
        borderColor: "rgba(29, 78, 216, 0.8)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // dark mode friendly chart options
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: "Pet Age Distribution",
        font: { size: 18, weight: 'bold' },
        color: "#e2e8f0", // light text for dark bg
        padding: { bottom: 20 }
      },
      legend: { display: false },
      tooltip: { 
        callbacks: { label: (ctx) => `${ctx.parsed.y} pet(s)` },
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        titleColor: "#e2e8f0",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(74, 222, 128, 0.6)",
        borderWidth: 1,
        padding: 10,
        displayColors: false
      },
    },
    scales: {
      x: { 
        title: { 
          display: true, 
          text: "Age (years)",
          color: "#94a3b8",
          padding: { top: 10 }
        },
        grid: {
          display: true,
          color: "rgba(71, 85, 105, 0.2)", // subtle grid
        },
        ticks: {
          color: "#94a3b8"
        }
      },
      y: { 
        beginAtZero: true, 
        title: { 
          display: true, 
          text: "Count",
          color: "#94a3b8",
          padding: { bottom: 10 }
        },
        grid: {
          display: true,
          color: "rgba(71, 85, 105, 0.2)",
        },
        ticks: {
          color: "#94a3b8"
        }
      },
    },
  };

  return (
    <div className="w-full max-w-[600px] mx-auto my-8 p-4 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
      <Bar data={chartData} options={options} />
    </div>
  );
}