import { MediaRenderer, Web3Button, toEther, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { BUSINESSES_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from "../constants/contracts";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";


type Props = {
    tokenId: number;
};

export default function BusinessCard({ tokenId }: Props) {
    // Get the user's address
    const address = useAddress();


    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    
 
    const { contract: businessesContract } = useContract(BUSINESSES_CONTRACT_ADDRESS);
    const { data: nft } = useNFT(businessesContract, tokenId);

    const { contract: stakingContact } = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: businessRewards } = useContractRead(
        stakingContact,
        "getStakeInfoForToken",
        [
            tokenId,
            address
        ]
    );


    useEffect(() => {
        if (!stakingContact || !address) return;

        async function loadClaimableRewards() {
            const stakeInfo = await stakingContact?.call("getStakeInfoForToken", [
                tokenId,
                address,
            ]);
            setClaimableRewards(stakeInfo[1]);
        }

        loadClaimableRewards();

        const intervalId = setInterval(loadClaimableRewards, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Truncate the revenue to 6 decimal places
    const truncateRevenue = (revenue: BigNumber) => {
        const convertToEther = toEther(revenue);
        const truncateValue = convertToEther.toString().slice(0, 6);
        return truncateValue;
    };

    return (
        <div className={styles.nftCard} style={{ backgroundColor: "#222"}}>
            <MediaRenderer
                src={nft?.metadata.image}
            />
            <div style={{ margin: "10px" }}>
                <h4>{nft?.metadata.name}</h4>
                {businessRewards && (
                    businessRewards[1].gt(0) && (
                        <p>Qty: {businessRewards[0].toNumber()}</p>
                    )
                )}
                {claimableRewards && (
                    <p>Revenue: {truncateRevenue(claimableRewards as BigNumber)}</p>
                )}
            </div>
            <Web3Button
                contractAddress={STAKING_CONTRACT_ADDRESS}
                action={(contract) => contract.call(
                    "claimRewards",
                    [tokenId]
                )}
                onSuccess={() => alert("Revenue Claimed!")}
                className={styles.nftCardButton}
            >Claim Revenue</Web3Button>
        </div>
    );
}
