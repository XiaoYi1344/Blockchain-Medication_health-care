import { ethers } from "ethers";
import type { LicenseOnChain, LicenseV6, RawContractLicense } from "@/types/license";

const CONTRACT_ADDRESS = "0x69b12aFE1492b51a74ef56D5320fb582d2e51c23";
const CONTRACT_ABI = [
  "function getLicense(string id) view returns (string,string,string,string,string[],uint256,string,uint8,uint256,uint256)",
  "function getLicensesByCompany(string companyId) view returns (string[])",
  "function createLicense(string id,string name,string companyId,string licenseId,string docHash,string[] images,uint256 expiryDate,string licenseType,uint8 status)"
];

function getProvider(): ethers.BrowserProvider | ethers.JsonRpcProvider {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }

  const rpc = "https://rpc.zeroscan.org";
  const chainId = 5080;
  console.log("🛰️ Dùng RPC fallback:", rpc);

  return new ethers.JsonRpcProvider(rpc, { name: "PZO", chainId });
}

function getContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export const licenseContractService = {
  getLicense: async (id: string): Promise<LicenseV6> => {
    const c = getContract();
    const res: RawContractLicense = await c.getLicense(id);

    return {
      _id: res.id,
      name: res.name,
      companyId: res.companyId,
      licenseId: res.licenseId,
      docHash: res.docHash,
      images: [], // on-chain chỉ có public_id, React sẽ fetch File từ backend
      type: res.licenseType as LicenseV6["type"],
      status: ["draft", "active", "expired", "revoked"][res.status] as LicenseV6["status"],
      expiryDate: new Date(Number(res.expiryDate) * 1000).toISOString().split("T")[0],
      txHash: "",
    };
  },

  getLicensesByCompany: async (companyId: string): Promise<LicenseV6[]> => {
    const c = getContract();
    const ids: string[] = await c.getLicensesByCompany(companyId);

    const licenses: LicenseV6[] = [];
    for (const id of ids) {
      try {
        const lic = await licenseContractService.getLicense(id);
        licenses.push(lic);
      } catch {
        continue;
      }
    }
    return licenses;
  },

  createLicense: async (signer: ethers.Signer, payload: LicenseOnChain) => {
    const c = getContract(signer);

    const tx = await c.createLicense(
  payload.id,
  payload.name,
  payload.companyId,
  payload.licenseId,
  payload.docHash,
  payload.images || [], // ← thêm dòng này
  payload.expiryDate,
  payload.licenseType,
  payload.status
);


    return tx.wait();
  }
};
