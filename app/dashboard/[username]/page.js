'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard({ params }) {
  const router = useRouter();

  const [username, setUsername] = useState(params?.username || "");
  const [utm, setUtm] = useState("");

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRPM, setTotalRPM] = useState(0);
  const [maxRevenue, setMaxRevenue] = useState(0.0);
  const [maxRPM, setMaxRPM] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [campaignData, setCampaignData] = useState([]);
  const [hideReset, setHideReset] = useState(true);
  const [showStats, setShowStats] = useState(false);

  // 🔁 Sync username to utm
  useEffect(() => {
    if (username && utm !== username) {
      setUtm(username);
    }
  }, [username]);

  // Example: fetch data based on utm
  useEffect(() => {
    if (utm) {
      // Your fetch or API logic goes here
      console.log("Fetching campaign data for:", utm);
    }
  }, [utm]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username} 👋</h1>

      {utm && (
        <div className="mb-4">
          <p><strong>UTM:</strong> {utm}</p>
        </div>
      )}

      {/* You can put your campaign table, stats, or charts here */}
      <div>
        <p>Total Revenue: ${totalRevenue}</p>
        <p>Total RPM: {totalRPM}</p>
        <p>Total Users: {totalUsers}</p>
      </div>
    </div>
  );
}
