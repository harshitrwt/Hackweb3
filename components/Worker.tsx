import { MediaRenderer, useAddress, useContract, useOwnedNFTs, useTokenBalance } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { TOKEN_CONTRACT_ADDRESS, WORKER_CONTRACT_ADDRESS } from "../constants/contracts";

const Worker = () => {

    const address = useAddress();


    const { contract: workerContract } = useContract(WORKER_CONTRACT_ADDRESS);
    const { data: ownedWorkers, isLoading: loadingWorker } = useOwnedNFTs(workerContract, address);

 
    const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);


    const truncateNumber = (num: string) => {
        return num.slice(0, 6);
    }

    return (
        <div style={{ width: "50%"}}>
            {!loadingWorker ? (
                ownedWorkers && ownedWorkers.length > 0 && (
                    ownedWorkers.map((worker) => (
                        <div className={styles.workerContainer} key={worker.metadata.id}>
                            <div>
                                <h2>Worker Stats:</h2>
                                <MediaRenderer 
                                    key={worker.metadata.id}
                                    src={worker.metadata.image}
                                    style={{ borderRadius: "10px", margin: "10px 0px" }}
                                />
                            </div>
                            <div>
                                <p style={{ fontWeight: "bold"}}>{worker.metadata.name} - ID: #{worker.metadata.id}</p>
                                {tokenBalance && (
                                    <p>Balance: {truncateNumber(tokenBalance?.displayValue as string)} {tokenBalance?.symbol}</p>
                                )}
                            </div>
                        </div>
                    ))
                )
            ) : (
                <p>Loading worker...</p>
            )}
        </div>
    )
};

export default Worker;
