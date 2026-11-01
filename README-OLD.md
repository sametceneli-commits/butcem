# Dayıcım Hesap V5

## Güncelleme
1. Bu klasördeki dosyaları GitHub deposunun kök dizinine yükleyin ve mevcut dosyaların üzerine yazın.
2. Supabase Dashboard > SQL Editor bölümünde `migration-v5.sql` dosyasının içeriğini **bir kez** çalıştırın.
3. GitHub Pages yayınlandıktan sonra uygulamayı `?v=5` ile açıp yenileyin.

## Yeni özellikler
- Seçili ay için tek tek veya toplu tekrarlayan ödeme gideri oluşturma.
- Aynı tekrarlayan ödemenin aynı aya ikinci kez eklenmesini uygulama ve veritabanı düzeyinde engelleme.
- Tekrarlayan ödeme adı, tutarı, günü ve kategorisini düzenleme.
- Silinen tekrarlayan ödeme geçmişte oluşturulmuş gider kayıtlarını silmez.

Mevcut Supabase URL, istemci anahtarı, tablo yapısı ve geçmiş işlem verileri korunur. `schema.sql` dosyasını yeniden çalıştırmayın; yalnızca `migration-v5.sql` bir kez çalıştırılmalıdır.
