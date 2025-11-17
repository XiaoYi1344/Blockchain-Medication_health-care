"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import toast from "react-hot-toast";
import {
  useAppKitAccount,
  useAppKit,
  useDisconnect,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { tbnbChain, pzoChain, sepolia } from "@/config/reown";
import { ethers } from "ethers";

type WalletState = "select" | "connecting" | "success" | "error" | "info";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
}

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ open, onClose }) => {
  const { address, isConnected } = useAppKitAccount();
  const { open: openWallet } = useAppKit();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useAppKitNetwork();

  const NETWORKS = [pzoChain, tbnbChain, sepolia] as const;
  type Network = (typeof NETWORKS)[number];

  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [walletState, setWalletState] = useState<WalletState>("select");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // const [symbol, setSymbol] = useState<string>("PZO");

  const [balance, setBalance] = useState<string>("0");
  useEffect(() => {
    let isMounted = true; // ✅

    const fetchBalance = async () => {
      if (!address || !window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(address);
        if (isMounted) setBalance(ethers.formatEther(bal));
      } catch (err) {
        console.error(err);
      }
    };

    fetchBalance();

    return () => {
      isMounted = false; // cleanup khi unmount
    };
  }, [address]);

  // Set default chain once on mount
  useEffect(() => {
    setCurrentChainId(pzoChain.id);
  }, []);

  // Update walletState based on connection
  useEffect(() => {
    if (isConnected) setWalletState("success");
    else setWalletState("select");
  }, [isConnected]);

  // const connectWallet = async () => {
  //   setWalletState("connecting");
  //   try {
  //     const res = await openWallet();
  //     if (res && "hash" in res) {
  //       setWalletState("success");
  //       fetchTransactions();
  //     } else {
  //       setWalletState("success");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setWalletState("error");
  //     toast.error("Connection failed!");
  //   }
  // };
  const connectWallet = async () => {
    setWalletState("connecting");
    let isMounted = true;
    try {
      const res = await openWallet();
      if (!isMounted) return;
      if (res && "hash" in res) {
        setWalletState("success");
        fetchTransactions();
      } else {
        setWalletState("success");
      }
    } catch (err) {
      if (!isMounted) return;
      console.error(err);
      setWalletState("error");
      toast.error("Connection failed!");
    }

    return () => {
      isMounted = false;
    };
  };

  // const disconnectWallet = async () => {
  //   try {
  //     await disconnect();
  //     setWalletState("select");
  //     setTransactions([]);
  //     toast("Wallet disconnected 🔌");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Disconnect failed!");
  //   }
  // };
  const disconnectWallet = async () => {
    let isMounted = true;
    try {
      await disconnect();
      if (!isMounted) return;
      setWalletState("select");
      setTransactions([]);
      toast("Wallet disconnected 🔌");
    } catch (err) {
      if (!isMounted) return;
      console.error(err);
      toast.error("Disconnect failed!");
    }

    return () => {
      isMounted = false;
    };
  };

  // const handleSwitchNetwork = async (network: Network) => {
  //   try {
  //     await switchNetwork(network);
  //     setCurrentChainId(network.id);
  //     toast.success(`Switched network to ${network.name}`);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Switch network failed");
  //   }
  // };
  const handleSwitchNetwork = async (network: Network) => {
    let isMounted = true;
    try {
      await switchNetwork(network);
      if (!isMounted) return;
      setCurrentChainId(network.id);
      toast.success(`Switched network to ${network.name}`);
    } catch (err) {
      if (!isMounted) return;
      console.error(err);
      toast.error("Switch network failed");
    }

    return () => {
      isMounted = false;
    };
  };

  const fetchTransactions = () => {
    if (!address) return;
    const mockTx: Transaction[] = [
      {
        hash: "0xabc123",
        from: address,
        to: "0xrecipient1",
        amount: "0.5 ETH",
      },
      { hash: "0xdef456", from: "0xsender2", to: address, amount: "1.2 ETH" },
    ];
    setTransactions(mockTx);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          background: "linear-gradient(135deg, #00c6ff, #0072ff)",
          color: "#fff",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        {walletState === "select" && "Connect Wallet"}
        {walletState === "connecting" && "Connecting Wallet"}
        {walletState === "success" && "Wallet Connected"}
        {walletState === "error" && "Connection Failed"}
        {walletState === "info" && "Wallet Information"}
      </DialogTitle>

      <DialogContent
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          backgroundColor: "#e0f7fa",
        }}
      >
        <AnimatePresence mode="wait">
          {walletState === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Typography variant="body1" textAlign="center" mb={2}>
                Choose your wallet to connect with MedixCare
              </Typography>
              <Stack spacing={2} width={1}>
                <Button
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                  onClick={connectWallet}
                >
                  MetaMask
                </Button>
                <Button variant="contained" disabled>
                  WalletConnect
                </Button>
                <Button variant="contained" disabled>
                  Coinbase Wallet
                </Button>
              </Stack>
            </motion.div>
          )}

          {walletState === "connecting" && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <CircularProgress color="primary" />
              <Typography mt={2}>Please confirm in your wallet</Typography>
            </motion.div>
          )}

          {walletState === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                style={{ display: "inline-block" }}
              >
                <CheckCircleIcon
                  sx={{ color: "#4caf50", fontSize: 60, mb: 2 }}
                />
              </motion.div>

              <Typography variant="h6" mb={1}>
                Connected Successfully
              </Typography>
              <Typography variant="body2" mb={2}>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Typography>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
                  }}
                  onClick={() => setWalletState("info")}
                >
                  View Wallet
                </Button>
              </motion.div>
            </motion.div>
          )}

          {walletState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ textAlign: "center" }}
            >
              <ErrorIcon sx={{ color: "#ff5252", fontSize: 60, mb: 2 }} />
              <Typography variant="h6" mb={1}>
                Connection Failed
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
                }}
                onClick={connectWallet}
              >
                Retry
              </Button>
            </motion.div>
          )}

          {walletState === "info" && isConnected && (
            <motion.div
              key="info"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ width: "100%" }}
            >
              <Typography variant="h6" mb={2}>
                Wallet Information
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  mb: 3,
                  background: "#ffffff",
                  textAlign: "center",
                  wordBreak: "break-all",
                }}
              >
                <Typography variant="body2">Address: {address}</Typography>
                <Typography variant="body2">Số dư: {balance}</Typography>
              </Paper>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Network</InputLabel>
                <Select
                  value={currentChainId || NETWORKS[0].id}
                  label="Network"
                  onChange={(e) => {
                    const network = NETWORKS.find(
                      (n) => n.id === Number(e.target.value)
                    );
                    if (network) handleSwitchNetwork(network);
                  }}
                >
                  {NETWORKS.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle1" mb={1}>
                Transaction History
              </Typography>
              <Paper
                sx={{
                  maxHeight: 200,
                  overflowY: "auto",
                  mb: 3,
                  background: "#f5f5f5",
                  color: "#000",
                }}
              >
                <List dense>
                  {transactions.map((tx) => (
                    <ListItem key={tx.hash}>
                      <ListItemText
                        primary={tx.amount}
                        secondary={`From: ${tx.from} → To: ${tx.to}`}
                      />
                    </ListItem>
                  ))}
                  {transactions.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No transactions found." />
                    </ListItem>
                  )}
                </List>
              </Paper>

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
                  }}
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "#0072ff", borderColor: "#0072ff" }}
                  onClick={onClose}
                >
                  Close
                </Button>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
