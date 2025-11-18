const db = require("../models");

const generateCode =  async (name, text) => {
   const counter = await db.Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seqString = String(counter.seq).padStart(5, '0');
  return `${text}${seqString}`;
}

module.exports = generateCode
