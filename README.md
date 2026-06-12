# NarrativeFlow

**Finansal Anlatıların Yapay Zekâ Tabanlı Sentiment Analizi ve Borsa İstanbul Hisse Senedi Piyasalarına Dinamik Etki Simülasyonu**

NarrativeFlow; makroekonomik haberleri, merkez bankası kararlarını ve jeopolitik finansal gelişmeleri analiz ederek bu anlatıların Borsa İstanbul'da işlem gören seçili şirketler üzerindeki olası etkilerini simüle eden web tabanlı bir karar destek sistemidir.

## Proje Görseli

> Aşağıdaki görselin görüntülenmesi için ekran görüntüsünü `images/narrativeflow-ekran-goruntusu.png` adıyla projeye ekleyin.

![NarrativeFlow ekran görüntüsü](images/narrativeflow-ekran-goruntusu.png)

## Projenin Amacı

Bu projenin amacı, yapılandırılmamış finansal metinleri Doğal Dil İşleme yöntemleriyle analiz etmek ve elde edilen duygu skorlarını Borsa İstanbul'da yer alan seçili hisse senetlerinin fiyat hareketlerine dinamik olarak yansıtmaktır.

Sistem:

- Manuel olarak girilen finansal metinleri analiz eder.
- RSS kaynaklarından güncel finans haberlerini toplar.
- Metnin dilini Türkçe veya İngilizce olarak tespit eder.
- Groq API üzerinden `llama-3.1-8b-instant` modeliyle duygu analizi gerçekleştirir.
- API kullanılamadığında kural tabanlı finansal sözlük motoruna geçer.
- Pozitif, negatif ve nötr duygu skorları üretir.
- Analiz sonucunu seçili BIST hisseleri üzerinde simüle eder.
- Canlı fiyat değişimlerini, ticker bandını ve kıvılcım grafiklerini görselleştirir.

## Temel Özellikler

### Finansal Metin Analizi

Kullanıcılar sisteme doğrudan haber veya finansal değerlendirme metni girebilir. Metin yeterli uzunluğa ulaştığında analiz işlemi aktif hâle gelir.

### RSS Haber Akışı

Sistem, yerel ve küresel finans haberlerini farklı RSS kaynaklarından çekebilir. CORS kaynaklı erişim sorunlarında aşağıdaki proxy servisleri sıralı olarak denenir:

- AllOrigins API
- CorsProxy.io
- CodeTabs Proxy

Bir servis başarısız olduğunda sistem otomatik olarak sonraki servise geçer.

### Dil Tespiti

Girilen metin, Türkçe bağlaçlar ve sık kullanılan kelimelerin geçiş sıklığına göre Türkçe veya İngilizce olarak sınıflandırılır.

### Hibrit Sentiment Analizi

Sistem iki farklı analiz yöntemi kullanır:

1. **LLM tabanlı analiz:** Groq API ve Llama 3.1 modeliyle anlamsal finans analizi yapılır.
2. **Kural tabanlı analiz:** API anahtarı bulunmadığında finansal olumlu ve olumsuz kelime listeleri kullanılır.

LLM tarafından üretilen temel çıktı yapısı:

```json
{
  "positive": 0.65,
  "negative": 0.20,
  "neutral": 0.15,
  "translation": "Analiz edilen veya çevrilen metin",
  "reasoning": "Finansal etkinin Türkçe açıklaması"
}
```

## Simülasyonda Kullanılan Hisseler

| Hisse | Şirket | Sektör |
|---|---|---|
| THYAO | Türk Hava Yolları | Havacılık |
| GARAN | Garanti BBVA | Bankacılık |
| AKBNK | Akbank | Bankacılık |
| ISCTR | Türkiye İş Bankası C | Bankacılık |
| TUPRS | Tüpraş | Enerji |
| ASELS | Aselsan | Savunma ve Teknoloji |
| EREGL | Ereğli Demir Çelik | Demir-Çelik |
| BIMAS | BİM Mağazaları | Perakende |
| MGROS | Migros | Perakende |
| KCHOL | Koç Holding | Holding |

## Fiyat Simülasyon Modeli

Bir hisse senedinin yeni fiyatı aşağıdaki temel yaklaşımla hesaplanır:

```text
P_t = P_(t-1) × (1 + Drift_total)
```

Toplam sürüklenme değeri:

```text
Drift_total = Drift_random + Drift_NLP
```

Rassal piyasa hareketi:

```text
Drift_random = (Math.random() - 0.49) × 2 × vol
```

Yapay zekâ analizinden gelen yönlü etki:

```text
Drift_NLP = Yön × vol × 1.4
```

Duygu etiketine göre yön değeri:

- Pozitif haber: `+1`
- Negatif haber: `-1`
- Nötr haber: `0`

Fiyatın aşırı düşmesini engellemek için taban fiyat mekanizması uygulanır:

```text
P_t = Maksimum(P_(t-1) × (1 + Drift_total), P_base × 0.4)
```

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript
- Chart.js
- Groq API
- Llama 3.1 8B Instant
- RSS ve XML
- DOMParser
- Asenkron JavaScript
- JSON

## Projeyi Çalıştırma

Bu proje istemci tarafında çalışacak şekilde geliştirilmiştir.

1. Repository'yi bilgisayarınıza indirin:

```bash
git clone https://github.com/NurgulYilmazz/NLP.git
```

2. Proje klasörüne girin:

```bash
cd NLP
```

3. Ana HTML dosyasını tarayıcıda açın.

Daha sağlıklı çalışma için Visual Studio Code içerisindeki **Live Server** eklentisi kullanılabilir.

## Groq API Anahtarı

LLM tabanlı analiz özelliğini kullanmak için geçerli bir Groq API anahtarı gereklidir.

> **Güvenlik uyarısı:** Gerçek API anahtarınızı kaynak kodun içine yazarak GitHub'a yüklemeyin. API anahtarını kullanıcıdan çalışma anında alın veya güvenli bir sunucu katmanı üzerinden yönetin.

API anahtarı bulunmadığında sistem kural tabanlı sözlük motoruyla çalışmaya devam eder.

## Önerilen Proje Yapısı

```text
NLP/
├── images/
│   └── narrativeflow-ekran-goruntusu.png
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── .gitignore
└── README.md
```

Dosya adları mevcut projenize göre farklılık gösterebilir.

## Görselleştirme Bileşenleri

- Canlı hisse ticker bandı
- Hisse bazlı fiyat kartları
- Son 30 zaman adımını gösteren sparklines
- Pozitif, negatif ve nötr duygu skorları
- Etkilenen sektör ve şirket listesi
- Yükselen ve düşen varlık sayaçları
- Yapay zekâ gerekçelendirme paneli

## Gelecek Çalışmalar

- Çoklu ajanlı alıcı ve satıcı simülasyonu
- Piyasa derinliği ve emir defteri modeli
- Tarihsel haber verileriyle geriye dönük test
- Gerçek BIST verileriyle sonuç karşılaştırması
- Daha gelişmiş çok dilli finansal NLP modelleri
- Sunucu taraflı güvenli API anahtarı yönetimi

## Akademik Anahtar Kelimeler

`Doğal Dil İşleme` `NLP` `Büyük Dil Modelleri` `LLM` `Finansal Sentiment Analizi` `Borsa İstanbul` `Groq API` `Piyasa Simülasyonu` `Karar Destek Sistemleri`

## Hazırlayan

**Çağrı Özden**  
Yapay Zekâ ve Veri Mühendisliği Anabilim Dalı  
Ankara, Türkiye

## Lisans

Bu proje akademik çalışma ve eğitim amacıyla hazırlanmıştır.
