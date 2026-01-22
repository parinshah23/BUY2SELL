"use client";



export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-secondary-50 py-12">
            <div className="container-custom max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Privacy Policy</h1>
                    <p className="text-secondary-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-slate max-w-none text-secondary-700 space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">1. Introduction</h2>
                            <p>
                                Welcome to Buy2Sell ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our marketplace services.
                            </p>
                            <p>
                                By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">2. Information We Collect</h2>
                            <p>We collect information that identifies, relates to, describes, references, is capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or device.</p>

                            <h3 className="text-lg font-semibold text-secondary-800 mt-4 mb-2">A. Personal Information You Disclose to Us</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
                                <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
                                <li><strong>Financial Data:</strong> Bank account and payment card details (processed securely by our payment processors like Stripe).</li>
                                <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products and services you have purchased or sold.</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-secondary-800 mt-4 mb-2">B. Information Automatically Collected</h3>
                            <p>
                                We automatically collect certain information when you visit, use, or navigate the Site. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our Site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">3. How We Use Your Information</h2>
                            <p>We use personal information collected via our Site for a variety of business purposes described below:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>To facilitate account creation and logon processes.</li>
                                <li>To send you marketing and promotional communications plan to your preferences.</li>
                                <li>To fulfill and manage your orders, payments, returns, and exchanges.</li>
                                <li>To request feedback and contact you about your use of our Site.</li>
                                <li>To protect our Site and legal rights (e.g., fraud monitoring and prevention).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">4. Sharing Your Information</h2>
                            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                                <li><strong>Third-Party Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf (e.g., Stripe for payments, Cloudinary for image hosting).</li>
                                <li><strong>Other Users:</strong> When you share personal information or otherwise interact with public areas of the Site (e.g., posting product listings or reviews), such personal information may be viewed by all users.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">5. Data Security</h2>
                            <p>
                                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">6. Your Privacy Rights (GDPR & CCPA)</h2>
                            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>The right to access – You have the right to request copies of your personal data.</li>
                                <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
                                <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                                <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-secondary-900 mb-3">7. Contact Us</h2>
                            <p>
                                If you have questions or comments about this policy, you may email us at support@buy2sell.eu or by post to:
                            </p>
                            <address className="not-italic mt-2">
                                Buy2Sell Inc.<br />
                                Alexanderplatz 1<br />
                                10178 Berlin, Germany
                            </address>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
