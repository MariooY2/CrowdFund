import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, FormEvent, ChangeEvent } from "react";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonate: (amount: number) => void;
}

const DonateModal = ({ isOpen, onClose, onDonate }: DonateModalProps) => {
  const [customAmount, setCustomAmount] = useState<string>("");
  const presetAmounts = [0.1, 0.2, 0.5];

  const handlePresetDonate = (amount: number) => {
    onDonate(amount);
    onClose();
  };

  const handleCustomDonate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = parseFloat(customAmount);
    if (amount && !isNaN(amount) && amount > 0) {
      onDonate(amount);
      setCustomAmount("");
      onClose();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid numbers only
    if (
      value === "" ||
      (/^\d*\.?\d*$/.test(value) && !isNaN(parseFloat(value)))
    ) {
      setCustomAmount(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white sm:max-w-md w-[calc(100%-2rem)] mx-4 sm:mx-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold text-center sm:text-2xl">
            Select Donation Amount
          </DialogTitle>
          <p className="text-gray-400 text-sm text-center">
            Choose a preset amount or enter your own
          </p>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 my-6">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handlePresetDonate(amount)}
              className="bg-blue-600 hover:bg-blue-700 py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {amount} ETH
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">or</span>
          </div>
        </div>

        <form onSubmit={handleCustomDonate} className="space-y-4 mt-6">
          <div className="space-y-2">
            <label htmlFor="customAmount" className="block text-sm font-medium">
              Custom Amount (ETH)
            </label>
            <Input
              id="customAmount"
              type="text"
              inputMode="decimal"
              placeholder="Enter amount"
              value={customAmount}
              onChange={handleInputChange}
              className="bg-gray-700 border-gray-600 text-white h-11 placeholder:text-gray-400"
              aria-describedby="amount-description"
            />
            <p id="amount-description" className="text-xs text-gray-400">
              Enter the amount you wish to donate in ETH
            </p>
          </div>
          <button
            type="submit"
            disabled={
              !customAmount ||
              isNaN(parseFloat(customAmount)) ||
              parseFloat(customAmount) <= 0
            }
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 px-4 rounded-lg transition-colors text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Donate Custom Amount
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonateModal;
