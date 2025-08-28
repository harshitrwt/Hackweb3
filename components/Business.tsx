import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { STAKING_CONTRACT_ADDRESS } from "../constants/contracts";
import { BigNumber } from "ethers";
import BussinessCard from "../components/BussinessCard";
import Image from "next/image";

const Businesses = () => {
    const address = useAddress();
    const { contract: stakingContact } = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: stakedTokens, isLoading: loadingBusinesses } = useContractRead(stakingContact, "getStakeInfo", [
        address,
    ]);

    return (
        <div className={styles.businessFlexWrapper}>
            {/* Left: Labour Image */}
            <div className={styles.businessImageWrapper}>
                <Image 
                    src="/images/labour.png"
                    alt="Labour"
                    width={400}
                    height={400}
                    className={styles.businessImage}
                    priority
                />
            </div>
            
            {/* Right: Business Content */}
            <div className={styles.businessContainer}>
                {!loadingBusinesses ? (
                    <>
                        <h2>Businesses:</h2>
                        <div className={styles.grid}>
                            {stakedTokens && stakedTokens[0].length > 0 ? (
                                stakedTokens[0].map((stakedToken: BigNumber) => (
                                    <BussinessCard
                                        key={stakedToken.toString()}
                                        tokenId={stakedToken.toNumber()}
                                    />
                                ))
                            ) : (
                                <div className={styles.noBusinessWrapper}>
                                    <p>No businesses started.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Loading businesses...</p>
                )}
            </div>
        </div>
    );
};

export default Businesses;
