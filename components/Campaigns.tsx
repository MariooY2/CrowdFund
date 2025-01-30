"use client";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ContractData from "../public/Crowdfunding.json";
import { Progress } from "@/components/ui/progress";
import { formatEther, parseEther } from "viem";
import { useState, useMemo } from "react";
import DonateModal from "../components/DonateModal";
import ViewDetailsModal from "./ViewDetailsModal";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const CampaignsPage = () => {
  const account = useAccount();
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("mostRecent");
  const ContractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();

  const CampaignsQuery = useReadContract({
    abi: ContractData.abi,
    address: ContractAddress,
    functionName: "getAllCampaigns",
  });
  const { data: Campaigns, isLoading: Campaignsloading } = CampaignsQuery;
  console.log(Campaigns);

  const CountQuery = useReadContract({
    abi: ContractData.abi,
    address: ContractAddress,
    functionName: "getAllCampaigns",
  });
  const { data: count } = CountQuery;
  console.log(count);

  const calculateDaysLeft = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = Number(deadline) - now;
    const daysLeft = Math.ceil(secondsLeft / (24 * 60 * 60));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const filteredCampaigns = useMemo(() => {
    if (!Array.isArray(Campaigns)) return [];

    const sorted = [...Campaigns];

    switch (filterOption) {
      case "mostRecent":
        // Sort by creation time (assuming higher IDs are more recent)
        sorted.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "mostFunded":
        // Sort by absolute total funds
        sorted.sort((a, b) => Number(b.totalFunds) - Number(a.totalFunds));
        break;
      case "endingSoon":
        // Sort by days remaining
        sorted.sort((a, b) => {
          const daysLeftA = calculateDaysLeft(a.deadline);
          const daysLeftB = calculateDaysLeft(b.deadline);
          return daysLeftA - daysLeftB;
        });
        break;
      default:
        return sorted;
    }

    return sorted;
  }, [Campaigns, filterOption]);

  const handleDonate = async (amount) => {
    if (selectedCampaign === null) return;
    await writeContractAsync({
      abi: ContractData.abi,
      address: ContractAddress,
      functionName: "contribute",
      args: [selectedCampaign],
      value: parseEther(amount.toString()),
    });
    CampaignsQuery.refetch?.();
    toast({
      title: `Thanks for Donating ${amount} ETH`,
     
    });
  };

  const openDonateModal = (campaignIndex: bigint) => {
    if (account.address == null) {
      toast({
        title: "Connect Wallet First",
        description: "Please connect your web3 wallet",
      });
      return;
    }
    setSelectedCampaign(Number(campaignIndex));
    setIsDonateModalOpen(true);
  };

  const withdraw = async (Id: number) => {
    writeContractAsync({
      abi: ContractData.abi,
      address: ContractAddress,
      functionName: "withdrawFunds",
      args: [Id],
    });
  };

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState(null);
  const openDetailsModal = (campaign) => {
    setSelectedCampaignDetails(campaign);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-16">
      <div className="max-w-7xl ">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Active Campaigns</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full sm:w-auto text-sm"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="mostRecent">Most Recent</option>
              <option value="mostFunded">Most Funded</option>
              <option value="endingSoon">Ending Soon</option>
            </select>
            <Link href={"/create"}>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2 rounded-lg text-sm whitespace-nowrap w-full sm:w-auto">
                Create Campaign
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Campaignsloading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={`skeleton-${index}`}
                  className="bg-gray-800 border-gray-700 flex flex-col"
                >
                  <div className="relative w-full h-48">
                    <Skeleton className="absolute inset-0 rounded-t-lg" />
                  </div>
                  <CardHeader>
                    <Skeleton className="h-6 w-[16.85rem]" />
                    <Skeleton className="h-4 w-[16.85rem] mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between text-sm">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-4 mt-auto">
                    <Skeleton className="w-full h-10 rounded-lg" />
                    <Skeleton className="w-full h-10 rounded-lg" />
                  </CardFooter>
                </Card>
              ))
            : filteredCampaigns.map((campaign) => {
                const daysLeft = calculateDaysLeft(campaign.deadline);
                const progressPercentage =
                  (Number(campaign.totalFunds) / Number(campaign.goal)) * 100;

                return (
                  <Card
                    key={campaign.id}
                    className="bg-gray-800 border-gray-700 flex flex-col w-80"
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={`https://${campaign.imageCID}.ipfs.w3s.link/`}
                        alt={campaign.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl line-clamp-1 text-white">
                        {campaign.title}
                      </CardTitle>
                      <CardDescription className="text-white line-clamp-2">
                        {campaign.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Progress
                          className={`${
                            progressPercentage < 50
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                          value={progressPercentage}
                        />
                        <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm text-white">
                          <span className="whitespace-nowrap">
                            {formatEther(campaign.totalFunds)} ETH raised
                          </span>
                          <span className="whitespace-nowrap">
                            Target: {formatEther(campaign.goal)} ETH
                          </span>
                        </div>
                        <div className="text-sm text-white">
                          {daysLeft} days left
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter
                      className={`grid gap-2 sm:gap-4 mt-auto grid-cols-1 text-white`}
                    >
                      <button
                        className="bg-blue-600 hover:bg-blue-700 py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
                        onClick={() => openDetailsModal(campaign)}
                      >
                        View Details
                      </button>
                      {campaign.totalFunds >= campaign.goal &&
                        account.address == campaign.creator && (
                          <button
                            className="bg-green-600 hover:bg-green-700 py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
                            onClick={() => withdraw(campaign.id)}
                          >
                            Withdraw
                          </button>
                        )}
                      {campaign.totalFunds < campaign.goal && daysLeft > 0 && (
                        <button
                          className="bg-green-600 hover:bg-green-700 py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
                          onClick={() => openDonateModal(campaign.id)}
                        >
                          Donate
                        </button>
                      )}
                      {daysLeft <= 0 && (
                        <button className="bg-red-600 hover:bg-red-700 py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm">
                          Closed
                        </button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
        </div>
        <DonateModal
          isOpen={isDonateModalOpen}
          onClose={() => setIsDonateModalOpen(false)}
          onDonate={handleDonate}
        />
        <ViewDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          campaign={selectedCampaignDetails}
        />
      </div>
    </div>
  );
};

export default CampaignsPage;
