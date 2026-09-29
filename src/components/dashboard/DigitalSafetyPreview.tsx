import React from 'react';
import { ShieldCheck, ScanText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DigitalSafetyPreview: React.FC = () => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1917]/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F62440]" />
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
              DIGITAL HARASSMENT SCANNER
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#78716C]">
            ON-DEVICE OCR
          </span>
        </div>

        <h4 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold mb-2">
          Analyze a message or screenshot
        </h4>
        <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed mb-6">
          Upload any suspicious text or screenshot to scan for intimidation patterns, stalking indicators,
          and secure it in your vault with zero cloud visual leaks.
        </p>
      </div>

      <div>
        <Link
          to="/digital-safety"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1C1917] text-[#FFFAF3] rounded-xl font-mono text-xs font-bold hover:bg-[#333] transition-colors"
        >
          <ScanText className="w-4 h-4 text-[#FFE5BF]" />
          <span>ANALYZE SOMETHING →</span>
        </Link>

        <div className="pt-3 border-t border-[#1C1917]/10 flex items-center justify-between text-[10px] font-mono text-[#78716C] mt-4">
          <span>PRIVATE PARSING</span>
          <span>1 SEC SCAN</span>
        </div>
      </div>
    </div>
  );
};
