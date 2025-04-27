// pages/_app.tsx
import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import { Chain } from "@thirdweb-dev/chains"; // Import Chain type for custom chain definition
import "../styles/global.css";
import Navbar from "../components/Navbar";
import { ACCOUNT_FACTORY_CONTRACT_ADDRESS } from "../constants/contracts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Define Monad Testnet
const MonadTestnet: Chain = {
  name: "Monad Testnet",
  chain: "monad-testnet",
  shortName: "monad",
  slug: "monad-testnet",
  chainId: 10143, // Replace with Monad Testnet's chain ID if different
  rpc: ["https://10143.rpc.thirdweb.com/d391b93f5f62d9c15f67142e43841acc"], // Monad Testnet RPC URL
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  explorers: [
    {
      name: "Monad Testnet Explorer",
      url: "https://testnet.monadexplorer.com", // Monad Testnet Explorer URL
      standard: "EIP3091",
    },
  ],
  testnet: true,
};

const activeChain = MonadTestnet; // Set Monad Testnet as the active chain
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
        activeChain={activeChain} // Use Monad Testnet here
        supportedWallets={[
          smartWallet(embeddedWallet(), {
            factoryAddress: ACCOUNT_FACTORY_CONTRACT_ADDRESS,
            gasless: true,
          }),
        ]}
        authConfig={{
          domain: process.env.DOMAIN || "",
          authUrl: "/api/auth",
        }}
      >
        <Navbar />
        <Component {...pageProps} />
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
