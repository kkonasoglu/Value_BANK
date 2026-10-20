// main.js - Electron Ana Süreç Dosyası (Windows Masaüstü Uygulaması)

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Çoklu pencere açılmasını engelleme (Tek örnek kilidi)
const gotTheLock = app.requestSingleInstanceLock();
let mainWindow = null;

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        createMainWindow();

        // 2. BİLGİSAYAR AÇILDIĞINDA OTOMATİK BAŞLATMA
        // Windows başlangıcına otomatik kayıt ekler
        if (process.platform === 'win32' && !app.isPackaged) {
            // Geliştirme aşamasındayken isteğe bağlı log
            console.log('Geliştirme modunda: Otomatik başlatma paketlendiğinde aktif olacaktır.');
        }

        try {
            app.setLoginItemSettings({
                openAtLogin: true,
                path: process.execPath,
                args: []
            });
        } catch (err) {
            console.error('Otomatik başlatma ayarı yapılırken hata oluştu:', err);
        }

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createMainWindow();
            }
        });
    });
}

function createMainWindow() {
    // 1. ELECTRON PENCERE KURULUMU
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 850,
        minWidth: 460,
        minHeight: 650,
        center: true,
        title: 'GelirGiderim - Kişisel Bütçe ve Kasa Takip',
        backgroundColor: '#f8fafc',
        show: false, // Sayfa hazır olana kadar titremeyi önlemek için gizli başlar
        autoHideMenuBar: true, // Varsayılan menü çubuğunu gizle
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            spellcheck: false
        }
    });

    // Varsayılan Electron üst menüsünü tamamen kaldır (Temiz & modern pencere)
    Menu.setApplicationMenu(null);

    // Ana HTML dosyasını yükle (Tamamen yerel & çevrimdışı)
    mainWindow.loadFile('index.html');

    // Pencere yüklendiğinde zarifçe göster
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Harici linklerin (varsa) varsayılan sistem tarayıcısında açılması
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http:') || url.startsWith('https:')) {
            require('electron').shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Tüm pencereler kapandığında çıkış yap (macOS hariç)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
