import React, { useState } from 'react';

import Icon from '../../components/ui/Icon';

interface PaymentMethod {
    id: number;
    type: 'credit' | 'paypal';
    brand?: 'visa' | 'mastercard' | 'amex' | 'discover';
    last4?: string;
    expiryMonth?: string;
    expiryYear?: string;
    holderName?: string;
    email?: string;
    isDefault: boolean;
    nickname: string;
}

interface Transaction {
    id: string;
    restaurant: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'refunded' | 'failed';
    paymentMethod: string;
    items: string[];
    orderId: string;
}

interface CardForm {
    holderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    nickname: string;
    isDefault: boolean;
}

const Payments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'methods' | 'history' | 'billing'>('methods');
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [editingCardId, setEditingCardId] = useState<number | null>(null);
    const [showCardNumber, setShowCardNumber] = useState<{ [key: number]: boolean }>({});
    const [filterPeriod, setFilterPeriod] = useState('all');

    // data
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: 1,
            type: 'credit',
            brand: 'visa',
            last4: '4242',
            expiryMonth: '12',
            expiryYear: '2025',
            holderName: 'John Doe',
            isDefault: true,
            nickname: 'Personal Visa',
        },
        {
            id: 2,
            type: 'credit',
            brand: 'mastercard',
            last4: '8888',
            expiryMonth: '08',
            expiryYear: '2026',
            holderName: 'John Doe',
            isDefault: false,
            nickname: 'Work Card',
        },
        {
            id: 3,
            type: 'paypal',
            email: 'john.doe@email.com',
            isDefault: false,
            nickname: 'PayPal Account',
        },
    ]);

    const [transactions] = useState<Transaction[]>([
        // (seed data unchanged) …
    ]);

    const [cardForm, setCardForm] = useState<CardForm>({
        holderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        nickname: '',
        isDefault: false,
    });

    // helper utilites
    const cardBrands: Record<string, { name: string; color: string }> = {
        visa: { name: 'Visa', color: 'bg-blue-600' },
        mastercard: { name: 'Mastercard', color: 'bg-red-600' },
        amex: { name: 'American Express', color: 'bg-green-600' },
        discover: { name: 'Discover', color: 'bg-orange-600' },
    };

    const getCardBrand = (number: string) => {
        const first = number.charAt(0);
        if (first === '4') return 'visa';
        if (first === '5') return 'mastercard';
        if (first === '3') return 'amex';
        if (first === '6') return 'discover';
        return 'visa';
    };

    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return 'text-green-700 bg-green-50';
            case 'pending':
                return 'text-yellow-600 bg-yellow-50';
            case 'refunded':
                return 'text-blue-600 bg-blue-50';
            case 'failed':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-500 bg-gray-50';
        }
    };

    const filteredTransactions = transactions.filter(t => {
        if (filterPeriod === 'all') return true;
        const diff = Date.now() - new Date(t.date).getTime();
        const day = 24 * 60 * 60 * 1000;
        if (filterPeriod === 'week') return diff <= 7 * day;
        if (filterPeriod === 'month') return diff <= 30 * day;
        if (filterPeriod === 'year') return diff <= 365 * day;
        return true;
    });

    // cards payment method
    const handleAddCard = () => {
        setCardForm({
            holderName: '',
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
            nickname: '',
            isDefault: false,
        });
        setIsAddingCard(true);
        setEditingCardId(null);
    };

    const handleEditCard = (method: PaymentMethod) => {
        setCardForm({
            holderName: method.holderName || '',
            cardNumber: '',
            expiryMonth: method.expiryMonth || '',
            expiryYear: method.expiryYear || '',
            cvv: '',
            nickname: method.nickname,
            isDefault: method.isDefault,
        });
        setIsAddingCard(true);
        setEditingCardId(method.id);
    };

    const handleSaveCard = () => {
        const brand = getCardBrand(cardForm.cardNumber || '4');
        const base: Partial<PaymentMethod> = {
            type: 'credit',
            brand: brand as any,
            last4: (cardForm.cardNumber || '').slice(-4),
            expiryMonth: cardForm.expiryMonth,
            expiryYear: cardForm.expiryYear,
            holderName: cardForm.holderName,
            nickname: cardForm.nickname || `${cardBrands[brand].name} Card`,
            isDefault: cardForm.isDefault,
        };

        setPaymentMethods(prev => {
            // if editing
            if (editingCardId) {
                return prev.map(m => (m.id === editingCardId ? { ...m, ...base } : m)) as PaymentMethod[];
            }
            // adding
            const id = Date.now();
            let newPrev = prev;
            if (cardForm.isDefault)
                newPrev = prev.map(m => ({ ...m, isDefault: false }));
            return [...newPrev, { ...base, id } as PaymentMethod];
        });

        setIsAddingCard(false);
        setEditingCardId(null);
    };

    const handleDeleteCard = (id: number) => {
        if (
            window.confirm('Are you sure you want to delete this payment method?')
        ) {
            setPaymentMethods(prev => prev.filter(m => m.id !== id));
        }
    };

    const handleSetDefault = (id: number) => {
        setPaymentMethods(prev =>
            prev.map(m => ({ ...m, isDefault: m.id === id }))
        );
    };

    const toggleCardVisibility = (id: number) =>
        setShowCardNumber(v => ({ ...v, [id]: !v[id] }));

    // tabs
    const PaymentMethodsTab = () => (
        <div className="space-y-6">
            {/* Header & Add button */}
            <div className="flex items-center justify-between">
                <h2 className="text-gray-900 text-2xl font-bold">Payment Methods</h2>
                <button
                    onClick={handleAddCard}
                    className="bg-primary hover:bg-yellow-600 flex transform items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                    <Icon name={'plus'} className="h-5 w-5" />
                    Add New Card
                </button>
            </div>

            {/* Add / Edit Form */}
            {isAddingCard && (
                <div className="border-gray-200 rounded-2xl border bg-white p-6 shadow-lg">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-gray-900 text-xl font-bold">
                            {editingCardId ? 'Edit Card' : 'Add New Card'}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveCard}
                                className="bg-green-500 flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-green-600"
                            >
                                <Icon name={'save'} className="h-4 w-4" />
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsAddingCard(false);
                                    setEditingCardId(null);
                                }}
                                className="flex items-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                            >
                                <Icon name={'x'} className="h-4 w-4" />
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-gray-900 mb-1 block text-sm font-semibold">Card Holder Name</label>
                                <input
                                    type="text"
                                    value={cardForm.holderName}
                                    onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="text-gray-900 mb-1 block text-sm font-semibold">Card Number</label>
                                <input
                                    type="text"
                                    value={cardForm.cardNumber}
                                    onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                    placeholder="0000 0000 0000 0000"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 grid-cols-3">
                            <div>
                                <label className="text-gray-900 mb-1 block text-sm font-semibold">Expiry Month</label>
                                <input
                                    type="text"
                                    value={cardForm.expiryMonth}
                                    onChange={(e) => setCardForm({ ...cardForm, expiryMonth: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                    placeholder="MM"
                                />
                            </div>
                            <div>
                                <label className="text-gray-900 mb-1 block text-sm font-semibold">Expiry Year</label>
                                <input
                                    type="text"
                                    value={cardForm.expiryYear}
                                    onChange={(e) => setCardForm({ ...cardForm, expiryYear: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                    placeholder="YYYY"
                                />
                            </div>
                            <div>
                                <label className="text-gray-900 mb-1 block text-sm font-semibold">CVV</label>
                                <input
                                    type="text"
                                    value={cardForm.cvv}
                                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                    placeholder="123"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-gray-900 mb-1 block text-sm font-semibold">Nickname</label>
                            <input
                                type="text"
                                value={cardForm.nickname}
                                onChange={(e) => setCardForm({ ...cardForm, nickname: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                placeholder="My Visa Card"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={cardForm.isDefault}
                                onChange={(e) => setCardForm({ ...cardForm, isDefault: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                            />
                            <label htmlFor="isDefault" className="text-gray-900 text-sm font-medium">Set as default payment method</label>
                        </div>
                    </div>
                </div>
            )}

            {/* Existing cards list */}
            <div className="space-y-4">
                {paymentMethods.map(m => (
                    <div
                        key={m.id}
                        className={`rounded-2xl border bg-white p-6 shadow-lg transition-all hover:shadow-xl ${m.isDefault ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            {/* Icon & details */}
                            <div className="flex items-center gap-4">
                                {/* Avatar circle */}
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${m.type === 'credit' && m.brand
                                        ? cardBrands[m.brand].color
                                        : 'bg-blue-500'
                                        }`}
                                >
                                    {m.type === 'credit' ? (
                                        <Icon name={'credit-card'} className="h-6 w-6 text-white" />
                                    ) : (
                                        <Icon name={'wallet'} className="h-6 w-6 text-white" />
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-gray-900 flex items-center gap-2 font-semibold">
                                        {m.nickname}
                                        {m.isDefault && (
                                            <span className="bg-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-white">
                                                <Icon name={'star'} className="h-3 w-3" /> Default
                                            </span>
                                        )}
                                    </h4>

                                    {m.type === 'credit' ? (
                                        <p className="text-gray-500 text-sm">
                                            {showCardNumber[m.id]
                                                ? `•••• ${m.last4}`
                                                : '•••• •••• •••• ' + m.last4}
                                            &nbsp;| Expires {m.expiryMonth}/{m.expiryYear}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 text-sm">{m.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {m.type === 'credit' && (
                                    <button
                                        onClick={() => toggleCardVisibility(m.id)}
                                        className="text-gray-500 rounded-lg p-2 transition-colors hover:bg-gray-100"
                                    >
                                        {showCardNumber[m.id] ? (
                                            <Icon name={'eye-off'} className="h-5 w-5" />
                                        ) : (
                                            <Icon name={'eye'} className="h-5 w-5" />
                                        )}
                                    </button>
                                )}

                                {!m.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(m.id)}
                                        className="rounded-lg px-3 py-2 text-sm text-yellow-600 transition-colors hover:bg-yellow-50 hover:text-yellow-700"
                                    >
                                        Set Default
                                    </button>
                                )}

                                <button
                                    onClick={() => handleEditCard(m)}
                                    className="text-green-600 rounded-lg p-2 transition-colors hover:bg-green-50 hover:text-green-700"
                                >
                                    <Icon name={'lucide-edit-3'} className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={() => handleDeleteCard(m.id)}
                                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                    <Icon name={'lucide-trash-2'} className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const HistoryTab = () => (
        <div className="space-y-6">
            {/* Filter */}
            <div className="flex items-center justify-between">
                <h2 className="text-gray-900 text-2xl font-bold">
                    Transaction History
                </h2>

                <div className="relative">
                    <Icon
                        name={'filter'}
                        className="text-gray-500 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
                    />
                    <select
                        value={filterPeriod}
                        onChange={e => setFilterPeriod(e.target.value)}
                        className="border-gray-200 rounded-lg border bg-white py-3 pr-8 pl-10 focus:ring-2 focus:ring-yellow-400"
                    >
                        <option value="all">All Time</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
            </div>

            {/* Transactions */}
            <div className="space-y-4">
                {filteredTransactions.map(t => (
                    <div
                        key={t.id}
                        className="border-gray-200 rounded-2xl border bg-white p-6 shadow-lg transition-all hover:shadow-xl"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="text-gray-900 flex items-center gap-2 font-semibold">
                                    {t.restaurant}
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                                            t.status
                                        )}`}
                                    >
                                        {t.status}
                                    </span>
                                </h4>
                                <p className="text-gray-500 text-sm">{t.paymentMethod}</p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(t.date).toLocaleString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-green-600 text-xl font-bold">
                                    ${t.amount.toFixed(2)}
                                </p>
                                <p className="text-gray-500 text-sm">{t.orderId}</p>
                                <button className="mt-2 flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-yellow-600 transition-colors hover:bg-yellow-50 hover:text-yellow-700">
                                    <Icon name={'receipt'} className="h-4 w-4" />
                                    Receipt
                                </button>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {t.items.map((i, idx) => (
                                <span
                                    key={idx}
                                    className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs"
                                >
                                    {i}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredTransactions.length === 0 && (
                    <div className="border-gray-200 rounded-2xl border bg-white p-12 text-center shadow-lg">
                        <Icon
                            name={'receipt'}
                            className="mx-auto h-10 w-10 text-yellow-400"
                        />
                        <h3 className="text-gray-900 mt-4 text-xl font-semibold">
                            No transactions found
                        </h3>
                        <p className="text-gray-500">
                            Change the filter period to see your past orders.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    const BillingTab = () => (
        <div className="space-y-6">
            <h2 className="text-gray-900 text-2xl font-bold">
                Billing &amp; Security
            </h2>

            <div className="border-gray-200 flex items-start gap-6 rounded-2xl border bg-white p-6 shadow-lg">
                <Icon
                    name={'shield'}
                    className="h-10 w-10 flex-shrink-0 text-yellow-400"
                />

                <div className="flex-1">
                    <h3 className="text-gray-900 mb-1 font-semibold">Secure Payments</h3>
                    <p className="text-gray-500 text-sm">
                        All card information is encrypted and processed over secure
                        channels.
                    </p>
                </div>
            </div>

            <div className="border-gray-200 rounded-2xl border bg-white p-6 shadow-lg">
                <h3 className="text-gray-900 mb-4 font-semibold">Next Payment</h3>
                <div className="flex items-center justify-between">
                    <div className="text-gray-500 flex items-center gap-3">
                        <Icon name={'calendar'} className="h-5 w-5" />
                        <span>15 July 2025</span>
                    </div>
                    <div className="text-gray-500 flex items-center gap-3">
                        <Icon name={'dollar-sign'} className="h-5 w-5" />
                        <span>$24.99</span>
                    </div>
                    <button className="bg-primary hover:bg-yellow-600 flex items-center gap-1 rounded-lg px-4 py-2 text-white transition-colors">
                        <Icon name={'download'} className="h-4 w-4" />
                        Invoice
                    </button>
                </div>
            </div>
        </div>
    );

    //  Main Render

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            {/* Tabs bar */}
            <div className="border-gray-200 flex gap-2 rounded-lg border bg-white p-1">
                {[
                    { id: 'methods', label: 'Payment Methods' },
                    { id: 'history', label: 'History' },
                    { id: 'billing', label: 'Billing' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'methods' | 'history' | 'billing')}
                        className={`rounded-md px-4 py-2 transition-colors ${activeTab === tab.id
                            ? 'bg-primary text-white'
                            : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === 'methods' && <PaymentMethodsTab />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'billing' && <BillingTab />}
        </div>
    );
};

export default Payments;
