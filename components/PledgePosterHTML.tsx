"use client";
import React, { forwardRef } from 'react';

// Similar prop structure to the old PledgePosterCanvas
interface Props {
  userName:      string;
  pledgeName:    string;
  date:          string;
  bgImageUrl:    string;
  orgLogoUrl?:   string | null;
  userPhotoUrl?: string | null;
  logoPosition?: string | null;
  isQuiz?:       boolean;
}

export const PledgePosterHTML = forwardRef<HTMLDivElement, Props>(
  ({ userName, pledgeName, date, bgImageUrl, userPhotoUrl, isQuiz = false }, ref) => {
    
    // Default fallback name
    const displayName = userName || "Your Name Here";

    // Dynamic text sizing based on name length
    const maxLen = Math.max(1, displayName.length);
    const nameFontSize = maxLen > 17 ? '18px' : '22px';

    const isSparrowQuiz = 
      pledgeName === 'House Sparrow Challenge' || 
      pledgeName === 'Reduce Single-Use Plastic' || 
      bgImageUrl?.includes('house-sparrow') || 
      bgImageUrl?.includes('no-plastic');

    return (
      <div 
        ref={ref}
        id="certificate-visual"
        className="w-full relative overflow-hidden flex flex-col items-center justify-center bg-white text-gray-900 mx-auto shadow-sm"
        style={{ aspectRatio: '1080/1600' }}
      >
        {/* Layer 1: Background Image */}
        <img 
          src={bgImageUrl} 
          alt="Background"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        {isSparrowQuiz ? (
          <>
            {/* House Sparrow Custom Layout */}
            
            {/* Dynamic User Photo (Polaroid Style, slightly rotated) */}
            <div 
              className="absolute top-[23%] left-[58.5%] w-[33%] aspect-square z-10 flex items-center justify-center bg-gray-100 overflow-hidden"
              style={{ transform: 'rotate(-4deg)' }}
            >
                <img 
                    src={userPhotoUrl || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover" 
                    alt="User Photo"
                />
            </div>

            {/* Dynamic User Name (Right Aligned below photo) */}
            <div className="absolute top-[56.5%] right-[5%] w-full z-10 flex items-center justify-end">
                <h2 
                    id="poster-name-element"
                    className="text-black font-bold tracking-tight leading-none text-right px-8 uppercase" 
                    style={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontSize: maxLen > 17 ? '28px' : '36px'
                    }}
                >
                    {displayName}
                </h2>
            </div>
          </>
        ) : (
          <>
            {/* Standard PledgeMarks Layout */}
            
            {/* Layer 2: Dynamic User Photo (Circular, Center-Left) */}
            <div className="absolute top-[30.3%] left-[26.1%] w-[40.8%] aspect-square rounded-full overflow-hidden z-10 flex items-center justify-center bg-gray-100/50">
                <img 
                    src={userPhotoUrl || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover" 
                    alt="User Photo"
                />
            </div>

            {/* Layer 3: Dynamic User Name */}
            <div className="absolute top-[59.94%] left-0 w-full z-10 flex items-center justify-center">
                <h2 
                    id="poster-name-element"
                    className="text-black font-bold tracking-wide leading-none w-full text-center px-8" 
                    style={{ 
                        fontFamily: '"Inria Serif", serif',
                        fontSize: nameFontSize 
                    }}
                >
                    {displayName}
                </h2>
            </div>
          </>
        )}

        {/* Quiz Specific Elements (if needed for identical templates - generic layout only) */}
        {isQuiz && !isSparrowQuiz && (
            <div className="absolute top-[65%] w-full text-center z-10">
                <p className="font-inter text-stone-800 font-medium italic" style={{ fontSize: '13px' }}>
                    {pledgeName}
                </p>
                <p className="font-inter text-stone-600 font-normal mt-1" style={{ fontSize: '10px' }}>
                    {date}
                </p>
            </div>
        )}

        {/* Watermark Layer - Kept generic for Pledgemarks */}
        {!isSparrowQuiz && (
          <div className="absolute z-40 right-[4%] bottom-[2%]">
              <span className="font-inter font-medium text-black/50" style={{ fontSize: '10px' }}>
                  pledgemarks.com
              </span>
          </div>
        )}
      </div>
    );
  }
);
PledgePosterHTML.displayName = 'PledgePosterHTML';
