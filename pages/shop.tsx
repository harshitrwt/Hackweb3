import { useState, useEffect, useRef } from "react";
import { useContract, useNFTs, useUser } from "@thirdweb-dev/react";
import { BUSINESSES_CONTRACT_ADDRESS } from "../constants/contracts";
import NFTCard from "../components/NFTBussinessCard";
import { getUser } from "../pages/api/auth/[...thirdweb]";
import { useRouter } from "next/router";

export default function Shop() {
    const { contract: businessesContract } = useContract(BUSINESSES_CONTRACT_ADDRESS);
    const { data: businesses } = useNFTs(businessesContract);
    const { isLoggedIn, isLoading } = useUser();
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!businesses || businesses.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % 3);
        }, 3000);

        return () => clearInterval(interval);
    }, [businesses]);

    useEffect(() => {
        if (!isLoggedIn && !isLoading) {
            router.push("/login");
        }
    }, [isLoggedIn, isLoading, router]);

    if (!businesses) return null;

    const carouselItems = [
        {
            title: "More Business Opportunities",
            description: "Exciting new franchises launching soon!",
            gradient: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)" // Violet to Fuchsia
        },
        {
            title: "Exclusive Rewards Program",
            description: "Earn points with every purchase",
            gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" // Deep Purple to Purple
        },
        {
            title: "Community Features",
            description: "Connect with other entrepreneurs", 
            gradient: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)" // Royal Purple to Bright Purple
        }
    ];

    return (
        <div style={{
            padding: "40px",
            maxWidth: "1200px",
            margin: "0 auto",
            fontFamily: "Arial, sans-serif"
        }}>
            <h2 style={{
                fontSize: "2.2rem",
                marginBottom: "30px",
                textAlign: "center",
                color: "#333"
            }}>Buy a Business</h2>

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center",
                marginBottom: "40px"
            }}>
                {businesses.length > 0 ? (
                    businesses.map((business) => (
                        <div key={business.metadata.id} style={{
                            width: "280px",
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            overflow: "hidden",
                            transition: "transform 0.2s ease-in-out",
                        }}>
                            <NFTCard nft={business} />
                        </div>
                    ))
                ) : (
                    <p style={{
                        textAlign: "center",
                        fontSize: "1.2rem",
                        color: "#666"
                    }}>No businesses for sale.</p>
                )}
            </div>

            {businesses.length > 0 && (
                <div 
                    ref={carouselRef}
                    style={{
                        marginTop: "40px",
                        position: "relative",
                        height: "180px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
                    }}
                >
                    <div style={{
                        display: "flex",
                        height: "100%",
                        transition: "transform 0.5s ease-out",
                        transform: `translateX(-${currentSlide * 100}%)`
                    }}>
                        {carouselItems.map((item, index) => (
                            <div 
                                key={index}
                                style={{
                                    minWidth: "100%",
                                    height: "100%",
                                    background: item.gradient,
                                    padding: "30px",
                                    color: "white",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <h3 style={{ 
                                    fontSize: "1.8rem", 
                                    marginBottom: "10px",
                                    textShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                }}>
                                    {item.title}
                                </h3>
                                <p style={{ 
                                    fontSize: "1.1rem",
                                    opacity: 0.9,
                                    maxWidth: "600px",
                                    textAlign: "center"
                                }}>
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: "10px"
                    }}>
                        {[0, 1, 2].map((i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    backgroundColor: currentSlide === i ? "white" : "rgba(255,255,255,0.5)",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease"
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export async function getServerSideProps(context: any) {
    const user = await getUser(context.req);

    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
}