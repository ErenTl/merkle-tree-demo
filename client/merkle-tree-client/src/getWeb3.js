import Web3 from "web3";
const getWeb3 = () =>
  new Promise((resolve, reject) => { 
    
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
  resolve(web3);
    /*
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          console.log("if 1");
          // Accounts now exposed
          resolve(web3);
          console.log("if 1 end");
        } catch (error) {
          reject(error);
        }
        console.log("modern dap browser");
      }
      // Legacy dapp browsers...
      else if (window.ethereum) {
        // Use Mist/MetaMask's provider.
        const web3 = window.ethereum;
        console.log("Injected web3 detected.");
        resolve(web3);
        console.log("legacy dap browser");
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:7545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });*/
  });

export default getWeb3;
