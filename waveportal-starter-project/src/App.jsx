import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]); // new added
  const contractAddress = "0x0D75D55E780dc0ef2381575A17020A373b7B55D4";

  const contractABI = abi.abi;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
            devil_fruit_type: wave.devilfruittype,
            crewmate: wave.crewmate
          };
        });
        /*
        
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message, devil) => {
    console.log("NewWave", from, timestamp, message, devil);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
        devil: devil,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves(); // getallwaves added
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);



        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        var inputVal = document.getElementById("message_here").value;
        var inputdev = document.getElementById("devilf").value;
        const waveTxn = await wavePortalContract.wave(inputVal, parseInt(inputdev), { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (

    <div className="mainContainer">
      <div class="split left">
        <div class="centered">
          <img src="one_piece.png" id="imageofcrew" alt="luffy and his crew" height="600" width="700" align="top"></img></div></div>
      <div class="split right">
        <div className="dataContainer">
        <div class = "centered_right">

          <div className="header">
            &#128082; HI GUYS !!! THIS IS <font color="red">Monkey D. Luffy</font>
          </div>

          <div className="bio">
            I am on a journey to become the &#9875;Pirate King&#9875; and for that I need a lots of Nakamas. So come, Join me on my Journey and lets conquer the Grand Line together.
          <br></br> <font color="red" size="4">Gomu Gomu Noo....</font><br></br><br></br>
          </div>
          <div><b>
          Tell me about You powers and maybe I will take you in my Crew </b></div>
          <input id="message_here" type="text" placeholder="Tell me about your Powers" minlength="1"></input>
          <td></td>
          <br></br>
          <b><label for="devilfruit">Type of Devil Fruit You Have : </label></b>
          
          <select id="devilf">
            <option value="1">Paramecia</option>
            <option value="2">Logia</option>
            <option value="3">Zoan</option>
          </select>
          <br></br>
          <button className="waveButton" onClick={wave}>
            Join Me on "The Thousand Sunny"
        </button>
        <br></br>

          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
          </button>
          )}
    
    <h2> List of my Nakamas </h2>
          {allWaves.map((wave, index) => {
            return (
              <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" , margin : "2%"}}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
                <div>Type Of Devil Fruit: {((wave.devil_fruit_type == 1) ? "Paramecia" : ((wave.devil_fruit_type == 2) ? "Logia" : "Zoan"))}</div>
                <div>Crew Mate: {((wave.crewmate == 1) ? 'You are a Strawhat' : 'You dont have what it takes to be the part of my Crew')}</div>
              </div>)
          })}
          </div>
        </div>
          
      </div>
    </div>
  );
}

export default App