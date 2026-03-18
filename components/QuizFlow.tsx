"use client";
import React, { useState, useRef, useCallback } from 'react';
import { Quiz, Question, AnswerOption } from '@prisma/client';
import { PledgePosterHTML } from './PledgePosterHTML';
import { downloadPoster, sharePoster } from '@/utils/downloadPoster';
import { Check, X, Loader2, Camera, Edit2, Pencil, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

type QuestionWithOptions = Omit<Question, 'quizId'> & {
  answerOptions: Omit<AnswerOption, 'isCorrect' | 'questionId'>[]
};
type QuizWithQuestions = Quiz & { questions: QuestionWithOptions[] };

type QuizStep = 'form' | 'quiz' | 'preview' | 'success';

interface UserData {
  fullName: string;
  email: string;
  whatsapp: string;
  photoUrl: string | null;
  agreed: boolean;
  orgId?: string;
}

export function QuizFlow({ quiz }: { quiz: QuizWithQuestions }) {
  const [currentStep, setCurrentStep] = useState<QuizStep>('form');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userData, setUserData] = useState<UserData>({ fullName: '', email: '', whatsapp: '', photoUrl: null, agreed: true });
  const [scoreData, setScoreData] = useState<{ score: number, total: number } | null>(null);

  const goToStep = (step: QuizStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(step);
      window.scrollTo(0, 0);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 16);
  };

  return (
    <div className="min-h-screen relative bg-stone-50">
      <main className={`relative z-10 w-full transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {currentStep === 'form' && (
          <QuizForm
            quiz={quiz}
            onSubmit={(data) => { setUserData(data); goToStep('quiz'); }}
          />
        )}
        {currentStep === 'quiz' && (
          <QuizEngine
            quiz={quiz}
            userData={userData}
            onComplete={(answersRecord, scoreRes) => {
              setScoreData(scoreRes);
              goToStep('preview');
            }}
          />
        )}
        {currentStep === 'preview' && (
          <QuizCertPreview
            quiz={quiz}
            userData={userData}
            scoreData={scoreData}
            onRetake={() => {
              setScoreData(null);
              goToStep('form');
            }}
            onConfirm={() => goToStep('success')}
          />
        )}
        {currentStep === 'success' && (
          <QuizSuccess
            quiz={quiz}
            userData={userData}
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
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h3 className="font-bold text-stone-900 flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-sky-500"/> Adjust Photo
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
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

        <div className="px-6 py-4 bg-white flex items-center justify-between gap-4 border-t border-slate-100">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Zoom</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="p-4 bg-white flex justify-end gap-3 border-t border-slate-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 shadow-md transition-colors">
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizForm({ quiz, onSubmit }: { quiz: QuizWithQuestions, onSubmit: (data: UserData) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserData>({
    fullName: '',
    email: '',
    whatsapp: '',
    photoUrl: null,
    agreed: true
  });

  const isValid = formData.fullName.length > 2 && formData.email.includes('@') && formData.email.includes('.') && formData.whatsapp.length > 5;

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
    setFormData(prev => ({ ...prev, photoUrl: croppedImage }));
    setRawImageSrc(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit(formData);
  };

  return (
    <>
      {rawImageSrc && (
        <PhotoCropModal 
          imageSrc={rawImageSrc} 
          onClose={() => setRawImageSrc(null)} 
          onCropSave={handleCropSave} 
        />
      )}

      <div className="min-h-[90vh] bg-stone-50 pt-16 pb-12 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 relative text-center">
            
            <div className="inline-block px-4 py-1.5 rounded-full bg-sky-50 text-sky-600 font-bold text-[10px] uppercase tracking-widest mb-4">
              QUIZ: {quiz.title.toUpperCase()}
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
                  <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${formData.photoUrl ? 'bg-white shadow-md' : 'bg-slate-50 border-2 border-slate-100'}`}>
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} className="w-full h-full object-cover" alt="User" />
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
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="hover:text-sky-600 transition-colors uppercase">Upload Photo</button>
                  <span className="text-slate-300 text-lg font-light">|</span>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="hover:text-sky-600 transition-colors uppercase">Use Camera</button>
                </div>
              </div>

              {/* Inputs Section */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
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
                        required
                        value={formData.whatsapp}
                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                        className="flex-1 bg-transparent border-none px-5 py-4 text-stone-700 placeholder-slate-400 outline-none"
                        placeholder="98765 43210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-stone-700 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer group mt-6 pt-4">
                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${formData.agreed ? 'bg-orange-500 border-orange-500' : 'bg-slate-50 border-slate-300 group-hover:border-slate-400'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={formData.agreed} 
                      onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })} 
                    />
                    {formData.agreed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm text-stone-600 leading-snug select-none">
                    I agree to receive information about similar initiatives in the future. (Optional)
                  </span>
                </label>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={!isValid}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg transform active:scale-[0.98]
                      ${isValid 
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    Start Quiz <span className="ml-1">›</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  </>
  );
}

function QuizEngine({ quiz, userData, onComplete }: {
  quiz: QuizWithQuestions,
  userData: UserData,
  onComplete: (answers: Record<string, string>, scoreRes: { score: number, total: number }) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<'idle' | 'selected' | 'verifying' | 'revealed'>('idle');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = quiz.questions[currentIndex];

  const isCorrect = selectedOptionId === correctOptionId;
  const mood = answerState === 'revealed' ? (isCorrect ? 'happy' : 'sad') : 'neutral';
  const moodColor = mood === 'neutral' ? 'bg-slate-200' : (mood === 'happy' ? 'bg-green-500' : 'bg-red-400');

  const handleSelect = (aId: string) => {
    if (answerState !== 'idle') return;
    setSelectedOptionId(aId);
    setAnswerState('selected');
  };

  const handleConfirm = async () => {
    if (answerState !== 'selected' || !selectedOptionId) return;
    setAnswerState('verifying');

    try {
      const res = await fetch('/api/verify-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, optionId: selectedOptionId })
      });
      const data = await res.json();
      setCorrectOptionId(data.correctOptionId);
      setAnswerState('revealed');

      setTimeout(async () => {
        const newAnswers = { ...answers, [question.id]: selectedOptionId };
        setAnswers(newAnswers);

        if (currentIndex < quiz.questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setAnswerState('idle');
          setSelectedOptionId(null);
          setCorrectOptionId(null);
        } else {
          const attemptRes = await fetch('/api/quiz-attempts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quizId: quiz.id,
              userName: userData.fullName,
              userEmail: userData.email,
              whatsapp: userData.whatsapp,
              agreed: userData.agreed,
              orgId: userData.orgId,
              answers: newAnswers
            })
          });
          const attemptData = await attemptRes.json();
          onComplete(newAnswers, { score: attemptData.score, total: attemptData.totalQuestions });
        }
      }, 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const progress = ((currentIndex) / quiz.questions.length) * 100;

  return (
    <div className="min-h-[90vh] bg-stone-50 pt-16 pb-12 px-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-12 max-w-xl mx-auto w-full relative">
        <div className={`fixed bottom-6 right-6 w-12 h-12 rounded-full transition-colors duration-500 shadow-lg ${moodColor}`} />

        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-slate-500 mb-3">
            <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h2 className="text-2xl font-inter font-bold text-stone-900 mb-8">{question.text}</h2>

        <div className="space-y-3 mb-8">
          {question.answerOptions.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isActuallyCorrect = correctOptionId === opt.id;

            let optStyle = "border-slate-200 hover:border-sky-400 hover:bg-slate-50";
            if (answerState === 'selected') {
              optStyle = isSelected ? "border-sky-400 ring-2 ring-sky-400/20 bg-sky-50 scale-[1.02]" : "border-slate-200 opacity-75";
            } else if (answerState === 'verifying') {
              optStyle = isSelected ? "border-sky-400 ring-2 ring-sky-400/20 bg-sky-50 animate-pulse" : "border-slate-200 opacity-50";
            } else if (answerState === 'revealed') {
              if (isActuallyCorrect) {
                optStyle = "border-green-500 bg-green-50 scale-[1.02] text-green-900";
              } else if (isSelected && !isActuallyCorrect) {
                optStyle = "border-red-500 bg-red-50 text-red-900";
              } else {
                optStyle = "border-slate-200 opacity-50 blur-[1px]";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={answerState !== 'idle'}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium text-stone-800 flex justify-between items-center ${optStyle}`}
              >
                <span>{opt.text}</span>
                {answerState === 'revealed' && isActuallyCorrect && <Check className="w-5 h-5 text-green-600" />}
                {answerState === 'revealed' && isSelected && !isActuallyCorrect && <X className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        <div className="h-16 flex items-center justify-center">
          {answerState === 'selected' && (
            <button onClick={handleConfirm} className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg hover:-translate-y-0.5 text-white font-bold transition-all transform shadow-blue-500/30">
              Submit Answer
            </button>
          )}
          {answerState === 'verifying' && (
            <div className="flex items-center text-sky-600 font-medium">
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
              Verifying Answer...
            </div>
          )}
          {answerState === 'revealed' && (
            <div className="text-slate-500 font-medium animate-pulse">
              {currentIndex < quiz.questions.length - 1 ? "Next question coming..." : "Calculating final score..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizCertPreview({ 
  quiz, 
  userData, 
  scoreData, 
  onRetake,
  onConfirm
}: { 
  quiz: QuizWithQuestions, 
  userData: UserData, 
  scoreData: { score: number, total: number } | null, 
  onRetake: () => void,
  onConfirm: () => void
}) {
  const today = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden w-full max-w-5xl mx-auto flex flex-col md:flex-row min-h-[70vh]">
      <div className="p-10 md:w-2/5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
        <h2 className="text-3xl font-display font-bold text-stone-900 mb-2">Quiz Complete!</h2>
        <p className="text-slate-600 mb-8">You&apos;ve unlocked your certificate of completion.</p>

        {scoreData && (
          <div className="bg-white rounded-[1.5rem] p-6 border border-slate-200 mb-10 shadow-sm text-center">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Your Score</div>
            <div className="text-5xl font-mono font-bold text-sky-500">
              {scoreData.score} <span className="text-2xl text-slate-300">/ {scoreData.total}</span>
            </div>
          </div>
        )}

        <div className="space-y-4 mt-auto">
          <button
            onClick={onConfirm}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold hover:shadow-lg hover:-translate-y-1 transition-all shadow-blue-500/30 flex justify-center items-center gap-2"
          >
            Generate My Certificate <Check className="w-4 h-4" strokeWidth={3} />
          </button>
          <button
            onClick={onRetake}
            className="w-full py-4 px-6 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors bg-white"
          >
            Retake Quiz
          </button>
        </div>
      </div>

      <div className="p-10 md:w-3/5 bg-stone-50 flex items-center justify-center">
        <div className="w-full max-w-sm shadow-2xl shadow-sky-900/10 ring-1 ring-slate-100 rounded-[1.5rem] overflow-hidden pointer-events-none bg-white">
          <PledgePosterHTML
            userName={userData.fullName}
            pledgeName={quiz.title}
            date={today}
            bgImageUrl={quiz.bgImageUrl}
            userPhotoUrl={userData.photoUrl}
            isQuiz={true}
          />
        </div>
      </div>
    </div>
  );
}

function QuizSuccess({ quiz, userData }: { quiz: QuizWithQuestions, userData: UserData }) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const today = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());

  const handleDownload = async () => {
    setIsProcessing(true);
    if (posterRef.current) await downloadPoster(posterRef.current, userData.fullName, 'Quiz');
    setIsProcessing(false);
  };

  const handleShare = async () => {
    setIsProcessing(true);
    if (posterRef.current) await sharePoster(posterRef.current, userData.fullName, window.location.href);
    setIsProcessing(false);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-12 text-center max-w-2xl mx-auto w-full relative">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-in shadow-sm border border-green-100">
        <Check className="w-10 h-10 text-green-500" strokeWidth={2.5} />
      </div>
      
      <h2 className="text-4xl font-display font-bold text-stone-900 mb-3 tracking-tight">Your Certificate is Ready! <span className="ml-1">🎉</span></h2>
      <p className="text-slate-500 mb-10 text-lg">Great job, <span className="font-bold text-stone-900">{userData.fullName}</span>! Your achievement is now officially recognized.</p>

      <div className="max-w-[320px] mx-auto mb-10 shadow-2xl shadow-sky-900/10 ring-1 ring-slate-100 rounded-[1.5rem] overflow-hidden pointer-events-none bg-white">
        <PledgePosterHTML
          ref={posterRef}
          userName={userData.fullName}
          pledgeName={quiz.title}
          date={today}
          bgImageUrl={quiz.bgImageUrl}
          userPhotoUrl={userData.photoUrl}
          isQuiz={true}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-10">
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

      <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center text-sm font-medium">
        <Link href="/quiz" className="text-sky-500 hover:text-sky-600 transition-colors flex items-center">
          Take Another Quiz →
        </Link>
        <span className="hidden sm:inline text-slate-300">|</span>
        <Link href="/" className="text-slate-500 hover:text-stone-900 transition-colors flex items-center">
          Return Home →
        </Link>
      </div>
    </div >
  );
}
