"use client";

import { useState } from "react";

export default function MortgageCalculator({ price }: any) {
  const [rate, setRate] = useState(100);
  const [years, setYears] = useState(10);

  const monthlyRate = rate / 100 / 12;
  const months = years * 12;

  const monthlyPayment = (
    price * monthlyRate /
    (1 - Math.pow(1 + monthlyRate, -months))
  ).toFixed(2);

  return (
    <div className="border p-4 rounded-xl dark:bg-white dark:text-gray-700 shadow my-6">
      <h3 className="font-bold text-lg mb-2">Mortgage Calculator</h3>

      <div className="space-y-3">
        
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />

        <p className="text-lg font-semibold">
          Monthly Payment: ₦{Number(monthlyPayment).toLocaleString()}
        </p>

      </div>
    </div>
  );
}
