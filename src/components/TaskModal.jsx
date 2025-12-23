/**
 * TaskModal Component
 * Displays a modal when task is completed with Islamic acknowledgment message
 */

import React from 'react';

const TaskModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-light rounded-lg shadow-lg p-8 max-w-sm mx-4 text-center animate-slideUp">
        {/* Icon and Message */}
        <div className="mb-6">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-primary mb-2">تم</h2>
          <p className="text-lg text-blue font-semibold">
            نحتسبها عند الله 🌱
          </p>
        </div>

        {/* Divider */}
        <div className="border-b border-sand mb-6"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-primary hover:bg-accent text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          حسناً
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TaskModal;
