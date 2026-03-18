import React from 'react';
import { X, Shield, Lock, Eye } from 'lucide-react';

interface PrivacyPolicyProps {
    onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-2">
                        <Shield size={20} className="text-orange-500" />
                        <h2 className="font-display font-bold text-xl text-stone-800">Privacy Policy</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6 text-stone-600">
                    <p className="text-sm">
                        Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <section>
                        <h3 className="text-stone-900 font-bold mb-2 flex items-center gap-2">
                            <Lock size={16} className="text-sky-500" /> Data Collection
                        </h3>
                        <p className="text-sm leading-relaxed">
                            We collect only the information necessary to generate your certificate and maintain the pledge registry. This includes your name, phone number, email address, and the photo you upload. We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-stone-900 font-bold mb-2 flex items-center gap-2">
                            <Eye size={16} className="text-sky-500" /> Image Processing
                        </h3>
                        <p className="text-sm leading-relaxed">
                            The photo you upload is processed essentially in your browser to generate the certificate. If stored, it is solely for the purpose of allowing you to download or share your pledge certificate.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-stone-900 font-bold mb-2">Usage of Information</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>To generate your personalized Flag Pledge certificate.</li>
                            <li>To send you a copy of your certificate via email or WhatsApp (if applicable).</li>
                            <li>To count the total number of pledges taken across different regions.</li>
                        </ul>
                    </section>


                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-stone-800 text-white font-bold rounded-lg hover:bg-stone-900 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
