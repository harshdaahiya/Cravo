import React, { useState } from 'react';
import SEO from '../../components/shared/SEO';
import {
    AlertCircle,
    ChevronDown,
    ChevronUp,
    CreditCard,
    ExternalLink,
    FileText,
    HelpCircle,
    Mail,
    MessageCircle,
    Package,
    Phone,
    Search,
    Send,
    Settings,
    Shield,
    ThumbsDown,
    ThumbsUp,
    User,
    Video,
    X,
    LucideIcon
} from 'lucide-react';

interface Faq {
    id: number;
    category: string;
    question: string;
    answer: string;
    helpful: number;
    notHelpful: number;
}

interface FaqCategory {
    key: string;
    label: string;
    icon: LucideIcon;
}

interface QuickAction {
    title: string;
    description: string;
    icon: LucideIcon;
}

interface ContactMethod {
    type: string;
    description: string;
    availability: string;
    time: string;
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
}

interface Ticket {
    id: string;
    subject: string;
    category: string;
    status: 'open' | 'in_progress' | 'resolved';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    messages: number;
}

interface Guide {
    title: string;
    desc: string;
    icon: LucideIcon;
}

const HelpSupport: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets' | 'guides'>('faq');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactForm, setContactForm] = useState({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: '',
    });

    const faqCategories: FaqCategory[] = [
        { key: 'all', label: 'All Topics', icon: FileText },
        { key: 'orders', label: 'Orders', icon: Package },
        { key: 'payments', label: 'Payments', icon: CreditCard },
        { key: 'account', label: 'Account', icon: User },
        { key: 'technical', label: 'Technical', icon: Settings },
    ];

    const faqs: Faq[] = [
        {
            id: 1,
            category: 'orders',
            question: 'How can I track my order?',
            answer:
                'You can track your order in real-time by going to "My Orders" section. You\'ll see live updates and receive notifications for major status changes.',
            helpful: 45,
            notHelpful: 3,
        },
        {
            id: 2,
            category: 'orders',
            question: 'What should I do if my order is late?',
            answer:
                'If your order is delayed beyond the estimated time, contact our support team. We can track your order and provide updates or compensation if needed.',
            helpful: 38,
            notHelpful: 2,
        },
        {
            id: 3,
            category: 'orders',
            question: 'Can I modify or cancel my order?',
            answer:
                'You can cancel within the first few minutes after placing it. Go to active orders and click "Cancel Order". Modifications aren\'t possible once confirmed.',
            helpful: 52,
            notHelpful: 8,
        },
        {
            id: 4,
            category: 'payments',
            question: 'What payment methods do you accept?',
            answer:
                'We accept credit/debit cards, UPI, net banking, and digital wallets. You can save multiple payment methods for faster checkout.',
            helpful: 67,
            notHelpful: 1,
        },
        {
            id: 5,
            category: 'payments',
            question: 'How do refunds work?',
            answer:
                'Refunds are processed to your original payment method within 5-7 business days. Cancelled orders get full refunds.',
            helpful: 41,
            notHelpful: 6,
        },
        {
            id: 6,
            category: 'account',
            question: 'How do I reset my password?',
            answer:
                'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a reset link. Check spam if you don\'t see it.',
            helpful: 73,
            notHelpful: 2,
        },
        {
            id: 7,
            category: 'technical',
            question: 'The app is not working properly',
            answer:
                'Try closing and reopening the app. Check for updates and clear the cache. If issues persist, contact our support team.',
            helpful: 56,
            notHelpful: 7,
        },
    ];

    const quickActions: QuickAction[] = [
        { title: 'Track Order', description: 'Check order status', icon: Package },
        {
            title: 'Report Issue',
            description: 'Report a problem',
            icon: AlertCircle,
        },
        { title: 'Account Help', description: 'Manage settings', icon: User },
        {
            title: 'Payment Issues',
            description: 'Fix billing problems',
            icon: CreditCard,
        },
    ];

    const contactMethods: ContactMethod[] = [
        {
            type: 'Live Chat',
            description: 'Chat with our team',
            availability: 'Available 24/7',
            time: '2-3 min response',
            icon: MessageCircle,
            bgColor: 'bg-success-muted',
            iconColor: 'text-success',
        },
        {
            type: 'Phone Support',
            description: 'Call us directly',
            availability: 'Mon-Sun • 8 AM-10 PM',
            time: '+91 555-1234-FOOD',
            icon: Phone,
            bgColor: 'bg-info-muted',
            iconColor: 'text-info',
        },
        {
            type: 'Email Support',
            description: 'Send us an email',
            availability: 'Reply within 4-6 hours',
            time: 'support@carve.com',
            icon: Mail,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ];

    const supportTickets: Ticket[] = [
        {
            id: 'TKT-001',
            subject: 'Order never arrived',
            category: 'orders',
            status: 'resolved',
            priority: 'high',
            createdAt: '2024-01-20',
            messages: 3,
        },
        {
            id: 'TKT-002',
            subject: 'Refund request',
            category: 'payments',
            status: 'in_progress',
            priority: 'medium',
            createdAt: '2024-01-19',
            messages: 5,
        },
    ];

    const guides: Guide[] = [
        {
            title: 'Getting Started',
            desc: 'Quick overview of features',
            icon: FileText,
        },
        { title: 'How to Order', desc: 'Step-by-step guide', icon: Video },
        {
            title: 'Manage Payments',
            desc: 'Add/edit payment methods',
            icon: CreditCard,
        },
        { title: 'Account Security', desc: 'Keep your account safe', icon: Shield },
        {
            title: 'App Settings',
            desc: 'Customize your experience',
            icon: Settings,
        },
        { title: 'Video Tutorials', desc: 'Watch quick tutorials', icon: Video },
    ];

    const filteredFaqs = faqs.filter(f => {
        const term = searchTerm.toLowerCase();
        const matches =
            f.question.toLowerCase().includes(term) ||
            f.answer.toLowerCase().includes(term);
        const cat = selectedCategory === 'all' || f.category === selectedCategory;
        return matches && cat;
    });

    const getStatusStyle = (status: Ticket['status']) => {
        const styles = {
            open: 'bg-warning-muted text-warning-foreground',
            in_progress: 'bg-info-muted text-info-foreground',
            resolved: 'bg-success-muted text-success-foreground',
        };
        return styles[status] || 'bg-muted text-foreground';
    };

    const getPriorityStyle = (priority: Ticket['priority']) => {
        const styles = {
            high: 'bg-destructive-muted text-destructive-foreground',
            medium: 'bg-warning-muted text-warning-foreground',
            low: 'bg-success-muted text-success-foreground',
        };
        return styles[priority] || 'bg-muted text-foreground';
    };

    const FAQTab = () => (
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {quickActions.map(action => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.title}
                            onClick={() => {
                                if (action.title === 'Report Issue') setShowContactForm(true);
                            }}
                            className="border-border hover:border-ring group rounded-2xl border bg-background p-4 text-left transition-all hover:shadow-lg"
                        >
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-warning-muted transition-colors group-hover:bg-warning-muted">
                                <Icon className="h-6 w-6 text-primary-hover" />
                            </div>
                            <h3 className="text-foreground mb-1 text-sm font-bold">
                                {action.title}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                {action.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Search & Filters */}
            <div className="border-border space-y-4 rounded-2xl border bg-background p-6">
                <div className="relative">
                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search frequently asked questions..."
                        className="w-full rounded-xl border border-border py-3 pr-4 pl-12 focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {faqCategories.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-all ${selectedCategory === cat.key
                                    ? 'bg-primary text-foreground shadow-lg'
                                    : 'text-muted-foreground bg-muted hover:bg-muted'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
                {filteredFaqs.length === 0 ? (
                    <div className="border-border rounded-2xl border bg-background p-12 text-center">
                        <HelpCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="text-foreground mb-2 text-xl font-bold">
                            No FAQs found
                        </h3>
                        <p className="text-muted-foreground">
                            Try different keywords or another category
                        </p>
                    </div>
                ) : (
                    filteredFaqs.map(faq => (
                        <div
                            key={faq.id}
                            className="border-border overflow-hidden rounded-2xl border bg-background"
                        >
                            <button
                                onClick={() =>
                                    setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                                }
                                className="hover:bg-muted flex w-full items-center justify-between p-5 text-left transition-colors"
                            >
                                <h3 className="text-foreground pr-4 font-semibold">
                                    {faq.question}
                                </h3>
                                {expandedFaq === faq.id ? (
                                    <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                )}
                            </button>

                            {expandedFaq === faq.id && (
                                <div className="border-t border-border px-5 pb-5">
                                    <p className="text-muted-foreground mt-4 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                    <div className="mt-4 flex items-center gap-3">
                                        <span className="text-muted-foreground text-sm">
                                            Was this helpful?
                                        </span>
                                        <button className="inline-flex items-center gap-1 rounded-lg bg-success-muted px-3 py-1 text-sm font-medium text-success-foreground transition-colors hover:bg-success-muted">
                                            <ThumbsUp className="h-4 w-4" />
                                            {faq.helpful}
                                        </button>
                                        <button className="inline-flex items-center gap-1 rounded-lg bg-destructive-muted px-3 py-1 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive-muted">
                                            <ThumbsDown className="h-4 w-4" />
                                            {faq.notHelpful}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const ContactTab = () => (
        <div className="space-y-6">
            {/* Contact Methods */}
            <div className="grid gap-4 md:grid-cols-3">
                {contactMethods.map(method => {
                    const Icon = method.icon;
                    return (
                        <button
                            key={method.type}
                            onClick={() =>
                                method.type === 'Email Support' && setShowContactForm(true)
                            }
                            className="border-border hover:border-ring rounded-2xl border bg-background p-6 text-left transition-all hover:shadow-lg"
                        >
                            <div
                                className={`h-14 w-14 ${method.bgColor} mb-4 flex items-center justify-center rounded-xl`}
                            >
                                <Icon className={`h-7 w-7 ${method.iconColor}`} />
                            </div>
                            <h3 className="text-foreground mb-2 font-bold">{method.type}</h3>
                            <p className="text-muted-foreground mb-3 text-sm">
                                {method.description}
                            </p>
                            <p className="text-muted-foreground text-xs">{method.availability}</p>
                            <p className="text-foreground mt-1 text-xs font-semibold">
                                {method.time}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Contact Form */}
            {showContactForm && (
                <div className="border-border rounded-2xl border bg-background p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-foreground text-xl font-bold">
                            Send us a message
                        </h3>
                        <button
                            onClick={() => setShowContactForm(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-muted"
                        >
                            <X className="text-muted-foreground h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-foreground mb-2 block text-sm font-semibold">
                                Subject
                            </label>
                            <input
                                value={contactForm.subject}
                                onChange={e =>
                                    setContactForm({ ...contactForm, subject: e.target.value })
                                }
                                className="w-full rounded-xl border border-border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-none"
                                placeholder="Brief description of your issue"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-foreground mb-2 block text-sm font-semibold">
                                    Category
                                </label>
                                <select
                                    value={contactForm.category}
                                    onChange={e =>
                                        setContactForm({ ...contactForm, category: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-none"
                                >
                                    <option value="general">General</option>
                                    <option value="orders">Orders</option>
                                    <option value="payments">Payments</option>
                                    <option value="technical">Technical</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-foreground mb-2 block text-sm font-semibold">
                                    Priority
                                </label>
                                <select
                                    value={contactForm.priority}
                                    onChange={e =>
                                        setContactForm({ ...contactForm, priority: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-foreground mb-2 block text-sm font-semibold">
                                Message
                            </label>
                            <textarea
                                value={contactForm.message}
                                onChange={e =>
                                    setContactForm({ ...contactForm, message: e.target.value })
                                }
                                rows={5}
                                className="w-full resize-none rounded-xl border border-border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-none"
                                placeholder="Describe your issue in detail..."
                            />
                        </div>

                        <button className="bg-primary hover:bg-primary-hover text-foreground inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition-colors">
                            <Send className="h-4 w-4" />
                            Submit Request
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const TicketsTab = () => (
        <div className="space-y-4">
            {supportTickets.map(ticket => (
                <div
                    key={ticket.id}
                    className="border-border rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                                <h3 className="text-foreground font-bold">{ticket.subject}</h3>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(ticket.status)}`}
                                >
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Created: {new Date(ticket.createdAt).toLocaleDateString()} •{' '}
                                {ticket.messages} messages
                            </p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(ticket.priority)}`}
                        >
                            {ticket.priority}
                        </span>
                    </div>
                </div>
            ))}

            {supportTickets.length === 0 && (
                <div className="border-border rounded-2xl border bg-background p-12 text-center">
                    <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <h3 className="text-foreground mb-2 text-xl font-bold">
                        No support tickets
                    </h3>
                    <p className="text-muted-foreground">
                        You haven't created any support tickets yet
                    </p>
                </div>
            )}
        </div>
    );

    const GuidesTab = () => (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.map(guide => {
                const Icon = guide.icon;
                return (
                    <a
                        key={guide.title}
                        href="#"
                        className="group border-border hover:border-ring rounded-2xl border bg-background p-6 transition-all hover:shadow-lg"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-warning-muted transition-colors group-hover:bg-warning-muted">
                            <Icon className="h-6 w-6 text-primary-hover" />
                        </div>
                        <h3 className="text-foreground mb-2 font-bold">{guide.title}</h3>
                        <p className="text-muted-foreground mb-3 text-sm">{guide.desc}</p>
                        <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary-hover" />
                    </a>
                );
            })}
        </div>
    );

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <SEO
                title="Help & Support"
                description="Get 24/7 customer support, browse frequently asked questions, track active support tickets, and read ordering guides on Cravo."
            />
            {/* Header */}
            <div>
                <h1 className="text-foreground text-3xl font-bold">Help & Support</h1>
                <p className="text-muted-foreground mt-1">We're here to help you 24/7</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'faq', label: 'FAQs' },
                    { id: 'contact', label: 'Contact Us' },
                    { id: 'tickets', label: 'My Tickets' },
                    { id: 'guides', label: 'Guides' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`rounded-xl px-6 py-2.5 font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                            ? 'bg-primary text-foreground shadow-lg'
                            : 'text-muted-foreground border-border hover:bg-muted border bg-background'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'faq' && <FAQTab />}
            {activeTab === 'contact' && <ContactTab />}
            {activeTab === 'tickets' && <TicketsTab />}
            {activeTab === 'guides' && <GuidesTab />}
        </div>
    );
};

export default HelpSupport;
