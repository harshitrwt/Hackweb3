import type { AppProps } from "next/app";
import { ThirdwebProvider, embeddedWallet, smartWallet } from "@thirdweb-dev/react";
import { B3Sepolia } from "@thirdweb-dev/chains"; 
import "../styles/globals.css";
import { ACCOUNT_FACTORY_CONTRACT_ADDRESS} from "../constants/contracts";
import Navbar from "../components/Navbar";

// Set your active chain here
const activeChain = Sepolia;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[
        smartWallet(embeddedWallet(), {
          factoryAddress: "",
          gasless: true,
        })
      ]}
      authConfig={{
        domain: process.env.DOMAIN || "",
        authUrl: "/api/auth"
      }}
    >
      <Navbar />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
