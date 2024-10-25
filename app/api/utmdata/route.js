import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

const propertyId = '329824737';

// Initialize the client
const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Correctly format the private key
    },
});

export async function POST(request) {
    try {
        // Parse the request body to get utmSource
        const { utm, startDate, endDate } = await request.json();

        // Ensure the utm keyword is provided
        if (!utm || utm.trim() === "") {
            return NextResponse.json({ error: "UTM parameter is missing or empty." });
        }

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dimensions: [
                { name: "firstUserCampaignName" }
            ],
            metrics: [
                { name: "newUsers" },
                { name: "totalRevenue" }
            ],
            dateRanges: [
                { startDate: startDate, endDate: endDate }
            ],
            dimensionFilter: {
                filter: {
                    fieldName: "firstUserCampaignName",
                    stringFilter: {
                        matchType: "CONTAINS",
                        value: utm // Pass utmSource dynamically
                    }
                }
            }
        });

        // If no data is returned, handle that case
        if (!response.rows || response.rows.length === 0) {
            return NextResponse.json({ message: "No data found for the given UTM parameter." }, { DataNotFound: true });
        }
        // Map and return the response data
        const data = response.rows.map(row => {
            const totalUsers = parseInt(row.metricValues[0].value, 10);   // Users for this campaign
            const totalRevenue = parseFloat(row.metricValues[1].value);   // Revenue for this campaign

            // Calculate RPM for this campaign
            const rpm = totalUsers > 0 ? (totalRevenue / totalUsers) * 1000 : 0;

            return {
                campaign: row.dimensionValues[0].value, // Second dimension (firstUserCampaignName)
                users: totalUsers,                      // Users for this campaign
                revenue: totalRevenue.toFixed(2),                  // Revenue for this campaign
                rpm: rpm.toFixed(2)                     // RPM for this campaign, rounded to 2 decimal places
            };
        });

        // Return the response using NextResponse
        return NextResponse.json(data, {DataNotFound: false});
    } catch (error) {
        console.error('Error fetching UTM Campaign Data:', error);
        return NextResponse.json({ error: 'No Data Found' }, { status: 500 });
    }
}
