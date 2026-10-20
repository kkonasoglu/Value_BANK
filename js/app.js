// js/app.js - Sade Kişisel Bütçe, Abonelik, Alınacaklar ve Admin Yönetimi

const App = {
    currentTab: 'dashboard',
    selectedSalaryMonth: null,

    init() {
        this.selectedSalaryMonth = DataStore.getCurrentMonth();
        this.setupNavigation();
        this.renderAll();
        this.updateUserDisplay();

        if (window.lucide) {
            lucide.createIcons();
        }
    },

    renderAll() {
        this.renderDashboard();
        this.renderTransactions();
        this.renderSubscriptions();
        this.renderWishlist();
        this.renderAccounts();
        this.renderAdmin();
        this.updateUserDisplay();

        if (window.lucide) {
            lucide.createIcons();
        }
    },

    // ================= SEKMELER VE GEÇİŞLER =================
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = item.getAttribute('data-tab');
                if (targetTab) {
                    this.switchTab(targetTab);
                }
            });
        });

        if (window.location.hash) {
            const hashTab = window.location.hash.replace('#', '');
            if (document.getElementById(`tab-${hashTab}`)) {
                this.switchTab(hashTab);
            }
        }
    },

    toggleMobileSidebar() {
        const sidebar = document.getElementById('app-sidebar');
        if (!sidebar) return;
        const isOpen = !sidebar.classList.contains('-translate-x-full');
        if (isOpen) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    },

    openMobileSidebar() {
        const sidebar = document.getElementById('app-sidebar');
        const backdrop = document.getElementById('mobile-sidebar-backdrop');
        if (sidebar) sidebar.classList.remove('-translate-x-full');
        if (backdrop) backdrop.classList.remove('hidden');
        document.body.classList.add('overflow-hidden', 'lg:overflow-auto');
    },

    closeMobileSidebar() {
        const sidebar = document.getElementById('app-sidebar');
        const backdrop = document.getElementById('mobile-sidebar-backdrop');
        if (sidebar) sidebar.classList.add('-translate-x-full');
        if (backdrop) backdrop.classList.add('hidden');
        document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
    },

    switchTab(tabId) {
        this.currentTab = tabId;

        // Masaüstü Sidebar Nav İtemleri
        document.querySelectorAll('.nav-item').forEach(el => {
            if (el.getAttribute('data-tab') === tabId) {
                el.classList.add('bg-blue-600', 'text-white');
                el.classList.remove('hover:bg-slate-800', 'text-slate-300');
            } else {
                el.classList.remove('bg-blue-600', 'text-white');
                el.classList.add('text-slate-300', 'hover:bg-slate-800');
            }
        });

        // Mobil Alt Menü İtemleri
        document.querySelectorAll('.mobile-nav-item').forEach(el => {
            if (el.getAttribute('data-tab') === tabId) {
                el.classList.add('text-blue-600', 'font-bold');
                el.classList.remove('text-slate-400');
            } else {
                el.classList.remove('text-blue-600', 'font-bold');
                el.classList.add('text-slate-400');
            }
        });

        this.closeMobileSidebar();

        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(`tab-${tabId}`);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        const titles = {
            dashboard: { title: "Ana Sayfa", sub: "Paranızın net durumu ve son işlemleriniz" },
            transactions: { title: "Tüm Hareketler", sub: "Maaş girişleriniz ve yaptığınız harcamaların dökümü" },
            subscriptions: { title: "Aboneliklerim", sub: "Her ay otomatik ve düzenli kesilen sabit ödemeleriniz" },
            wishlist: { title: "Alınacaklar", sub: "Aylık alışveriş hedefleriniz, tahmini giderler ve satın alma takibi" },
            accounts: { title: "Hesaplarım & Kasa", sub: "Banka hesaplarınız, nakit cüzdanınız ve acil durum kasanız" },
            admin: { title: "Admin Paneli", sub: "Tüm sayfa içeriklerini, hesap bakiyelerini ve kategorileri yönetin" }
        };

        const currentMeta = titles[tabId] || { title: "Kişisel Bütçem", sub: "" };
        document.getElementById('page-title').textContent = currentMeta.title;
        document.getElementById('page-subtitle').textContent = currentMeta.sub;

        if (tabId === 'dashboard') {
            this.renderDashboard();
        } else if (tabId === 'subscriptions') {
            this.renderSubscriptions();
        } else if (tabId === 'wishlist') {
            this.renderWishlist();
        } else if (tabId === 'accounts') {
            this.renderAccounts();
        } else if (tabId === 'admin') {
            this.renderAdmin();
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    },

    // ================= PROFİL & KULLANICI =================
    updateUserDisplay() {
        const s = DataStore.data.settings;
        const nameEl = document.getElementById('sidebar-user-name');
        if (nameEl) nameEl.textContent = s.userName || 'Benim Bütçem';

        // Alınacaklar menü rozeti (Bu ay bekleyen ürün sayısı)
        const navWishlistCount = document.getElementById('nav-wishlist-count');
        if (navWishlistCount) {
            const currentMonth = DataStore.getCurrentMonth();
            const count = (DataStore.data.wishlist || []).filter(w => w.targetMonth === currentMonth && w.status === 'pending').length;
            navWishlistCount.textContent = count;
        }
    },

    // ================= 1. ANA SAYFA (DASHBOARD) =================
    renderDashboard() {
        const metrics = DataStore.getMainMetrics();

        // 5 ANA KUTU DEĞERLERİ
        // KUTU 1: TOPLAM PARA (Sadece elimdeki harcanabilir nakit & banka)
        const elTotalMoney = document.getElementById('box-total-money');
        if (elTotalMoney) elTotalMoney.textContent = DataStore.formatCurrency(metrics.availableMoney);

        // KUTU 2: TOPLAM GİDER
        const elTotalExpense = document.getElementById('box-total-expense');
        if (elTotalExpense) elTotalExpense.textContent = DataStore.formatCurrency(metrics.monthExpense);

        // KUTU 3: ABONELİK GİDERLERİ
        const elSubExpense = document.getElementById('box-sub-expense');
        if (elSubExpense) elSubExpense.textContent = DataStore.formatCurrency(metrics.subscriptionExpenseTotal);

        // KUTU 4: BU AY ALINACAKLAR (TAHMİNİ GİDER)
        const elWishlistExpense = document.getElementById('box-wishlist-expense');
        if (elWishlistExpense) elWishlistExpense.textContent = DataStore.formatCurrency(metrics.thisMonthWishlistTotal);

        const elWishlistSub = document.getElementById('box-wishlist-sub');
        if (elWishlistSub) {
            elWishlistSub.textContent = `${DataStore.formatMonthName(metrics.currentMonth)} • ${metrics.thisMonthPendingCount} ürün bekliyor`;
        }

        // KUTU 5: KASA (ACİL DURUM PARASI - Harcanabilir paradan ayrı tutulur)
        const elEmergency = document.getElementById('box-emergency-money');
        if (elEmergency) elEmergency.textContent = DataStore.formatCurrency(metrics.kasaMoney);

        // AYLIK MAAŞ TAKİBİ & AY SEÇİM KARTI
        this.renderSalaryTracker();

        // SON 7 İŞLEM TABLOSU
        const recentTrx = [...DataStore.data.transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 7);

        const recentTbody = document.getElementById('dash-recent-transactions');
        if (!recentTbody) return;

        if (recentTrx.length === 0) {
            recentTbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400">Henüz kayıtlı bir işlem yok. "+ Gelir Ekle" veya "- Gider Ekle" butonlarını kullanarak başlayabilirsiniz.</td></tr>`;
        } else {
            recentTbody.innerHTML = recentTrx.map(trx => {
                const acc = DataStore.data.accounts.find(a => a.id === trx.accountId);
                const isIncome = trx.type === 'income';
                return `
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="py-3 px-4 text-slate-500 whitespace-nowrap">${DataStore.formatDate(trx.date)}</td>
                        <td class="py-3 px-4">
                            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${isIncome ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
                                ${isIncome ? '+ Gelir' : '- Gider'}
                            </span>
                        </td>
                        <td class="py-3 px-4 font-semibold text-slate-800">${trx.category}</td>
                        <td class="py-3 px-4 text-slate-600 truncate max-w-xs">${trx.description || '-'}</td>
                        <td class="py-3 px-4 text-slate-500">${acc ? acc.name : '-'}</td>
                        <td class="py-3 px-4 text-right font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}">
                            ${isIncome ? '+' : '-'}${DataStore.formatCurrency(trx.amount)}
                        </td>
                        <td class="py-3 px-4 text-center">
                            <div class="flex items-center justify-center gap-1">
                                <button onclick="App.editTransaction('${trx.id}')" title="Düzenle" class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg">
                                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                </button>
                                <button onclick="App.deleteTransaction('${trx.id}')" title="Sil" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        if (window.lucide) lucide.createIcons();
    },

    // ================= MAAŞ & AYLIK SEÇİM SİSTEMİ =================
    renderSalaryTracker() {
        const descEl = document.getElementById('salary-tracker-desc');
        const actionEl = document.getElementById('salary-tracker-action');
        const dayTextEl = document.getElementById('salary-tracker-day-text');
        const monthSelect = document.getElementById('salary-tracker-month-select');

        if (!descEl || !actionEl) return;

        if (!this.selectedSalaryMonth) {
            this.selectedSalaryMonth = DataStore.getCurrentMonth();
        }

        // Ay seçeneklerini doldur
        if (monthSelect) {
            if (monthSelect.children.length === 0) {
                const options = DataStore.getMonthOptions(6, 5);
                monthSelect.innerHTML = options.map(o => `
                    <option value="${o.value}" ${o.value === this.selectedSalaryMonth ? 'selected' : ''}>${o.label}</option>
                `).join('');
            } else {
                monthSelect.value = this.selectedSalaryMonth;
            }
        }

        const salarySettings = DataStore.getSalarySettings();
        if (dayTextEl) dayTextEl.textContent = `Her ayın ${salarySettings.salaryDay}'i`;

        const salaryTrx = DataStore.getSalaryTransactionForMonth(this.selectedSalaryMonth);
        const monthName = DataStore.formatMonthName(this.selectedSalaryMonth);

        if (salaryTrx) {
            const acc = DataStore.data.accounts.find(a => a.id === salaryTrx.accountId);
            const accName = acc ? acc.name : 'Banka Hesabı';
            descEl.innerHTML = `
                <span class="text-emerald-950 font-medium">
                    ✓ <strong>${monthName} Maaşı Yattı:</strong> ${DataStore.formatDate(salaryTrx.date)} tarihinde <strong>${DataStore.formatCurrency(salaryTrx.amount)}</strong> ${accName} hesabınıza işlendi.
                </span>
            `;
            actionEl.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-xs">
                        <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i> Bu Ay Yattı
                    </span>
                    <button onclick="App.deleteTransaction('${salaryTrx.id}')" title="Bu ayın maaş kaydını geri al / sil" class="px-2.5 py-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-xs font-semibold transition-colors cursor-pointer">
                        Geri Al
                    </button>
                </div>
            `;
        } else {
            const now = new Date();
            const [y, m] = this.selectedSalaryMonth.split('-').map(Number);
            const targetDate = new Date(y, m - 1, salarySettings.salaryDay);
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const isPastOrToday = today >= targetDate;
            const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

            if (isPastOrToday) {
                descEl.innerHTML = `
                    <span class="text-amber-900 font-semibold flex items-center gap-1">
                        <span>⚠️ <strong>${monthName}</strong> maaş ödeme günü geldi (${salarySettings.salaryDay} ${monthName.split(' ')[0]}). Henüz hesaba eklenmedi.</span>
                    </span>
                `;
                actionEl.innerHTML = `
                    <button onclick="App.processSalaryForSelectedMonth()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        <span>Maaşı Hesaba Yatır (${DataStore.formatCurrency(salarySettings.amount)})</span>
                    </button>
                `;
            } else {
                descEl.innerHTML = `
                    <span class="text-slate-600">
                        ⏳ <strong>${monthName}</strong> maaş gününe <strong>${diffDays} gün kaldı</strong> (${salarySettings.salaryDay} ${monthName.split(' ')[0]}).
                    </span>
                `;
                actionEl.innerHTML = `
                    <button onclick="App.processSalaryForSelectedMonth()" class="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 hover:text-emerald-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all">
                        <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i>
                        <span>Erken Yattıysa Şimdi Ekle</span>
                    </button>
                `;
            }
        }

        if (window.lucide) lucide.createIcons();
    },

    onSalaryMonthChange() {
        const select = document.getElementById('salary-tracker-month-select');
        if (select) {
            this.selectedSalaryMonth = select.value;
            this.renderSalaryTracker();
        }
    },

    processSalaryForSelectedMonth() {
        const month = this.selectedSalaryMonth || DataStore.getCurrentMonth();
        const s = DataStore.getSalarySettings();
        const monthName = DataStore.formatMonthName(month);

        if (confirm(`${monthName} net maaşı (${DataStore.formatCurrency(s.amount)}) hesabınıza aktarılsın mı?`)) {
            DataStore.recordSalaryForMonth(month);
            this.renderAll();
            this.showToast(`${monthName} maaşı başarıyla hesabınıza eklendi!`, 'success');
        }
    },

    openSalaryDayModal() {
        const salarySettings = DataStore.getSalarySettings();

        // 1-31 Günleri
        const daySelect = document.getElementById('modal-salary-day');
        if (daySelect) {
            daySelect.innerHTML = Array.from({ length: 31 }, (_, i) => i + 1).map(day => `
                <option value="${day}" ${day === salarySettings.salaryDay ? 'selected' : ''}>
                    Her ayın ${day}'i ${day === 15 ? '(Maaş Günü - Yaygın)' : (day === 1 ? '(Ay Başı)' : '')}
                </option>
            `).join('');
        }

        const amtInput = document.getElementById('modal-salary-amount');
        if (amtInput) amtInput.value = salarySettings.amount;

        const accSelect = document.getElementById('modal-salary-account');
        if (accSelect) {
            accSelect.innerHTML = DataStore.getActiveAccounts().map(a => `
                <option value="${a.id}" ${a.id === salarySettings.accountId ? 'selected' : ''}>
                    ${a.name} (${DataStore.formatCurrency(a.balance)})
                </option>
            `).join('');
        }

        this.openModal('modal-salary-settings');
    },

    saveSalarySettings(e) {
        e.preventDefault();
        const salaryDay = parseInt(document.getElementById('modal-salary-day').value) || 15;
        const amount = parseFloat(document.getElementById('modal-salary-amount').value) || 65000;
        const accountId = document.getElementById('modal-salary-account').value || 'acc-1';

        DataStore.setSalarySettings({ salaryDay, amount, accountId });

        this.closeModal('modal-salary-settings');
        this.renderAll();
        this.showToast(`Maaş ayarlarınız kaydedildi (Her ayın ${salaryDay}. günü).`, 'success');
    },

    // ================= 2. TÜM HAREKETLER =================
    renderTransactions() {
        const tbody = document.getElementById('transactions-table-body');
        if (!tbody) return;

        const searchQuery = (document.getElementById('trx-search')?.value || '').toLowerCase();
        const filterType = document.getElementById('trx-filter-type')?.value || 'all';
        const filterAcc = document.getElementById('trx-filter-account')?.value || 'all';

        let list = DataStore.data.transactions.filter(t => {
            const matchesSearch = (t.description && t.description.toLowerCase().includes(searchQuery)) ||
                (t.category && t.category.toLowerCase().includes(searchQuery));

            if (!matchesSearch) return false;
            if (filterType !== 'all' && t.type !== filterType) return false;
            if (filterAcc !== 'all' && t.accountId !== filterAcc) return false;
            return true;
        });

        const accFilterEl = document.getElementById('trx-filter-account');
        if (accFilterEl) {
            accFilterEl.innerHTML = `<option value="all">Tüm Hesaplar</option>` +
                DataStore.data.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
        }

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400">İşlem kaydı bulunamadı.</td></tr>`;
            return;
        }

        list.sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = list.map(trx => {
            const isIncome = trx.type === 'income';
            const acc = DataStore.data.accounts.find(a => a.id === trx.accountId);

            return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="py-3 px-4 text-slate-500 whitespace-nowrap">${DataStore.formatDate(trx.date)}</td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${isIncome ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
                            ${isIncome ? 'Gelir' : 'Gider'}
                        </span>
                    </td>
                    <td class="py-3 px-4 font-semibold text-slate-800">${trx.category}</td>
                    <td class="py-3 px-4 text-slate-600 max-w-sm truncate">${trx.description || '-'}</td>
                    <td class="py-3 px-4 text-slate-500">${acc ? acc.name : '-'}</td>
                    <td class="py-3 px-4 text-right font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}">
                        ${isIncome ? '+' : '-'}${DataStore.formatCurrency(trx.amount)}
                    </td>
                    <td class="py-3 px-4 text-center">
                        <div class="flex items-center justify-center gap-1">
                            <button onclick="App.editTransaction('${trx.id}')" title="Düzenle" class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                            </button>
                            <button onclick="App.deleteTransaction('${trx.id}')" title="Sil" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    },

    openTransactionModal(type = 'income', presetCategory = '', editId = null) {
        document.getElementById('transaction-form').reset();
        document.getElementById('trx-id').value = editId || '';
        document.getElementById('trx-type').value = type;

        document.getElementById('trx-date').value = new Date().toISOString().split('T')[0];

        const accSelect = document.getElementById('trx-account-id');
        accSelect.innerHTML = DataStore.data.accounts.map(a => `<option value="${a.id}">${a.name} (${DataStore.formatCurrency(a.balance)})</option>`).join('');

        this.onTrxTypeChange();

        if (presetCategory) {
            document.getElementById('trx-category').value = presetCategory;
        }
        this.onTrxCategoryChange();

        if (editId) {
            const trx = DataStore.data.transactions.find(t => t.id === editId);
            if (trx) {
                document.getElementById('trx-type').value = trx.type;
                this.onTrxTypeChange();
                document.getElementById('trx-amount').value = trx.amount;
                document.getElementById('trx-date').value = trx.date;
                document.getElementById('trx-account-id').value = trx.accountId;
                document.getElementById('trx-category').value = trx.category;
                this.onTrxCategoryChange();
                document.getElementById('trx-description').value = trx.description || '';
                document.getElementById('modal-transaction-title').textContent = 'İşlemi Düzenle';
                document.getElementById('trx-submit-btn').textContent = 'Değişiklikleri Kaydet';
            }
        }

        this.openModal('modal-transaction');
    },

    editTransaction(id) {
        const trx = DataStore.data.transactions.find(t => t.id === id);
        if (trx) {
            this.openTransactionModal(trx.type, trx.category, trx.id);
        }
    },

    onTrxTypeChange() {
        const type = document.getElementById('trx-type').value;
        const title = document.getElementById('modal-transaction-title');
        const iconContainer = document.getElementById('modal-trx-icon');
        const submitBtn = document.getElementById('trx-submit-btn');
        const catSelect = document.getElementById('trx-category');

        if (type === 'income') {
            title.textContent = 'Gelir Ekle';
            iconContainer.className = 'w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center';
            iconContainer.innerHTML = '<i data-lucide="plus-circle" class="w-4 h-4"></i>';
            submitBtn.className = 'px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-all';
            submitBtn.textContent = 'Geliri Kaydet';

            catSelect.innerHTML = DataStore.data.categories.income.map(c => `<option value="${c}">${c}</option>`).join('');
        } else {
            title.textContent = 'Gider Ekle';
            iconContainer.className = 'w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center';
            iconContainer.innerHTML = '<i data-lucide="minus-circle" class="w-4 h-4"></i>';
            submitBtn.className = 'px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-sm transition-all';
            submitBtn.textContent = 'Gideri Kaydet';

            catSelect.innerHTML = DataStore.data.categories.expense.map(c => `<option value="${c}">${c}</option>`).join('');
        }

        this.onTrxCategoryChange();

        if (window.lucide) lucide.createIcons();
    },

    onTrxCategoryChange() {
        const catSelect = document.getElementById('trx-category');
        const helper = document.getElementById('trx-salary-helper');
        if (!catSelect || !helper) return;

        if (catSelect.value === 'Aylık Maaş') {
            helper.classList.remove('hidden');
            const salarySettings = DataStore.getSalarySettings();
            const noteEl = document.getElementById('trx-salary-day-note');
            if (noteEl) noteEl.textContent = `Maaş Günü: Her ayın ${salarySettings.salaryDay}'i`;

            const monthSelect = document.getElementById('trx-salary-month-select');
            if (monthSelect) {
                const options = DataStore.getMonthOptions(6, 5);
                const currentMonth = DataStore.getCurrentMonth();
                monthSelect.innerHTML = options.map(o => `
                    <option value="${o.value}" ${o.value === currentMonth ? 'selected' : ''}>${o.label}</option>
                `).join('');
                this.onTrxSalaryMonthChange();
            }
        } else {
            helper.classList.add('hidden');
        }
    },

    onTrxSalaryMonthChange() {
        const monthSelect = document.getElementById('trx-salary-month-select');
        if (!monthSelect) return;
        const selectedMonth = monthSelect.value;
        const salarySettings = DataStore.getSalarySettings();

        const [y, m] = selectedMonth.split('-').map(Number);
        const maxDays = new Date(y, m, 0).getDate();
        const day = Math.min(salarySettings.salaryDay, maxDays);
        const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;

        document.getElementById('trx-date').value = dateStr;
        document.getElementById('trx-description').value = `${DataStore.formatMonthName(selectedMonth)} Net Maaş Ödemesi`;

        const amtInput = document.getElementById('trx-amount');
        if (!amtInput.value || parseFloat(amtInput.value) === 0) {
            amtInput.value = salarySettings.amount;
        }

        const accSelect = document.getElementById('trx-account-id');
        if (accSelect && salarySettings.accountId) {
            accSelect.value = salarySettings.accountId;
        }
    },

    saveTransaction(e) {
        e.preventDefault();
        const editId = document.getElementById('trx-id').value;
        const type = document.getElementById('trx-type').value;
        const amount = parseFloat(document.getElementById('trx-amount').value) || 0;
        const date = document.getElementById('trx-date').value;
        const accountId = document.getElementById('trx-account-id').value;
        const category = document.getElementById('trx-category').value;
        const description = document.getElementById('trx-description').value;

        if (amount <= 0) {
            alert('Lütfen geçerli bir tutar girin.');
            return;
        }

        if (editId) {
            const index = DataStore.data.transactions.findIndex(t => t.id === editId);
            if (index !== -1) {
                const oldTrx = DataStore.data.transactions[index];

                const oldAcc = DataStore.data.accounts.find(a => a.id === oldTrx.accountId);
                if (oldAcc) {
                    if (oldTrx.type === 'income') oldAcc.balance -= oldTrx.amount;
                    else oldAcc.balance += oldTrx.amount;
                }

                const newAcc = DataStore.data.accounts.find(a => a.id === accountId);
                if (newAcc) {
                    if (type === 'income') newAcc.balance += amount;
                    else newAcc.balance -= amount;
                }

                DataStore.data.transactions[index] = {
                    ...oldTrx,
                    type,
                    amount,
                    date,
                    accountId,
                    category,
                    description
                };

                this.showToast('İşlem başarıyla güncellendi.', 'success');
            }
        } else {
            const newTrx = {
                id: DataStore.generateId('trx'),
                date,
                type,
                accountId,
                category,
                amount,
                description
            };

            DataStore.data.transactions.unshift(newTrx);

            const acc = DataStore.data.accounts.find(a => a.id === accountId);
            if (acc) {
                if (type === 'income') acc.balance += amount;
                else acc.balance -= amount;
            }

            this.showToast(type === 'income' ? 'Gelir başarıyla eklendi.' : 'Gider başarıyla kaydedildi.', 'success');
        }

        DataStore.save();
        this.closeModal('modal-transaction');
        this.renderAll();
    },

    deleteTransaction(trxId) {
        const trx = DataStore.data.transactions.find(t => t.id === trxId);
        if (!trx) return;

        if (confirm(`Bu işlemi silmek istediğinizden emin misiniz? (İlgili hesap bakiyeleri geri alınacaktır)`)) {
            const kasaAcc = DataStore.getKasaAccount();
            const activeAcc = DataStore.data.accounts.find(a => a.id === trx.accountId);

            if (trx.targetKasa) {
                // Cebimden Kasaya aktarılmıştı: Kasadan düş, cebe iade et
                if (kasaAcc) kasaAcc.balance -= trx.amount;
                if (activeAcc) activeAcc.balance += trx.amount;
            } else if (trx.fromKasa) {
                // Kasadan Cebe çekilmişti: Kasaya iade et, cepten düş
                if (kasaAcc) kasaAcc.balance += trx.amount;
                if (activeAcc) activeAcc.balance -= trx.amount;
            } else if (trx.targetFundId) {
                // Eski fon uyumluluğu
                const fundAcc = DataStore.data.accounts.find(a => a.id === trx.targetFundId);
                if (fundAcc) fundAcc.balance -= trx.amount;
                if (activeAcc) activeAcc.balance += trx.amount;
            } else if (trx.sourceFundId) {
                const fundAcc = DataStore.data.accounts.find(a => a.id === trx.sourceFundId);
                if (fundAcc) fundAcc.balance += trx.amount;
                if (activeAcc) activeAcc.balance -= trx.amount;
            } else {
                const acc = DataStore.data.accounts.find(a => a.id === trx.accountId);
                if (acc) {
                    if (trx.type === 'income') acc.balance -= trx.amount;
                    else acc.balance += trx.amount;
                }
            }

            DataStore.data.transactions = DataStore.data.transactions.filter(t => t.id !== trxId);
            DataStore.save();
            this.renderAll();
            this.showToast('İşlem silindi ve bakiyeler güncellendi.', 'info');
        }
    },

    // ================= 3. ABONELİKLER =================
    // ================= 3. ABONELİKLER & DÜZENLİ GELİR/GİDER =================
    renderSubscriptions() {
        const subscriptions = DataStore.data.subscriptions || [];
        const tbody = document.getElementById('subscriptions-table-body');
        if (!tbody) return;

        if (subscriptions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400">Tanımlı abonelik veya düzenli gelir/gider bulunmuyor.</td></tr>`;
            return;
        }

        const sortedSubs = [...subscriptions].sort((a, b) => a.billingDay - b.billingDay);
        const now = new Date();
        const currentDay = now.getDate();
        const targetPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        tbody.innerHTML = sortedSubs.map(sub => {
            const acc = DataStore.data.accounts.find(a => a.id === sub.accountId);
            const isIncome = sub.type === 'income';

            const isProcessed = DataStore.data.transactions.some(t => 
                t.date && t.date.startsWith(targetPrefix) && 
                (t.subscriptionId === sub.id || (t.description && t.description.toLowerCase().includes(sub.name.toLowerCase())))
            );

            let statusBadge = '';
            if (isProcessed) {
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center justify-center gap-1 w-max mx-auto"><i data-lucide="check" class="w-3 h-3"></i> ${isIncome ? 'Bu Ay Yattı' : 'Bu Ay Ödendi'}</span>`;
            } else if (sub.billingDay <= currentDay) {
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} flex items-center justify-center gap-1 w-max mx-auto"><i data-lucide="alert-circle" class="w-3 h-3"></i> Günü Geldi / Bekliyor</span>`;
            } else {
                const daysLeft = sub.billingDay - currentDay;
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center justify-center gap-1 w-max mx-auto"><i data-lucide="clock" class="w-3 h-3"></i> ${daysLeft} gün kaldı</span>`;
            }

            return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="py-3 px-4">
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isIncome ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-purple-50 text-purple-700 border border-purple-200'}">
                                ${isIncome ? '+ Gelir' : '- Gider'}
                            </span>
                            <span class="font-bold text-slate-900">${sub.name}</span>
                        </div>
                        <div class="text-[11px] text-slate-400 italic mt-0.5">${sub.notes || '-'}</div>
                    </td>
                    <td class="py-3 px-4 font-medium text-slate-700">${sub.category}</td>
                    <td class="py-3 px-4 font-semibold text-slate-800">
                        <span class="bg-slate-100 px-2 py-0.5 rounded text-[11px]">Her ayın ${sub.billingDay}'i</span>
                    </td>
                    <td class="py-3 px-4 text-slate-600">${acc ? acc.name : '-'}</td>
                    <td class="py-3 px-4 text-right font-bold ${isIncome ? 'text-emerald-600' : 'text-slate-900'}">
                        ${isIncome ? '+' : '-'}${DataStore.formatCurrency(sub.amount)}
                    </td>
                    <td class="py-3 px-4 text-center">${statusBadge}</td>
                    <td class="py-3 px-4 text-center">
                        <div class="flex items-center justify-center gap-1.5">
                            ${!isProcessed ? `
                                <button onclick="App.processSingleSubscription('${sub.id}')" title="${isIncome ? 'Bu Ay Yattı Olarak Gelire Ekle' : 'Bu Ay Ödendi Olarak Harcamalara Ekle'}" class="p-1.5 ${isIncome ? 'text-emerald-600 hover:bg-emerald-50' : 'text-blue-600 hover:bg-blue-50'} rounded-lg">
                                    <i data-lucide="check-circle" class="w-4 h-4"></i>
                                </button>
                            ` : ''}
                            <button onclick="App.editSubscription('${sub.id}')" title="Düzenle" class="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button onclick="App.deleteSubscription('${sub.id}')" title="Sil" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    },

    openSubscriptionModal(editId = null) {
        document.getElementById('subscription-form').reset();
        document.getElementById('sub-id').value = editId || '';

        const daySelect = document.getElementById('sub-billing-day');
        daySelect.innerHTML = Array.from({ length: 31 }, (_, i) => i + 1).map(day => `
            <option value="${day}">Her ayın ${day}. günü</option>
        `).join('');

        const accSelect = document.getElementById('sub-account-id');
        accSelect.innerHTML = DataStore.data.accounts.map(a => `
            <option value="${a.id}">${a.name} (${DataStore.formatCurrency(a.balance)})</option>
        `).join('');

        if (editId) {
            const sub = DataStore.data.subscriptions.find(s => s.id === editId);
            if (sub) {
                document.getElementById('sub-type').value = sub.type || 'expense';
                this.onSubTypeChange();
                document.getElementById('sub-name').value = sub.name;
                document.getElementById('sub-amount').value = sub.amount;
                document.getElementById('sub-billing-day').value = sub.billingDay;
                document.getElementById('sub-category').value = sub.category;
                document.getElementById('sub-account-id').value = sub.accountId;
                document.getElementById('sub-notes').value = sub.notes || '';
                document.getElementById('modal-sub-title').textContent = (sub.type === 'income') ? 'Düzenli Geliri Düzenle' : 'Aboneliği Düzenle';
            }
        } else {
            document.getElementById('sub-type').value = 'expense';
            this.onSubTypeChange();
            document.getElementById('modal-sub-title').textContent = 'Yeni Abonelik / Düzenli İşlem';
        }

        this.openModal('modal-subscription');
    },

    onSubTypeChange() {
        const type = document.getElementById('sub-type').value || 'expense';
        const title = document.getElementById('modal-sub-title');
        const nameLabel = document.getElementById('label-sub-name');
        const accLabel = document.getElementById('label-sub-account');
        const nameInput = document.getElementById('sub-name');
        const catSelect = document.getElementById('sub-category');

        if (type === 'income') {
            if (title) title.textContent = 'Yeni Düzenli Gelir (Maaş vb.)';
            if (nameLabel) nameLabel.textContent = 'Düzenli Gelir Adı *';
            if (nameInput) nameInput.placeholder = 'Örn: Aylık Net Maaş, Kira Geliri';
            if (accLabel) accLabel.textContent = 'Yatırılacak Hesap *';
            catSelect.innerHTML = (DataStore.data.categories.income || []).map(c => `
                <option value="${c}">${c}</option>
            `).join('');
        } else {
            if (title) title.textContent = 'Yeni Abonelik / Sabit Gider';
            if (nameLabel) nameLabel.textContent = 'Abonelik / Gider Adı *';
            if (nameInput) nameInput.placeholder = 'Örn: Netflix, Spotify, Ev İnterneti';
            if (accLabel) accLabel.textContent = 'Çekilecek Hesap *';
            catSelect.innerHTML = (DataStore.data.categories.expense || []).map(c => `
                <option value="${c}">${c}</option>
            `).join('');
        }
    },

    editSubscription(id) {
        this.openSubscriptionModal(id);
    },

    saveSubscription(e) {
        e.preventDefault();
        const id = document.getElementById('sub-id').value;
        const type = document.getElementById('sub-type').value || 'expense';
        const name = document.getElementById('sub-name').value;
        const amount = parseFloat(document.getElementById('sub-amount').value) || 0;
        const billingDay = parseInt(document.getElementById('sub-billing-day').value) || 1;
        const category = document.getElementById('sub-category').value;
        const accountId = document.getElementById('sub-account-id').value;
        const notes = document.getElementById('sub-notes').value;

        if (amount <= 0) {
            alert('Lütfen geçerli bir tutar girin.');
            return;
        }

        if (id) {
            const index = DataStore.data.subscriptions.findIndex(s => s.id === id);
            if (index !== -1) {
                DataStore.data.subscriptions[index] = {
                    ...DataStore.data.subscriptions[index],
                    type,
                    name,
                    amount,
                    billingDay,
                    category,
                    accountId,
                    notes
                };
                this.showToast('Kayıt güncellendi.', 'success');
            }
        } else {
            const newSub = {
                id: DataStore.generateId('sub'),
                name,
                type,
                amount,
                billingDay,
                category,
                accountId,
                status: 'active',
                notes
            };
            DataStore.data.subscriptions.push(newSub);
            this.showToast(type === 'income' ? 'Düzenli gelir eklendi.' : 'Yeni abonelik eklendi.', 'success');
        }

        DataStore.save();
        this.closeModal('modal-subscription');
        this.renderAll();
    },

    deleteSubscription(id) {
        const sub = DataStore.data.subscriptions.find(s => s.id === id);
        if (!sub) return;

        if (confirm(`"${sub.name}" kaydını silmek istediğinizden emin misiniz?`)) {
            DataStore.data.subscriptions = DataStore.data.subscriptions.filter(s => s.id !== id);
            DataStore.save();
            this.renderAll();
            this.showToast('Kayıt silindi.', 'info');
        }
    },

    processSingleSubscription(subId) {
        const sub = DataStore.data.subscriptions.find(s => s.id === subId);
        if (!sub) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(Math.min(sub.billingDay, now.getDate())).padStart(2, '0');
        const trxDate = `${year}-${month}-${day}`;
        const isIncome = sub.type === 'income';

        const newTrx = {
            id: DataStore.generateId('trx'),
            date: trxDate,
            type: isIncome ? 'income' : 'expense',
            accountId: sub.accountId,
            category: sub.category,
            amount: sub.amount,
            subscriptionId: sub.id,
            description: `${isIncome ? 'Düzenli Gelir' : 'Abonelik'}: ${sub.name} (${month}/${year})`
        };

        DataStore.data.transactions.unshift(newTrx);

        const acc = DataStore.data.accounts.find(a => a.id === sub.accountId);
        if (acc) {
            if (isIncome) acc.balance += sub.amount;
            else acc.balance -= sub.amount;
        }

        DataStore.save();
        this.renderAll();
        this.showToast(`${sub.name} (${DataStore.formatCurrency(sub.amount)}) ${isIncome ? 'gelirlere ve hesaba eklendi.' : 'harcamalara işlendi.'}`, 'success');
    },

    processDueSubscriptions() {
        const now = new Date();
        const currentDay = now.getDate();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const targetPrefix = `${year}-${month}`;

        const activeSubs = (DataStore.data.subscriptions || []).filter(s => s.status === 'active');
        let processedCount = 0;
        let totalIncomeProcessed = 0;
        let totalExpenseProcessed = 0;

        activeSubs.forEach(sub => {
            if (sub.billingDay <= currentDay) {
                const isAlreadyProcessed = DataStore.data.transactions.some(t => 
                    t.date && t.date.startsWith(targetPrefix) && 
                    (t.subscriptionId === sub.id || (t.description && t.description.toLowerCase().includes(sub.name.toLowerCase())))
                );

                if (!isAlreadyProcessed) {
                    const day = String(sub.billingDay).padStart(2, '0');
                    const isIncome = sub.type === 'income';
                    const trx = {
                        id: DataStore.generateId('trx'),
                        date: `${year}-${month}-${day}`,
                        type: isIncome ? 'income' : 'expense',
                        accountId: sub.accountId,
                        category: sub.category,
                        amount: sub.amount,
                        subscriptionId: sub.id,
                        description: `${isIncome ? 'Düzenli Gelir' : 'Abonelik'}: ${sub.name} (${month}/${year})`
                    };

                    DataStore.data.transactions.unshift(trx);

                    const acc = DataStore.data.accounts.find(a => a.id === sub.accountId);
                    if (acc) {
                        if (isIncome) {
                            acc.balance += sub.amount;
                            totalIncomeProcessed += sub.amount;
                        } else {
                            acc.balance -= sub.amount;
                            totalExpenseProcessed += sub.amount;
                        }
                    }

                    processedCount += 1;
                }
            }
        });

        if (processedCount > 0) {
            DataStore.save();
            this.renderAll();
            this.showToast(`${processedCount} adet günü gelen işlem işlendi (Gelir: ${DataStore.formatCurrency(totalIncomeProcessed)}, Gider: ${DataStore.formatCurrency(totalExpenseProcessed)}).`, 'success');
        } else {
            this.showToast('Günü gelmiş ve işlenmemiş yeni kayıt bulunmuyor.', 'info');
        }
    },

    // ================= 4. ALINACAKLAR (TAHMİNİ GİDER & HEDEFLER) =================
    renderWishlist() {
        const wishlist = DataStore.data.wishlist || [];
        const currentMonth = DataStore.getCurrentMonth();

        // Ay Filtresi Dropdownunu Doldur
        const monthFilterEl = document.getElementById('wish-filter-month');
        if (monthFilterEl) {
            const currentSelected = monthFilterEl.value || currentMonth;

            // Benzersiz ayları topla (mevcut aylar + bu ay + sonraki 2 ay)
            const monthSet = new Set();
            monthSet.add(currentMonth);

            // Sonraki 2 ayı da ekle
            const now = new Date();
            for (let i = 1; i <= 3; i++) {
                const nextM = new Date(now.getFullYear(), now.getMonth() + i, 1);
                monthSet.add(`${nextM.getFullYear()}-${String(nextM.getMonth() + 1).padStart(2, '0')}`);
            }

            wishlist.forEach(w => {
                if (w.targetMonth) monthSet.add(w.targetMonth);
            });

            const sortedMonths = Array.from(monthSet).sort();

            monthFilterEl.innerHTML = `<option value="all">Tüm Aylar</option>` +
                sortedMonths.map(m => `
                    <option value="${m}" ${m === currentSelected ? 'selected' : ''}>
                        ${DataStore.formatMonthName(m)} ${m === currentMonth ? '(Bu Ay)' : ''}
                    </option>
                `).join('');
        }

        const selectedMonth = monthFilterEl ? monthFilterEl.value : currentMonth;
        const statusFilter = document.getElementById('wish-filter-status')?.value || 'all';
        const searchQuery = (document.getElementById('wish-search')?.value || '').toLowerCase();

        // 4 Özet Kartının Hesabı
        // 1. Bu Ay Alınacaklar (Seçili ayda veya bu ayda bekleyen)
        const targetActiveMonth = selectedMonth !== 'all' ? selectedMonth : currentMonth;
        const thisMonthPending = wishlist.filter(w => w.targetMonth === targetActiveMonth && w.status === 'pending');
        const thisMonthPendingTotal = thisMonthPending.reduce((sum, w) => sum + (Number(w.estimatedPrice) || 0), 0);

        // 2. Toplam Alınacakların Bedeli (Tüm ayların bekleyen genel toplamı)
        const allPending = wishlist.filter(w => w.status === 'pending');
        const allPendingTotal = allPending.reduce((sum, w) => sum + (Number(w.estimatedPrice) || 0), 0);

        // 3. Satın Alınanlar (Seçili filtreye göre)
        const purchasedItems = wishlist.filter(w => w.status === 'purchased' && (selectedMonth === 'all' || w.targetMonth === selectedMonth));
        const purchasedTotal = purchasedItems.reduce((sum, w) => sum + (Number(w.estimatedPrice) || 0), 0);

        // 4. İptal Edilenler
        const cancelledItems = wishlist.filter(w => w.status === 'cancelled' && (selectedMonth === 'all' || w.targetMonth === selectedMonth));
        const cancelledTotal = cancelledItems.reduce((sum, w) => sum + (Number(w.estimatedPrice) || 0), 0);

        // Özet Kartlarına Yazdır
        const elThisMonth = document.getElementById('wish-stat-this-month');
        if (elThisMonth) {
            elThisMonth.textContent = DataStore.formatCurrency(thisMonthPendingTotal);
            document.getElementById('wish-stat-this-month-sub').textContent = `${DataStore.formatMonthName(targetActiveMonth)} • ${thisMonthPending.length} ürün bekliyor`;
        }

        const elAllPending = document.getElementById('wish-stat-all-pending');
        if (elAllPending) {
            elAllPending.textContent = DataStore.formatCurrency(allPendingTotal);
            document.getElementById('wish-stat-all-pending-sub').textContent = `Tüm aylar toplamı • ${allPending.length} ürün`;
        }

        const elPurchased = document.getElementById('wish-stat-purchased');
        if (elPurchased) {
            elPurchased.textContent = DataStore.formatCurrency(purchasedTotal);
            document.getElementById('wish-stat-purchased-sub').textContent = `${purchasedItems.length} ürün satın alındı`;
        }

        const elCancelled = document.getElementById('wish-stat-cancelled');
        if (elCancelled) {
            elCancelled.textContent = DataStore.formatCurrency(cancelledTotal);
            document.getElementById('wish-stat-cancelled-sub').textContent = `${cancelledItems.length} üründen vazgeçildi`;
        }

        // Tablo Filtreleme
        let list = wishlist.filter(w => {
            const matchesSearch = (w.title && w.title.toLowerCase().includes(searchQuery)) ||
                (w.category && w.category.toLowerCase().includes(searchQuery));

            if (!matchesSearch) return false;
            if (selectedMonth !== 'all' && w.targetMonth !== selectedMonth) return false;
            if (statusFilter !== 'all' && w.status !== statusFilter) return false;
            return true;
        });

        const tbody = document.getElementById('wishlist-table-body');
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400">Bu kriterlere uygun alınacak ürün veya hedef bulunamadı.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(item => {
            let priorityBadge = '';
            if (item.priority === 'high') {
                priorityBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Yüksek</span>`;
            } else if (item.priority === 'medium') {
                priorityBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Orta</span>`;
            } else {
                priorityBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">Düşük</span>`;
            }

            let statusBadge = '';
            if (item.status === 'purchased') {
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center justify-center gap-1 w-max mx-auto"><i data-lucide="check" class="w-3 h-3"></i> Alındı</span>`;
            } else if (item.status === 'cancelled') {
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 line-through flex items-center justify-center gap-1 w-max mx-auto"><i data-lucide="x" class="w-3 h-3"></i> İptal Edildi</span>`;
            } else {
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center gap-1 w-max mx-auto"><i data-lucide="clock" class="w-3 h-3"></i> Alınacak</span>`;
            }

            const isPending = item.status === 'pending';

            return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        <span class="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono">${DataStore.formatMonthName(item.targetMonth)}</span>
                    </td>
                    <td class="py-3 px-4">
                        <div class="font-bold text-slate-900 ${item.status === 'cancelled' ? 'line-through text-slate-400' : ''}">${item.title}</div>
                        <div class="text-[11px] text-slate-400 italic">${item.notes || '-'}</div>
                    </td>
                    <td class="py-3 px-4 font-medium text-slate-600">${item.category || 'Genel'}</td>
                    <td class="py-3 px-4 text-center">${priorityBadge}</td>
                    <td class="py-3 px-4 text-right font-bold text-slate-900">${DataStore.formatCurrency(item.estimatedPrice)}</td>
                    <td class="py-3 px-4 text-center">${statusBadge}</td>
                    <td class="py-3 px-4 text-center">
                        <div class="flex items-center justify-center gap-1">
                            ${isPending ? `
                                <button onclick="App.markWishlistAsPurchased('${item.id}')" title="Alındı Olarak İşaretle" class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                                    <i data-lucide="check-circle" class="w-4 h-4"></i>
                                </button>
                                <button onclick="App.setWishlistStatus('${item.id}', 'cancelled')" title="İptal Et / Vazgeç" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg">
                                    <i data-lucide="ban" class="w-4 h-4"></i>
                                </button>
                            ` : `
                                <button onclick="App.setWishlistStatus('${item.id}', 'pending')" title="Tekrar Alınacak Yap" class="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg">
                                    <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                                </button>
                            `}
                            <button onclick="App.openWishlistModal('${item.id}')" title="Düzenle" class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                            </button>
                            <button onclick="App.deleteWishlistItem('${item.id}')" title="Sil" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    },

    openWishlistModal(editId = null) {
        document.getElementById('wishlist-form').reset();
        document.getElementById('wish-id').value = editId || '';
        document.getElementById('modal-wish-title').textContent = editId ? 'Alınacak Ürünü Düzenle' : 'Yeni Alınacak / Hedef Ekle';

        // Varsayılan bu ay
        document.getElementById('wish-month').value = DataStore.getCurrentMonth();

        // Kategorileri doldur
        const catSelect = document.getElementById('wish-category');
        catSelect.innerHTML = DataStore.data.categories.expense.map(c => `
            <option value="${c}">${c}</option>
        `).join('');

        if (editId) {
            const item = (DataStore.data.wishlist || []).find(w => w.id === editId);
            if (item) {
                document.getElementById('wish-title').value = item.title;
                document.getElementById('wish-price').value = item.estimatedPrice;
                document.getElementById('wish-month').value = item.targetMonth;
                document.getElementById('wish-category').value = item.category;
                document.getElementById('wish-priority').value = item.priority || 'medium';
                document.getElementById('wish-notes').value = item.notes || '';
            }
        }

        this.openModal('modal-wishlist');
    },

    saveWishlistItem(e) {
        e.preventDefault();
        const id = document.getElementById('wish-id').value;
        const title = document.getElementById('wish-title').value;
        const estimatedPrice = parseFloat(document.getElementById('wish-price').value) || 0;
        const targetMonth = document.getElementById('wish-month').value;
        const category = document.getElementById('wish-category').value;
        const priority = document.getElementById('wish-priority').value;
        const notes = document.getElementById('wish-notes').value;

        if (estimatedPrice <= 0) {
            alert('Lütfen geçerli bir tahmini bedel girin.');
            return;
        }

        if (!targetMonth) {
            alert('Lütfen hedef ayı seçin.');
            return;
        }

        if (!DataStore.data.wishlist) DataStore.data.wishlist = [];

        if (id) {
            const index = DataStore.data.wishlist.findIndex(w => w.id === id);
            if (index !== -1) {
                DataStore.data.wishlist[index] = {
                    ...DataStore.data.wishlist[index],
                    title,
                    estimatedPrice,
                    targetMonth,
                    category,
                    priority,
                    notes
                };
                this.showToast('Alınacak ürün güncellendi.', 'success');
            }
        } else {
            const newItem = {
                id: DataStore.generateId('wsh'),
                title,
                estimatedPrice,
                targetMonth,
                category,
                priority,
                status: 'pending',
                notes
            };
            DataStore.data.wishlist.unshift(newItem);
            this.showToast('Yeni alınacak hedefi eklendi.', 'success');
        }

        DataStore.save();
        this.closeModal('modal-wishlist');
        this.renderAll();
    },

    setWishlistStatus(id, newStatus) {
        const item = (DataStore.data.wishlist || []).find(w => w.id === id);
        if (!item) return;

        item.status = newStatus;
        DataStore.save();
        this.renderAll();
        
        const statusText = newStatus === 'cancelled' ? 'iptal edildi olarak işaretlendi.' : 'yeniden alınacaklar listesine alındı.';
        this.showToast(`"${item.title}" ${statusText}`, 'info');
    },

    markWishlistAsPurchased(id) {
        const item = (DataStore.data.wishlist || []).find(w => w.id === id);
        if (!item) return;

        const addToExpenses = confirm(`"${item.title}" (${DataStore.formatCurrency(item.estimatedPrice)}) alındı olarak işaretlensin mi?\n\nTamam'a basarsanız aynı zamanda Harcamalar listenize de otomatik gider olarak kaydedilecektir.`);

        item.status = 'purchased';

        if (addToExpenses) {
            const defaultAccount = DataStore.data.accounts[0];
            const newTrx = {
                id: DataStore.generateId('trx'),
                date: new Date().toISOString().split('T')[0],
                type: 'expense',
                accountId: defaultAccount ? defaultAccount.id : 'acc-1',
                category: item.category || 'Alışveriş',
                amount: item.estimatedPrice,
                description: `Satın Alındı: ${item.title}`
            };

            DataStore.data.transactions.unshift(newTrx);

            if (defaultAccount) {
                defaultAccount.balance -= item.estimatedPrice;
            }
            this.showToast(`"${item.title}" alındı ve harcamalarınıza işlendi!`, 'success');
        } else {
            this.showToast(`"${item.title}" alındı olarak işaretlendi.`, 'success');
        }

        DataStore.save();
        this.renderAll();
    },

    deleteWishlistItem(id) {
        const item = (DataStore.data.wishlist || []).find(w => w.id === id);
        if (!item) return;

        if (confirm(`"${item.title}" kaydını silmek istediğinizden emin misiniz?`)) {
            DataStore.data.wishlist = DataStore.data.wishlist.filter(w => w.id !== id);
            DataStore.save();
            this.renderAll();
            this.showToast('Alınacak hedefi silindi.', 'info');
        }
    },

    // ================= 5. FON & YATIRIM (KASA, ALTIN, FON) =================
    // ================= 5. KASA & AKTARIM (ACİL DURUM GÜVENCESİ) =================
    openTransferToKasaModal(direction = 'to_kasa') {
        const form = document.getElementById('kasa-transfer-form');
        if (form) form.reset();

        // Cebimdeki Aktif Hesaplar (Nakit & Vadesiz Banka)
        const pocketSelect = document.getElementById('kasa-pocket-account-id');
        const activeAccounts = DataStore.getActiveAccounts();
        if (pocketSelect) {
            pocketSelect.innerHTML = activeAccounts.map(a => `
                <option value="${a.id}">${a.name} (${DataStore.formatCurrency(a.balance)})</option>
            `).join('');
        }

        const dirSelect = document.getElementById('kasa-transfer-direction');
        if (dirSelect) dirSelect.value = direction;

        const dateInput = document.getElementById('kasa-transfer-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

        this.onKasaDirectionChange();
        this.openModal('modal-kasa-transfer');
    },

    setKasaQuickAmount(amt) {
        const input = document.getElementById('kasa-transfer-amount');
        if (input) {
            input.value = amt;
            input.focus();
        }
    },

    onKasaDirectionChange() {
        const dirEl = document.getElementById('kasa-transfer-direction');
        const direction = dirEl ? dirEl.value : 'to_kasa';
        const titleEl = document.getElementById('modal-kasa-title');
        const submitBtn = document.getElementById('kasa-transfer-submit-btn');
        const pocketLabel = document.getElementById('label-kasa-pocket-acc');
        const infoBox = document.getElementById('kasa-info-box');

        if (direction === 'to_kasa') {
            if (titleEl) titleEl.textContent = 'Kasaya Para Aktar (Cebimden)';
            if (pocketLabel) pocketLabel.textContent = 'Paranın Çekileceği Cebimdeki Hesap *';
            if (submitBtn) {
                submitBtn.className = 'px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-sm transition-all';
                submitBtn.textContent = 'Kasaya Aktar (Kenara Ayır)';
            }
            if (infoBox) {
                infoBox.className = 'p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed';
                infoBox.innerHTML = '<strong>Bilgi:</strong> Belirlediğiniz tutar cebinizdeki harcanabilir paradan düşecek ve <strong>Kasa (Acil Durum Parası)</strong> hesabınıza eklenecektir.';
            }
        } else {
            if (titleEl) titleEl.textContent = 'Kasadan Para Çek (Cebime Aktar)';
            if (pocketLabel) pocketLabel.textContent = 'Paranın Yatırılacağı Cebimdeki Hesap *';
            if (submitBtn) {
                submitBtn.className = 'px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-all';
                submitBtn.textContent = 'Cebime Aktar (İhtiyaç)';
            }
            if (infoBox) {
                infoBox.className = 'p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed';
                infoBox.innerHTML = '<strong>Bilgi:</strong> <strong>Kasa (Acil Durum)</strong> hesabınızdan para çekilir, harcanabilir <u>Cebimdeki Para</u> hesabınıza aktarılır ve Toplam Gelir hanesine eklenir.';
            }
        }

        if (window.lucide) lucide.createIcons();
    },

    saveKasaTransfer(e) {
        e.preventDefault();
        const direction = document.getElementById('kasa-transfer-direction').value;
        const pocketAccId = document.getElementById('kasa-pocket-account-id').value;
        const amount = parseFloat(document.getElementById('kasa-transfer-amount').value) || 0;
        const date = document.getElementById('kasa-transfer-date').value;
        const note = document.getElementById('kasa-transfer-note').value.trim();

        if (amount <= 0) {
            alert('Lütfen geçerli bir aktarım tutarı girin.');
            return;
        }

        const pocketAcc = DataStore.data.accounts.find(a => a.id === pocketAccId);
        const kasaAcc = DataStore.getKasaAccount();

        if (!pocketAcc || !kasaAcc) {
            alert('Hesap bilgisi bulunamadı.');
            return;
        }

        if (direction === 'to_kasa') {
            // CEBİMDEN KASAYA AKTAR
            if (pocketAcc.balance < amount) {
                if (!confirm(`Seçtiğiniz hesapta (${pocketAcc.name}) yeterli bakiye görünmüyor (${DataStore.formatCurrency(pocketAcc.balance)}). Yine de aktarılsın mı?`)) {
                    return;
                }
            }

            pocketAcc.balance -= amount;
            kasaAcc.balance += amount;

            const newTrx = {
                id: DataStore.generateId('trx'),
                date,
                type: 'expense',
                accountId: pocketAcc.id,
                category: 'Kasaya Para Aktarma (Birikim)',
                amount,
                targetKasa: true,
                description: note ? `Kasaya Aktarım: ${note}` : `Kasaya Aktarım: ${pocketAcc.name} ➔ Kasa (Acil Durum)`
            };

            DataStore.data.transactions.unshift(newTrx);
            this.showToast(`${DataStore.formatCurrency(amount)} başarıyla Kasaya aktarıldı.`, 'success');
        } else {
            // KASADAN CEBİME AKTAR
            if (kasaAcc.balance < amount) {
                if (!confirm(`Kasada yeterli bakiye görünmüyor (${DataStore.formatCurrency(kasaAcc.balance)}). Yine de aktarılsın mı?`)) {
                    return;
                }
            }

            kasaAcc.balance -= amount;
            pocketAcc.balance += amount;

            const newTrx = {
                id: DataStore.generateId('trx'),
                date,
                type: 'income',
                accountId: pocketAcc.id,
                category: 'Kasadan Para Çekme (Acil Durum)',
                amount,
                fromKasa: true,
                description: note ? `Kasadan Çekim: ${note}` : `Kasadan Çekim: Kasa ➔ ${pocketAcc.name}`
            };

            DataStore.data.transactions.unshift(newTrx);
            this.showToast(`${DataStore.formatCurrency(amount)} kasadan çekilerek ${pocketAcc.name} hesabınıza aktarıldı.`, 'success');
        }

        DataStore.save();
        this.closeModal('modal-kasa-transfer');
        this.renderAll();
    },

    // ================= 6. HESAPLARIM =================
    renderAccounts() {
        const container = document.getElementById('accounts-cards-container');
        if (!container) return;

        container.innerHTML = DataStore.data.accounts.map(acc => {
            let icon = 'landmark';
            let colorClass = 'bg-blue-50 text-blue-600';
            let typeLabel = 'Banka Hesabı';

            if (acc.type === 'kasa' || acc.type === 'emergency') {
                icon = 'shield-alert';
                colorClass = 'bg-amber-50 text-amber-600';
                typeLabel = 'Kasa (Acil Durum Parası)';
            } else if (acc.type === 'cash') {
                icon = 'banknote';
                colorClass = 'bg-emerald-50 text-emerald-600';
                typeLabel = 'Nakit Cüzdan';
            } else {
                icon = 'landmark';
                colorClass = 'bg-blue-50 text-blue-600';
                typeLabel = 'Banka Hesabı';
            }

            return `
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">${typeLabel}</span>
                            <h4 class="font-bold text-slate-800 text-sm mt-0.5">${acc.name}</h4>
                        </div>
                        <div class="w-9 h-9 rounded-xl ${colorClass} flex items-center justify-center">
                            <i data-lucide="${icon}" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-4">
                        <span class="text-xs text-slate-400">Mevcut Bakiye</span>
                        <h3 class="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">${DataStore.formatCurrency(acc.balance)}</h3>
                        <p class="text-[11px] text-slate-400 mt-1 truncate">${acc.iban || 'Hesap / Cüzdan'}</p>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    },

    openAccountModal() {
        document.getElementById('account-form').reset();
        this.openModal('modal-account');
    },

    saveAccount(e) {
        e.preventDefault();
        const type = document.getElementById('acc-type').value;
        const name = document.getElementById('acc-name').value;
        const iban = document.getElementById('acc-iban').value;
        const balance = parseFloat(document.getElementById('acc-balance').value) || 0;

        const newAccount = {
            id: DataStore.generateId('acc'),
            type,
            name,
            iban,
            balance
        };

        DataStore.data.accounts.push(newAccount);
        DataStore.save();
        this.closeModal('modal-account');
        this.renderAccounts();
        this.renderDashboard();
        this.renderAdmin();
        this.showToast('Yeni hesap eklendi.', 'success');
    },

    // ================= 6. ADMIN / İÇERİK YÖNETİM PANELİ =================
    renderAdmin() {
        const s = DataStore.data.settings;

        const userNameInput = document.getElementById('admin-user-name');
        if (userNameInput) userNameInput.value = s.userName || 'Benim Bütçem';

        const curInput = document.getElementById('admin-currency');
        if (curInput) curInput.value = s.currency || '₺';

        const salInput = document.getElementById('admin-salary-target');
        if (salInput) salInput.value = s.monthlySalaryTarget || 65000;

        const salDaySelect = document.getElementById('admin-salary-day');
        if (salDaySelect) {
            salDaySelect.innerHTML = Array.from({ length: 31 }, (_, i) => i + 1).map(day => `
                <option value="${day}" ${day === (s.salaryDay || 15) ? 'selected' : ''}>
                    Her ayın ${day}'i ${day === 15 ? '(Yaygın)' : ''}
                </option>
            `).join('');
        }

        const salAccSelect = document.getElementById('admin-salary-account');
        if (salAccSelect) {
            salAccSelect.innerHTML = DataStore.getActiveAccounts().map(a => `
                <option value="${a.id}" ${a.id === (s.salaryAccountId || 'acc-1') ? 'selected' : ''}>
                    ${a.name}
                </option>
            `).join('');
        }

        const accountsContainer = document.getElementById('admin-accounts-list');
        if (accountsContainer) {
            accountsContainer.innerHTML = DataStore.data.accounts.map(acc => {
                let tag = 'HESAP';
                if (acc.type === 'kasa' || acc.type === 'emergency') tag = 'KASA (ACİL DURUM)';
                else if (acc.type === 'cash') tag = 'CEBİMDEKİ PARA • NAKİT';
                else if (acc.type === 'bank') tag = 'CEBİMDEKİ PARA • VADESİZ BANKA';

                return `
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div class="flex-1 min-w-0">
                        <span class="text-[10px] uppercase font-bold text-slate-400 block">${tag}</span>
                        <input type="text" value="${acc.name}" onchange="App.updateAccountName('${acc.id}', this.value)" class="font-bold text-slate-800 text-xs bg-transparent border-b border-dashed border-slate-300 hover:border-blue-500 focus:outline-none focus:border-blue-600 w-full">
                    </div>
                    <div class="flex items-center gap-2 w-full sm:w-auto">
                        <span class="text-xs font-bold text-slate-500">₺</span>
                        <input type="number" step="0.01" value="${acc.balance}" id="admin-bal-${acc.id}" class="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-right">
                        <button onclick="App.updateAccountBalance('${acc.id}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors">
                            Kaydet
                        </button>
                    </div>
                </div>
            `;
            }).join('');
        }

        const incomeList = document.getElementById('admin-income-cats-list');
        const expenseList = document.getElementById('admin-expense-cats-list');

        if (incomeList && DataStore.data.categories) {
            const incomeCats = DataStore.data.categories.income || [];
            document.getElementById('admin-income-cat-count').textContent = `${incomeCats.length} Kategori`;
            incomeList.innerHTML = incomeCats.map(cat => `
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span>${cat}</span>
                    <button type="button" onclick="App.deleteCategory('income', '${cat}')" class="text-emerald-500 hover:text-rose-600 p-0.5 rounded">
                        <i data-lucide="x" class="w-3 h-3"></i>
                    </button>
                </span>
            `).join('');
        }

        if (expenseList && DataStore.data.categories) {
            const expenseCats = DataStore.data.categories.expense || [];
            document.getElementById('admin-expense-cat-count').textContent = `${expenseCats.length} Kategori`;
            expenseList.innerHTML = expenseCats.map(cat => `
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
                    <span>${cat}</span>
                    <button type="button" onclick="App.deleteCategory('expense', '${cat}')" class="text-rose-400 hover:text-rose-700 p-0.5 rounded">
                        <i data-lucide="x" class="w-3 h-3"></i>
                    </button>
                </span>
            `).join('');
        }

        if (window.lucide) lucide.createIcons();
    },

    saveAdminGeneral(e) {
        e.preventDefault();
        const userName = document.getElementById('admin-user-name').value;
        const currency = document.getElementById('admin-currency').value;
        const amount = parseFloat(document.getElementById('admin-salary-target').value) || 0;
        const salaryDay = parseInt(document.getElementById('admin-salary-day').value) || 15;
        const salaryAccountId = document.getElementById('admin-salary-account').value || 'acc-1';

        DataStore.data.settings.userName = userName;
        DataStore.data.settings.currency = currency;

        DataStore.setSalarySettings({ salaryDay, amount, accountId: salaryAccountId });

        this.updateUserDisplay();
        this.renderDashboard();
        this.renderSubscriptions();
        this.showToast('Sayfa başlıkları ve maaş ayarları güncellendi.', 'success');
    },

    updateAccountBalance(accId) {
        const input = document.getElementById(`admin-bal-${accId}`);
        if (!input) return;

        const newBal = parseFloat(input.value) || 0;
        const acc = DataStore.data.accounts.find(a => a.id === accId);
        if (acc) {
            acc.balance = newBal;
            DataStore.save();
            this.renderDashboard();
            this.renderAccounts();
            this.showToast(`${acc.name} bakiyesi ${DataStore.formatCurrency(newBal)} olarak güncellendi.`, 'success');
        }
    },

    updateAccountName(accId, newName) {
        if (!newName.trim()) return;
        const acc = DataStore.data.accounts.find(a => a.id === accId);
        if (acc) {
            acc.name = newName.trim();
            DataStore.save();
            this.renderDashboard();
            this.renderAccounts();
            this.showToast(`Hesap adı "${acc.name}" olarak güncellendi.`, 'success');
        }
    },

    addCategory(e, type) {
        e.preventDefault();
        const inputId = type === 'income' ? 'new-income-cat-input' : 'new-expense-cat-input';
        const input = document.getElementById(inputId);
        if (!input || !input.value.trim()) return;

        const newCat = input.value.trim();
        if (!DataStore.data.categories[type].includes(newCat)) {
            DataStore.data.categories[type].push(newCat);
            DataStore.save();
            input.value = '';
            this.renderAdmin();
            this.showToast(`"${newCat}" kategorisi eklendi.`, 'success');
        } else {
            alert('Bu kategori zaten mevcut.');
        }
    },

    deleteCategory(type, catName) {
        if (confirm(`"${catName}" kategorisini silmek istediğinizden emin misiniz?`)) {
            DataStore.data.categories[type] = DataStore.data.categories[type].filter(c => c !== catName);
            DataStore.save();
            this.renderAdmin();
            this.showToast(`"${catName}" kategorisi silindi.`, 'info');
        }
    },

    // ================= 7. YEDEKLEME VE VERİ YÖNETİMİ =================
    exportDataFile() {
        const jsonStr = DataStore.exportJSON();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const dateStr = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `kisisel_butce_yedek_${dateStr}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Tüm bütçe verileriniz JSON olarak indirildi.', 'success');
    },

    importDataFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            if (DataStore.importJSON(content)) {
                this.renderAll();
                this.showToast('Yedek başarıyla geri yüklendi!', 'success');
            } else {
                alert('Geçersiz dosya formatı.');
            }
        };
        reader.readAsText(file);
    },

    resetToDefaultData() {
        if (confirm('Örnek veriler yeniden yüklenecektir. Onaylıyor musunuz?')) {
            DataStore.resetToInitial();
            this.renderAll();
            this.showToast('Örnek veriler yüklendi.', 'success');
        }
    },

    clearAllData() {
        if (confirm('DİKKAT: Tüm kayıtlarınız sıfırlanacaktır. Devam etmek istiyor musunuz?')) {
            DataStore.clearAll();
            this.renderAll();
            this.showToast('Tüm kayıtlar sıfırlandı.', 'info');
        }
    },

    // ================= MODAL & BİLDİRİM =================
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            if (window.lucide) lucide.createIcons();
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle-2';
        if (type === 'error') iconName = 'alert-triangle';

        toast.innerHTML = `
            <i data-lucide="${iconName}" class="w-5 h-5 shrink-0"></i>
            <span class="flex-1">${message}</span>
        `;

        container.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(30px)';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    App.init();
}
