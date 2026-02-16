import React from 'react';

import Footer from '../../components/layout/Footer';
import { AuthSidebar } from '../../features/auth';
import CategoriesSlider from './sections/CategoriesSection';
import CitiesSection from './sections/CitiesSection';
import BestDineOutSection from './sections/DineOutRestaurantSection';
import GetTheAppSection from './sections/GetTheAppSection';
import Hero from './sections/HeroSection';
import LandingNavigation from './sections/NavigationSection';
import RestaurantsSection from './sections/RestaurantsSection';

const LandingPage: React.FC = () => {
    return (
        <div className="">
            <div className="font-helvetica bg-white">
                {/* Hero Section */}
                <section className="bg-primary">
                    <LandingNavigation />
                    <Hero />
                </section>

                {/* Content Sections */}
                <CategoriesSlider />
                <RestaurantsSection />
                <BestDineOutSection />
                <GetTheAppSection />
                <CitiesSection />
                <Footer />
                <AuthSidebar />
            </div>
        </div>
    );
};

export default LandingPage;
