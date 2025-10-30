// import { Stack, Button } from "@mui/material";
// import QRCode from "qrcode.react";
// import { useEffect, useRef } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";

// interface QRWidgetProps {
//   value: string;
// }

// export const QRWidget = ({ value }: QRWidgetProps) => {
//   const scannerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const scanner = new Html5QrcodeScanner(scannerRef.current?.id || "", { fps: 10, qrbox: 250 });
//     scanner.render((decodedText) => console.log("QR Code:", decodedText));
//     return () => scanner.clear().catch(() => {});
//   }, []);

//   return (
//     <Stack spacing={2}>
//       <QRCode value={value} size={128} />
//       <div id="qr-scanner" ref={scannerRef}></div>
//       <Button variant="outlined" onClick={() => window.print()}>Print QR</Button>
//     </Stack>
//   );
// };
