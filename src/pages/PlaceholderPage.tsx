import React from 'react';
import { AppShell } from '../components/app/AppShell';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  icon?: LucideIcon;
  stepNumber?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle,
  description,
  category,
  icon: Icon = ShieldCheck,
  stepNumber = 'STEP 3',
}) => {
  return (
    <AppShell title={title} subtitle={subtitle}>
      <div className="space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#57534E] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO DASHBOARD</span>
          </Link>
          <span className="font-mono text-xs px-2.5 py-0.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded text-[#1C1917] font-bold">
            {stepNumber} PIPELINE
          </span>
        </div>

        {/* Clean Feature Stage Box */}
        <div className="p-8 sm:p-12 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] text-center max-w-2xl mx-auto my-12 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center mx-auto mb-4 text-[#1C1917]">
            <Icon className="w-8 h-8 text-[#1C1917]" />
          </div>

          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
            {category}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-bold mb-3">
            {title}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed max-w-md mx-auto mb-8">
            {description}
          </p>

          <div className="p-4 bg-[#FFF2DB]/60 border border-[#1C1917]/10 rounded-xl text-xs font-mono text-[#57534E] max-w-sm mx-auto mb-8 flex items-center gap-2 text-left">
            <Clock className="w-4 h-4 text-[#1C1917] shrink-0" />
            <span>This module architecture is connected to the application shell and ready for functional integration.</span>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1917] text-[#FFFAF3] rounded-xl font-mono text-xs font-bold hover:bg-[#333] transition-colors"
          >
            <span>RETURN TO DASHBOARD</span>
          </Link>
        </div>

      </div>
    </AppShell>
  );
};

export default PlaceholderPage;
