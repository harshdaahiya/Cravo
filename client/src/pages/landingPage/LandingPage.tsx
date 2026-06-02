import React from 'react';

import Footer from '../../components/layout/Footer';
import SEO from '../../components/shared/SEO';
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
            <SEO 
                title="Delicious Food Delivered Fast" 
                description="Cravo is your favorite food delivery service. Order from 1000+ top restaurants near you and enjoy fast 30-minute delivery. Find pizzas, burgers, Chinese, and more!"
            />
            <div className="font-helvetica bg-background">
                {/* Header Section */}
                <header className="bg-primary">
                    <LandingNavigation />
                </header>

                {/* Main Landmark Content */}
                <main id="main-content">
                    {/* Hero Section */}
                    <section className="bg-primary">
                        <Hero />
                    </section>

                    {/* Content Sections */}
                    <CategoriesSlider />
                    <RestaurantsSection />
                    <BestDineOutSection />
                    <GetTheAppSection />
                    <CitiesSection />
                </main>
                <Footer />
                <AuthSidebar />
            </div>
        </div>
    );
};

export default LandingPage;
