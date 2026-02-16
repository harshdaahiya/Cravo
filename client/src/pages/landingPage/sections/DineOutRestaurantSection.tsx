import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';

const BestDineOutSection: React.FC = () => {
    return (
        <section className="bg-gradient-to-b from-white to-yellow-50/30 px-4 py-20">
            <div className="mx-auto max-w-6xl">
                <div className="grid items-center gap-12 md:grid-cols-2">
                    {/* Content Side */}
                    <div className="space-y-6">
                        <div className="to-primary-hover text-text-main inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 px-5 py-2 text-sm font-bold shadow-lg shadow-yellow-200">
                            <Icon name="sparkles" className="h-4 w-4" />
                            Premium Selection
                        </div>

                        <h2 className="text-text-main text-4xl leading-tight font-bold md:text-5xl">
                            Unforgettable
                            <span className="to-primary-hover block bg-gradient-to-r from-yellow-600 bg-clip-text text-transparent">
                                Dining Experiences
                            </span>
                        </h2>

                        <p className="text-text-secondary text-lg leading-relaxed">
                            Discover handpicked restaurants that redefine fine dining with
                            exceptional ambiance, world-class cuisine, and memories that last
                            forever.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 gap-2 pt-2">
                            <div className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-yellow-300 hover:shadow-lg">
                                <div className="to-primary-hover flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 shadow-md transition-transform group-hover:scale-110">
                                    <Icon name="star" className="text-text-main h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-text-main mb-1 font-bold">
                                        Top Rated Venues
                                    </p>
                                    <p className="text-text-secondary text-sm">
                                        Curated selection of 4.5+ star restaurants
                                    </p>
                                </div>
                            </div>

                            <div className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-yellow-300 hover:shadow-lg">
                                <div className="to-primary-hover flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 shadow-md transition-transform group-hover:scale-110">
                                    <Icon name="map-pin" className="text-text-main h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-text-main mb-1 font-bold">
                                        Prime Locations
                                    </p>
                                    <p className="text-text-secondary text-sm">
                                        Best dining spots across the city
                                    </p>
                                </div>
                            </div>

                            <div className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-yellow-300 hover:shadow-lg">
                                <div className="to-primary-hover flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 shadow-md transition-transform group-hover:scale-110">
                                    <Icon name="clock" className="text-text-main h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-text-main mb-1 font-bold">
                                        Instant Reservation
                                    </p>
                                    <p className="text-text-secondary text-sm">
                                        Book your perfect table in seconds
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link to={'restaurants/dine-out'}>
                            <button className="group to-primary-hover text-text-main flex cursor-pointer items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 px-8 py-4 font-bold shadow-lg shadow-yellow-200 transition-all hover:gap-4 hover:from-yellow-500 hover:to-yellow-600 hover:shadow-xl hover:shadow-yellow-300">
                                Explore Dine-Out Options
                                <Icon name="arrow-right" className="h-5 w-5 transition-all" />
                            </button>
                        </Link>
                    </div>

                    {/* Image Side */}
                    <div className="relative">
                        {/* Background Accent */}
                        <div className="absolute -top-6 -right-6 h-72 w-72 rounded-full bg-yellow-200 opacity-30 blur-3xl"></div>

                        {/* Main Image Container */}
                        <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                                alt="Best Restaurant for Dine-Out"
                                className="h-[500px] w-full object-cover"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Floating Stats Card */}
                        <div className="absolute -bottom-6 -left-6 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="to-primary-hover flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 shadow-lg">
                                    <Icon
                                        name="star"
                                        className="text-text-main h-3 w-3 fill-gray-900"
                                    />
                                </div>
                                <div>
                                    <p className="text-text-main text-sm font-bold">4.8</p>
                                    <p className="text-text-secondary text-xs">Average Rating</p>
                                </div>
                            </div>
                        </div>

                        {/* Small Accent Badge */}
                        <div className="absolute top-6 right-6 rounded-xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm">
                            <p className="text-text-secondary text-xs font-semibold">
                                FEATURED
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BestDineOutSection;
