import React, { useState } from 'react';

import {
    ArrowRight,
    BarChart3,
    Building2,
    CheckCircle,
    Clock,
    Coffee,
    CreditCard,
    Gift,
    Headphones,
    LucideIcon,
    Play,
    Settings,
    Shield,
    Sparkles,
    TrendingUp,
    Truck,
    Users,
    UsersRound,
    X,
} from 'lucide-react';

interface ContactFormState {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    employeeCount: string;
    message: string;
}

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface PricingPlan {
    id: string;
    name: string;
    price: string;
    description: string;
    employees: string;
    features: string[];
    popular: boolean;
}

interface Testimonial {
    company: string;
    testimonial: string;
    author: string;
    position: string;
    employees: string;
    savings: string;
}

interface Stat {
    label: string;
    value: string;
    icon: LucideIcon;
}

const CorporatePage: React.FC = () => {
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactForm, setContactForm] = useState<ContactFormState>({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        employeeCount: '',
        message: '',
    });

    const corporateFeatures: Feature[] = [
        {
            icon: Users,
            title: 'Employee Management',
            description:
                'Easy employee onboarding with bulk invitations and role-based access controls.',
        },
        {
            icon: CreditCard,
            title: 'Centralized Billing',
            description:
                'Single invoice for all orders with detailed reporting and expense tracking.',
        },
        {
            icon: BarChart3,
            title: 'Analytics Dashboard',
            description:
                'Comprehensive insights into ordering patterns, spending, and employee preferences.',
        },
        {
            icon: Settings,
            title: 'Custom Policies',
            description:
                'Set spending limits, approved restaurants, and ordering time restrictions.',
        },
        {
            icon: Shield,
            title: 'Security & Compliance',
            description:
                'Enterprise-grade security with SOC 2 compliance and data protection.',
        },
        {
            icon: Headphones,
            title: 'Dedicated Support',
            description:
                '24/7 priority support with dedicated account manager for enterprise clients.',
        },
    ];

    const pricingPlans: PricingPlan[] = [
        {
            id: 'starter',
            name: 'Starter',
            price: 'Free',
            description: 'Perfect for small teams',
            employees: 'Up to 25 employees',
            features: [
                'Basic employee management',
                'Monthly spending reports',
                'Email support',
                'Standard delivery',
                'Basic analytics',
            ],
            popular: false,
        },
        {
            id: 'standard',
            name: 'Standard',
            price: '₹8,999',
            description: 'Great for growing companies',
            employees: 'Up to 100 employees',
            features: [
                'Advanced employee management',
                'Real-time analytics',
                'Priority support',
                'Custom spending limits',
                'Bulk ordering',
                'API access',
            ],
            popular: true,
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 'Custom',
            description: 'For large organizations',
            employees: 'Unlimited employees',
            features: [
                'Everything in Standard',
                'Dedicated account manager',
                'Custom integrations',
                'Advanced reporting',
                'SLA guarantee',
                'White-label options',
            ],
            popular: false,
        },
    ];

    const testimonials: Testimonial[] = [
        {
            company: 'TechCorp Inc.',
            testimonial:
                'Carve has transformed our office meal experience. The corporate dashboard gives us complete visibility into our food spending.',
            author: 'Sarah Johnson',
            position: 'HR Director',
            employees: '500+ employees',
            savings: '30% cost reduction',
        },
        {
            company: 'StartupXYZ',
            testimonial:
                'The employee management features are fantastic. We can easily onboard new team members and track meal allowances.',
            author: 'Mike Chen',
            position: 'Operations Manager',
            employees: '150+ employees',
            savings: '25% time saved',
        },
        {
            company: 'Global Solutions',
            testimonial:
                'Outstanding support and analytics. The insights help us make better decisions about our employee benefits program.',
            author: 'Emily Rodriguez',
            position: 'Benefits Manager',
            employees: '1000+ employees',
            savings: '40% efficiency gain',
        },
    ];

    const stats: Stat[] = [
        { label: 'Corporate Clients', value: '500+', icon: Building2 },
        { label: 'Employees Served', value: '50K+', icon: Users },
        { label: 'Orders Delivered', value: '2M+', icon: Truck },
        { label: 'Cost Savings', value: '35%', icon: TrendingUp },
    ];

    const useCases: Feature[] = [
        {
            icon: Coffee,
            title: 'Daily Meals',
            description:
                'Provide breakfast, lunch, and dinner options for your employees with flexible meal allowances.',
        },
        {
            icon: UsersRound,
            title: 'Team Events',
            description:
                'Order catering for meetings, celebrations, and team building events with bulk ordering features.',
        },
        {
            icon: Clock,
            title: 'Late Night Work',
            description:
                'Support employees working late with extended ordering hours and priority delivery.',
        },
        {
            icon: Gift,
            title: 'Employee Perks',
            description:
                'Enhance your benefits package with meal credits and special occasion treats.',
        },
    ];

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Contact submitted:', contactForm);
        setShowContactForm(false);
        setContactForm({
            companyName: '',
            contactName: '',
            email: '',
            phone: '',
            employeeCount: '',
            message: '',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div className="absolute inset-0">
                    <div className="bg-primary/10 absolute top-20 right-20 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
                    <div className="bg-primary-hover/10 absolute bottom-20 left-20 h-96 w-96 rounded-full blur-3xl"></div>
                </div>

                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
                            backgroundSize: '50px 50px',
                        }}
                    ></div>
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:py-28">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="bg-primary/20 border-gray-700 mb-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold text-yellow-400 shadow-lg backdrop-blur-xl">
                            <Building2 className="h-4 w-4" />
                            Corporate Solutions
                        </div>

                        <h1 className="mb-6 text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
                            <span className="text-white">Feed Your Team,</span>
                            <br />
                            <span className="to-primary-hover bg-gradient-to-r from-yellow-400 via-yellow-300 bg-clip-text text-transparent">
                                Fuel Success
                            </span>
                        </h1>

                        <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
                            Streamline your corporate food ordering with our comprehensive
                            platform. Manage employees, track spending, and boost
                            productivity.
                        </p>

                        <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
                            <button
                                onClick={() => setShowContactForm(true)}
                                className="group bg-primary hover:bg-primary-hover text-gray-900 flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-bold shadow-xl transition-all hover:shadow-2xl"
                            >
                                Get Started
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </button>
                            <button className="group hover:text-gray-900 flex items-center justify-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-4 font-bold text-white backdrop-blur-xl transition-all hover:bg-white">
                                <Play className="h-5 w-5" />
                                Watch Demo
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                            {stats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={i}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                                    >
                                        <div className="bg-primary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
                                            <Icon className="text-gray-900 h-6 w-6" />
                                        </div>
                                        <div className="mb-1 text-3xl font-bold text-white">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm font-medium text-gray-400">
                                            {stat.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="mx-auto max-w-7xl px-4 py-20">
                <div className="mb-16 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800">
                        <Sparkles className="h-4 w-4" />
                        Powerful Features
                    </div>
                    <h2 className="text-gray-900 mb-4 text-4xl font-bold md:text-5xl">
                        Everything You Need for Corporate Food Management
                    </h2>
                    <p className="text-gray-500 mx-auto max-w-3xl text-xl">
                        Our platform is designed specifically for businesses to manage
                        employee meals efficiently and cost-effectively.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {corporateFeatures.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={i}
                                className="group border-gray-200 hover:border-yellow-400 rounded-2xl border bg-white p-8 transition-all duration-300 hover:shadow-2xl"
                            >
                                <div className="to-primary-hover mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 shadow-lg transition-transform group-hover:scale-110">
                                    <Icon className="text-gray-900 h-8 w-8" />
                                </div>
                                <h3 className="text-gray-900 mb-3 text-xl font-bold">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Use Cases */}
            <div className="bg-gray-50 py-20">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-16 text-center">
                        <h2 className="text-gray-900 mb-4 text-4xl font-bold md:text-5xl">
                            Perfect for Every Occasion
                        </h2>
                        <p className="text-gray-500 mx-auto max-w-3xl text-xl">
                            From daily meals to special events, we've got your corporate food
                            needs covered.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {useCases.map((useCase, i) => {
                            const Icon = useCase.icon;
                            return (
                                <div
                                    key={i}
                                    className="border-gray-200 rounded-2xl border bg-white p-6 text-center transition-all hover:shadow-xl"
                                >
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                                        <Icon className="h-8 w-8 text-yellow-600" />
                                    </div>
                                    <h3 className="text-gray-900 mb-2 text-lg font-bold">
                                        {useCase.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {useCase.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="mx-auto max-w-7xl px-4 py-20">
                <div className="mb-16 text-center">
                    <h2 className="text-gray-900 mb-4 text-4xl font-bold md:text-5xl">
                        Choose Your Plan
                    </h2>
                    <p className="text-gray-500 mx-auto max-w-3xl text-xl">
                        Flexible pricing options to fit your company size and needs.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {pricingPlans.map(plan => (
                        <div
                            key={plan.id}
                            className={`relative rounded-3xl border-2 bg-white p-8 transition-all hover:shadow-2xl ${plan.popular
                                    ? 'border-yellow-400 scale-105 shadow-xl'
                                    : 'border-gray-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="to-primary-hover text-gray-900 rounded-full bg-gradient-to-r from-yellow-400 px-5 py-2 text-sm font-bold shadow-lg">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-8 text-center">
                                <h3 className="text-gray-900 mb-2 text-2xl font-bold">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-500 mb-6">{plan.description}</p>
                                <div className="mb-4">
                                    <span className="text-gray-900 text-5xl font-bold">
                                        {plan.price}
                                    </span>
                                    {plan.price !== 'Free' && plan.price !== 'Custom' && (
                                        <span className="text-gray-500">/month</span>
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm font-semibold">
                                    {plan.employees}
                                </p>
                            </div>

                            <ul className="mb-8 space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                        <span className="text-gray-500">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => setShowContactForm(true)}
                                className={`w-full rounded-2xl py-4 font-bold transition-all ${plan.popular
                                        ? 'bg-primary hover:bg-primary-hover text-gray-900 shadow-lg hover:shadow-xl'
                                        : 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className="bg-gray-50 py-20">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-16 text-center">
                        <h2 className="text-gray-900 mb-4 text-4xl font-bold md:text-5xl">
                            Trusted by Leading Companies
                        </h2>
                        <p className="text-gray-500 mx-auto max-w-3xl text-xl">
                            Join hundreds of satisfied HR and operations teams who rely on us
                            every day.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {testimonials.map((testimonial, i) => (
                            <div
                                key={i}
                                className="border-gray-200 rounded-2xl border bg-white p-8 transition-all hover:shadow-xl"
                            >
                                <div className="mb-6">
                                    <div className="mb-4 flex gap-1">
                                        {[...Array(5)].map((_, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-primary h-5 w-5 rounded-full"
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="text-gray-500 mb-6 leading-relaxed">
                                        "{testimonial.testimonial}"
                                    </p>
                                </div>

                                <div className="border-gray-200 border-t pt-6">
                                    <p className="text-gray-900 mb-1 font-bold">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-gray-500 mb-1 text-sm">
                                        {testimonial.position}
                                    </p>
                                    <p className="text-gray-900 text-sm font-semibold">
                                        {testimonial.company}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <span className="text-gray-500">
                                            {testimonial.employees}
                                        </span>
                                        <span className="font-semibold text-green-600">
                                            {testimonial.savings}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="mx-auto max-w-7xl px-4 py-20">
                <div className="to-primary-hover relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-400 p-12 text-center md:p-16">
                    <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

                    <div className="relative">
                        <h2 className="text-gray-900 mb-6 text-4xl font-bold md:text-5xl">
                            Ready to Supercharge Your Team Meals?
                        </h2>
                        <p className="text-gray-900 mx-auto mb-8 max-w-2xl text-xl">
                            Get a personalized demo or start for free in minutes.
                        </p>
                        <button
                            onClick={() => setShowContactForm(true)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-10 py-5 font-bold text-white shadow-xl transition-all hover:bg-gray-800 hover:shadow-2xl"
                        >
                            Contact Sales
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            {showContactForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
                        <button
                            onClick={() => setShowContactForm(false)}
                            className="text-gray-500 hover:text-gray-900 absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-gray-900 mb-2 text-3xl font-bold">
                            Let's Talk
                        </h3>
                        <p className="text-gray-500 mb-8">
                            Fill out the form and our team will get back to you within 24
                            hours.
                        </p>

                        <div className="space-y-5">
                            <input
                                className="w-full rounded-xl border border-gray-300 px-5 py-4 transition-all focus:border-transparent focus:ring-2 focus:ring-yellow-400"
                                placeholder="Company Name"
                                value={contactForm.companyName}
                                onChange={e =>
                                    setContactForm({
                                        ...contactForm,
                                        companyName: e.target.value,
                                    })
                                }
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                                <input
                                    className="w-full rounded-xl border border-gray-300 px-5 py-4 transition-all focus:border-transparent focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Contact Name"
                                    value={contactForm.contactName}
                                    onChange={e =>
                                        setContactForm({
                                            ...contactForm,
                                            contactName: e.target.value,
                                        })
                                    }
                                />
                                <input
                                    type="email"
                                    className="w-full rounded-xl border border-gray-300 px-5 py-4 transition-all focus:border-transparent focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Email"
                                    value={contactForm.email}
                                    onChange={e =>
                                        setContactForm({ ...contactForm, email: e.target.value })
                                    }
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <input
                                    className="w-full rounded-xl border border-gray-300 px-5 py-4 transition-all focus:border-transparent focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Phone Number"
                                    value={contactForm.phone}
                                    onChange={e =>
                                        setContactForm({ ...contactForm, phone: e.target.value })
                                    }
                                />
                                <input
                                    type="number"
                                    className="w-full rounded-xl border border-gray-300 px-5 py-4 transition-all focus:border-transparent focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Number of Employees"
                                    value={contactForm.employeeCount}
                                    onChange={e =>
                                        setContactForm({
                                            ...contactForm,
                                            employeeCount: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <textarea
                                rows={4}
                                className="w-full resize-none rounded-xl border border-gray-300 px-5 py-4 transition-all focus:border-transparent focus:ring-2 focus:ring-yellow-400"
                                placeholder="How can we help your organization?"
                                value={contactForm.message}
                                onChange={e =>
                                    setContactForm({ ...contactForm, message: e.target.value })
                                }
                            />

                            <button
                                onClick={handleContactSubmit}
                                className="bg-primary hover:bg-primary-hover text-gray-900 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold shadow-lg transition-all hover:shadow-xl"
                            >
                                Submit Request
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CorporatePage;
