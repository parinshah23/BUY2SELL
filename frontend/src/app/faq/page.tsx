"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
    const faqs = [
        {
            category: "Ordering & Payments",
            items: [
                {
                    question: "How do I place an order?",
                    answer: "To place an order, simply browse our catalog, select the items you wish to purchase, and add them to your cart. Proceed to checkout, enter your shipping and payment details, and confirm your order."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit and debit cards (Visa, MasterCard, Amex) processed securely via Stripe. We also support digital wallet payments in some regions."
                },
                {
                    question: "Can I cancel my order?",
                    answer: "You can cancel your order within 1 hour of placing it if it hasn't been shipped yet. Go to 'My Orders' and select the order you wish to cancel."
                }
            ]
        },
        {
            category: "Selling & Payouts",
            items: [
                {
                    question: "How do I start selling?",
                    answer: "Create an account, verify your identity (KYC), and click 'Sell Now' to list your item. You'll need to upload photos, provide a description, and set a price."
                },
                {
                    question: "When do I get paid?",
                    answer: "Funds are released to your wallet once the buyer confirms receipt of the item and indicates they are satisfied. From your wallet, you can request a payout to your bank account."
                },
                {
                    question: "What are the selling fees?",
                    answer: "We charge a commission fee on each successful sale. Currently, new listings enjoy 0% commission for the first 30 days! After that, a standard 7% fee applies."
                }
            ]
        },
        {
            category: "Account & Security",
            items: [
                {
                    question: "Is my personal information safe?",
                    answer: "Yes, we prioritize data security. All sensitive data is encrypted, and we never share your personal details with third parties for marketing purposes without your consent."
                },
                {
                    question: "How do I reset my password?",
                    answer: "If you've forgotten your password, go to the Login page and click 'Forgot Password'. Follow the instructions sent to your email to reset it."
                }
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-secondary-50 py-12">
            <div className="container-custom max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Frequently Asked Questions</h1>
                    <p className="text-secondary-500 mb-8">Find answers to common questions about using Buy2Sell.</p>

                    <div className="space-y-10">
                        {faqs.map((section) => (
                            <div key={section.category}>
                                <h2 className="text-xl font-bold text-secondary-800 mb-4 pb-2 border-b border-secondary-100">
                                    {section.category}
                                </h2>
                                <div className="space-y-4">
                                    {section.items.map((item, index) => (
                                        <FAQItem key={index} question={item.question} answer={item.answer} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-secondary-100 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-secondary-50 hover:bg-secondary-100 transition-colors text-left"
            >
                <span className="font-semibold text-secondary-900">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-secondary-500" /> : <ChevronDown size={20} className="text-secondary-500" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-white text-secondary-600 text-sm leading-relaxed border-t border-secondary-100 animate-fade-in">
                    {answer}
                </div>
            )}
        </div>
    );
}
