"use client";

import { useSession } from "next-auth/react";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";
import Categories from "@/components/landing/Categories";
import FeaturedListings from "@/components/landing/FeaturedListings";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import WhyChooseUs from "@/components/landing/WhyChooseUs";

export default function LandingPage() {
  const { data: session } = useSession(); // get session

  const isGuest = !session; // true if not logged in

  return (
    <main className="text-black/80">
      <HeroSection />
      <Categories initialType="sale" showModalButton={true} enablePagination={false} />
      <FeaturedListings />
      <FeaturesSection />
      <HowItWorks />
      <CTASection show={isGuest} /> {/* Only show if guest */}
      <Testimonials />
      <WhyChooseUs />
    </main>
  );
}
