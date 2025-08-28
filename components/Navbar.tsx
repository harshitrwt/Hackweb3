import { ConnectWallet, useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";
import { TOKEN_CONTRACT_ADDRESS } from "../constants/contracts";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image"; // For optimized image handling in Next.js
import logo from "../public/images/logo.png"; // Import the logo image

const Navbar = () => {

    const address = useAddress();
    const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);

    const truncateNumber = (num: string) => {
        return num.slice(0, 6);
    }

    return (
        <div className={styles.navbarContainer}>
            {address && (
                <>
                    <div className={styles.logoContainer}>
                        <Image
                            src={logo}
                            alt="Logo"
                            width={40}
                            height={40}
                            className={styles.logoImage}
                        />
                        <h1 className={styles.brandText}>
                            Chain<span style={{ color: "purple", fontWeight: "bold" }}>Vestor</span>
                        </h1>
                    </div>

                    <div className={styles.navbarOptions}>
                        <Link href="/">
                            <p>Businesses</p>
                        </Link>
                        <Link href="/shop">
                            <p>Shop</p>
                        </Link>
                    </div>

                    <div className={styles.navbarOptions}>
                        {tokenBalance && (
                            <p>{truncateNumber(tokenBalance?.displayValue as string)} {tokenBalance?.symbol}</p>
                        )}
                        <ConnectWallet />
                    </div>
                </>
            )}
        </div>
    )
};

export default Navbar;
