# 💰 GelirGiderim - Sade Kişisel Bütçe & Kasa Takibi

Kişisel bütçenizi, cebinizdeki harcanabilir aktif paranızı, aylık maaşınızı, acil durum kasanızı, düzenli aboneliklerinizi ve aylık alışveriş hedeflerinizi sade bir arayüzle takip etmenizi sağlayan modern bir web uygulamasıdır.

Şirket muhasebeleri, karmaşık cariler veya faturalar yerine **yalnızca siz, cebinizdeki para, maaşınız, harcamalarınız ve kasanız** üzerine tasarlanmıştır.

---

## ✨ Öne Çıkan Özellikler

### 1. 📊 Sade ve Odaklanmış Ana Sayfa (Dashboard)
- **Kutu 1 • Cebimdeki Para:** Sadece harcanabilir aktif nakit ve vadesiz banka hesaplarınızın toplamıdır. Kasadaki paradan ayrı tutulur.
- **Kutu 2 • Toplam Gider:** İçinde bulunulan ay yapılan toplam harcamalarınız.
- **Kutu 3 • Abonelik Giderleri:** Aylık düzenli taahhüt ve sabit giderlerinizin toplamı.
- **Kutu 4 • Alınacaklar (Tahmini Gider):** O ay için planladığınız alışveriş ve harcama hedeflerinizin tahmini bütçesi.
- **Kutu 5 • Kasa (Acil Durum Parası) + "Aktar" Butonu:** Cebinizden kenara ayırdığınız acil durum güvence paranız. Doğrudan kutunun üzerindeki **Aktar** butonuyla tek tıkla cebinizden kasaya para aktarabilir veya ihtiyaç halinde kasadan cebinize çekebilirsiniz.
- **Hızlı İşlem Butonları:** `+ Gelir Ekle` ve `- Gider Ekle`.
- **Son 7 İşlem:** En son yaptığınız harcama ve aktarımların anlık tablosu.

---

### 2. 💵 Aylık Maaş Takibi, Maaş Günü ve Ay Seçimi
- **Maaş Günü Seçimi (1 - 31 Gün):** Maaşınızı ayın hangi gününde aldığınızı (Örn: Her ayın 15'i, 1'i vb.) doğrudan ana sayfadaki karttan veya Admin panelinden belirleyin.
- **Aylık Seçim & Durum Kontrolü:** İster içinde bulunduğunuz ayı, ister geçmiş veya gelecek ayları seçerek o ayın maaşının yatıp yatmadığını anında görün.
- **Tek Tıkla Maaşı Hesaba Yatırma:** Maaş günü geldiğinde veya erken yattığında tek tıkla (`Maaşı Hesaba Yatır`) maaş tutarınız banka hesabınıza eklenir ve gelir dökümünüze işlenir.
- **Gelir Ekleme Entegrasyonu:** "+ Gelir Ekle" penceresinde "Aylık Maaş" seçildiğinde hangi ayın maaşı olduğu seçilebilir; tarih kullanıcının maaş gününe ve tutar kayıtlı maaşa otomatik ayarlanır.

---

### 3. 🛡️ Kasa & Hızlı Para Aktarımı
- **Kasanın Yanındaki "Aktar" Butonu:**
  - **Cebimden ➔ Kasaya Aktar (Birikim):** Cebinizdeki harcanabilir hesaptan belirlediğiniz tutar düşer, Kasa bakiyesine eklenir. Hızlı seçim butonları (+1.000 ₺, +2.500 ₺, +5.000 ₺, +10.000 ₺) mevcuttur.
  - **Kasadan ➔ Cebime Aktar (İhtiyaç):** Kasanızdan para çekilir, harcanabilir aktif hesabınıza aktarılır ve gelir hanenize eklenir.

---

### 3. 🔁 Abonelikler & Düzenli Gelir/Gider Sistemi
- **Hem Gelir Hem Gider Desteği:**
  - **Düzenli Gelir:** Aylık Net Maaş, yan gelir vb.
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

### 5. ⚙️ Yönetici (Admin) Paneli
- **Başlık ve Metin Düzenleme:** Kullanıcı adı, bütçe başlığı ve para birimi özelleştirme.
- **Doğrudan Bakiye Düzenleme:** Banka, nakit ve kasa bakiyelerini doğrudan panelden değiştirebilme.
- **Kategori Yönetimi:** Gelir ve Gider kategorilerini ekleme ve çıkarma.
- **JSON Veri Yedekleme & Geri Yükleme:** Tüm verilerinizi tek tıkla `.json` dosyası olarak bilgisayarınıza indirme veya geri yükleme.

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

## 🖥️ Windows Masaüstü Uygulaması (.exe) Olarak Çalıştırma & Derleme

Proje artık Electron altyapısıyla bağımsız bir Windows masaüstü uygulaması olarak çalışabilir:

### 1. Ön Hazırlık (Node.js)
Bilgisayarınızda Node.js kurulu değilse PowerShell'de tek satırla kurabilirsiniz:
```powershell
winget install OpenJS.NodeJS.LTS
```
*(Kurulum sonrası terminali yeniden başlatın).*

### 2. Bağımlılıkları Yükleme
```powershell
npm install
```

### 3. Geliştirme Modunda Çalıştırma
```powershell
npm start
```

### 4. Tek Tıkla `.exe` Çıktısı Alma
```powershell
# Taşınabilir (kurulum gerektirmeyen tek parça .exe)
npm run build:portable

# Veya kurulum sihirbazlı (.exe setup)
npm run build:installer
```
Oluşturulan `.exe` dosyası `dist/` klasörü altına kaydedilir.

---

## 🛠️ Kullanılan Teknolojiler

- **HTML5 & Vanilla JavaScript (ES6+):** Saf, hafif ve hızlı mimari.
- **Electron & electron-builder:** Windows masaüstü (.exe) desteği.
- **Tailwind CSS & Lucide Icons (Offline / Yerel):** Çevrimdışı çalışan modern arayüz ve ikonlar.
- **HTML5 LocalStorage:** Sıfır veritabanı maliyeti ve yerel veri saklama.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak paylaşılmıştır. Dilediğiniz gibi kullanabilir ve geliştirebilirsiniz.
