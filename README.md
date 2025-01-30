# 🚀 Decentralized Crowdfunding DApp  

A decentralized crowdfunding platform built with **Next.js**, **ShadCN**, **Wagmi**, **Viem**, **RainbowKit**, and **TailwindCSS**. Smart contracts are developed and deployed using **Hardhat**. IPFS (Storcha) is used for decentralized image storage.  

---

## 📌 Features
- 🏗 **Smart contract-based crowdfunding**  
- 🌐 **Next.js frontend with ShadCN UI**  
- 🔗 **Web3 wallet integration (RainbowKit + Wagmi + Viem)**  
- 🎨 **Styled with TailwindCSS**  
- 📦 **Decentralized image storage using IPFS (Storcha)**  
- 🔥 **Hardhat for contract development & deployment**  

---

## 🛠️ Prerequisites  

Before running the project, make sure you have the following installed:  

- **[Node.js](https://nodejs.org/) v16+** (LTS recommended)  
- **[npm](https://www.npmjs.com/)**  
- **[Hardhat](https://hardhat.org/)** (for smart contract development)  
- **[MetaMask](https://metamask.io/)** or any Web3 wallet  
- **[IPFS Storcha](https://www.pinata.cloud/)** for storing images  

---

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  

```sh
git clone https://github.com/MariooY2/CrowdFund
cd CrowdFund
```
### 2️⃣ Install Dependencies  

```sh
npm run install:all 
```
### 3️⃣  Run Frontend and Local Blockchain on 2 terminals

  ```sh
npm run dev
```
  ```sh
cd hardhat
npx hardhat node
```
### 4️⃣ Deploy the Smart Contract(inside the hardhat directory)

```sh
npx hardhat run /scripts/DeployContract.ts --network localhost
```
### 4️⃣ Setup Enviromental variables
- setup IPFS storage enviromental variables
- rename .env.example to .env I have added 2 private keys

### 5️⃣ Connect Wallet & Start Using the DApp  

- Open your browser and go to `http://localhost:3000`  
- Connect your Web3 wallet (MetaMask or any supported wallet)  
- Start creating and funding campaigns! 🚀  

## 🤝 Contributing  

Contributions are welcome! Feel free to open issues or submit pull requests. 

## 📬 Contact  

For any inquiries or suggestions, feel free to reach out:  

- GitHub: [@MariooY2](https://github.com/MariooY2)  
- Twitter: [@MarioY00](https://twitter.com/@MarioY00)  

🚀 **Happy Building!** 🎉