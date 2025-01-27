import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Decentralized Crowdfunding
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Create and support campaigns with transparency and security on the
            blockchain
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium">
              Start a Campaign
            </button>
            <button className="border border-blue-600 hover:bg-blue-600/10 px-8 py-3 rounded-lg font-medium">
              Explore Campaigns
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Transparent</CardTitle>
                <CardDescription className="text-gray-400">
                  All transactions are recorded on the blockchain
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Secure</CardTitle>
                <CardDescription className="text-gray-400">
                  Smart contracts ensure safe fund management
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Global</CardTitle>
                <CardDescription className="text-gray-400">
                  Anyone can create or support campaigns worldwide
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
