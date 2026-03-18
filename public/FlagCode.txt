import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, HelpCircle } from 'lucide-react';

const FAQS = [
    {
        question: "What is the Indian National Flag?",
        answer: "The Indian National Flag, also known as the Tricolour, is the official flag of India consisting of saffron, white, and green horizontal bands with the Ashoka Chakra at the centre."
    },
    {
        question: "Who can hoist or display the Indian National Flag?",
        answer: "Any Indian citizen, institution, or organisation may hoist the flag, provided it is done in accordance with the Flag Code of India."
    },
    {
        question: "Is it mandatory to follow the Flag Code of India?",
        answer: "Yes. The Flag Code of India provides binding guidelines for respectful display and use of the national flag."
    },
    {
        question: "Which colour must always be on top while displaying the flag?",
        answer: "The saffron band must always be on top when the flag is displayed horizontally or vertically."
    },
    {
        question: "Can the Indian flag be flown at night?",
        answer: "Yes, the flag may be flown day and night, provided it is properly illuminated and displayed with dignity."
    },
    {
        question: "Can the flag touch the ground or water?",
        answer: "No. The flag must never touch the ground, water, or any unclean surface."
    },
    {
        question: "Is flying the flag upside down allowed?",
        answer: "No. Flying the flag upside down is considered disrespectful."
    },
    {
        question: "Can the flag be used as decoration or drapery?",
        answer: "No. The flag must not be used as a decorative item, tablecloth, or backdrop."
    },
    {
        question: "Is it allowed to use the flag as clothing or costume?",
        answer: "No. The flag should not be used as apparel, uniform, or accessory."
    },
    {
        question: "Can text, logos, or images be printed on the flag?",
        answer: "No. Writing, printing, or placing any symbol on the flag is prohibited."
    },
    {
        question: "Can the Indian flag be used for commercial advertising?",
        answer: "No. Commercial use of the national flag is not permitted."
    },
    {
        question: "What materials are permitted for making the flag?",
        answer: "The flag may be made of khadi, cotton, silk, wool, or polyester as prescribed."
    },
    {
        question: "Are plastic flags allowed?",
        answer: "Plastic flags are discouraged, as improper disposal may lead to disrespect."
    },
    {
        question: "Can a damaged or faded flag be displayed?",
        answer: "No. Only clean and well-maintained flags should be displayed."
    },
    {
        question: "How should the flag be hoisted and lowered?",
        answer: "The flag should be hoisted briskly and lowered slowly with respect."
    },
    {
        question: "Can the flag be dipped as a mark of respect to a person?",
        answer: "No. The Indian National Flag must never be dipped."
    },
    {
        question: "When is the flag flown at half-mast?",
        answer: "Only on occasions of state mourning as officially declared by the Government of India."
    },
    {
        question: "Can the flag be displayed along with other flags?",
        answer: "Yes, but the Indian flag must always be in a position of honour."
    },
    {
        question: "How should the flag be folded and stored?",
        answer: "The flag should be folded neatly and stored respectfully to avoid damage."
    },
    {
        question: "How should old or damaged flags be disposed of?",
        answer: "They should be disposed of privately and respectfully, preferably by burning."
    },
    {
        question: "Should flags be collected after public events?",
        answer: "Yes. Flags must not be left unattended or discarded after events."
    },
    {
        question: "Is disrespecting the Indian flag punishable?",
        answer: "Yes. Intentional disrespect can attract penalties under Indian law."
    },
    {
        question: "Are schools and institutions required to follow the Flag Code?",
        answer: "Yes. All public institutions must comply with the Flag Code of India."
    },
    {
        question: "Can citizens hoist the flag at their homes?",
        answer: "Yes. Citizens may hoist the flag on any day, following proper etiquette."
    },
    {
        question: "Can the flag be displayed on vehicles?",
        answer: "Only authorised vehicles may display the flag as per government rules."
    },
    {
        question: "Is ignorance of the Flag Code a valid excuse?",
        answer: "No. Citizens are expected to be aware of proper flag etiquette."
    },
    {
        question: "Can the flag be printed on paper for awareness purposes?",
        answer: "Yes, provided it is depicted respectfully and not misused."
    },
    {
        question: "Can the flag be carried in processions or parades?",
        answer: "Yes, as long as it is carried with dignity and not allowed to touch the ground."
    },
    {
        question: "Why is flag etiquette important?",
        answer: "It reflects respect for the nation and its constitutional values."
    },
    {
        question: "Where can citizens find official flag guidelines?",
        answer: "From the Flag Code of India issued by the Ministry of Home Affairs."
    }
];

export const FlagCode: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-white py-20 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-6">
                        <BookOpen className="text-orange-600" size={32} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-stone-900 mb-6 tracking-tight">
                        Indian National Flag – Code of Conduct
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-orange-500 via-white to-green-500 mx-auto rounded-full mb-8 border border-stone-200"></div>

                    <div className="bg-stone-50 rounded-3xl p-8 md:p-10 shadow-sm border border-stone-100 text-left">
                        <p className="text-lg text-stone-700 leading-relaxed mb-6">
                            The Indian National Flag is not just a piece of cloth; it is a symbol of our nation’s pride, unity, and freedom. Every colour and symbol on the flag has deep meaning and represents the values of India and its people.
                        </p>
                        <p className="text-lg text-stone-700 leading-relaxed mb-6">
                            To ensure that the Tricolour is always treated with respect, the Government of India has issued clear rules known as the Flag Code of India, under the Ministry of Home Affairs (MHA). These rules explain how the flag should be hoisted, displayed, handled, stored, and disposed of.
                        </p>
                        <p className="text-lg text-stone-700 leading-relaxed mb-6">
                            Many times, people disrespect the flag unknowingly due to lack of awareness. This section is created to help citizens understand the correct and respectful way to use the Indian National Flag in daily life, public events, schools, institutions, and celebrations.
                        </p>
                        <p className="text-lg text-stone-700 leading-relaxed font-medium">
                            By following the Flag Code, every citizen can show love for the nation while ensuring that the dignity and honour of the Indian National Flag are always preserved.
                        </p>
                    </div>
                </div>

                {/* FAQs Section */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <HelpCircle className="text-blue-600" size={28} />
                        <h3 className="text-2xl font-bold text-stone-900">Frequently Asked Questions (FAQs)</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {FAQS.map((faq, index) => (
                            <div
                                key={index}
                                className={`border border-stone-200 rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-stone-50 shadow-md border-stone-300' : 'bg-white hover:border-stone-300'}`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                >
                                    <span className={`font-semibold text-lg ${openIndex === index ? 'text-blue-700' : 'text-stone-800'}`}>
                                        {index + 1}. {faq.question}
                                    </span>
                                    {openIndex === index ? (
                                        <ChevronUp className="text-blue-600 shrink-0 ml-4" size={20} />
                                    ) : (
                                        <ChevronDown className="text-stone-400 shrink-0 ml-4" size={20} />
                                    )}
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="p-5 pt-0 text-stone-600 leading-relaxed border-t border-stone-200/50 mt-2">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Source & Credit */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center text-blue-900/80 text-sm leading-relaxed">
                    <p className="font-bold mb-1">Source & Credit:</p>
                    <p>Flag Code of India – Ministry of Home Affairs (MHA), Government of India</p>
                    <p className="opacity-75">(Content simplified for public awareness and educational purposes)</p>
                </div>

            </div>
        </section>
    );
};
