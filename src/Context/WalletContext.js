import React, { Component } from "react";
import Web3 from "web3";
import cogoToast from "cogo-toast";

const votingFactoryAbi = require("../votingFactoryAbi.json");
const votingFactoryContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_FOR_VOTING_FACTORY;

export const WalletContext = React.createContext();

class WalletContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      walletModal: false,
      accountBalance: 0,
      web3Provider: null,
      accountId: null,
      votingContract: null,
      balance: 0,
    };
  }

  componentDidMount() {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", function (networkId) {
        localStorage.setItem("MetaMask", "");
        window.location.reload(true);
      });
      window.ethereum.on("accountsChanged", () => {
        // localStorage.setItem('MetaMask', '');
        this.connectWallet();
      });
    }
    if (localStorage.getItem("MetaMask") === "true") {
      this.connectWallet();
    }
  }

  setWalletModal = (walletModal) => {
    this.setState({ walletModal });
  };

  connectWallet = async () => {
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const accountID = accounts[0];

        const networkId = await web3.eth.net.getId();
        if ([4].indexOf(networkId) !== -1) {
          const balance = await web3.eth.getBalance(accountID);
          const accountBalance = web3.utils.fromWei(balance, "ether");

          this.setState({
            accountBalance: parseFloat(accountBalance).toFixed(4),
          });
          localStorage.setItem("MetaMask", "true");
          web3.eth.defaultAccount = accounts[0];
          this.setState(
            {
              web3Provider: web3,
              accountId: accountID,
              walletModal: false,
            },
            () => {
              this.connectVotingFactoryContract();
            }
          );
        } else {
          this.setState({ walletModal: false });
          return cogoToast.error(
            "Please change your network to Ethereum mainnet!"
          );
        }
      } catch (e) {
        console.log(e);
        cogoToast.error(e.message);
      }
    } else if (window.web3) {
      let web3 = new Web3(window.web3.currentProvider);
      this.setState({ web3Provider: web3 });
    } else {
      cogoToast.error("You have to install MetaMask !");
    }
  };

  connectVotingFactoryContract = async () => {
    const web3 = this.state.web3Provider;
    const votingContract = await new web3.eth.Contract(votingFactoryAbi, votingFactoryContractAddress);
    console.log("votingContract = ", votingContract);
    this.setState(
      {
        votingContract
      }
    );
  };

  render() {
    const { children } = this.props;
    return (
      <WalletContext.Provider
        value={{
          ...this.state,
          setWalletModal: this.setWalletModal,
          connectWallet: this.connectWallet,
        }}
      >
        {children}
      </WalletContext.Provider>
    );
  }
}

export default WalletContextProvider;
