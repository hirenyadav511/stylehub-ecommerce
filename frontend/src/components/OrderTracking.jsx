import React from "react";
import "./OrderTracking.css";

const OrderTracking = ({ status }) => {
  const steps = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  // Map backend status (lowercase) to step index
  const statusMap = {
    "pending": 0,
    "confirmed": 1,
    "shipped": 2,
    "out for delivery": 3,
    "delivered": 4
  };

  const currentStatus = status.toLowerCase();
  let currentStepIndex = statusMap[currentStatus];

  // If status is "cancelled", we might want to handle it differently, 
  // but for now let's just show no progress or handle it as -1
  if (currentStatus === "cancelled") currentStepIndex = -1;

  // If not in map, try exact match or default to 0
  if (currentStepIndex === undefined) {
    const exactMatch = steps.findIndex(s => s.toLowerCase() === currentStatus);
    currentStepIndex = exactMatch !== -1 ? exactMatch : 0;
  }

  // Calculate progress bar width
  const calculateProgressWidth = () => {
    if (currentStepIndex === -1) return "0%";
    if (currentStepIndex === steps.length - 1) return "100%";
    return `${(currentStepIndex / (steps.length - 1)) * 100}%`;
  };

  return (
    <div className="order-tracking-container mt-4">
      <div className="order-tracking-steps">
        {/* Progress Line */}
        <div 
          className="progress-line" 
          style={{ width: calculateProgressWidth() }}
        ></div>

        {steps.map((step, index) => {
          let stepClass = "order-tracking-step";
          if (index < currentStepIndex) {
            stepClass += " completed";
          } else if (index === currentStepIndex) {
            stepClass += " active";
          } else {
            stepClass += " upcoming";
          }

          return (
            <div key={index} className={stepClass}>
              <div className="order-tracking-dot"></div>
              <div className="order-tracking-label">{step}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracking;
