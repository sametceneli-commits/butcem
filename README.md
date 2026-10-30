# Dayıcım Hesap — gelir/gider takip uygulaması

Bu proje iPhone'da ana ekrana eklenebilen bir PWA'dır. E-posta/şifre ile Supabase Auth kullanır; işlemler Supabase veritabanında saklanır ve aynı hesapla giriş yapılan cihazlarda senkronize olur.

## 1. Supabase projesi oluştur
1. https://supabase.com adresinden ücretsiz hesap aç ve yeni bir proje oluştur.
2. Project Settings → API bölümünden Project URL ve `anon` / publishable key değerini al.
3. Supabase → SQL Editor bölümünde `schema.sql` içeriğini çalıştır.
4. Authentication → URL Configuration bölümünde uygulamanın yayınlanacağı adresi Site URL ve Redirect URLs alanlarına ekle.
5. Authentication → Providers → Email bölümünde e-posta sağlayıcısının açık olduğundan emin ol. E-posta doğrulaması açık kalabilir.

## 2. Uygulamayı Supabase'e bağla
`app.js` dosyasının en üstündeki şu iki değeri doldur:
- `SUPABASE_PROJECT_URL`
- `SUPABASE_ANON_KEY`

Yalnızca istemci için tasarlanmış anon/publishable key kullan. `service_role` veya secret key'i asla tarayıcıya koyma.

## 3. Ücretsiz yayınla
Dosyaları HTTPS destekleyen statik bir hostinge (ör. GitHub Pages) yükle. GitHub Pages için depoyu oluşturup dosyaları ana dala ekleyebilir ve Settings → Pages bölümünden yayınlayabilirsin. Uygulama alt dizinde yayınlanıyorsa manifest ve servis çalışanı yollarını buna göre ayarla.

## 4. iPhone'a yükle
1. Yayınlanan HTTPS adresini Safari'de aç.
2. Paylaş → Ana Ekrana Ekle.
3. Ana ekrandaki Dayıcım Hesap simgesine dokunarak kullan.

## Özellikler
- E-posta ile hesap oluşturma ve giriş
- Gelir/gider kaydı, tarih ve kategori
- Kredi kartı ödeme yöntemi ve kart adı alanı
- Aylık gelir/gider özeti ve toplam bakiye
- Son 6 ayın gelir-gider grafiği ve kategori bazında gider dağılımı
- Tekrarlayan aylık ödeme planları (otomatik tahsilat veya otomatik işlem oluşturmaz)
- İşlem silme ve CSV dışa aktarma

## Notlar / kapsam
- Tekrarlayan ödemeler şu an plan/hatırlatma listesidir; otomatik olarak gider kaydı oluşturmaz.
- Kredi kartı harcamaları giderlere işlem tarihindeki tutarlarıyla dahil edilir. Ekstre, son ödeme tarihi, taksit ve kart borcu mutabakatı V1'de yoktur.
- Bu sürüm kart/banka hesaplarına bağlanmaz.
- Supabase'in ücretsiz planı başlangıç için yeterli olabilir; kullanım limitleri ve ücretsiz plan koşulları zamanla değişebilir.
- Hassas finansal veriler gireceğin için güçlü parola kullan, e-posta doğrulamasını açık tut ve verilerini düzenli dışa aktar. Veritabanı RLS politikaları kullanıcıların yalnızca kendi kayıtlarını görmesini sağlar.


## Şifre sıfırlama için Supabase ayarı

Supabase Dashboard → Authentication → URL Configuration bölümünde:
- Site URL: `https://sametceneli-commits.github.io/butcem/`
- Redirect URLs listesine aynı adresi ekle: `https://sametceneli-commits.github.io/butcem/`

Şifremi unuttum bağlantısı bu adrese geri döner. Kullanıcı e-postadaki bağlantıyı açtıktan sonra uygulamadaki “Hesap ve şifre ayarları” bölümünden yeni şifresini kaydedebilir.
