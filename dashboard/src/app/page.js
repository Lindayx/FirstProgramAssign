import Navbar from "@/components/Navbar";
import FeaturesChart from "@/components/FeaturesChart";
// import TestButton from "@/components/TestButton";
import GenderChart from "@/components/GenderChart";
import AgeBarGraph from "@/components/AgeBarGraph";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <Navbar />
//       <div className=""></div> {/* pardon me if this is too janky*/}
//       <FeaturesChart />
//       <GenderChart />
//       {/* <TestButton /> */}
//       <AgeBarGraph />
//       {/* <div className="h-[200vh]"></div> */}
//     </div>
//   );
// }

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <FeaturesChart />
      <GenderChart />
      <AgeBarGraph />
    </div>
  );
}