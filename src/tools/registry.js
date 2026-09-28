/**
 * Tool registry: metadata + bilingual SEO copy for every tool.
 * The prerender script and ToolLayout both read this single source.
 */

import AmountInWordsPage from '../pages/AmountInWordsPage.jsx';
import DigitsPage from '../pages/DigitsPage.jsx';
import RomanizePage from '../pages/RomanizePage.jsx';
import LoremPage from '../pages/LoremPage.jsx';
import FancyPage from '../pages/FancyPage.jsx';
import TashkeelPage from '../pages/TashkeelPage.jsx';
import ZatcaPage from '../pages/ZatcaPage.jsx';
import BidiPage from '../pages/BidiPage.jsx';

export const SITE_URL = 'https://kalima.tools';

export const TOOLS = [
  {
    slug: 'amount-in-words',
    icon: 'Coins',
    Component: AmountInWordsPage,
    related: ['digits-converter', 'zatca-qr-decoder'],
    en: {
      title: 'Arabic & English Amount in Words (Tafqeet) — Free Online',
      meta: 'Convert any amount to Arabic or English words instantly — Riyal, Dollar, Dirham, Dinar and 12 currencies. The Tafqeet (تفقيط) generators uses for invoices, checks and contracts.',
      keywords: 'arabic amount in words, tafqeet generator, amount to words arabic, invoice amount in words, check writer',
      intro: [
        'Convert a numeric amount into full Arabic or English words in one click — the exact phrasing (“Only one thousand two hundred Saudi Riyals and fifty halalas only”) used on invoices, cheques, contracts and receipts across the Arab world.',
        'Every official Arabic document needs the amount written out in words to prevent tampering, and hand-writing it correctly with the tricky Arabic grammar rules (dual forms, pluralization, gender) is genuinely hard. This tool gets the grammar right for 12 currencies.'
      ],
      steps: [
        'Type the amount (e.g. 1250.75) and pick a currency — SAR, AED, EGP, USD and 8 more.',
        'Choose Arabic or English output; copy the result with one click.',
        'Paste it into your invoice, cheque or contract.'
      ],
      faq: [
        {
          q: 'What is Tafqeet (تفقيط)?',
          a: 'Tafqeet is the Arabic legal convention of writing the monetary amount in words on a financial document so that the numeric figure cannot be altered. Any Arabic invoice template or cheque asks for it.'
        },
        {
          q: 'Does it follow correct Arabic grammar?',
          a: 'Yes — dual forms (ريالان), the 3-10 plural rules, the special teens (أحد عشر, اثنا عشر) and subunits (halala, fils, piastre, baisa) are all handled per currency.'
        },
        {
          q: 'Is it free and private?',
          a: 'Yes. The converter runs entirely in your browser; no amount or document ever leaves your device.'
        }
      ]
    },
    ar: {
      title: 'تفقيط المبلغ بالحروف بالعربية والإنجليزية — أونلاين مجاناً',
      meta: 'حوّل أي مبلغ إلى كلمات عربية أو إنجليزية فوراً — ريالات ودراهم ودنانير ودولارات و12 عملة، بصيغة التفقيط النظامية للفواتير والشيكات والعقود.',
      keywords: 'تفقيط, تفقيط المبلغ, المبلغ بالحروف, كتابة المبالغ, تفقيط فاتورة, شيك',
      intro: [
        'حوّل أي رقم إلى كلمات كاملة بالعربية أو الإنجليزية بضغطة واحدة — الصيغة النظامية المستخدمة في الفواتير والشيكات والعقود في كل العالم العربي.',
        'القواعد العربية معقدة (المثنى، جمع القلة والكثرة، الأعداد المركبة، وحدات أصغر مثل هللة وفلس وقرش)، وهذه الأداةطبّقها بدقة لـ 12 عملة.'
      ],
      steps: [
        'اكتب المبلغ (مثل 1250.75) واختر العملة — ريال سعودي، درهم، جنيه، دولار وغيرها.',
        'اختر الإخراج بالعربية أو الإنجليزية وانسخ النتيجة بضغطة.',
        'الصقها في الفاتورة أو الشيك أو العقد.'
      ],
      faq: [
        { q: 'ما هو التفقيط؟', a: 'كتابة المبلغ بالحروف على المستندات المالية بحيث لا يمكن التلاعب بالرقم، وهو مطلوب في أي نموذج فاتورة أو شيك رسمي.' },
        { q: 'هل القواعد العربية دقيقة؟', a: 'نعم — المثنى وجمع 3 إلى 10 والأعداد المركبة والوحدات الأصغر (هللة، فلس، قرش، بيسة) كلها معالَجة لكل عملة.' },
        { q: 'هل الاستخدام مجاني وخاص؟', a: 'نعم، كل شيء يعمل في متصفحك ولا تغادر بياناتك جهازك.' }
      ]
    }
  },
  {
    slug: 'digits-converter',
    icon: 'Hash',
    Component: DigitsPage,
    related: ['tashkeel-tools', 'bidi-inspector'],
    en: {
      title: 'Arabic-Indic Digits Converter (٠١٢ ↔ 012) — Free Online',
      meta: 'Convert numbers between Western (0-9) and Arabic-Indic (٠١٢) or Persian (۰۱۲) numerals. Paste whole paragraphs — great for designers, translators and RTL developers.',
      keywords: 'arabic digits converter, ٠١٢ to 012, eastern arabic numerals, arabic-indic numbers, hind digits',
      intro: [
        'Switch any text between Western digits (0-9), Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩ — used in the Gulf, Egypt and most Mashreq countries) and Persian digits (۰۱۲۳۴۵۶۷۸۹ — used in Iran and Urdu text).',
        'Unlike a keyboard layout switch, the tool keeps every other character intact: sentences, URLs, punctuation and line breaks survive untouched. It is the fastest way to localize numbers inside a design mockup, an e-book or an app string.'
      ],
      steps: [
        'Paste any text — mixed Arabic/English works fine.',
        'Pick a direction: to Arabic-Indic, to Persian, or back to Western digits.',
        'Copy the converted text.'
      ],
      faq: [
        { q: 'What is the difference between Arabic and Arabic-Indic numerals?', a: '“Arabic numerals” (0-9) are the ones English uses. “Arabic-Indic numerals” (٠١٢) originated in India and are used in Arabic-language documents, printed books and the Arabic-locale settings of phones.' },
        { q: 'Does it change digits inside URLs or code?', a: 'It converts every digit you feed it, so paste URLs or code at your own discretion — designers normally only paste prose.' },
        { q: 'Which countries use ٠١٢ vs 012?', a: 'Arabic-Indic ٠١٢ is standard in printed Arabic across the Gulf, Egypt and the Levant; North Africa and daily digital life mostly use 012.' }
      ]
    },
    ar: {
      title: 'محوّل الأرقام العربية ٠١٢ ↔ 012 — أونلاين مجاناً',
      meta: 'حوّل الأرقام بين الشكل الغربي (0-9) والشكل الشرقي (٠١٢) والفارسي (۰۱۲) للنصوص كاملة مع الحفاظ على كل حرف آخر. للمصممين والمترجمين ومطوري الواجهات العربية.',
      keywords: 'تحويل الأرقام العربية, أرقام هندية, ٠١٢ إلى 012, الأرقام الشرقية',
      intro: [
        'بدّل أي نص بين الأرقام الغربية (0-9) والشرقية العربية (٠١٢٣٤٥٦٧٨٩ المستخدمة في الخليج ومصر والشام) والفارسية (۰۱۲ المستخدمة في إيران والأردية).',
        'بخلاف تغيير لغة الكيبورد، الأداة تحافظ على بقية الأحرف: الجمل والروابط والترقيم تبقى كما هي. أسرع طريقة لتعريب الأرقام داخل تصميم أو كتاب إلكتروني.'
      ],
      steps: [
        'الصق أي نص — حتى لو مختلط عربي/إنجليزي.',
        'اختر الاتجاه: إلى ٠١٢ أو ۰۱۲ أو رجوع إلى 012.',
        'انسخ النص بعد التحويل.'
      ],
      faq: [
        { q: 'ما الفرق بين الأرقام العربية والهندية؟', a: 'الأرقام 0-9 تسمى غربية وهي المستخدمة بالإنجليزية، والأرقام ٠١٢ تسمى هندية/شرقية وتُستخدم في الكتب والوثائق العربية وإعدادات الجوال العربية.' },
        { q: 'هل تتحول الأرقام داخل الروابط؟', a: 'كل رقم في النص يتحول، فلا تلصق روابط أو أكواد برمجية إلا إذا كان هذا مقصودك.' },
        { q: 'أين تُستخدم ٠١٢؟', a: 'في المطبوعات العربية في الخليج ومصر والشام، بينما شمال أفريقيا والحياة الرقمية اليومية تستخدم 012 غالباً.' }
      ]
    }
  },
  {
    slug: 'romanize-arabic-names',
    icon: 'Languages',
    Component: RomanizePage,
    related: ['digits-converter', 'arabic-lorem-ipsum'],
    en: {
      title: 'Arabic Name to English — Romanization Converter',
      meta: 'Transliterate Arabic names and text into Latin letters instantly. Deterministic, rules-based romanization — perfect for usernames, emails, passports-style spellings and developer ID slugs.',
      keywords: 'arabic name to english, romanize arabic, transliteration arabic to english, arabic username generator',
      intro: [
        'Type an Arabic name and get a clean Latin-letter spelling: نورة → Noorah, علي → Ali, سعيد → S’eed. Great for usernames, email aliases, file names and API identifiers where Arabic characters are not allowed.',
        'The converter is rules-based and 100% deterministic — same input, same output, every time. Words written with long-vowel letters (و ا ي) come out familiar; it is a transliterator, not a dictionary, so it never guesses “creative” spellings.'
      ],
      steps: [
        'Type or paste Arabic text (names work best).',
        'Choose capitalization or hyphenated output (for slugs).',
        'Copy the Latin result.'
      ],
      faq: [
        { q: 'Is this the correct passport spelling?', a: 'Passport spelling is personal — governments accept many variants. This tool gives one consistent, readable variant; keep it consistent across all your documents and accounts.' },
        { q: 'Why does محمد become “Mhmd”?', a: 'Short vowels in Arabic are diacritics (فَتْحَة etc.) that are usually not written. A rules-based tool only sees the letters written. Names spelled with و/ا/ي (Noora, Fahad…) convert naturally.' },
        { q: 'Can I use it for bulk lists?', a: 'Yes — paste up to several hundred names, one per line. Pro adds CSV export.' }
      ]
    },
    ar: {
      title: 'تحويل الاسم العربي إلى إنجليزي — رومنزة الأسماء العربية',
      meta: 'حوّل الأسماء والنصوص العربية إلى حروف لاتينية فوراً بقواعد ثابتة — مثالي لأسماء المستخدمين والإيميلات والمعرفات والمعرّفات اللاتينية.',
      keywords: 'تحويل الاسم العربي الى انجليزي, رومنزة, تحويل الحروف العربية الى انجليزية',
      intro: [
        'اكتب اسمك بالعربية واحصل على كتابة لاتينية نظيفة: نورة → Noorah، علي → Ali. مفيد لأسماء المستخدمين والإيميلات وأسماء الملفات والمعرّفات التي لا تقبل العربية.',
        'التحويل قائم على قواعد ثابتة 100% — نفس المدخل يعطي نفس المخرج دائماً. الأسماء المكتوبة بحروف العلة (و ا ي) تخرج مألوفة، والأداة لا تخترع تهجئيات عشوائية.'
      ],
      steps: [
        'اكتب أو الصق النص العربي (الأسماء أفضل).',
        'اختر ت رأسي الحروف أو وضع الشرطة السفلية للمعرّفات.',
        'انسخ النتيجة اللاتينية.'
      ],
      faq: [
        { q: 'هل هذه كتابة الجوازات الصحيحة؟', a: 'تهجئة الجواز شخصية وتقبل الحكومات أشكالاً متعددة. الأداة تعطي صيغة واحدة ثابتة ومقروءة — الأهم أن تلتزم بها في كل أوراقك وحساباتك.' },
        { q: 'لماذا محمد تصبح Mhmd؟', a: 'الحركات القصيرة في العربية لا تُكتب عادة، والأداة تقرأ الحروف المكتوبة فقط. الأسماء التي فيها و/ا/ي (نورة، فهد) تتحول بشكل طبيعي.' },
        { q: 'هل يدعم قوائم كبيرة؟', a: 'نعم — الصق مئات الأسماء سطراً سطراً، وتصدير CSV متاح لمشتركي برو.' }
      ]
    }
  },
  {
    slug: 'arabic-lorem-ipsum',
    icon: 'Text',
    Component: LoremPage,
    related: ['fancy-arabic-text', 'digits-converter'],
    en: {
      title: 'Arabic Lorem Ipsum Generator — Real RTL Placeholder Text',
      meta: 'Generate natural-looking Arabic placeholder paragraphs for RTL mockups and wireframes. Seeded, deterministic output in one click — better than Latin lorem for Arabic UI design.',
      keywords: 'arabic lorem ipsum, arabic placeholder text, rtl mockup text, عربي وهمي, نص تجريبي عربي',
      intro: [
        'Latin lorem ipsum in an Arabic interface tells you nothing about how the real layout will flow. This generator produces natural-looking Arabic filler text so designers, developers and agencies can preview RTL line lengths, ragged edges and font rhythm before real copy exists.',
        'Output is seeded: pass a seed and you get the same paragraphs on every reload — useful for screenshot-driven design docs and regression tests.'
      ],
      steps: [
        'Choose how many paragraphs and an optional seed.',
        'Hit generate and preview the RTL flow instantly.',
        'Copy or download the text (CSV/TXT export in Pro).'
      ],
      faq: [
        { q: 'Why not just paste Latin lorem?', a: 'Arabic script connects, has different average word length, and renders right-to-left — Latin filler hides layout bugs that only appear in RTL scripts.' },
        { q: 'Is the text real Arabic?', a: 'It is grammatically shaped filler built from real UI-related words — readable as texture, meaningless as prose, exactly like classic lorem.' },
        { q: 'Can I use it commercially?', a: 'Yes, unlimited and free, no attribution required.' }
      ]
    },
    ar: {
      title: 'مولّد النص الوهمي العربي — لوريم إيبسوم عربي للواجهات',
      meta: 'ولّد فقرات عربية وهمية واقعية للموك أب والتصاميم من اليمين لليسار. ناتج ثابت حسب البذرة بضغطة واحدة — أدق من اللاتيني في معاينة الواجهات العربية.',
      keywords: 'لوريم إيبسوم عربي, نص وهمي عربي, نص تجريبي للواجهات',
      intro: [
        'اللوريم إيبسوم اللاتيني في واجهة عربية لا يكشف شيئاً عن تدفق التصميم الحقيقي. هذا المولّد ينتج نصاً عربياً واقعياً ليرى المصمم والمطوّر أطوال الأسطر وإيقاع الخط قبل جاهزية النص الحقيقي.',
        'الناتج قابل للتثبيت عبر “البذرة”: نفس البذرة تعطي نفس الفقرات في كل مرة — مفيد لوثائق التصميم واختبارات regression.'
      ],
      steps: [
        'حدد عدد الفقرات والبذرة (اختياري).',
        'اضغط توليد وشاهد تدفق RTL فوراً.',
        'انسخ النص أو صدّره (TXT/CSV في برو).'
      ],
      faq: [
        { q: 'لماذا لا نستخدم اللاتيني؟', a: 'العربية متصلة وأسطرها أقصر وتُقرأ من اليمين — اللاتيني يخفي مشاكل تظهر فقط في RTL.' },
        { q: 'هل النص عربي صحيح؟', a: 'هو حشو ذو بنية عربية من كلمات واجهات حقيقية — يُقرأ كنسيج نصي دون معنى، مثل اللوريم الأصلي تماماً.' },
        { q: 'هل الاستخدام التجاري مسموح؟', a: 'نعم، بلا حدود ولا requirement للإسناد.' }
      ]
    }
  },
  {
    slug: 'fancy-arabic-text',
    icon: 'Sparkles',
    Component: FancyPage,
    related: ['arabic-lorem-ipsum', 'tashkeel-tools'],
    en: {
      title: 'Fancy Text Generator — Beautiful Fonts for Instagram & WhatsApp',
      meta: 'Turn normal text into decorative Unicode styles: bold serif, script, small caps, circled, fullwidth, kashida elongation for Arabic and ornamental frames. Copy-paste anywhere.',
      keywords: 'fancy text generator, instagram fonts, unicode text styles, كشيدة, زخرفة النص العربي',
      intro: [
        'Instantly restyle any text with 14 decorative Unicode styles that paste straight into Instagram, TikTok, WhatsApp, X and game profiles — no images, no font installs.',
        'Arabic gets native treatment too: kashida (tatweel) elongation stretches joinable letters for that calligraphic banner look, plus ornamental frames. Latin text maps to mathematical-alphanumeric styles.'
      ],
      steps: [
        'Type your text.',
        'Hover styles for a live preview grid.',
        'Click any card to copy it to the clipboard.'
      ],
      faq: [
        { q: 'Will the fancy text work everywhere?', a: 'Mostly yes — it is real Unicode text, not images. Some older devices lack fonts for a few decorative blocks, so always check a preview.' },
        { q: 'What is kashida elongation?', a: 'Kashida (تطويل/كشيدة) is the horizontal stroke Arabic calligraphy uses to stretch words. The tool inserts tatweel between joinable letters automatically.' },
        { q: 'Is it free?', a: 'Yes — unlimited for personal use. Pro unlocks custom style presets.' }
      ]
    },
    ar: {
      title: 'زخرفة النص — خطوط مزخرفة لإنستقرام وواتساب',
      meta: 'حوّل نصك إلى 14 نمط يونيكود مزخرف: عريض ويدوي وأحرف مطوقة وتطويل بالكشيدة العربية وإطارات زخرفية — انسخه والصقه في أي مكان.',
      keywords: 'زخرفة النص, تنسيق النص, كشيدة, خطوط انستقرام, نص مزخرف عربي',
      intro: [
        'أعد تنسيق أي نص بـ 14 نمط يونيكود مزخرف ينسخ مباشرة إلى إنستقرام وتيك توك وواتساب وسيراتها — بدون صور ولا تثبيت خطوط.',
        'والعربية لها معاملة خاصة: تطويل الكشيدة يمدّ الأحرف المتصلة للمظهر الخطي، مع إطارات زخرفية. أما اللاتيني فيتحول لأنماط رياضية فاخرة.'
      ],
      steps: [
        'اكتب نصك.',
        'مرّر فوق الأنماط لمعاينة مباشرة.',
        'اضغط على أي بطاقة لنسخها.'
      ],
      faq: [
        { q: 'هل يعمل في كل التطبيقات؟', a: 'في الغالب نعم — هو نص يونيكود حقيقي وليس صورة، لكن بعض الأجهزة القديمة تفتقد بعض الخطوط فراجع المعاينة.' },
        { q: 'ما هي الكشيدة؟', a: 'الخط الأفقي الذي تمدّ به الخطّاطة الكلمة العربية، وتدرجه الأداة تلقائياً بين الأحرف المتصلة.' },
        { q: 'هل هو مجاني؟', a: 'نعم بلا حدود للاستخدام الشخصي، وبرو يفتح حفظ أنماطك الخاصة.' }
      ]
    }
  },
  {
    slug: 'tashkeel-tools',
    icon: 'Eraser',
    Component: TashkeelPage,
    related: ['digits-converter', 'bidi-inspector'],
    en: {
      title: 'Arabic Tashkeel Remover & Diacritics Counter',
      meta: 'Strip Arabic diacritics (harakat, tashkeel, tatweel) from any text in one click, or count how many marks a text carries. Essential for NLP, search indexing and clean Quran text handling.',
      keywords: 'tashkeel remover, remove harakat arabic, تشكيل, إزالة التشكيل, diacritics counter arabic',
      intro: [
        'Remove every Arabic diacritic — fatḥa, ḍamma, kasra, tanwīn, sukūn, shadda, the superscript alif and tatweel stretching — from any Arabic text instantly, or do the opposite and measure how heavily voweled a text is.',
        'Search engines, NLP pipelines and database keys usually need the bare consonantal skeleton; scholars and language learners need to verify vocalization coverage. Both take one click here.'
      ],
      steps: [
        'Paste Arabic text (with or without tashkeel).',
        'Read the live stats: marks count, density.',
        'Copy the stripped version.'
      ],
      faq: [
        { q: 'What exactly gets removed?', a: 'Unicode U+064B–U+065F (the Arabic diacritical block), U+0670 superscript alif and U+0640 tatweel. Letters and digits are untouched.' },
        { q: 'Does removing tashkeel change meaning?', a: 'The written letters stay identical; only the pronunciation guides disappear. That is exactly why NLP systems strip it — the root letters are preserved.' },
        { q: 'Is it good for Quran text?', a: 'It preserves every letter and reports mark counts; use it for indexing, not for recitation-quality text.' }
      ]
    },
    ar: {
      title: 'إزالة التشكيل من النص العربي + عدّاد الحركات',
      meta: 'احذف التشكيل والحركات والتطويل من أي نص عربي بضغطة، أو عُدّ عدد الحركات في النص وأداة قياس التشكيل. مفيدة لمحركات البحث ومعالجة النصوص والفهرسة.',
      keywords: 'إزالة التشكيل, تشكيل, حذف الحركات, عداد التشكيل',
      intro: [
        'احذف كل علامات التشكيل — الفتحة والضمة والكصرة والتنوين والسكون والشدة والألف الخنجرية والتطويل — من أي نص فورا، أو قِس كم تشكيلاً يحمل نصك.',
        'محركات البحث وأنظمة معالجة اللغة ومفاتيح قواعد البيانات تحتاج غالباً الهيكل الساكن بلا حركات، والباحث ودارس اللغة يحتاج التحقق من اكتمال التشكيل — والاثنان بضغطة هنا.'
      ],
      steps: [
        'الصق النص العربي (ب تشكيل أو بدونه).',
        'اقرأ الإحصاءات الفورية: عدد الحركات والكثافة.',
        'انسخ النص بعد التجريد.'
      ],
      faq: [
        { q: 'ما الذي يُحذف بالضبط؟', a: 'كتلة التشكيل U+064B–U+065F والألف الخنجرية U+0670 والتطويل U+0640 — الحروف والأرقام لا تتغير.' },
        { q: 'هل إزالة التشكيل تغير المعنى؟', a: 'الحروف المكتوبة تبقى كما هي وتزول دلائل النطق فقط، وهذا بالذات ما تفعله أنظمة معالجة اللغة.' },
        { q: 'هل يناسب نصوص القرآن؟', a: 'يُبقي كل الحروف ويعطيك إحصاء العلامات — استخدمه للفهرسة لا لنصوص التلاوة.' }
      ]
    }
  },
  {
    slug: 'zatca-qr-decoder',
    icon: 'QrCode',
    Component: ZatcaPage,
    related: ['amount-in-words', 'bidi-inspector'],
    en: {
      title: 'ZATCA QR Code Decoder — Read Saudi E-Invoice TLV Data',
      meta: 'Paste the Base64 payload (or scan URL) from a Saudi e-invoice QR and decode the TLV tags: seller name, VAT number, timestamp, totals, hash. Runs locally — invoice data never leaves your browser.',
      keywords: 'zatca qr decode, zatca tlv, saudi invoice qr, فاتورة ضريبية qr, e-invoicing phase 1 tlv',
      intro: [
        'Every ZATCA Phase-1 simplified tax invoice carries a QR code hiding a Base64 TLV payload: seller name, 15-digit VAT number, ISO timestamp, total with VAT, and VAT total (Phase-2 adds a hash and signature).',
        'Paste any QR reader output here and the tool decodes every tag, validates the VAT number format and timestamp, and flags compliance issues — for auditors, accountants, POS developers and anyone verifying a receipt.'
      ],
      steps: [
        'Scan the invoice QR with any reader app (or open it in a QR-decoder site).',
        'Paste the Base64 string into the box.',
        'Review the decoded tags and the compliance checklist.'
      ],
      faq: [
        { q: 'What is TLV in a ZATCA QR?', a: 'Tag-Length-Value — a compact binary encoding where each field (tag) is followed by its byte length and value, then Base64-encoded into the QR.' },
        { q: 'Is it safe to paste invoice data?', a: 'Yes — decoding runs 100% inside your browser via JavaScript; nothing is transmitted anywhere.' },
        { q: 'How do I check the QR image itself?', a: 'This tool decodes the Base64 text. For the image, first use any phone QR scanner to get the text, then paste it here.' }
      ]
    },
    ar: {
      title: 'فك تشفير QR فاتورة ZATCA — قراءة بيانات TLV',
      meta: 'الصق نص Base64 من رمز QR في الفاتورة الإلكترونية السعودية وافك تشفير TLV: اسم المورد والرقم الضريبي والتاريخ والإجماليات والتجزئة. كل ذلك محلياً داخل متصفحك.',
      keywords: 'فك تشفير QR الفاتورة, zacta tlv, رمز الفاتورة, الفاتورة الضريبية qr, التحقق من الفاتورة',
      intro: [
        'كل فاتورة ضريبية مبسطة من المرحلة الأولى تحمل رمز QR يخفي بيانات TLV بصيغة Base64: اسم المورد والرقم الضريبي ذو الـ 15 خانياً والتاريخ بصيغة ISO والإجمالي مع الضريبة وإجمالي الضريبة (وتضيف المرحلة الثانية التجزئة والتوقيع).',
        'الصق أي ناتج قارئ QR هنا والأداة تفك كل الحقول وتتأكد من صحة الرقم الضريبي والتاريخ وتتبنى مشاكل الامتثال — للمحاسبين ومدققي الحسابات ومطوري نقاط البيع ولمن يتحقق من فاتورة.'
      ],
      steps: [
        'امسح QR الفاتورة بأي تطبيق قراءة.',
        'الصق نص الـ Base64 في الخانة.',
        'راجع الحقول المفكوكة وقائمة فحص الامتثال.'
      ],
      faq: [
        { q: 'ما هو TLV في رمز الفاتورة؟', a: 'Tag-Length-Value: ترميز مختصر يتكون من رقم الحقل ثم طوله ثم قيمته، ويُشفَّر بصيغة Base64 داخل الـ QR.' },
        { q: 'هل لصق بيانات الفاتورة آمن؟', a: 'نعم — فك التشفير يتم بالكامل في متصفحك ولا يُرسل شيء لأي خادم.' },
        { q: 'كيف أفحص صورة الـ QR مباشرة؟', a: 'هذه الأداة تفك النص. استخدم قارئ QR في جوالك للحصول على النص أولاً ثم الصقه هنا.' }
      ]
    }
  },
  {
    slug: 'bidi-inspector',
    icon: 'ArrowLeftRight',
    Component: BidiPage,
    related: ['tashkeel-tools', 'digits-converter'],
    en: {
      title: 'RTL/LTR Bidi Inspector — Find Hidden Direction Characters',
      meta: 'Detect invisible Unicode bidi marks (RLM, LRM, RLO, isolates, BOM) that silently break Arabic layouts. See each hidden character, its position and a one-click clean version.',
      keywords: 'bidi control characters, RLO arabic reversal, hidden characters rtl, rlm lrm, zero width arabic',
      intro: [
        'When Arabic text is pasted from the web, Word or PDFs it silently carries directional control marks (RLM, LRM, RLO, embeddings, isolates, zero-width joiners) that cause “why is my Arabic backwards”, broken punctuation and ghost spacing.',
        'Paste any suspicious string and every invisible character is located, named and risk-rated — then export a cleaned version that keeps only the harmless joiners.'
      ],
      steps: [
        'Paste the problematic string.',
        'Review the findings table: position, character, risk level.',
        'Copy the cleaned text.'
      ],
      faq: [
        { q: 'What is the RLO character?', a: 'Right-to-Left Override (U+202E) forces everything after it to render reversed — used in pranks, and it can even hide filenames. This tool always flags it as high risk.' },
        { q: 'Is ZWNJ safe to keep?', a: 'Yes — the zero-width non-joiner (used in Persian and in emoji sequences) is functional, not directional, so the cleaner preserves it.' },
        { q: 'Why do my Arabic strings look fine in Word but break on the web?', a: 'Apps and browsers apply different bidi resolution defaults and sanitize different character subsets — the marks exist in the clipboard and only misbehave in some renderers.' }
      ]
    },
    ar: {
      title: 'فاحص الاتجاهات RTL/LTR — اكتشف أحرف الاتجاه المخفية',
      meta: 'اكتشف علامات الاتجاه الخفية في يونيكود (RLM وLRM وRLO والعزلات وBOM) التي تكسر النصوص العربية بصمت. حدّد موضع كل حرف وسبب المشكلة ونسّخ نصاً نظيفاً بضغطة.',
      keywords: 'علامات الاتجاه المخفية, rlo, rlm, نص معكوس, أحرف خفية يونيكود',
      intro: [
        'عند نسخ نص عربي من الويب أو الوورد أو PDF قد يحمل بصمت علامات اتجاه (RLM وLRM وRLO وتضمينات وعزلات وأحرف صفرية العرض) تسبب “ليش النص العربي معكوس” وترقيماً مكسوراً ومسافات شبحية.',
        'الصق النص المشكوك فيه ويظهر لك موقع كل حرف خفي وخطورته، ثم انسخ نسخة نظيفة تحافظ فقط على أدوات الوصل المفيدة.'
      ],
      steps: [
        'الصق النص المزعج.',
        'راجع جدول النتائج: الموضع والحرف والخطورة.',
        'انسخ النص بعد التنظيف.'
      ],
      faq: [
        { q: 'ما هو حرف RLO؟', a: 'تجاوز اليمين-ليسار (U+202E) يقلب عرض كل ما بعده — يُستخدم في المقالب وقد يُخفي أسماء الملفات، وهو دائماًخطر عالي هنا.' },
        { q: 'هل حرف ZWNJ آمن؟', a: 'نعم — مانع الوصل الصفري وظيفي وليس اتجاهياً، لذلك يبقيه المنظّف.' },
        { q: 'ليش النص سليم في الوورد ومكسور في الويب؟', a: 'لكل تطبيق معايير مختلفة في حل الاتجاه وتنقية الأحرف — العلامات موجودة في النص الأصلي ولا تظهر إلا في بعض المعارضات.' }
      ]
    }
  }
];

export function findTool(slug) {
  return TOOLS.find((tool) => tool.slug === slug) || null;
}
