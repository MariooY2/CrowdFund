// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Campaign {
        address payable creator;
        uint256 id;
        string title;
        string description;
        string imageCID; // IPFS CID for the campaign image
        uint256 goal;
        uint256 deadline;
        uint256 totalFunds;
        bool goalReached;
        bool fundsWithdrawn;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions; 

    event CampaignCreated(uint256 indexed campaignId, address indexed creator,string title, string description, string imageCID, uint256 goal, uint256 deadline);
    event Funded(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event GoalReached(uint256 indexed campaignId, uint256 totalFunds);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed creator, uint256 amount);
    event Refunded(uint256 indexed campaignId, address indexed donor, uint256 amount);

    modifier onlyCreator(uint256 campaignId) {
        require(campaigns[campaignId].creator == msg.sender, "Only the campaign creator can perform this action");
        _;
    }

    modifier campaignActive(uint256 campaignId) {
        require(block.timestamp < campaigns[campaignId].deadline, "Campaign is no longer active");
        _;
    }

    modifier campaignEnded(uint256 campaignId) {
        require(block.timestamp >= campaigns[campaignId].deadline, "Campaign is still active");
        _;
    }

    function createCampaign(string memory title,string memory description, string memory imageCID, uint256 goal, uint256 duration) external {
        require(goal > 0, "Goal must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");

        campaignCount++;
        campaigns[campaignCount] = Campaign({
            title:title,
            id:campaignCount,
            creator: payable(msg.sender),
            description: description,
            imageCID: imageCID,
            goal: goal,
            deadline: duration,
            totalFunds: 0,
            goalReached: false,
            fundsWithdrawn: false
        });

        emit CampaignCreated(campaignCount, msg.sender,title, description, imageCID, goal, block.timestamp + duration);
    }

    function contribute(uint256 campaignId) external payable campaignActive(campaignId) {
        require(msg.value > 0, "Contribution must be greater than 0");

        Campaign storage campaign = campaigns[campaignId];
        campaign.totalFunds += msg.value;
        contributions[campaignId][msg.sender] += msg.value;

        emit Funded(campaignId, msg.sender, msg.value);

        if (campaign.totalFunds >= campaign.goal && !campaign.goalReached) {
            campaign.goalReached = true;
            emit GoalReached(campaignId, campaign.totalFunds);
        }
    }

    function withdrawFunds(uint256 campaignId) external onlyCreator(campaignId) campaignEnded(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.goalReached, "Campaign goal not reached");
        require(!campaign.fundsWithdrawn, "Funds already withdrawn");

        campaign.fundsWithdrawn = true;
        campaign.creator.transfer(campaign.totalFunds);

        emit FundsWithdrawn(campaignId, msg.sender, campaign.totalFunds);
    }

    function refund(uint256 campaignId) external campaignEnded(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        require(!campaign.goalReached, "Campaign goal reached, no refunds");

        uint256 amount = contributions[campaignId][msg.sender];
        require(amount > 0, "No contributions to refund");

        contributions[campaignId][msg.sender] = 0; // Prevent re-entrancy
        payable(msg.sender).transfer(amount);

        emit Refunded(campaignId, msg.sender, amount);
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);

        for (uint256 i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }

        return allCampaigns;
    }
}