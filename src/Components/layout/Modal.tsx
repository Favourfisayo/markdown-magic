import React from "react";
import { AlertCircle, Plus, Trash2, X } from "lucide-react";

type ModalProps = {
  title: string;
  message: string;
  onChoice: (choice: "Append" | "Discard" | "Cancel") => void;
};

const Modal: React.FC<ModalProps> = ({ title, message, onChoice }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={() => onChoice("Cancel")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed mb-8">{message}</p>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={() => onChoice("Cancel")}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
            
            <button
              onClick={() => onChoice("Discard")}
              className="flex-1 px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Discard
            </button>
            
            <button
              onClick={() => onChoice("Append")}
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Append
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;