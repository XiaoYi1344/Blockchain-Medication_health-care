const { Readable } = require("stream");
const axios = require("axios");
const FormData = require("form-data");
const pLimit = require("p-limit").default;

const uploadFile = async (file) => {
  try {
    const formData = new FormData();

    // chuyển Buffer thành stream để axios hiểu đúng
    const fileStream = Readable.from(file.buffer);
    formData.append("file", fileStream, { filename: file.originalname });

    const metadata = JSON.stringify({ name: file.originalname });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({ cidVersion: 1 });
    formData.append("pinataOptions", options);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          ...formData.getHeaders(),
        },
        maxBodyLength: Infinity,
      }
    );

    const { IpfsHash } = res.data;
    const url = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;

    // console.log("✅ Upload thành công:", url);
    return { hash: IpfsHash, url };
  } catch (err) {
    throw err;
  }
};

const deleteFile = async (hash) => {
  try {
    if (!hash) throw new Error("No IPFS hash provided");

    await axios.delete(`https://api.pinata.cloud/pinning/unpin/${hash}`, {
      headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
    });

    return { hash, status: "deleted" };
  } catch (err) {
    return {
      hash,
      status: "failed",
      message: err.response?.data || err.message,
    };
  }
};

const deleteFiles = async (hashes = []) => {
  try {
    if (!Array.isArray(hashes) || hashes.length === 0) {
      throw new Error("No IPFS hashes provided");
    }

    const limit = pLimit(5);
    const results = await Promise.all(
      hashes.map((hash) => limit(() => deleteFile(hash)))
    );

    return results;
  } catch (err) {
    throw err;
  }
};

module.exports = { uploadFile, deleteFile, deleteFiles };