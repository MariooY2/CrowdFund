import Link from "next/link";
const HomePage = () => {
  return (
    <div className="w-full max-w-4xl px-4 flex items-center ">
      <section className="text-center text-white">
        <h1 className="text-5xl font-bold mb-6">Decentralized Crowdfunding</h1>
        <p className="text-xl text-gray-300 mb-8">
          Create and support campaigns with transparency and security on the
          blockchain
        </p>
        <div className="flex justify-center gap-4">
          <Link href={"/create"}>
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium">
              Start a Campaign
            </button>
          </Link>
          <Link href={"/campaigns"}>
            <button className="border border-blue-600 hover:bg-blue-600/10 px-8 py-3 rounded-lg font-medium">
              Explore Campaigns
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
