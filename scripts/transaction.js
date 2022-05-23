require('dotenv').config();
const STAGING_ALCHEMY_KEY = process.env.STAGING_ALCHEMY_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(STAGING_ALCHEMY_KEY);

const _contract = require("../artifacts/contracts/CRT_ERC20.sol/CRT_ERC20.json");
const contractAddress = "0x2C515F4121D5ACc7b96C689368d527932bAF3c3c";
const contract = new web3.eth.Contract(_contract.abi, contractAddress);

async function run() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');

  const tx = {
    'from': PUBLIC_KEY,
    'to': contractAddress,
    'nonce': nonce,
    'gas': 500000,
    'data': contract.methods.mint(PUBLIC_KEY, 100 * 10**18).encodeABI()
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise.then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err)
    })
}

run()