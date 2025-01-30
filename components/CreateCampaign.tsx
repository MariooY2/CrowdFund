"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info, X } from "lucide-react";
import ContractData from "../public/Crowdfunding.json";
import { parseEther } from "viem";
import { useWalletClient, useAccount, useWriteContract } from "wagmi";
import { create } from "@web3-storage/w3up-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const CreateCampaignPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadImageToIPFS = async (file) => {
    if (!file) throw new Error("No image file selected.");
    const client = await create();
    const email = process.env.NEXT_PUBLIC_EMAIL as `${string}@${string}`;
    await client.login(email);
    await client.setCurrentSpace(`did:key:${process.env.NEXT_PUBLIC_IPFSKEY}`);
    const fileCID = await client.uploadFile(file);
    return fileCID.toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!walletClient || !address) {
      toast({
        title: "Please connect your wallet first",
      });
      return;
    }

    setIsLoading(true);
    try {
      const imageCID = await uploadImageToIPFS(formData.image);
      const targetInWei = parseEther(formData.target);
      const deadlineTimestamp = Math.floor(
        new Date(formData.deadline).getTime() / 1000
      );

      if (!writeContractAsync) {
        throw new Error("writeContractAsync is undefined");
      }

      const tx = await writeContractAsync({
        abi: ContractData.abi,
        address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        functionName: "createCampaign",
        args: [
          formData.title,
          formData.description,
          imageCID,
          targetInWei,
          deadlineTimestamp,
        ],
      });

      toast({
        title: "Campaign Created Successfully",
        description: `tx hash: ${tx}`,
      });
      router.push("/campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Campaign Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">Tips for Success</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Set a realistic funding goal</li>
                    <li>Choose a compelling project image</li>
                    <li>Write a clear, detailed description</li>
                    <li>Set an appropriate campaign duration</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Connected wallet</li>
                    <li>Project description</li>
                    <li>Campaign image</li>
                    <li>Funding goal in ETH</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">
                  Create a New Campaign
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                      Campaign Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Enter your campaign title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-32"
                      placeholder="Describe your campaign in detail"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">
                        Target Amount (ETH)
                      </label>
                      <input
                        type="number"
                        name="target"
                        value={formData.target}
                        onChange={handleChange}
                        step="0.01"
                        min="0.1"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="0.00"
                        required
                        
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                      Campaign Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                      {!imagePreview ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="relative w-full h-48">
                          <Image
                            src={imagePreview}
                            alt="Campaign preview"
                            fill
                            className="object-cover rounded-lg"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full hover:bg-gray-700 transition z-10"
                          >
                            <X className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium text-lg transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Campaign...
                      </div>
                    ) : (
                      "Create Campaign"
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
