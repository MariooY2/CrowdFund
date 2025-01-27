"use client"
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const CampaignsPage = () => {
  const [campaigns] = useState([
    {
      id: 1,
      title: "Save the Local Library",
      description: "Help us renovate and modernize our community library",
      target: 10,
      raised: 6.5,
      daysLeft: 15,
      image: "/api/placeholder/400/200",
    },
    // Add more sample campaigns here
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Active Campaigns</h1>
          <div className="flex gap-4">
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
              <option>Most Recent</option>
              <option>Most Funded</option>
              <option>Ending Soon</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg">
              Create Campaign
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="bg-gray-800 border-gray-700">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle className="text-xl">{campaign.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={(campaign.raised / campaign.target) * 100} />
                  <div className="flex justify-between text-sm">
                    <span>{campaign.raised} ETH raised</span>
                    <span>Target: {campaign.target} ETH</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {campaign.daysLeft} days left
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg">
                  View Details
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
