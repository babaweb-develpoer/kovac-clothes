import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useCallback, useEffect, useState } from "react";
import Benefits from "./components/Benefits";
import CartDrawer, { ToastContainer } from "./components/CartDrawer";
import CartPage from "./components/CartPage";
import Collection from "./components/Collection";
import Cta from "./components/Cta";
import Faq from "./components/Faq";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Keynote from "./components/Keynote";
import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";
import Pricing from "./components/Pricing";
import ProductModal from "./components/ProductModal";
import ProductStory from "./components/ProductStory";
import Showcase from "./components/Showcase";
import SocialProof from "./components/SocialProof";
import Testimonials from "./components/Testimonials";
import Ticker from "./components/Ticker";
import { CartProvider, useCart } from "./context/CartContext";

function MainExperience() {
  const { activeView } = useCart();
  const [ready, setReady] = useState(false);
  const onPreloaderDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      anchors: { offset: -80 },
    });
    let rafId: number;
    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Preloader onDone={onPreloaderDone} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ember focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <Navbar />
      <CartDrawer />
      <ProductModal />
      <ToastContainer />

      <main id="main">
        {activeView === "cart" ? (
          <CartPage />
        ) : activeView === "story" ? (
          <ProductStory />
        ) : (
          <>
            <Hero ready={ready} />
            <Ticker />
            <SocialProof />
            <Collection />
            <Keynote />
            <Features />
            <Showcase />
            <Benefits />
            <Testimonials />
            <Pricing />
            <Faq />
            <Cta />
          </>
        )}
      </main>

      <Footer />

      {/* Film grain overlay */}
      <div
        className="grain pointer-events-none fixed inset-0 z-[90] opacity-[0.05] mix-blend-overlay"
        aria-hidden
      />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <MainExperience />
      </CartProvider>
    </MotionConfig>
  );
}
