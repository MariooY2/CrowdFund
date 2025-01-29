import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatEther } from "viem";
import { Calendar, Users, Timer, Target } from "lucide-react";
import Image from "next/image";

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: bigint;
  totalFunds: bigint;
  deadline: bigint;
  creator: string;
  imageCID: string;
}

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

const ViewDetailsModal = ({
  isOpen,
  onClose,
  campaign,
}: ViewDetailsModalProps) => {
  if (!campaign) return null;

  const calculateDaysLeft = (deadline: bigint): number => {
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = Number(deadline) - now;
    const daysLeft = Math.ceil(secondsLeft / (24 * 60 * 60));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const formatDate = (timestamp: bigint): string => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const progressPercentage =
    (Number(campaign.totalFunds) / Number(campaign.goal)) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold line-clamp-2 text-center">
            {campaign.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Campaign Image */}
          <div className="relative w-full h-48 sm:h-64 lg:h-72 rounded-lg overflow-hidden">
            <Image
              src={`https://${campaign.imageCID}.ipfs.w3s.link/`}
              alt={campaign.title}
              fill
              className="object-fit"
              priority
            />
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <Progress
              className={`h-4 ${
                progressPercentage < 50 ? "bg-red-500" : "bg-green-500"
              }`}
              value={progressPercentage}
            />
            <div className="flex flex-col sm:flex-row justify-between gap-2 text-base sm:text-lg">
              <span className="font-medium">
                {formatEther(campaign.totalFunds)} ETH raised
              </span>
              <span className="text-gray-300">
                Goal: {formatEther(campaign.goal)} ETH
              </span>
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Target size={20} className="shrink-0" />
                <span className="text-sm font-medium">Progress</span>
              </div>
              <p className="text-lg sm:text-xl font-bold">
                {progressPercentage.toFixed(1)}%
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <Users size={20} className="shrink-0" />
                <span className="text-sm font-medium">Contributors</span>
              </div>
              <p className="text-lg sm:text-xl font-bold">Private</p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <Timer size={20} className="shrink-0" />
                <span className="text-sm font-medium">Days Left</span>
              </div>
              <p className="text-lg sm:text-xl font-bold">
                {calculateDaysLeft(campaign.deadline)}
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <Calendar size={20} className="shrink-0" />
                <span className="text-sm font-medium">End Date</span>
              </div>
              <p className="text-lg sm:text-xl font-bold">
                {formatDate(campaign.deadline)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold">
              About this Campaign
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {campaign.description}
            </p>
          </div>

          {/* Creator Info */}
          <div className="bg-gray-700 p-4 rounded-lg space-y-2">
            <h3 className="text-base sm:text-lg font-semibold">
              Campaign Creator
            </h3>
            <p className="text-gray-300 text-sm break-all font-mono">
              {campaign.creator}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsModal;
