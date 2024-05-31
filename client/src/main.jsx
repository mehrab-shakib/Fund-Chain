import React from 'react'; 
import ReactDom from 'react-dom/client'; 
import {BrowserRouter as Router} from 'react-router-dom'; 
import {ChainId,  ThirdwebProvider } from "@thirdweb-dev/react";
import {StateContextProvider} from './context'

import App from './App';
import './index.css'

const root = ReactDom.createRoot(document.getElementById('root')); 

root.render (
    // <ThirdwebProvider desiredChainId= {ChainId.Sepolia} >
    <ThirdwebProvider activeChain="sepolia" clientId="858ab9d56b3f1ed6c121f797a0a271d3" >
    <Router>
    <StateContextProvider>
            <App/>
    </StateContextProvider>
        
    </Router>    

    </ThirdwebProvider>
)

// Abar createCampaig ongsho tuku dekhe sob check korte hobe