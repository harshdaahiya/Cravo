import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
    Check,
    ChevronRight,
    Clock,
    Copy,
    Gift,
    Percent,
    Search,
    Sparkles,
    Star,
    Tag,
    TrendingUp,
    Truck,
} from 'lucide-react';

interface Restaurant {
    name: string;
    rating: number;
    deliveryTime?: string;
}

interface Offer {
    id: string;
    title: string;
    description: string;
    image: string;
    discount: string;
    code: string;
    type: 'percentage' | 'bogo' | 'free_delivery' | 'fixed';
    category: string;
    isNew?: boolean;
    isTrending?: boolean;
    minOrder: number;
    maxDiscount?: number | null;
    validUntil: string;
    restaurant: Restaurant;
}

const OffersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const categories = [
        { key: 'all', label: 'All Offers' },
        { key: 'pizza', label: 'Pizza' },
        { key: 'burgers', label: 'Burgers' },
        { key: 'asian', label: 'Asian' },
        { key: 'desserts', label: 'Desserts' },
    ];

    const featuredOffers: Offer[] = [
        {
            id: 'f1',
            title: 'Flat 50% Off on First Order',
            description:
                'New user exclusive! Get half off on your first delicious meal',
            image:
                'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
            discount: '50%',
            code: 'WELCOME50',
            type: 'percentage',
            category: 'pizza',
            isNew: true,
            isTrending: true,
            minOrder: 20,
            maxDiscount: 15,
            validUntil: '2025-12-31',
            restaurant: {
                name: 'Pizza Paradise',
                rating: 4.5,
                deliveryTime: '30-40',
            },
        },
        {
            id: 'f2',
            title: 'Buy 1 Get 1 Free on All Burgers',
            description: 'Double the joy! BOGO deal on our premium burger collection',
            image:
                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
            discount: 'BOGO',
            code: 'BURGERBOGO',
            type: 'bogo',
            category: 'burgers',
            isNew: false,
            isTrending: true,
            minOrder: 15,
            maxDiscount: null,
            validUntil: '2025-11-15',
            restaurant: {
                name: 'Burger Bliss',
                rating: 4.3,
                deliveryTime: '25-35',
            },
        },
        {
            id: 'f3',
            title: 'Free Delivery on Orders Over $25',
            description: 'Save on delivery! Order more and pay nothing for shipping',
            image:
                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
            discount: 'FREE',
            code: 'FREEDEL25',
            type: 'free_delivery',
            category: 'all',
            isNew: true,
            isTrending: false,
            minOrder: 25,
            maxDiscount: null,
            validUntil: '2025-10-31',
            restaurant: {
                name: 'Quick Bites',
                rating: 4.7,
                deliveryTime: '20-30',
            },
        },
    ];

    const regularOffers: Offer[] = [
        {
            id: 'r1',
            title: '$5 Off on Sushi Orders',
            description: 'Fresh sushi delivered with a sweet discount',
            image:
                'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
            discount: '$5',
            code: 'SUSHI5',
            type: 'fixed',
            category: 'asian',
            minOrder: 30,
            validUntil: '2025-09-30',
            restaurant: {
                name: 'Sushi House',
                rating: 4.6,
            },
        },
        {
            id: 'r2',
            title: '15% Off Weekend Special',
            description: 'Make your weekends delicious with our special discount',
            image:
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
            discount: '15%',
            code: 'WEEKEND15',
            type: 'percentage',
            category: 'all',
            minOrder: 20,
            validUntil: '2025-08-31',
            restaurant: {
                name: 'Food Haven',
                rating: 4.4,
            },
        },
        {
            id: 'r3',
            title: 'Dessert Deal: 2 for $10',
            description: 'Sweet treats at sweeter prices',
            image:
                'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
            discount: '$10',
            code: 'SWEET2FOR10',
            type: 'fixed',
            category: 'desserts',
            minOrder: 10,
            validUntil: '2025-07-20',
            restaurant: {
                name: 'Sweet Delights',
                rating: 4.8,
            },
        },
        {
            id: 'r4',
            title: '20% Off Chinese Cuisine',
            description: 'Enjoy authentic Chinese flavors with amazing savings',
            image:
                'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&q=80',
            discount: '20%',
            code: 'CHINESE20',
            type: 'percentage',
            category: 'asian',
            minOrder: 25,
            validUntil: '2025-10-15',
            restaurant: {
                name: 'Dragon Wok',
                rating: 4.5,
            },
        },
        {
            id: 'r5',
            title: 'Combo Meal Deal - $15',
            description: 'Complete meal with sides and drink included',
            image:
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
            discount: '$15',
            code: 'COMBO15',
            type: 'fixed',
            category: 'all',
            minOrder: 15,
            validUntil: '2025-11-30',
            restaurant: {
                name: 'Meal Masters',
                rating: 4.3,
            },
        },
        {
            id: 'r6',
            title: '30% Off Family Pack',
            description: 'Perfect for family dinner nights',
            image:
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
            discount: '30%',
            code: 'FAMILY30',
            type: 'percentage',
            category: 'all',
            minOrder: 50,
            validUntil: '2025-09-20',
            restaurant: {
                name: 'Family Feast',
                rating: 4.7,
            },
        },
    ];

    const allOffers: Offer[] = [...featuredOffers, ...regularOffers];

    const handleCopyCode = (offer: Offer) => {
        navigator.clipboard.writeText(offer.code);
        setCopiedId(offer.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getOfferIcon = (type: Offer['type']) => {
        switch (type) {
            case 'percentage':
                return <Percent className="h-4 w-4" />;
            case 'bogo':
                return <Gift className="h-4 w-4" />;
            case 'free_delivery':
                return <Truck className="h-4 w-4" />;
            default:
                return <Tag className="h-4 w-4" />;
        }
    };

    const filterOffers = (offers: Offer[]) => {
        return offers.filter(offer => {
            const matchesSearch =
                offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === 'all' || offer.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-50/50 to-white">
            {/* Hero Section */}
            <div className="relative h-[500px] overflow-hidden">
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
                    alt="Delicious Food"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/50"></div>

                {/* Animated Accent */}
                <div className="bg-primary/20 absolute top-20 right-20 h-72 w-72 animate-pulse rounded-full blur-3xl"></div>

                {/* Content */}
                <div className="relative mx-auto flex h-full max-w-7xl items-center px-4">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <div className="bg-primary/20 border-gray-700 mb-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold text-yellow-400 shadow-lg backdrop-blur-xl">
                            <Sparkles className="h-4 w-4" />
                            Limited Time Offers
                        </div>

                        {/* Main Heading */}
                        <h1 className="mb-6 text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
                            <span className="text-white">Grab Amazing</span>
                            <br />
                            <span className="text-yellow-400">Deals & Save Big! 🍛</span>
                        </h1>

                        {/* Description */}
                        <p className="mb-8 text-xl leading-relaxed text-gray-200 md:text-2xl">
                            Discover exclusive offers from your favorite restaurants. More
                            savings, more happiness!
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-xl">
                                <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl">
                                    <Tag className="text-gray-900 h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        {allOffers.length}+
                                    </p>
                                    <p className="text-xs font-medium text-gray-300">
                                        Active Offers
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-xl">
                                <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl">
                                    <TrendingUp className="text-gray-900 h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">50%</p>
                                    <p className="text-xs font-medium text-gray-300">
                                        Max Discount
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-xl">
                                <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl">
                                    <Gift className="text-gray-900 h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">BOGO</p>
                                    <p className="text-xs font-medium text-gray-300">
                                        Free Deals
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter Section */}
            <div className="relative z-10 mx-auto -mt-8 max-w-7xl px-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                    <div className="flex flex-col gap-4 lg:flex-row">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for offers, restaurants, or cuisines..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-12 focus:border-transparent focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => setSelectedCategory(cat.key)}
                                    className={`rounded-xl px-4 py-2.5 font-semibold transition-all ${selectedCategory === cat.key
                                            ? 'bg-primary text-gray-900 shadow-lg shadow-yellow-200'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Offers Section */}
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-300 shadow-lg">
                            <Sparkles className="text-gray-900 h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-gray-900 text-2xl font-bold">
                                Featured Offers
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Hot deals you don't want to miss
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filterOffers(featuredOffers).map(offer => (
                        <div
                            key={offer.id}
                            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-2xl"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {offer.isNew && (
                                        <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                                            NEW
                                        </span>
                                    )}
                                    {offer.isTrending && (
                                        <span className="flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                                            <TrendingUp className="h-3 w-3" />
                                            HOT
                                        </span>
                                    )}
                                </div>

                                {/* Discount Badge */}
                                <div className="bg-primary absolute top-3 right-3 flex h-16 w-16 items-center justify-center rounded-full shadow-xl">
                                    <span className="text-gray-900 text-lg font-bold">
                                        {offer.discount}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {/* Type Badge */}
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                                        {getOfferIcon(offer.type)}
                                    </div>
                                    <span className="text-sm font-semibold text-yellow-600 capitalize">
                                        {offer.type.replace('_', ' ')}
                                    </span>
                                </div>

                                <h3 className="text-gray-900 mb-2 line-clamp-2 text-lg font-bold">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-500 mb-4 line-clamp-2 text-sm">
                                    {offer.description}
                                </p>

                                {/* Restaurant Info */}
                                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                                    <div>
                                        <p className="text-gray-900 text-sm font-semibold">
                                            {offer.restaurant.name}
                                        </p>
                                        <div className="text-gray-500 mt-1 flex items-center gap-3 text-xs">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                {offer.restaurant.rating}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {offer.restaurant.deliveryTime} min
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-500 text-xs">
                                        <p>Min: ${offer.minOrder}</p>
                                        <p>
                                            Valid till{' '}
                                            {new Date(offer.validUntil).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleCopyCode(offer)}
                                        className="bg-primary hover:bg-yellow-600 text-gray-900 flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-colors"
                                    >
                                        {copiedId === offer.id ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                {offer.code}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* More Offers Section */}
            <div className="mx-auto max-w-7xl px-4 pb-16">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
                        <Tag className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                        <h2 className="text-gray-900 text-2xl font-bold">
                            More Great Deals
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Additional offers just for you
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filterOffers(regularOffers).map(offer => (
                        <div
                            key={offer.id}
                            className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl"
                        >
                            <div className="relative h-40">
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="bg-primary absolute top-3 right-3 flex h-14 w-14 items-center justify-center rounded-full shadow-lg">
                                    <span className="text-gray-900 font-bold">
                                        {offer.discount}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-gray-900 mb-2 font-bold">{offer.title}</h3>
                                <p className="text-gray-500 mb-4 text-sm">
                                    {offer.description}
                                </p>

                                <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
                                    <div className="text-gray-500 text-xs">
                                        <p className="text-gray-900 font-semibold">
                                            {offer.restaurant.name}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            {offer.restaurant.rating}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCopyCode(offer)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-gray-800"
                                >
                                    {copiedId === offer.id ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            {offer.code}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="mx-auto max-w-7xl px-4 pb-16">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-400 p-8 text-center md:p-12">
                    <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

                    <div className="relative">
                        <h2 className="text-gray-900 mb-4 text-3xl font-bold md:text-4xl">
                            Don't Miss Out on These Deals!
                        </h2>
                        <p className="text-gray-900 mb-6 text-lg">
                            Start ordering now and enjoy incredible savings on your favorite
                            meals
                        </p>

                        <Link to={'/restaurants'}>
                            <button className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 font-bold text-white shadow-xl transition-all hover:bg-gray-800">
                                Browse All Restaurants
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OffersPage;
