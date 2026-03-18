import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UserData } from '../types';
import { ArrowRight, ShieldAlert, Play, BookOpen } from 'lucide-react';

interface PledgeReadingProps {
  userData: UserData;
  onBack: () => void;
  onConfirm: () => void;
}

// The pledge text to be read aloud (word by word)
// Breakdown of the pledge into individual points for the user to agree to
const PLEDGE_POINTS = [
  "I pledge to hoist the Indian National Flag correctly, with the saffron band on top.",
  "I pledge to display the Indian National Flag only on a proper staff or stand.",
  "I pledge to use Indian National Flags made from non-plastic, eco-friendly materials.",
  "I pledge to display the Indian National Flag only when it is clean, dignified, and in good condition.",
  "I pledge not to misuse the Indian National Flag as clothing, decoration, or for advertising purposes.",
  "I pledge not to print, write, paste, or place anything on the Indian National Flag.",
  "I pledge to ensure that the Indian National Flag never touches the ground, water, or any unclean surface.",
  "I pledge to handle, fold, and store the Indian National Flag with care and respect, strictly following the Flag Code of India.",
  "I pledge to collect Indian National Flags after events, ensure they are not left in public places.",
  "I pledge to dispose of damaged flags respectfully through proper methods such as private burning or burial."
];

export const PledgeReading: React.FC<PledgeReadingProps> = ({ userData, onBack, onConfirm }) => {
  // Store checked state for each point by index
  const [checkedPoints, setCheckedPoints] = useState<number[]>([]);

  const togglePoint = (index: number) => {
    if (checkedPoints.includes(index)) {
      setCheckedPoints(checkedPoints.filter(i => i !== index));
    } else {
      setCheckedPoints([...checkedPoints, index]);
    }
  };

  const handleSelectAll = () => {
    if (checkedPoints.length === PLEDGE_POINTS.length) {
      setCheckedPoints([]);
    } else {
      setCheckedPoints(PLEDGE_POINTS.map((_, i) => i));
    }
  };

  const allChecked = checkedPoints.length === PLEDGE_POINTS.length;

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-0 flex flex-col">
      {/* Top Bar */}
      <div className="px-4 mb-4 max-w-lg mx-auto w-full">
        <button onClick={onBack} className="text-stone-500 hover:text-stone-800 font-medium mb-4 block">
          ← Back to Preview
        </button>
        <h2 className="text-2xl font-display font-bold text-indiaNavy">Flag Code of India</h2>
        <p className="text-sm text-stone-500 mt-1">Read and acknowledge each point to continue.</p>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-hidden relative max-w-lg mx-auto w-full border border-stone-100 flex flex-col">

        {/* Header decoration */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-40">

          {/* Key Points - Do's and Don'ts */}
          <div className="grid grid-cols-1 gap-4">
            <section className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h3 className="font-display font-bold text-lg text-green-800 mb-2 flex items-center gap-2">
                ✅ Do's
              </h3>
              <ul className="space-y-1.5 text-xs md:text-sm text-stone-700">
                <li className="flex gap-2"><span className="text-green-600">✓</span> Treat the Flag with dignity.</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> Saffron band always at top.</li>
              </ul>
            </section>

            <section className="bg-red-50 p-4 rounded-xl border border-red-100">
              <h3 className="font-display font-bold text-lg text-red-800 mb-2 flex items-center gap-2">
                ❌ Don'ts
              </h3>
              <ul className="space-y-1.5 text-xs md:text-sm text-stone-700">
                <li className="flex gap-2"><span className="text-red-600">×</span> Never let flag touch ground.</li>
                <li className="flex gap-2"><span className="text-red-600">×</span> Don't use as costume/drapery.</li>
              </ul>
            </section>
          </div>

          {/* The Pledge Points */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-indiaNavy" />
                <h3 className="font-display font-bold text-lg text-indiaNavy">The Pledge</h3>
              </div>
              <button
                onClick={handleSelectAll}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wide"
              >
                {allChecked ? 'Unselect All' : 'Select All'}
              </button>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-3">
              {PLEDGE_POINTS.map((point, index) => {
                const isChecked = checkedPoints.includes(index);
                return (
                  <div
                    key={index}
                    onClick={() => togglePoint(index)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked
                      ? 'bg-white border-orange-200 shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-stone-100'
                      }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${isChecked
                      ? 'bg-orange-500 border-orange-500'
                      : 'bg-white border-stone-300'
                      }`}>
                      {isChecked && <CheckIcon />}
                    </div>
                    <p className={`text-sm leading-relaxed ${isChecked ? 'text-stone-900 font-medium' : 'text-stone-500'}`}>
                      {point}
                    </p>
                  </div>
                );
              })}
            </div>

          </section>
        </div>

        {/* Bottom Floating Action */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-stone-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-20">
          <button
            onClick={onConfirm}
            disabled={!allChecked}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${allChecked
              ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg hover:-translate-y-1'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
          >
            Take the Pledge <ShieldAlert size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
