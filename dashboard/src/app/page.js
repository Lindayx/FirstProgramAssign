import Navbar from "@/components/Navbar";
import FeaturesChart from "@/components/FeaturesChart";
import AgeBarGraph from "@/components/AgeBarGraph";
import GenderChart from "@/components/GenderChart";
import DeletedPetsChart from "@/components/DeletedPetsChart";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Feature Usage</h2>
            <FeaturesChart />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Gender Distribution</h2>
            <GenderChart />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Gender Distribution</h2>
            <GenderChart />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">DeletedPetsChart</h2>
            <DeletedPetsChart />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">DeletedPetsChart</h2>
             <AgeBarGraph />
          </div>
          
        </div>
      </main>
      <footer className="text-center py-4 bg-gray-800 text-white">
        © 2025 Pet Adoption Dashboard
      </footer>

    </div>
  );
}