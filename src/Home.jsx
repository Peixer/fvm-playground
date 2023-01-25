import Nullstack from "nullstack";

import "./Home.css";

import { ethers } from "ethers";

class Home extends Nullstack {
  state = {};
  prepare({ project, page, greeting }) {
    page.title = `${project.name} - ${greeting}`;
    page.description = `${project.name} was made with Nullstack`;
  }

  renderLink({ children, href }) {
    const link = `${href}?ref=create-nullstack-app`;
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    this.state = { selectedAddress: accounts[0] };
  }

  async getBalance() {
    const tokenContractAddress = "0xC551A964A711d06FCddC1e5C613A1990ce983D24";
    const abi = require("./../abi.json");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenContractAddress, abi, provider);
    const balance = (
      await contract.balanceOf(this.state.selectedAddress)
    ).toString();
    this.state.balance = balance;
  }

  async mintTokens() {
    const tokenContractAddress = "0xC551A964A711d06FCddC1e5C613A1990ce983D24";
    const abi = require("./../abi.json");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenContractAddress, abi, signer);
    await contract.mint(this.state.selectedAddress, 1000);
    await this.getBalance();
  }

  renderWelcome() {
    return (
      <>
        <p>Welcome {this.state.selectedAddress}</p>
        {this.state.balance && <p>Balance {this.state.balance}</p>}
        {!this.state.balance && (
          <button onclick={() => this.getBalance()}>Get balance</button>
        )}
        <button onclick={() => this.mintTokens()}>Mint tokens</button>
      </>
    );
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <button onclick={() => this.connectToMetamask()}>
          Connect to Metamask
        </button>
      );
    }
    return <Welcome />;
  }

  render({ project, greeting }) {
    return <div>{this.renderMetamask()}</div>;
  }
}

export default Home;
