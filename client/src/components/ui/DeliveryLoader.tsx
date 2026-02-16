import React from 'react';

const DeliveryLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="text-center">
                {/* Main Animation Container */}
                <div className="relative mx-auto mb-8 h-40 w-80">
                    {/* Road */}
                    <div className="absolute bottom-0 h-2 w-full rounded bg-gray-300">
                        <div className="road-lines absolute top-1/2 h-0.5 w-full -translate-y-1/2 transform bg-white"></div>
                    </div>

                    {/* Delivery Scooter with Rider */}
                    <div className="delivery-scooter absolute bottom-2 left-0 h-16 w-24">
                        {/* Rider */}
                        <div className="rider absolute -top-8 left-4">
                            {/* Head */}
                            <div className="relative mb-1 h-4 w-4 rounded-full bg-orange-400">
                                <div className="absolute top-1 left-1 h-2 w-2 rounded-full bg-orange-500"></div>
                            </div>
                            {/* Body */}
                            <div className="relative mx-auto h-6 w-3 rounded bg-blue-500">
                                {/* Arms */}
                                <div className="absolute top-1 -left-2 h-1 w-4 rotate-12 transform rounded bg-orange-400"></div>
                                <div className="absolute top-1 -right-1 h-1 w-3 -rotate-12 transform rounded bg-orange-400"></div>
                            </div>
                            {/* Legs */}
                            <div className="mt-1 flex justify-center space-x-1">
                                <div className="h-4 w-1 rounded bg-blue-600"></div>
                                <div className="h-4 w-1 rounded bg-blue-600"></div>
                            </div>
                        </div>

                        {/* Scooter Body */}
                        <div className="absolute bottom-0 left-2 h-6 w-16 rounded-lg bg-red-500">
                            <div className="absolute top-1 left-1 h-2 w-3 rounded bg-red-600"></div>
                            <div className="absolute top-1 right-1 h-2 w-8 rounded bg-red-600"></div>
                        </div>

                        {/* Delivery Box */}
                        <div className="bg-primary absolute -top-2 right-0 h-6 w-6 rounded border-2 border-yellow-500">
                            <div className="bg-yellow-400 absolute top-1 left-1 h-1 w-4"></div>
                            <div className="bg-yellow-400 absolute top-3 left-1 h-1 w-4"></div>
                        </div>

                        {/* Wheels */}
                        <div className="wheel-front absolute bottom-0 left-1 h-4 w-4 rounded-full bg-black">
                            <div className="absolute top-1 left-1 h-2 w-2 rounded-full bg-gray-600"></div>
                        </div>
                        <div className="wheel-back absolute right-2 bottom-0 h-4 w-4 rounded-full bg-black">
                            <div className="absolute top-1 left-1 h-2 w-2 rounded-full bg-gray-600"></div>
                        </div>
                    </div>

                    {/* Speed Lines */}
                    <div className="speed-lines absolute top-8 left-0">
                        <div className="mb-2 h-0.5 w-8 bg-gray-400 opacity-60"></div>
                        <div className="mb-2 h-0.5 w-6 bg-gray-400 opacity-40"></div>
                        <div className="h-0.5 w-10 bg-gray-400 opacity-80"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <h2 className="text-gray-900 mb-2 text-2xl font-bold">Cravo</h2>
                    <p className="text-gray-500 mb-4">
                        Preparing your delicious experience...
                    </p>

                    {/* Loading Dots */}
                    <div className="flex justify-center space-x-1">
                        <div className="loading-dot bg-primary h-2 w-2 rounded-full"></div>
                        <div className="loading-dot bg-primary h-2 w-2 rounded-full"></div>
                        <div className="loading-dot bg-primary h-2 w-2 rounded-full"></div>
                    </div>
                </div>
            </div>

            <style>{`
        .delivery-scooter {
          animation: ride 3s ease-in-out infinite;
        }

        .wheel-front,
        .wheel-back {
          animation: rotate 0.5s linear infinite;
        }

        .speed-lines {
          animation: speedLines 1s ease-in-out infinite;
        }

        .loading-dot:nth-child(1) {
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .loading-dot:nth-child(2) {
          animation: bounce 1.4s ease-in-out 0.2s infinite both;
        }

        .loading-dot:nth-child(3) {
          animation: bounce 1.4s ease-in-out 0.4s infinite both;
        }

        .rider {
          animation: riderBounce 0.5s ease-in-out infinite alternate;
        }

        @keyframes ride {
          0%,
          100% {
            transform: translateX(0px) translateY(0px);
          }
          25% {
            transform: translateX(80px) translateY(-2px);
          }
          50% {
            transform: translateX(160px) translateY(0px);
          }
          75% {
            transform: translateX(240px) translateY(-1px);
          }
          100% {
            transform: translateX(320px) translateY(0px);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes speedLines {
          0% {
            opacity: 0;
            transform: translateX(0px);
          }
          50% {
            opacity: 1;
            transform: translateX(-20px);
          }
          100% {
            opacity: 0;
            transform: translateX(-40px);
          }
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @keyframes riderBounce {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-2px);
          }
        }

        .road-lines {
          background-image: repeating-linear-gradient(
            to right,
            transparent,
            transparent 10px,
            white 10px,
            white 20px
          );
          animation: roadMove 1s linear infinite;
        }

        @keyframes roadMove {
          0% {
            transform: translateX(0px) translateY(-50%);
          }
          100% {
            transform: translateX(-20px) translateY(-50%);
          }
        }
      `}</style>
        </div>
    );
};

export default DeliveryLoader;
