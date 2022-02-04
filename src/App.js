import "./App.css";
import { useEffect, useState } from "react";

import web3 from "./Web3";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(async () => {
    setManager(await lottery.methods.manager().call());
    setPlayers(await lottery.methods.getPlayers().call());
    setBalance(await web3.eth.getBalance(lottery.options.address));
  }, []);

  const formHandler = async (event) => {
    event.preventDefault();

    setMessage("Waiting on transaction success...");
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setBalance(await web3.eth.getBalance(lottery.options.address));

    setMessage("You have been entered!");
  };

  const pickAWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    setMessage("Waiting on transaction success...");
    await lottery.methods.pickWinner().send({
      from: "0x767697634af456e4e74768feb9d52d901a9ba75b",
    });
    setMessage("A winner has been picked!");
  };

  return (
    <div>
      <h1>Lottery Contract</h1>
      <p>This Contract is managed by {manager ? manager : "loading..."}</p>

      <p>
        There are currently {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>

      <hr />

      <form onSubmit={formHandler}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></input>
        </div>
        <button>Enter</button>
      </form>

      <hr />

      <h4>Message from smart contract</h4>
      <p>{message}</p>

      <hr />

      <h4>Past Winners</h4>
      <ul>
        {players.map((address, index) => (
          <li key={index}>{address}</li>
        ))}
      </ul>

      <hr />

      <h4>Contract Address</h4>
      <p>
        {lottery.options.address ? (
          <span>{lottery.options.address}</span>
        ) : (
          <span>Loading</span>
        )}
      </p>

      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={pickAWinner}>Pick a Winner</button>
    </div>
  );
}

export default App;
