import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import AddressForm from "../components/AddressForm";
import * as web3 from "@solana/web3.js";

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [exec, setExec] = useState("");
  const addressSubmittedHandler = (address: string) => {
    try {
      const publicKey = new web3.PublicKey(address);
      setAddress(publicKey.toBase58());

      const connection = new web3.Connection(
        web3.clusterApiUrl("devnet"),
        "confirmed"
      );

      connection
        .getBalance(publicKey)
        .then((balance) => {
          setBalance(balance / web3.LAMPORTS_PER_SOL);
        })
        .catch((error) => {
          alert(error.message);
        });

      connection
        .getAccountInfo(publicKey)
        .then((accountInfo) => {
          if (accountInfo?.executable) {
            setExec("Yes");
          } else {
            setExec("Nopes");
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error) {
      setAddress("");
      setBalance(0);
      setExec("");
      alert("Wrong Public Key address. Please check the address again.");
    }
  };

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>Universal Solana Balance Checker(devnet)</p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
        <p>{`Is it Executable? ${exec}`}</p>
      </header>
    </div>
  );
};

export default Home;
