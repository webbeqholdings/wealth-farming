'use client';

import React, { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function PaymentForm() {
  const [product] = useState({
    name: 'Premium Headphones',
    description:
      'Experience crystal-clear sound with these premium headphones. Designed for comfort and exceptional audio quality, they are perfect for music lovers and professionals.',
    price: '149.99',
    category: 'Electronics',
    rating: 4.8,
    availability: 'In Stock',
    sku: 'HP123456',
    features: [
      'Exceptional sound clarity and deep bass',
      'Over-ear, noise-canceling design',
      '20-hour battery life with fast charging',
      'Durable and lightweight materials',
    ],
  });

  const [amount, setAmount] = useState(''); // State for input amount

  const handlePayment = () => {
    console.log(`Proceeding to pay ${amount} for ${product.name}`);
    // Add your payment processing logic here
  };

  return (
    <div>
      <SiteHeader />
      <div className="max-w-6xl mx-auto mt-10 bg-gradient-to-b from-white to-gray-100 shadow-lg p-10 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* QR Code Section */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">Scan to Pay</h3>
            <div className="inline-block p-6 bg-gray-50 border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src="/api/media/file/QR_Code.png"
                alt="QR Code"
                className="w-72 h-72 object-contain"
              />
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Use any QR code scanner to complete the payment quickly and securely.
            </p>
          </div>

          {/* Product Information Section */}
          <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">{product.name}</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            <p className="text-2xl font-bold text-blue-600 mt-6">Price: ${product.price}</p>
            <div className="mt-6 space-y-2">
              <p className="text-md text-gray-700">
                <strong>Category:</strong> {product.category}
              </p>
              <p className="text-md text-gray-700">
                <strong>Rating:</strong> {product.rating} ⭐
              </p>
              <p className="text-md">
                <strong>Availability:</strong>{' '}
                <span
                  className={`font-medium ${product.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {product.availability}
                </span>
              </p>
              <p className="text-md text-gray-700">
                <strong>SKU:</strong> {product.sku}
              </p>
            </div>

            {/* Product Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Input Amount and Button */}
            <div className="mt-8">
              <label htmlFor="amount" className="block text-md font-medium text-gray-700 mb-2">
                Enter Amount:
              </label>
              <input
                id="amount"
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                placeholder="Enter amount to pay"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                onClick={handlePayment}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
