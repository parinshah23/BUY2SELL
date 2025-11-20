"use client";

import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function MarketplacePage() {
  return (
    <div className="bg-secondary-50 min-h-screen">
      <Hero />

      <FeaturedProducts />

      {/* Trust/Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-100">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-12 text-secondary-900">Why Choose Buy2Sell?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🛡️</div>
              <h3 className="text-xl font-bold mb-2 text-secondary-900">Secure Transactions</h3>
              <p className="text-secondary-600">Every transaction is protected with industry-standard security.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🚀</div>
              <h3 className="text-xl font-bold mb-2 text-secondary-900">Fast Delivery</h3>
              <p className="text-secondary-600">Instant access to digital assets and quick shipping for physical goods.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💬</div>
              <h3 className="text-xl font-bold mb-2 text-secondary-900">24/7 Support</h3>
              <p className="text-secondary-600">Our dedicated support team is always here to help you.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
