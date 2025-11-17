"use client";
import { Snackbar, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface ToastNotifyProps {
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  open: boolean;
  onClose: () => void;
}

export default function ToastNotify({ message, severity = "info", open, onClose }: ToastNotifyProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          style={{ position: "fixed", top: 16, right: 16, zIndex: 9999 }}
        >
          <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
              {message}
            </Alert>
          </Snackbar>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
