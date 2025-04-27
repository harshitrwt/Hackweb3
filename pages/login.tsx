import { ConnectEmbed, SmartWallet, useAddress, useSDK, useShowConnectEmbed, useUser, useWallet } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { getUser } from "../pages/api/auth/[...thirdweb]";
import { WORKER_CONTRACT_ADDRESS } from "../constants/contracts";



const loginOptional = false;

const Login = () => {

    const showConnectEmbed = useShowConnectEmbed();

    
    const wallet = useWallet();
    const address = useAddress();
    const sdk = useSDK();


    const { isLoggedIn, isLoading } = useUser();
    const router = useRouter();


    const [loadingWorkerStatus, setLoadingWorkerStatus] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState("");


    const checkNewPlayer = async () => {
        try {
         
            if(wallet instanceof SmartWallet && address && sdk) {
            
                setLoadingWorkerStatus(true);
                setLoadingStatus("Checking worker balance...");

              
                const workerContract = await sdk?.getContract(WORKER_CONTRACT_ADDRESS);
                const workerBalance = await workerContract?.erc721.balanceOf(address);

                
                if(workerBalance?.toNumber() === 0) {
     
                    setLoadingStatus("No worker found...");
                    try {
               
                        setLoadingStatus("Claiming worker and tokens...")
                        const response = await fetch("/api/claimToken", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ address: address }),
                        });

                        const data = await response.json();
                        if(!response.ok) {
                            throw new Error(data.message);
                        }

                        
                        setLoadingStatus("Worker and tokens claimed...");
                    } catch (error) {
                        console.error(error);
                        alert("Error creating new account. Please try again.");
                    } finally {
                        
                        setLoadingStatus("");
                        router.push("/");
                    }
                } else {
                  
                    setLoadingStatus("");
                    router.push("/");
                }
            } else {
                console.error("Wallet is not a SmartWallet");
            }
        } catch (error) {
            console.error("Error getting worker balance");
            console.error(error);
        }
    };

  
    useEffect(() => {
        if(isLoggedIn && !isLoading) {
            checkNewPlayer();
        }
    }, [isLoggedIn, isLoading, wallet]);

   
    if(loadingWorkerStatus) {
        return (
            <div className={styles.container}>
                <h1>{loadingStatus}</h1>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1>Web3 Idle Game Login</h1>
            {showConnectEmbed && (
                <ConnectEmbed
                    auth={{
                        loginOptional,
                    }}
                />
            )}
        </div>
    )
};

export default Login;


export async function getServerSideProps(context: any) {
    const user = await getUser(context.req);

    console.log("Checking user" + user?.address);
    if(user) {
        return {
        redirect: {
            destination: "/",
            permanent: false,
        },
        };
    }

    return {
        props: {},
    };
}







  
