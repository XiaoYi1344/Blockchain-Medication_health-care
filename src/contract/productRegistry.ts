import { ethers } from "ethers";

// 👉 Địa chỉ contract đã deploy
export const PRODUCT_REGISTRY_ADDRESS =
  "0x72a1883d13f443d2Ea8FD1A5e9F94241ceDA37A5";

// 👉 ABI rút ra từ contract của bạn
export const PRODUCT_REGISTRY_ABI = [
  "function createProduct(string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description) external",
  "function updateProduct(uint256 productId,string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description) external",
  "function deleteProduct(uint256 productId) external",
  "function getProduct(uint256 productId) view returns (tuple(uint256 id,string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description,uint256 createdAt,uint256 updatedAt,address createdBy,bool isDeleted))",
  "function getAllProducts() view returns (tuple(uint256 id,string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description,uint256 createdAt,uint256 updatedAt,address createdBy,bool isDeleted)[])",
  "function getTotalProducts() view returns (uint256)",
  "event ProductCreated(uint256 indexed id,string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description,address createdBy)",
  "event ProductUpdated(uint256 indexed id,string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description,address updatedBy)",
  "event ProductDeleted(uint256 indexed id,address deletedBy)",
];

// 👉 Hàm khởi tạo contract instance
export const getProductContract = (
  providerOrSigner: ethers.Provider | ethers.Signer
) => {
  return new ethers.Contract(
    PRODUCT_REGISTRY_ADDRESS,
    PRODUCT_REGISTRY_ABI,
    providerOrSigner
  );
};
