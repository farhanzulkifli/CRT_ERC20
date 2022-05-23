const ethers = require("ethers");
const provider = ethers.providers.getDefaultProvider("rinkeby");
const address = "0x2C515F4121D5ACc7b96C689368d527932bAF3c3c";
const abi = require("../artifacts/contracts/CRT_ERC20.sol/CRT_ERC20.json");

const contract = new ethers.Contract(address, abi.abi, provider);

const callPromise = contract.mintCheck();

callPromise.then((error, result) => {
  if (!error) {
    console.log(result);
  } else {
    console.log(error);
  }
});
