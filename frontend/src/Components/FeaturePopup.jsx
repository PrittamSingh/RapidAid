import React, { useEffect, useState } from "react";

const FeaturePopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show popup after 1 second
    const timer = setTimeout(() => setVisible(true), 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-12 right-4 z-50">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-start space-x-4 animate-slide-in relative ">
        <span className="text-2xl">🔔</span>
        <div className="text-sm font-medium pr-6">
          <strong>New Feature:</strong> Immediate Doctor Resolution — Coming
          Soon!
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-white hover:text-gray-200 text-lg font-bold focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default FeaturePopup;
