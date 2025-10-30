"use client";
import { useEffect } from "react";
import AOS from "aos";

export default function useAOS() {
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      AOS.init({ duration: 1000, once: true });
    }

    return () => {
      isMounted = false;
      // optionally reset AOS if needed
    };
  }, []);
}
