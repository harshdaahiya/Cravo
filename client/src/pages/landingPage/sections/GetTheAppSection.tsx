import React from 'react';

import Icon from '../../../components/ui/Icon';

const GetTheAppSection: React.FC = () => {
    return (
        <section className="my-6 overflow-hidden bg-gray-900 py-12 text-white md:py-16">
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 md:flex-row lg:px-8">
                {/* Left Content: Title and Description */}
                <div className="space-y-3 text-center md:w-3/5 md:text-left">
                    <h2 className="text-3xl leading-snug font-extrabold md:text-4xl">
                        <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                            Cravo: Faster, Fresher, Yours.
                        </span>
                        Download Today!
                    </h2>
                    <p className="mx-auto text-base text-gray-400 md:mx-0 md:w-5/6">
                        Get exclusive app-only deals and real-time delivery tracking right
                        on your smartphone.
                    </p>
                </div>

                {/* Right Content: Download Buttons and Minimal QR Code */}
                <div className="flex flex-col items-center space-y-4 md:w-2/5 md:items-end">
                    <div className="flex flex-wrap justify-center gap-3 md:justify-end">
                        <button className="bg-primary-hover text-text-main hover:bg-primary flex transform items-center gap-2 rounded-xl px-5 py-2 font-bold shadow-lg transition-all duration-300 hover:scale-[1.02]">
                            <Icon name="download" className="h-5 w-5" />
                            App Store
                        </button>

                        {/* Google Play Button */}
                        <button className="bg-primary-hover text-text-main hover:bg-primary flex transform items-center gap-2 rounded-xl px-5 py-2 font-bold shadow-lg transition-all duration-300 hover:scale-[1.02]">
                            <Icon name="download" className="h-5 w-5" />
                            Google Play
                        </button>
                    </div>

                    {/* QR Code Display */}
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-gray-800 p-2 pl-3 shadow-xl">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-amber-400">
                            <Icon name="qr-code" className="text-text-main h-5 w-5" />
                        </div>
                        <p className="pr-1 text-sm font-medium text-gray-300">
                            Scan for instant download link
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GetTheAppSection;
