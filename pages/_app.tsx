// pages/_app.tsx
import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import "../styles/global.css";
import Navbar from "../components/Navbar";
import { ACCOUNT_FACTORY_CONTRACT_ADDRESS } from "../constants/contracts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const activeChain = Sepolia;
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
        activeChain={activeChain}
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
