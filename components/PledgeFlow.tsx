"use client";
import React, { useState, useCallback, useRef } from 'react';
import { Pledge, PledgeCommitment } from '@prisma/client';
import { PledgePosterHTML } from './PledgePosterHTML';
import { downloadPoster, sharePoster } from '@/utils/downloadPoster';
import { Check, Loader2, Camera, ArrowLeft, Edit2, X, Pencil, Share2, Download, RefreshCw, CheckCircle } from 'lucide-react';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

type PledgeWithCommitments = Pledge & { commitments: PledgeCommitment[] };
type PledgeStep = 'details' | 'preview' | 'commitments' | 'success';

interface UserData {
  fullName: string;
  whatsapp: string;
  email: string;
  photoUrl: string | null;
  agreed: boolean;
}

export function PledgeFlow({ pledge }: { pledge: PledgeWithCommitments }) {
  const [currentStep, setCurrentStep]         = useState<PledgeStep>('details');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userData, setUserData]               = useState<UserData>({ fullName: '', whatsapp: '', email: '', photoUrl: null, agreed: true });

  const goToStep = (step: PledgeStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(step);
      window.scrollTo(0, 0);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  return (
    <div className="min-h-screen relative bg-stone-50">
      <main className={`relative z-10 w-full transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        
        {currentStep === 'details' && (
          <PledgeDetails 
            pledge={pledge}
            userData={userData}
            onChange={(d) => setUserData({...userData, ...d})}
            onNext={() => goToStep('preview')} 
          />
        )}

        {currentStep === 'preview' && (
          <PledgePreview 
            pledge={pledge} 
            userData={userData}
            onBack={() => goToStep('details')}
            onConfirm={() => goToStep('commitments')} 
          />
        )}

        {currentStep === 'commitments' && (
          <PledgeCommitments 
            pledge={pledge} 
            userData={userData}
            onBack={() => goToStep('preview')}
            onSuccess={() => goToStep('success')} 
          />
        )}

        {currentStep === 'success' && (
          <PledgeSuccess 
            pledge={pledge} 
            userData={userData} 
            onReturnHome={() => window.location.href = '/'}
          />
        )}
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// Photo Crop Modal Component
// -------------------------------------------------------------
function PhotoCropModal({ 
  imageSrc, 
  onClose, 
  onCropSave 
}: { 
  imageSrc: string; 
  onClose: () => void; 
  onCropSave: (croppedImage: string) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) onCropSave(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-[1.5rem] w-full max-w-md overflow-hidden flex flex-col items-stretch">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <h3 className="font-bold text-[#1e1b4b] flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-[#f97316]"/> Adjust Photo
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative w-full h-[300px] sm:h-[400px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="px-6 py-4 bg-white flex items-center justify-between gap-4 border-t border-gray-100">
          <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Zoom</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f97316] hover:accent-[#ea580c] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20"
          />
        </div>

        <div className="p-4 bg-white flex justify-end gap-3 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#1e1b4b] text-white font-bold hover:bg-[#312e81] shadow-md transition-colors">
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Step 1: User Details (Form + Photo)
// -------------------------------------------------------------
function PledgeDetails({ userData, onChange, onNext }: { userData: UserData, onChange: (d: Partial<UserData>) => void, onNext: () => void, pledge: PledgeWithCommitments }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setRawImageSrc(event.target?.result as string);
      reader.readAsDataURL(file);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropSave = (croppedImage: string) => {
    onChange({ photoUrl: croppedImage });
    setRawImageSrc(null);
  };

  const isValid = userData.fullName.length > 2 && userData.email.includes('@') && userData.email.includes('.') && userData.whatsapp.length > 5;

  return (
    <>
      {rawImageSrc && (
        <PhotoCropModal 
          imageSrc={rawImageSrc} 
          onClose={() => setRawImageSrc(null)} 
          onCropSave={handleCropSave} 
        />
      )}

      <div className="min-h-screen bg-stone-50 pt-20 pb-12 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 relative text-center">
            
            <div className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 font-bold text-[10px] uppercase tracking-widest mb-4">
              Step 1 of 3
            </div>

            <h2 className="text-4xl font-display font-bold text-stone-900 text-center mb-10 mt-2">
              Enter Details
            </h2>
            
            <div className="flex flex-col gap-8 text-left">
              {/* Photo Upload Area */}
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-32 h-32 mb-5 group cursor-pointer"
                >
                  <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${userData.photoUrl ? 'bg-white shadow-md' : 'bg-slate-50 border-2 border-slate-100'}`}>
                    {userData.photoUrl ? (
                      <img src={userData.photoUrl} className="w-full h-full object-cover" alt="User" />
                    ) : (
                      <Camera className="text-slate-400 opacity-50" size={36} strokeWidth={1.5} />
                    )}
                  </div>
                  
                  {/* Edit Button Bubble */}
                  <div className="absolute bottom-1 right-1 w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center border-[3px] border-white shadow-sm transition-transform group-hover:scale-110">
                    <Pencil size={14} className="text-white fill-white" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                
                <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-sky-500">
                  <button onClick={() => fileInputRef.current?.click()} className="hover:text-sky-600 transition-colors uppercase">Upload Photo</button>
                  <span className="text-slate-300 text-lg font-light">|</span>
                  <button onClick={() => fileInputRef.current?.click()} className="hover:text-sky-600 transition-colors uppercase">Use Camera</button>
                </div>
              </div>

              {/* Inputs Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={userData.fullName}
                    onChange={e => onChange({ fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-stone-700 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">WhatsApp</label>
                    <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-sky-100 focus-within:border-sky-400 focus-within:bg-white transition-all">
                      <div className="bg-slate-100 px-4 flex items-center text-stone-600 font-medium border-r border-slate-200 justify-center">
                        +91
                      </div>
                      <input 
                        type="tel" 
                        value={userData.whatsapp}
                        onChange={e => onChange({ whatsapp: e.target.value.replace(/\D/g, '') })}
                        className="flex-1 bg-transparent border-none px-5 py-4 text-stone-700 placeholder-slate-400 outline-none"
                        placeholder="98765 43210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Email</label>
                    <input 
                      type="email" 
                      value={userData.email}
                      onChange={e => onChange({ email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-stone-700 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer group mt-6 pt-4">
                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${userData.agreed ? 'bg-orange-500 border-orange-500' : 'bg-slate-50 border-slate-300 group-hover:border-slate-400'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={userData.agreed} 
                      onChange={(e) => onChange({ agreed: e.target.checked })} 
                    />
                    {userData.agreed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm text-stone-600 leading-snug select-none">
                    I agree to receive information about similar initiatives in the future. (Optional)
                  </span>
                </label>
              </div>

              <div className="pt-4">
                <button 
                  onClick={onNext}
                  disabled={!isValid}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg transform active:scale-[0.98]
                    ${isValid 
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  Continue <span className="ml-1">›</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// Step 2: Preview
// -------------------------------------------------------------
function PledgePreview({ userData, pledge, onBack, onConfirm }: { userData: UserData, pledge: PledgeWithCommitments, onBack: () => void, onConfirm: () => void }) {
  const today = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());

  return (
    <div className="min-h-screen bg-stone-50 pt-16 pb-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 text-center relative border border-slate-100">
          
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 font-bold text-[10px] uppercase tracking-widest mb-6">
            Step 2 of 3
          </div>
          
          <h2 className="text-3xl font-display font-bold text-stone-900 mb-2 tracking-tight">Preview Certificate</h2>
          <p className="text-sm text-slate-500 mb-10">Review your details carefully. This is how your certificate will look.</p>
          
          <div className="max-w-[400px] mx-auto mb-10 shadow-2xl shadow-sky-900/10 rounded-[1.5rem] overflow-hidden bg-white ring-1 ring-slate-100">
            <PledgePosterHTML 
              userName={userData.fullName}
              pledgeName={pledge.name}
              date={today}
              bgImageUrl={pledge.bgImageUrl}
              userPhotoUrl={userData.photoUrl}
            />
          </div>

          <div className="flex gap-4 max-w-[400px] mx-auto">
            <button 
              onClick={onBack}
              className="flex-[0.35] py-4 rounded-xl border-2 border-slate-100 text-slate-700 font-bold hover:bg-slate-50 transition-colors bg-white flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400"/> Edit
            </button>
            <button 
              onClick={onConfirm}
              className="flex-[0.65] py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Looks Good <Check className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Step 3: Commitments (The Checkboxes) & Submission
// -------------------------------------------------------------
function PledgeCommitments({ pledge, userData, onBack, onSuccess }: { pledge: PledgeWithCommitments, userData: UserData, onBack: () => void, onSuccess: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const allChecked  = pledge.commitments.length > 0 && pledge.commitments.every(c => checked[c.id]);

  const handleSelectAll = () => {
    const next = !allChecked;
    setChecked(Object.fromEntries(pledge.commitments.map(c => [c.id, next])));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pledgeId: pledge.id,
          userName: userData.fullName,
          userEmail: userData.email,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit your pledge. Please try again.');
      }

      onSuccess();
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-16 pb-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative flex flex-col min-h-[70vh]">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
            <button onClick={onBack} className="text-slate-400 hover:text-stone-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-[17px] font-bold text-stone-900 absolute left-1/2 -translate-x-1/2">The Pledge</h2>
            <button 
              onClick={handleSelectAll} 
              className="text-[11px] font-bold text-sky-500 hover:text-sky-600 uppercase tracking-wider relative group"
            >
              {allChecked ? 'DESELECT ALL' : 'SELECT ALL'}
            </button>
          </div>
          
          {/* Commitment List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-32">
            {pledge.commitments.map((c) => (
              <label key={c.id} className="flex items-start gap-4 cursor-pointer group">
                <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${checked[c.id] ? 'bg-sky-500 border-sky-500' : 'border-slate-300 bg-white group-hover:border-sky-500'}`}>
                  {checked[c.id] && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className={`text-[15px] leading-snug select-none transition-colors ${checked[c.id] ? 'text-stone-900 font-medium' : 'text-slate-500 group-hover:text-stone-700'}`}>
                  {c.text}
                </span>
              </label>
            ))}
          </div>

          {/* Floating Action Bar */}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent pt-16 mt-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center font-medium animate-shake">
                {error}
              </div>
            )}
            <button 
              onClick={handleSubmit}
              disabled={!allChecked || isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2
                ${allChecked 
                  ? 'bg-stone-900 text-white hover:bg-black shadow-lg shadow-stone-900/20' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'}`}
            >
              {isSubmitting ? (
                 <><Loader2 className="w-5 h-5 animate-spin"/> Processing...</>
              ) : (
                `Take the Pledge ${allChecked ? "→" : ""}`
              )}
            </button>
            {!allChecked && <p className="text-center text-xs text-slate-400 mt-3">Select all to continue</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Step 4: Success
// -------------------------------------------------------------
function PledgeSuccess({ pledge, userData, onReturnHome }: { pledge: PledgeWithCommitments, userData: UserData, onReturnHome: () => void }) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const today = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());

  const handleDownload = async () => {
    setIsProcessing(true);
    if (posterRef.current) await downloadPoster(posterRef.current, userData.fullName);
    setIsProcessing(false);
  };

  const handleShare = async () => {
    setIsProcessing(true);
    if (posterRef.current) await sharePoster(posterRef.current, userData.fullName, window.location.href);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-16 pb-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl text-center pt-8">
        
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-in shadow-sm border border-green-100">
          <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={2.5} />
        </div>
        
        <h2 className="text-4xl font-display font-bold text-stone-900 mb-3 tracking-tight">Pledge Taken! <span className="ml-1">🎉</span></h2>
        <p className="text-slate-500 mb-10 text-lg">Thank you, <span className="font-bold text-stone-900">{userData.fullName}</span>.<br/>You have successfully pledged to honor the impact.</p>
        
        <div className="max-w-[400px] mx-auto mb-10 shadow-2xl shadow-sky-900/10 rounded-[1.5rem] overflow-hidden pointer-events-none bg-white ring-1 ring-slate-100">
           <PledgePosterHTML 
            ref={posterRef}
            userName={userData.fullName}
            pledgeName={pledge.name}
            date={today}
            bgImageUrl={pledge.bgImageUrl}
            userPhotoUrl={userData.photoUrl}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-[400px] mx-auto mb-8">
          <button 
            onClick={handleDownload}
            disabled={isProcessing}
            className="flex-1 py-4.5 rounded-xl border-2 border-slate-200 text-stone-700 font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center text-[15px] bg-white group disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 mr-2 text-sky-500 animate-spin" /> : <Download className="w-5 h-5 mr-2 text-slate-400 group-hover:text-stone-700 transition-colors" />} 
            <span>{isProcessing ? 'Processing' : 'Download'}</span>
          </button>
          <button 
            onClick={handleShare}
            disabled={isProcessing}
            className="flex-1 py-4.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center text-[15px] shadow-blue-500/30 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Share2 className="w-5 h-5 mr-2" />} 
            <span>{isProcessing ? 'Processing' : 'Share'}</span>
          </button>
        </div>
        
        <div className="max-w-[400px] mx-auto pb-10">
          <button 
            onClick={onReturnHome}
            className="w-full py-4.5 rounded-xl bg-stone-900 text-white font-bold hover:bg-black transition-colors flex items-center justify-center text-[15px] shadow-lg shadow-stone-900/20"
          >
            <RefreshCw className="w-5 h-5 mr-2 opacity-70" /> Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
