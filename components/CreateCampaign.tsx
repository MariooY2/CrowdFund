"use client"
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CreateCampaignPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Will integrate with smart contract later
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create a New Campaign
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Campaign Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Target Amount (ETH)
                  </label>
                  <input
                    type="number"
                    name="target"
                    value={formData.target}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Campaign Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium"
              >
                Create Campaign
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
