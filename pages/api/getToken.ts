import { NextApiRequest, NextApiResponse } from 'next';
import { Engine } from '@thirdweb-dev/engine';
import { TOKEN_CONTRACT_ADDRESS, WORKER_CONTRACT_ADDRESS } from '../../constants/contracts';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   
    if(req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    };

  
    const {
        THIRDWEB_ENGINE_URL,
        THIRDWEB_ENGINE_ACCESS_TOKEN,
        THIRDWE_ENGINE_WALLET,
    } = process.env;

    try {
       
        if(!THIRDWEB_ENGINE_URL || !THIRDWEB_ENGINE_ACCESS_TOKEN || !THIRDWE_ENGINE_WALLET) {
            throw new Error("THIRDWEB_ENGINE_URL, THIRDWEB_ENGINE_ACCESS_TOKEN, and THIRDWE_ENGINE_WALLET must be set in the environment");
        }

      
        const { address } = req.body;

    
        if(!address) {
            throw new Error("Address must be provided in the request body");
        }

        
        const engine = new Engine({
            url: THIRDWEB_ENGINE_URL,
            accessToken: THIRDWEB_ENGINE_ACCESS_TOKEN,
        });
        
    
        const claimTokens = await engine.erc20.mintTo(
            "<Sepolia>",
            TOKEN_CONTRACT_ADDRESS,
            THIRDWE_ENGINE_WALLET,
            {
                toAddress: address,
                amount: "150",
            }
        );

       
        const claimWorker = await engine.erc721.claimTo(
            "<Sepolia>",
            WORKER_CONTRACT_ADDRESS,
            THIRDWE_ENGINE_WALLET,
            {
                receiver: address,
                quantity: "1",
            }
        );

    
        const waitForMinedStatus = async (queueId: string) => {
            let status = "";
            while (status !== "mined") {
                
                const response = await engine.transaction.status(queueId);
                status = response.result.status as string;

               
                if (status === "mined") {
                    break;
                }

               
                await new Promise((resolve) => setTimeout(resolve, 3000));
            }
        }

   
        await waitForMinedStatus(claimTokens.result.queueId);
        await waitForMinedStatus(claimWorker.result.queueId);

   
        return res.status(200).json({ message: "Worker and tokens claimed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error claiming tokens" });
    }
};

export default handler;
