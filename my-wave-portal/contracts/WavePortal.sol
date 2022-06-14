// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * A little magic, Google what events are in Solidity!
     */
    event NewWave(address indexed from, uint256 timestamp, string message, string devil);

    mapping(address => uint256) public lastWavedAt;

    /*
     * I created a struct here named Wave.
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
        uint8 devilfruittype;
        uint8 crewmate;
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Wave[] waves;

    constructor() payable {
        console.log("ZORO... THIS IS A SMART CONTRACT... COME BACK BAKA");
    }

    /*
     * You'll notice I changed the wave function a little here as well and
     * now it requires a string called _message. This is the message our user
     * sends us from the frontend!
     */

    function decideCrew(string memory _message) view private returns(uint8){
        uint8 crew;
        uint rand = uint(keccak256(abi.encodePacked(_message)));
        rand = rand % 100;
        if(rand > 70){
            crew = 1;
            console.log(rand);
        }
        else{
            crew = 0;
            console.log(rand);
        }
        return crew;
    }
    function wave(string memory _message, uint8 devilfruit) public {
        totalWaves += 1;
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Dont spam me idiot"
        );
        console.log("%s wants to be or Nakama because %s", msg.sender, _message);

        /*
         * This is where I actually store the wave data in the array.
         */
        uint8 decide;
        decide = decideCrew(_message);
        waves.push(Wave(msg.sender, _message, block.timestamp, devilfruit, decide));

        /*
         * I added some fanciness here, Google it and try to figure out what it is!
         * Let me know what you learn in #general-chill-chat
         */
        string memory temp;
        if(devilfruit == 1){
            temp="Paramecia";
        }
        else if(devilfruit == 2){
            temp = "Logia";
        }
        else{
            temp = "Zoan";
        }
        uint256 prizeAmount = 0.0001 ether;
        if(decide == uint(1)){
            require(prizeAmount <= address(this).balance,"Trying to withdraw more money than the contract has.");
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
        lastWavedAt[msg.sender] = block.timestamp;
        emit NewWave(msg.sender, block.timestamp, _message, temp);
    }

    /*
     * I added a function getAllWaves which will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        // Optional: Add this line if you want to see the contract print the value!
        // We'll also print it over in run.js as well.
        console.log("We have %d total nakamas!", totalWaves);
        return totalWaves;
    }

    function getCrewMates() public view returns(Wave[] memory){
            Wave[] memory temps = new Wave[](waves.length);
            uint256 count;
            for(uint i = 0 ; i<waves.length; i++){
                    Wave storage temp2 = waves[i];
                    if(temp2.crewmate == uint8(1)){
                            temps[count] = temp2;
                            count++;
                    }
                    
            }
        return temps;
    }   
}