import React from "react";

const SubmitButton = ({
  onClick,
  isSubmitting = false,
  disabled = false,
  text = "Submit",
  loadingText = "Submitting...",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isSubmitting || disabled}
      className={`
        px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium
        transition-all duration-300 ease-in-out
        flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isSubmitting || disabled
            ? "bg-gray-300 text-gray-500"
            : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg hover:scale-105"
        }
        ${className}
      `}
    >
      {isSubmitting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm sm:text-base">{loadingText}</span>
        </>
      ) : (
        <span className="text-sm sm:text-base">{text}</span>
      )}
    </button>
  );
};

export default SubmitButton;
