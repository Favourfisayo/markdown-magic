import { FallbackProps } from "react-error-boundary";
const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
<div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
  <div className="bg-white rounded-2xl shadow-2xl border border-red-100 max-w-lg w-full overflow-hidden">
    <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black/5"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-red-100 text-sm">Don't worry, these things happen sometimes</p>
      </div>
    </div>

    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-red-800 mb-1">Error Details</h3>
            <p className="text-red-700 text-sm leading-relaxed">{error.message}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={resetErrorBoundary}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4l2-2 2 2V5" />
          </svg>
          Reload Page
        </button>
      </div>

    </div>

    <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500"></div>
  </div>
</div>
  );
};

export default ErrorFallback;
