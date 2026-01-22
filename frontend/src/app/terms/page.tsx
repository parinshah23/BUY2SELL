"use client";



export default function TermsPage() {
    return (
        <main className="min-h-screen bg-secondary-50 py-12">
            <div className="container-custom max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Terms of Service</h1>
                    <p className="text-secondary-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-slate max-w-none text-secondary-700 space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">1. Agreement to Terms</h2>
                            <p>
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Buy2Sell ("we," "us" or "our"), concerning your access to and use of the Buy2Sell website and marketplace.
                            </p>
                            <p>
                                By accessing the Site, you confirm that you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from using the Site and must discontinue use immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">2. User Accounts</h2>
                            <p>
                                To buy or sell items on our marketplace, you may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">3. Marketplace Rules</h2>
                            <h3 className="text-lg font-semibold text-secondary-800 mt-4 mb-2">Buying</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>When purchasing an item, you agree that you are responsible for reading the full item listing before making a commitment to buy.</li>
                                <li>You enter into a legally binding contract to purchase an item when you commit to buy or your offer for an item is accepted.</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-secondary-800 mt-4 mb-2">Selling</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>You must accurately describe your item and all terms of sale in your listing.</li>
                                <li>You are responsible for shipping the item to the buyer within the timeframe specified in your listing.</li>
                                <li>You acknowledge that we charge a commission on successful sales as outlined in our Fee Schedule.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">4. Prohibited Activities</h2>
                            <p>You may not use the Site for any purpose other than that for which we make it available. Prohibited activities include:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Selling illegal, counterfeit, or stolen items.</li>
                                <li>Harassing, annoying, intimidating, or threatening any of our employees or agents engaged in providing any portion of the Site to you.</li>
                                <li>Attempting to bypass any measures of the Site designed to prevent or restrict access to the Site, such as taking transactions off-platform to avoid fees.</li>
                                <li>Using the Site in a manner inconsistent with any applicable laws or regulations.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">5. Fees and Payments</h2>
                            <p>
                                Platform fees (commissions) are deducted automatically from the final sale price. All payments are processed via our third-party payment provider (Stripe). You agree to be bound by the Stripe Connected Account Agreement.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">6. Limitation of Liability</h2>
                            <p>
                                In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">7. Contact Us</h2>
                            <p>
                                To resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                            </p>
                            <p className="font-semibold mt-2">support@buy2sell.eu</p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
