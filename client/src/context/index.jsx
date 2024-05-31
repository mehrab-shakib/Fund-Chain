import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask, 
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
 import { createCampaign } from "../assets";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x3E0272caA7Ba9D91AfF78e5deC2F5d4a2d1E5C72"
  );

  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({args:[
        address, //owner
        form.title, //title
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image,
      ]});
      console.log("Contract call success", data);
    } catch (error) {
      console.log("Contract call failed", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target?.toString()?? '0'),
      deadline: campaign.deadline.toNumber(),
      ammountCollected: ethers.utils.formatEther(campaign.ammountCollected?.toString()?? '0'),
      image: campaign.image,
      pId: i,
    }));
  
    // console.log(parsedCampaigns);
    return parsedCampaigns;
  };
  
 const  getUserCampaigns = async() =>{
   const allCampaigns = await getCampaigns(); 

   const filteredCampaigns = allCampaigns.filter((campaign)=> campaign.owner === address)

   return filteredCampaigns;
 }

 const donate = async (pId, amount) => {
  const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

  return data;
}

const getDonations = async (pId) => {
  const donations = await contract.call('getDonators', [pId]);
  const numberOfDonations = donations[0].length;

  const parsedDonations = [];

  for(let i = 0; i < numberOfDonations; i++) {
    parsedDonations.push({
      donator: donations[0][i],
      donation: ethers.utils.formatEther(donations[1][i].toString())
    })
  }

  return parsedDonations;
}


  return (
    <StateContext.Provider
      value={{ 
          address, 
          contract, 
          connect, 
          createCampaign : publishCampaign,  //publishCampaign renamed to createCampaign
          getCampaigns, 
          getUserCampaigns,
          donate,
          getDonations
          
          
       }}
    >{children}</StateContext.Provider>
  );
};

export const useStateContext = () =>{
     return useContext (StateContext); 
}


