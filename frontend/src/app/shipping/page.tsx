"use client";


import { Truck, Globe, Clock, RefreshCw } from "lucide-react";

export default function ShippingPage() {
    return (
        <main className="min-h-screen bg-secondary-50 py-12">
            <div className="container-custom max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Shipping & Returns</h1>
                    <p className="text-secondary-500 mb-8">Everything you need to know about delivery and returns.</p>

                    <div className="grid gap-8 md:grid-cols-2 mb-12">
                        <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
                            <Truck className="w-10 h-10 text-primary-600 mb-4" />
                            <h3 className="text-lg font-bold text-secondary-900 mb-2">Standard Shipping</h3>
                            <p className="text-secondary-600 text-sm">
                                Reliable delivery via our partners (Mondial Relay, DHL, UPS). Tracking number provided for every order.
                            </p>
                        </div>
                        <div className="bg-secondary-50 p-6 rounded-xl border border-secondary-100">
                            <Globe className="w-10 h-10 text-secondary-600 mb-4" />
                            <h3 className="text-lg font-bold text-secondary-900 mb-2">International Delivery</h3>
                            <p className="text-secondary-600 text-sm">
                                We ship to over 20 countries across Europe. Customs fees may apply for non-EU destinations.
                            </p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none text-secondary-700 space-y-6">
                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold text-secondary-900 mb-3">
                                <Clock size={24} className="text-primary-600" /> Delivery Times
                            </h2>
                            <p>
                                Delivery times vary depending on the seller's location and the shipping method selected.
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Domestic (Germany):</strong> 2-4 business days.</li>
                                <li><strong>EU Region:</strong> 4-7 business days.</li>
                                <li><strong>International:</strong> 7-14 business days.</li>
                            </ul>
                            <p className="text-sm italic text-secondary-500 mt-2">
                                *Sellers have up to 5 days to ship the item after purchase. If not shipped, the order is automatically cancelled and refunded.
                            </p>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold text-secondary-900 mb-3 mt-8">
                                <RefreshCw size={24} className="text-primary-600" /> Return Policy
                            </h2>
                            <p>
                                As a peer-to-peer marketplace, verified returns are handled via our Buyer Protection program.
                            </p>
                            <h3 className="text-lg font-semibold text-secondary-800 mt-4 mb-2">You are covered if:</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>The item is significantly different from the description.</li>
                                <li>The item is counterfeit.</li>
                                <li>The item arrives damaged or never arrives.</li>
                            </ul>
                            <p className="mt-4">
                                <strong>Note:</strong> Returns are generally not accepted for "change of mind" or wrong size, unless the individual seller agrees to it. You must report any issue within 48 hours of delivery to suspend the payout to the seller.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
