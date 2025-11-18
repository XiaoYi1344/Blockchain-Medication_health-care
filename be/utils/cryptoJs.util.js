const CryptoJS = require("crypto-js");

const hashData = (data) => {
   const sorted = typeof data === "object" && !Array.isArray(data)
      ? Object.keys(data).sort().reduce((obj, key) => {
         obj[key] = data[key];
         return obj;
      }, {})
      : data;
   const text = typeof data === "string" ? sorted : JSON.stringify(sorted);
   return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
};

const verifyHash = (data, hash) => {
   const newHash = hashData(data);
   return newHash === hash;
};

function cleanMongooseDoc(doc) {
   if (!doc) return doc;

   const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;

   if (Array.isArray(obj)) {
      return obj.map(v => cleanMongooseDoc(v));
   }

   if (typeof obj === 'object' && obj !== null) {
      const keys = Object.keys(obj);
      const isNumericKeys = keys.every(k => /^\d+$/.test(k));
      if (isNumericKeys) {
         return keys.map(k => cleanMongooseDoc(obj[k]));
      }

      const cleaned = {};
      for (const [key, value] of Object.entries(obj)) {
         if (key === '_id' || key === '__v') continue;
         cleaned[key] = cleanMongooseDoc(value);
      }
      return cleaned;
   }

   return obj;
}

module.exports = { hashData, verifyHash, cleanMongooseDoc };