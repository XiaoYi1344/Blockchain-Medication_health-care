// // "use client";

// // import { Button } from "@/components/ui/button";
// // import { Typography } from "@mui/material";
// // import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
// // import { useBalance, useChainId } from "wagmi";
// // import { mainnet, polygon, sepolia } from "wagmi/chains"; // thêm chain bạn cần

// // export default function WalletButton() {
// //   const { open } = useAppKit();
// //   const { address, isConnected } = useAppKitAccount();
// //   const chainId = useChainId();

// //   // Tìm chain từ list
// //   const chains = [mainnet, polygon, sepolia];
// //   const currentChain = chains.find((c) => c.id === chainId);

// //   const { data: balance } = useBalance({
// //     address: address as `0x${string}` | undefined,
// //     chainId,
// //     query: { refetchInterval: 10_000 },
// //   });

// //   if (!isConnected) {
// //     return (
// //       <Button
// //         size="sm"
// //         className="bg-[#5c4422] hover:bg-[#3b2f2f] text-white rounded-full px-4 py-2"
// //         onClick={() => open()}
// //       >
// //         Connect Wallet
// //       </Button>
// //     );
// //   }

// //   return (
// //     <Button
// //       variant="outline"
// //       size="sm"
// //       onClick={() => open()}
// //       className="rounded-full border-[#5c4422] text-[#3b2f2f] hover:bg-[#f7f1e5]
// //                  px-3 py-1 flex flex-col items-start min-w-[120px] h-auto"
// //     >
// //       {/* Balance */}
// //       <Typography variant="body2" fontWeight={600} className="leading-tight">
// //         {parseFloat(balance?.formatted || "0").toFixed(2)}{" "}
// //         {balance?.symbol || currentChain?.nativeCurrency.symbol}
// //       </Typography>

// //       {/* Short address */}
// //       <Typography variant="caption" color="text.secondary" className="leading-tight">
// //         {address?.slice(0, 6)}...{address?.slice(-4)}
// //       </Typography>

// //       {/* Chain name */}
// //       {currentChain?.name && (
// //         <Typography variant="caption" color="text.disabled" className="leading-tight">
// //           {currentChain.name}
// //         </Typography>
// //       )}
// //     </Button>
// //   );
// // }

// // "use client";
// // import { useEffect, useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { toast } from "sonner";
// // import { motion } from "framer-motion";

// // declare global {
// //   interface Window {
// //     ethereum?: any;
// //   }
// // }

// // export default function ConnectWallet() {
// //   const [account, setAccount] = useState<string | null>(null);

// //   const connect = async () => {
// //     if (!window.ethereum) return toast.error("Chưa cài MetaMask!");
// //     try {
// //       const accounts = await window.ethereum.request({
// //         method: "eth_requestAccounts",
// //       });
// //       setAccount(accounts[0]);
// //       toast.success("Đã kết nối ví thành công!");
// //     } catch {
// //       toast.error("Kết nối ví thất bại!");
// //     }
// //   };

// //   useEffect(() => {
// //     if (window.ethereum)
// //       window.ethereum.on("accountsChanged", (acc: string[]) => setAccount(acc[0]));
// //   }, []);

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0 }}
// //       animate={{ opacity: 1 }}
// //       className="flex justify-end mb-3"
// //     >
// //       <Button
// //         onClick={connect}
// //         className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full"
// //       >
// //         {account ? (
// //           <span>
// //             🔗 {account.slice(0, 6)}...{account.slice(-4)}
// //           </span>
// //         ) : (
// //           "Kết nối MetaMask"
// //         )}
// //       </Button>
// //     </motion.div>
// //   );
// // }


// "use client";

// import { useState, useEffect } from "react";
// import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
// import { ethers } from "ethers";

// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// interface ConnectWalletProps {
//   onConnected?: (address: string, provider: ethers.providers.Web3Provider) => void;
// }

// export default function ConnectWallet({ onConnected }: ConnectWalletProps) {
//   const [loading, setLoading] = useState(false);
//   const [walletAddress, setWalletAddress] = useState<string | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   const handleConnect = async () => {
//     if (!window.ethereum) {
//       setSnackbarMessage("Không tìm thấy MetaMask. Vui lòng cài đặt.");
//       setSnackbarOpen(true);
//       return;
//     }

//     setLoading(true);
//     try {
//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       setWalletAddress(accounts[0]);
//       setSnackbarMessage("Kết nối ví thành công!");
//       setSnackbarOpen(true);

//       onConnected?.(accounts[0], provider);
//     } catch (error) {
//       setSnackbarMessage("Kết nối ví thất bại. Vui lòng thử lại.");
//       setSnackbarOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleConnect}
//         disabled={loading}
//         sx={{ textTransform: "none", borderRadius: 3 }}
//       >
//         {loading ? <CircularProgress size={24} color="inherit" /> : "Kết nối MetaMask"}
//       </Button>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert severity="success">
//           {walletAddress ? `Địa chỉ ví: ${walletAddress}` : snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }
