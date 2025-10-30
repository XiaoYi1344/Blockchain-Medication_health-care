// import { useEffect, useState } from "react";
// import { getProductContract } from "@/contract/productRegistry";
// import { getZeroProvider } from "@/utils/zeroNetwork";
// import { ethers } from "ethers";
// import { ProductOnChain } from "@/types/drug";

// export const useBlockchainProducts = () => {
//   const [products, setProducts] = useState<ProductOnChain[]>([]);
//   const [total, setTotal] = useState<number>(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const provider = getZeroProvider();
//         const contract = getProductContract(provider);
//         const totalProducts = await contract.getTotalProducts();
//         const allProducts = await contract.getAllProducts();
//         setTotal(Number(totalProducts));
//         setProducts(allProducts);
//       } catch (error) {
//         console.error("❌ Error fetching blockchain products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return { products, total, loading };
// };
