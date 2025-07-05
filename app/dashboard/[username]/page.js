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

  // 🔁 Sync username to utm automatically
  useEffect(() => {
    if (username && utm !== username) {
      setUtm(username);
    }
  }, [username]);

  // 🔁 Fetch campaign data (Dummy example)
  useEffect(() => {
    if (utm) {
      // Simulated API fetch
      setTimeout(() => {
        setCampaignData([
          { name: "Campaign A", revenue: 120, rpm: 30 },
          { name: "Campaign B", revenue: 90, rpm: 22 },
        ]);

        setTotalRevenue(210);
        setTotalRPM(26);
        setMaxRevenue(120);
        setMaxRPM(30);
        setTotalUsers(350);
        setShowStats(true);
        setHideReset(false);
      }, 1000);
    }
  }, [utm]);

  const handleReset = () => {
    setCampaignData([]);
    setTotalRevenue(0);
    setTotalRPM(0);
    setMaxRevenue(0);
    setMaxRPM(0);
    setTotalUsers(0);
    setShowStats(false);
    setHideReset(true);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome, {username}</h1>

      <div className="mb-6">
        <p className="text-lg">UTM: <strong>{utm}</strong></p>
      </div>

      {showStats && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Campaign Summary</h2>
          <p>Total Revenue: ${totalRevenue}</p>
          <p>Total RPM: {totalRPM}</p>
          <p>Max Revenue: ${maxRevenue}</p>
          <p>Max RPM: {maxRPM}</p>
          <p>Total Users: {totalUsers}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Campaigns</h2>
        {campaignData.length > 0 ? (
          <ul>
            {campaignData.map((campaign, index) => (
              <li key={index} className="border-b py-2">
                <strong>{campaign.name}</strong> – Revenue: ${campaign.revenue}, RPM: {campaign.rpm}
              </li>
            ))}
          </ul>
        ) : (
          <p>No campaign data yet.</p>
        )}
      </div>

      {!hideReset && (
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset Stats
        </button>
      )}
    </div>
  );
}
