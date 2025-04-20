// components/DeletionChart.js
"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { db } from "@/lib/firebaseConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DeletionChart() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "DashboardData", "DeletedPets"),
      (snap) => setCounts(snap.exists() ? snap.data() : {}),
      (err) => console.error(err)
    );
    return unsubscribe;
  }, []);

  const labels = Object.keys(counts);
  const data = {
    labels,
    datasets: [{
      label: "Deleted Pets",
      data: labels.map((l) => counts[l]),
      backgroundColor: labels.map((_, i) =>
        `rgba(75,192,192,${0.6 - i * 0.1})`
      ),
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,      // ← allow full height
    plugins: {
      title: { display: true, text: "Pets Deleted by Category" },
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  return (
    <div
      className="w-full h-150"      /* same wrapper height as pie chart */
      style={{ position: "relative" }}  
    >
      {labels.length > 0 ? (
        <Bar
          data={data}
          options={options}
          /* stretch to fill wrapper */
          style={{ height: "100%", width: "100%" }}
        />
      ) : (
        <p className="text-center text-gray-500">
          No deletions recorded yet.
        </p>
      )}
    </div>
  );
}
