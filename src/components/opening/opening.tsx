import React from "react";
import Navbar from "./navbar";
import ExploreUs from "./about";
import FeaturesFlow from "./features";
import WorkflowSection from "./workflow";
import SupplyChainHero from "./top/herosection";
import { Box } from "@mui/material";
import Footer from "../auth/layout/footer/footer";

const Opening = () => {
  return (
    <Box id="Opening">
      <Navbar />

      <section id="health-hero">
        <SupplyChainHero />
      </section>

      <section id="explore-us">
        <ExploreUs />
      </section>

      <section id="features-section">
        <FeaturesFlow />
      </section>

      <section id="workflow-section">
        <WorkflowSection />
      </section>

      <Footer />
    </Box>
  );
};

export default Opening;
