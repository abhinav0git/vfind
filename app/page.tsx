"use client"

import LandingPage from "./landing-page"
import { useEffect } from "react";

export default function SyntheticV0PageForDeployment() {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);
  return <LandingPage />
}