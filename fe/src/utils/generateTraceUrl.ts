export const generateTraceUrl = (batchCode: string, token: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) throw new Error("❌ NEXT_PUBLIC_BASE_URL chưa được set");

  const url = `${baseUrl}/trace/${encodeURIComponent(batchCode)}?token=${encodeURIComponent(token)}`;
  console.log("Generated Trace URL:", url);
  return url;
};
