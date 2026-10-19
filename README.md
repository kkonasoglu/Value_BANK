# 💰 GelirGiderim - Sade Kişisel Bütçe, Fon & Ön Muhasebe

Kişisel bütçenizi, harcanabilir aktif paranızı, aylık maaşınızı, birikimlerinizi (**Kasa, Altın, Fon**), düzenli aboneliklerinizi ve aylık alışveriş hedeflerinizi sade bir arayüzle takip etmenizi sağlayan modern bir web uygulamasıdır.

Şirket muhasebeleri, karmaşık cariler veya faturalar yerine **yalnızca siz, maaşınız, harcamalarınız ve birikimleriniz** üzerine tasarlanmıştır.

---

## ✨ Öne Çıkan Özellikler

### 1. 📊 Sade ve Odaklanmış Ana Sayfa (Dashboard)
- **Kutu 1 • Toplam Para (Elimdeki Para):** Sadece harcanabilir aktif nakit ve vadesiz banka hesaplarınızı gösterir. Birikim ve kasa havuzundan ayrı tutulur.
- **Kutu 2 • Toplam Gider:** İçinde bulunulan ay yapılan toplam harcamalar.
- **Kutu 3 • Abonelik Giderleri:** Aylık düzenli taahhüt ve sabit gider toplamı.
- **Kutu 4 • Bu Ay Alınacaklar:** O ay için planlanan alışveriş hedeflerinin tahmini gider bütçesi.
- **Kutu 5 • Kasa & Yatırım:** Harcanabilir paradan bağımsız tutulan güvence havuzu (**Kasa + Altın + Fon** toplamı).
- **Hızlı Aksiyon Butonları:** `+ Gelir Ekle (Maaş vb.)` ve `- Gider Ekle (Harcama)`.
- **Son 7 İşlem:** En son yapılan hareketlerin anlık özet tablosu.

---

### 2. 🪙 Fon & Yatırım Yönetimi (Kasa, Altın, Fon)
- **3 Ayrı Birikim Kutusu:**
  1. **Kasa (Acil Durum Parası):** Maaştan kenara ayrılan güvence nakdi.
  2. **Altın Hesabı:** Gram, çeyrek altın ve kıymetli maden birikimleri.
  3. **Yatırım Fonu (TEFAS / Hisse):** Portföy ve büyüme odaklı fon yatırımları.
- **Para Yükle (Yatırım Yap):** Elimdeki aktif paradan düşer, seçilen Fon/Kasa kutusuna aktarılır.
- **Para Çek (Bozdur):** Fon/Kasa kutusundan düşer, elimdeki aktif paraya geçer ve **Toplam Gelir** hanenize eklenir.
- **Fon Hareket Geçmişi:** Tüm yükleme ve bozdurma hareketlerinin dökümü ve geri alma (silme) desteği.

---

### 3. 🔁 Abonelikler & Düzenli Gelir/Gider Sistemi
- **Hem Gelir Hem Gider Desteği:**
  - **Düzenli Gelir:** Aylık Net Maaş, kira geliri vb.
  - **Düzenli Gider:** Netflix, Spotify, Ev İnterneti, spor salonu vb.
- **Günü Geldiğinde Otomatik/Tek Tıkla İşleme:** Günü gelen işlemler tek tıkla gelir veya harcamalara işlenir ve ilgili hesap bakiyesi güncellenir.
- **Durum Takibi:** "Bu Ay Yattı / Ödendi", "Günü Geldi / Bekliyor", "X gün kaldı" rozetleri.

---

### 4. 🎯 Alınacaklar (Hedef & Tahmini Gider Hesabı)
- Her ürün için **hedef ay** seçimi (Örn: Ekim 2026, Kasım 2026).
- **Özet Metrikler:** "Bu Ay Alınacaklar", "Toplam Alınacakların Bedeli (Tüm Aylar)", "Satın Alınanlar" ve "İptal / Tasarruf Edilenler".
- **Alındı / İptal Takibi:**
  - `Alındı`: İsteğe bağlı olarak tek tıkla harcamalar dökümünüze otomatik gider olarak kaydeder.
  - `İptal Edildi`: Vazgeçilen ürünleri tasarruf hanesinde listeler.

---

### 5. 🛡️ Yönetici (Admin) Paneli
- **Başlık ve Metin Düzenleme:** Kullanıcı adı, bütçe başlığı ve para birimi özelleştirme.
- **Doğrudan Bakiye Düzenleme:** Kasa, Altın, Fon ve banka hesap bakiyelerini doğrudan değiştirme.
- **Kategori Yönetimi:** Gelir ve Gider kategorilerini ekleme ve çıkarma.
- **JSON Veri Yedekleme & Geri Yükleme:** Tüm verilerinizi tek tıkla `.json` dosyası olarak bilgisayarınıza indirme veya yükleme.

---

## 🔒 Gizlilik ve Veri Güvenliği

- Uygulama **%100 istemci taraflı (client-side)** çalışır.
- Hiçbir veriniz harici bir sunucuya gönderilmez.
- Tüm kayıtlarınız tarayıcınızın **LocalStorage** alanında yerel olarak saklanır.
- İnternet bağlantısı olmasa bile çevrimdışı (offline) çalışabilir.

---

## 🚀 Yerel Olarak Çalıştırma

Kurulum veya sunucu gerektirmez.

1. Projeyi bilgisayarınıza indirin veya klonlayın:
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
   ```
2. Klasör içindeki `index.html` dosyasını tarayıcınızda çift tıklayarak açın.
3. Windows PowerShell üzerinden hızlıca açmak için:
   ```powershell
   Start-Process index.html
   ```

---

## 🌐 GitHub Pages ile Ücretsiz Canlı Yayına Alma

Projeyi herkesin erişebileceği canlı bir web sitesi olarak yayınlamak için:

1. Bu depoyu GitHub hesabınıza push edin.
2. GitHub'da deponuzun **Settings** (Ayarlar) sekmesine gidin.
3. Sol menüden **Pages** seçeneğine tıklayın.
4. **Build and deployment > Branch** kısmında:
   - Branch: `main`
   - Folder: `/ (root)`
   seçin ve **Save** (Kaydet) butonuna basın.
5. Birkaç saniye içinde siteniz `https://<kullanici-adiniz>.github.io/<repo-adiniz>/` adresinde yayına girecektir!

---

## 🛠️ Kullanılan Teknolojiler

- **HTML5 & Vanilla JavaScript (ES6+):** Saf, hafif ve hızlı mimari.
- **Tailwind CSS (CDN):** Modern, responsive ve şık UI bileşenleri.
- **Lucide Icons:** Hızlı ve vektörel modern ikon kütüphanesi.
- **HTML5 LocalStorage:** Sıfır veritabanı maliyeti ve yerel veri saklama.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak paylaşılmıştır. Dilediğiniz gibi kullanabilir ve geliştirebilirsiniz.
