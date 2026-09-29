import React from 'react';
import { Navbar } from '../components/Navbar';
import { CustomCursor } from '../components/visual/CustomCursor';
import { ScrollProgress } from '../components/animation/ScrollProgress';
import { PixelBlast } from '../components/ui/PixelBlast';
import { HeroJourney } from '../components/landing/HeroJourney';
import { SentinelExpand } from '../components/landing/SentinelExpand';
import { ScrollStory } from '../components/landing/ScrollStory';
import { SafetyLoop } from '../components/landing/SafetyLoop';
import { WalkWithMeStory } from '../components/landing/WalkWithMeStory';
import { CopilotStory } from '../components/landing/CopilotStory';
import { DigitalSafetyStory } from '../components/landing/DigitalSafetyStory';
import { IncidentVaultStory } from '../components/landing/IncidentVaultStory';
import { SafetyScoreStory } from '../components/landing/SafetyScoreStory';
import { ManualSOSStory } from '../components/landing/ManualSOSStory';
import { PrivacyStory } from '../components/landing/PrivacyStory';
import { WhatItIsNot } from '../components/landing/WhatItIsNot';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFAF3] text-[#171515] selection:bg-[#FFE5BF] selection:text-[#171515] overflow-x-clip relative">
      {/* Whole Background Interactive PixelBlast from React Bits */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <PixelBlast
          variant="circle"
          pixelSize={5}
          color="#3d2b1f"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={2}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={3}
          edgeFade={0.24}
          transparent
        />
      </div>

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Floating Scroll Story Progress Indicator */}
      <ScrollProgress />

      {/* Editorial Sticky Navigation */}
      <Navbar />

      <main className="relative z-10">
        {/* 01. The Signature Hero Journey — IVORY */}
        <HeroJourney />

        {/* 02. The Autonomous Sentinel ($10k Theme ScrollExpand with TechText) — OBSIDIAN */}
        <SentinelExpand />

        {/* 03. The Human Problem ("9:40 PM") — CREAM */}
        <ScrollStory />

        {/* 03. Core Safety Loop (DETECT -> VERIFY -> GUIDE -> PROTECT -> DOCUMENT) — PEACH */}
        <SafetyLoop />

        {/* 04. Signature Interactive Walk With Me Simulation — IVORY */}
        <WalkWithMeStory />

        {/* 05. Contextual Safety Copilot & Safe Havens Proximity — CREAM */}
        <CopilotStory />

        {/* 06. Digital Safety (Transition from Road to Screen) — IVORY */}
        <DigitalSafetyStory />

        {/* 07. Tamper-Evident Private Incident Vault — CREAM */}
        <IncidentVaultStory />

        {/* 08. Explainable Signals Risk Index — IVORY */}
        <SafetyScoreStory />

        {/* 09. Unconditional Manual SOS — PEACH */}
        <ManualSOSStory />

        {/* 10. Privacy Sovereignty ("You Stay In Control") — CREAM */}
        <PrivacyStory />

        {/* 11. Honest Boundaries ("What SakhiShield Is Not") — IVORY */}
        <WhatItIsNot />

        {/* 12. Final Emotional Climax ("Go where you need to go") — PEACH */}
        <FinalCTA />
      </main>

      {/* Editorial Dark Footer — INK */}
      <Footer />
    </div>
  );
};

export default LandingPage;
