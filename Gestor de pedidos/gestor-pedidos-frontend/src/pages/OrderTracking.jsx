// src/components/OrderProgress.jsx
import React from "react";
import { ORDER_STATUS_LABELS, ORDER_STEPS } from "../constants/orderStatus.js";

export default function OrderProgress({ status }) {
  const currentIndex = ORDER_STEPS.indexOf(status);
  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
      <div className="flex items-center gap-4 overflow-auto">
        {ORDER_STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full grid place-items-center ${i <= currentIndex ? "bg-green-500 text-white" : "bg-white/10 text-white/60"}`}>
              {i+1}
            </div>
            <div className="text-sm">
              <div className={`font-medium ${i <= currentIndex ? "text-white" : "text-white/60"}`}>{STATUS_LABEL_ES[s] || s}</div>
            </div>
            {i < ORDER_STEPS.length - 1 && <div className={`w-8 h-[2px] ${i < currentIndex ? "bg-green-400" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>
    </div>
  );
}
