import "./venox.css";
import { MotionConfig } from "framer-motion";
import LoadingScreen from "@/components/venox/LoadingScreen";
import Navbar from "@/components/venox/Navbar";
import Hero from "@/components/venox/Hero";
import CapabilityStrip from "@/components/venox/CapabilityStrip";
import Partnership from "@/components/venox/Partnership";
import Disciplines from "@/components/venox/Disciplines";
import ProcessSection from "@/components/venox/ProcessSection";
import Engagement from "@/components/venox/Engagement";
import Solutions from "@/components/venox/Solutions";
import Ecosystem from "@/components/venox/Ecosystem";
import VenoxShowpiece from "@/components/venox/VenoxShowpiece";
import CtaSection from "@/components/venox/CtaSection";
import Footer from "@/components/venox/Footer";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="venox">
        <LoadingScreen />
        <Navbar />
        <main>
          <Hero />
          <CapabilityStrip />
          <Partnership />
          <Disciplines />
          <ProcessSection />
          <Engagement />
          <Solutions />
          <Ecosystem />
          <VenoxShowpiece />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}