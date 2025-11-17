// tiny helper to build a QR payload url for a batch
export function buildBatchPublicUrl(base: string, batchCode: string) {
  // base: e.g. https://trace.example.com
  return `${base.replace(/\/$/, "")}/batches/${encodeURIComponent(batchCode)}`;
}
