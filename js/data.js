// js/data.js - Kişisel Gelir, Gider, Maaş, Abonelik, Fon/Yatırım ve Alınacaklar Veri Modeli

const STORAGE_KEY = 'kisisel_muhasebe_data_v4';

// Gerçekçi Başlangıç Verileri
const INITIAL_DATA = {
    settings: {
        userName: "Benim Bütçem",
        monthlySalaryTarget: 65000,
        currency: "₺"
    },
    // Hesaplar: Elimdeki harcanabilir aktif para (bank & cash) vs Ayrı tutulan Kasa / Yatırım (kasa, altin, fon)
    accounts: [
        { id: "acc-1", name: "Maaş / Vadesiz Hesap", type: "bank", balance: 48500, iban: "Garanti BBVA" },
        { id: "acc-2", name: "Nakit Cüzdan", type: "cash", balance: 3400, iban: "Nakit Para" },
        // Kasa & Yatırım (Toplam paradan ayrı tutulur)
        { id: "fund-kasa", name: "Kasa (Acil Durum Parası)", type: "kasa", balance: 25000, iban: "Evdeki / Güvence Kasası" },
        { id: "fund-altin", name: "Altın Hesabı", type: "altin", balance: 45000, iban: "Gram & Çeyrek Altın" },
        { id: "fund-fon", name: "Yatırım Fonu (TEFAS / Hisse)", type: "fon", balance: 50000, iban: "Portföy & Fon" }
    ],
    categories: {
        income: [
            "Aylık Maaş",
            "Prim & Bonus",
            "Ek İş / Freelance",
            "Kira / Pasif Gelir",
            "Fondan Para Çekme (Bozdurma)",
            "Diğer Gelir"
        ],
        expense: [
            "Ev Kirası & Aidat",
            "Market & Mutfak",
            "Faturalar (Elektrik, Su, Doğalgaz, İnternet)",
            "Ulaşım & Akaryakıt",
            "Dışarıda Yeme & İçme",
            "Fona / Kasaya Para Aktarma (Yatırım)",
            "Kredi & Kredi Kartı Ödemesi",
            "Sağlık & Kişisel Bakım",
            "Giyim & Alışveriş",
            "Elektronik & Teknoloji",
            "Ev & Yaşam",
            "Eğlence & Abonelikler (Netflix, Spotify vb.)",
            "Diğer Giderler"
        ]
    },
    // Düzenli Abonelikler (Hem Gider hem Gelir olabilir)
    subscriptions: [
        {
            id: "sub-0",
            name: "Aylık Net Maaş",
            type: "income", // DÜZENLİ GELİR
            category: "Aylık Maaş",
            amount: 65000.00,
            billingDay: 1, // Her ayın 1'i
            accountId: "acc-1",
            status: "active",
            notes: "İş yerinden yatan net maaş"
        },
        {
            id: "sub-1",
            name: "Netflix Premium",
            type: "expense", // DÜZENLİ GİDER
            category: "Eğlence & Abonelikler (Netflix, Spotify vb.)",
            amount: 299.99,
            billingDay: 5,
            accountId: "acc-1",
            status: "active",
            notes: "4K UHD Aile Paketi"
        },
        {
            id: "sub-2",
            name: "Spotify Bireysel",
            type: "expense",
            category: "Eğlence & Abonelikler (Netflix, Spotify vb.)",
            amount: 59.90,
            billingDay: 12,
            accountId: "acc-1",
            status: "active",
            notes: "Müzik aboneliği"
        },
        {
            id: "sub-3",
            name: "YouTube Premium",
            type: "expense",
            category: "Eğlence & Abonelikler (Netflix, Spotify vb.)",
            amount: 79.99,
            billingDay: 18,
            accountId: "acc-1",
            status: "active",
            notes: "Reklamsız video"
        },
        {
            id: "sub-4",
            name: "Turkcell Superonline Fiber İnternet",
            type: "expense",
            category: "Faturalar (Elektrik, Su, Doğalgaz, İnternet)",
            amount: 420.00,
            billingDay: 22,
            accountId: "acc-1",
            status: "active",
            notes: "Ev 500 Mbps internet"
        },
        {
            id: "sub-5",
            name: "Spor Salonu Üyeliği (MACFit)",
            type: "expense",
            category: "Sağlık & Kişisel Bakım",
            amount: 1450.00,
            billingDay: 25,
            accountId: "acc-1",
            status: "active",
            notes: "Aylık spor salonu aidatı"
        },
        {
            id: "sub-6",
            name: "Apple iCloud 200 GB",
            type: "expense",
            category: "Eğlence & Abonelikler (Netflix, Spotify vb.)",
            amount: 79.99,
            billingDay: 28,
            accountId: "acc-1",
            status: "active",
            notes: "Telefon yedekleme"
        }
    ],
    // Alınacaklar (Hedefler)
    wishlist: [
        {
            id: "wsh-1",
            title: "Kışlık Su Geçirmez Bot",
            targetMonth: "2026-10",
            estimatedPrice: 3850,
            category: "Giyim & Alışveriş",
            priority: "high",
            status: "pending",
            notes: "Kış sezonu için"
        },
        {
            id: "wsh-2",
            title: "Ergonomik Çalışma Koltuğu",
            targetMonth: "2026-10",
            estimatedPrice: 6200,
            category: "Ev & Yaşam",
            priority: "medium",
            status: "pending",
            notes: "Bel desteği için"
        },
        {
            id: "wsh-3",
            title: "Bluetooth Kulak İçi Kulaklık",
            targetMonth: "2026-10",
            estimatedPrice: 1950,
            category: "Elektronik & Teknoloji",
            priority: "low",
            status: "purchased",
            notes: "Satın alındı"
        },
        {
            id: "wsh-4",
            title: "Akıllı Robot Süpürge",
            targetMonth: "2026-11",
            estimatedPrice: 14500,
            category: "Ev & Yaşam",
            priority: "medium",
            status: "pending",
            notes: "Kasım indirimleri bekleniyor"
        }
    ],
    transactions: [
        {
            id: "trx-1",
            date: "2026-10-01",
            type: "income",
            accountId: "acc-1",
            category: "Aylık Maaş",
            amount: 65000,
            description: "Ekim 2026 Net Maaş Ödemesi"
        },
        {
            id: "trx-2",
            date: "2026-10-02",
            type: "expense",
            accountId: "acc-1",
            category: "Ev Kirası & Aidat",
            amount: 22000,
            description: "Ekim Ayı Ev Kirası + Bina Aidatı"
        },
        {
            id: "trx-3",
            date: "2026-10-05",
            type: "expense",
            accountId: "acc-1",
            category: "Faturalar (Elektrik, Su, Doğalgaz, İnternet)",
            amount: 2850,
            description: "Ev faturaları toplamı (Enerjisa, İgdaş)"
        },
        {
            id: "trx-4",
            date: "2026-10-05",
            type: "expense",
            accountId: "acc-1",
            category: "Eğlence & Abonelikler (Netflix, Spotify vb.)",
            amount: 299.99,
            subscriptionId: "sub-1",
            description: "Abonelik: Netflix Premium (Ekim 2026)"
        },
        {
            id: "trx-5",
            date: "2026-10-08",
            type: "expense",
            accountId: "acc-1",
            category: "Market & Mutfak",
            amount: 4600,
            description: "Haftalık toplu market alışverişi"
        },
        {
            id: "trx-6",
            date: "2026-10-10",
            type: "income",
            accountId: "acc-1",
            category: "Ek İş / Freelance",
            amount: 12500,
            description: "Web danışmanlığı ek ödemesi"
        },
        {
            id: "trx-7",
            date: "2026-10-12",
            type: "expense",
            accountId: "acc-1",
            category: "Eğlence & Abonelikler (Netflix, Spotify vb.)",
            amount: 59.90,
            subscriptionId: "sub-2",
            description: "Abonelik: Spotify Bireysel (Ekim 2026)"
        },
        {
            id: "trx-8",
            date: "2026-10-12",
            type: "expense",
            accountId: "acc-1",
            category: "Ulaşım & Akaryakıt",
            amount: 2400,
            description: "Araç benzin dolumu"
        },
        {
            id: "trx-9",
            date: "2026-10-15",
            type: "expense",
            accountId: "acc-2",
            category: "Dışarıda Yeme & İçme",
            amount: 1850,
            description: "Hafta sonu akşam yemeği"
        },
        {
            id: "trx-10",
            date: "2026-10-18",
            type: "expense",
            accountId: "acc-1",
            category: "Eğlence & Abonelikler (Netflix, Spotify vb.)",
            amount: 79.99,
            subscriptionId: "sub-3",
            description: "Abonelik: YouTube Premium (Ekim 2026)"
        },
        {
            id: "trx-11",
            date: "2026-10-18",
            type: "expense",
            accountId: "acc-1",
            category: "Market & Mutfak",
            amount: 3200,
            description: "Kasap ve manav harcamaları"
        }
    ]
};

// Veri Yönetim Nesnesi
const DataStore = {
    data: null,

    init() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                this.data = JSON.parse(stored);
                if (!this.data.subscriptions) this.data.subscriptions = JSON.parse(JSON.stringify(INITIAL_DATA.subscriptions));
                if (!this.data.wishlist) this.data.wishlist = JSON.parse(JSON.stringify(INITIAL_DATA.wishlist));
                if (!this.data.accounts) this.data.accounts = JSON.parse(JSON.stringify(INITIAL_DATA.accounts));
                this.save();
            } catch (e) {
                console.error("Kayıtlı veri okunamadı, varsayılana dönülüyor:", e);
                this.resetToInitial();
            }
        } else {
            this.resetToInitial();
        }
    },

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error("Veri kaydedilemedi:", e);
        }
    },

    resetToInitial() {
        this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
        this.save();
    },

    clearAll() {
        this.data = {
            settings: { ...INITIAL_DATA.settings },
            accounts: [
                { id: "acc-1", name: "Maaş / Vadesiz Hesap", type: "bank", balance: 0, iban: "" },
                { id: "acc-2", name: "Nakit Cüzdan", type: "cash", balance: 0, iban: "" },
                { id: "fund-kasa", name: "Kasa (Acil Durum Parası)", type: "kasa", balance: 0, iban: "" },
                { id: "fund-altin", name: "Altın Hesabı", type: "altin", balance: 0, iban: "" },
                { id: "fund-fon", name: "Yatırım Fonu", type: "fon", balance: 0, iban: "" }
            ],
            categories: { ...INITIAL_DATA.categories },
            subscriptions: [],
            wishlist: [],
            transactions: []
        };
        this.save();
    },

    exportJSON() {
        return JSON.stringify(this.data, null, 2);
    },

    importJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed && parsed.accounts && parsed.transactions) {
                this.data = parsed;
                this.save();
                return true;
            }
        } catch (e) {
            console.error("Geçersiz JSON formatı:", e);
        }
        return false;
    },

    formatCurrency(amount) {
        const num = Number(amount) || 0;
        return num.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    formatDate(dateStr) {
        if (!dateStr) return '-';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        return dateStr;
    },

    formatMonthName(yearMonthStr) {
        if (!yearMonthStr) return '-';
        const parts = yearMonthStr.split('-');
        if (parts.length < 2) return yearMonthStr;

        const months = [
            "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
        ];
        const mIndex = parseInt(parts[1], 10) - 1;
        return `${months[mIndex] || parts[1]} ${parts[0]}`;
    },

    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    },

    getCurrentMonth() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    },

    // Kasa / Yatırım Hesaplarını Getir
    getFundAccounts() {
        return (this.data.accounts || []).filter(a => ['kasa', 'altin', 'fon', 'emergency', 'savings'].includes(a.type));
    },

    // Elimdeki Aktif Para Hesaplarını Getir (Vadesiz banka & nakit cüzdan)
    getActiveAccounts() {
        return (this.data.accounts || []).filter(a => ['bank', 'cash'].includes(a.type));
    },

    // Ana Sayfa Metrikleri (Elimdeki Para ile Kasa/Fon ayrı tutulur)
    getMainMetrics() {
        // 1. TOPLAM PARA = Sadece elimdeki kullanılabilir aktif para (Maaş & Cüzdan)
        // Kasa/Yatırım kutusu bu hesaptan AYRI tutulur!
        const activeAccounts = this.getActiveAccounts();
        const availableMoney = activeAccounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);

        // 2. KASA & YATIRIM KUTUSU = Kasa + Altın + Fon toplamı (Ayrı güvence hesabı)
        const fundAccounts = this.getFundAccounts();
        const totalFunds = fundAccounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);

        // Ayrı ayrı Kasa, Altın, Fon bakiyeleri
        const kasaBal = fundAccounts.filter(a => a.type === 'kasa' || a.name.toLowerCase().includes('kasa')).reduce((s, a) => s + (Number(a.balance) || 0), 0);
        const altinBal = fundAccounts.filter(a => a.type === 'altin' || a.name.toLowerCase().includes('altın')).reduce((s, a) => s + (Number(a.balance) || 0), 0);
        const fonBal = fundAccounts.filter(a => a.type === 'fon' || a.name.toLowerCase().includes('fon')).reduce((s, a) => s + (Number(a.balance) || 0), 0);

        // 3. Bu Ayki Toplam Gelir ve Toplam Gider
        const currentMonth = this.getCurrentMonth();
        let monthExpense = 0;
        let monthIncome = 0;

        this.data.transactions.forEach(t => {
            if (t.date && t.date.startsWith(currentMonth)) {
                const amt = Number(t.amount) || 0;
                if (t.type === 'expense') monthExpense += amt;
                if (t.type === 'income') monthIncome += amt;
            }
        });

        // 4. Abonelik Giderleri & Abonelik Gelirleri
        const activeSubs = (this.data.subscriptions || []).filter(s => s.status === 'active');
        const subscriptionExpenseTotal = activeSubs.filter(s => s.type === 'expense').reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
        const subscriptionIncomeTotal = activeSubs.filter(s => s.type === 'income').reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

        // 5. Bu Ay Alınması Gerekenler (Tahmini Gider)
        const wishlist = this.data.wishlist || [];
        const thisMonthPendingWishlist = wishlist.filter(w => w.targetMonth === currentMonth && w.status === 'pending');
        const thisMonthWishlistTotal = thisMonthPendingWishlist.reduce((sum, w) => sum + (Number(w.estimatedPrice) || 0), 0);

        const allPendingWishlist = wishlist.filter(w => w.status === 'pending');
        const allPendingWishlistTotal = allPendingWishlist.reduce((sum, w) => sum + (Number(w.estimatedPrice) || 0), 0);

        return {
            availableMoney, // ELİMDEKİ PARA (Kasa/Yatırım Hariç)
            totalFunds,     // KASA & YATIRIM TOPLAMI
            kasaBal,
            altinBal,
            fonBal,
            monthExpense,
            monthIncome,
            subscriptionExpenseTotal,
            subscriptionIncomeTotal,
            thisMonthWishlistTotal,
            thisMonthPendingCount: thisMonthPendingWishlist.length,
            allPendingWishlistTotal,
            allPendingCount: allPendingWishlist.length,
            currentMonth
        };
    }
};

DataStore.init();
