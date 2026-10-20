import { Property, PropertyRequest, AgencyService } from '@/types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    code: 'REF-101',
    title: 'فيلا مودرن فاخرة مع مسبح خاص وحديقة واسعة',
    description: 'فيلا بتصميم معماري حديث وتشطيبات فندقية VIP في أرقى أحياء شمال الرياض. تتكون من دورين وملحق، مصعد إيطالي، تكييف مركزي، غرفة سائق وغرفة خادمة، مسبح خاص بنظام تدفئة، وموقف يتسع لـ 3 سيارات. مطابقة لكود البناء السعودي مع كافة الضمانات.',
    purpose: 'sale',
    type: 'villa',
    price: 3850000,
    location: {
      city: 'الرياض',
      district: 'حي الملقا',
      address: 'شارع الأمير سلمان بن محمد، الملقا',
      mapCoordinates: { lat: 24.8123, lng: 46.6124 }
    },
    area: 450,
    bedrooms: 5,
    bathrooms: 6,
    livingRooms: 2,
    parking: 3,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['مسبح خاص', 'مصعد إيطالي', 'تكييف مركزي', 'حديقة خاصة', 'غرفة خادمة', 'غرفة سائق', 'كاميرات مراقبة', 'سمارت هوم'],
    viewsCount: 245,
    whatsappClicks: 38,
    featured: true,
    createdAt: '2026-10-15T10:00:00Z'
  },
  {
    id: 'prop-2',
    code: 'REF-102',
    title: 'شقة فاخرة مؤثثة بالكامل بإطلالة بانورامية',
    description: 'شقة سكنية بتشطيب سوبر ديلوكس في برج سكني مميز بإطلالة مباشرة على الكورنيش. تتميز بدخول ذكي، مطبخ مجهز بأحدث الأجهزة الألمانية، وصالة معيشة مفتوحة وشرفة بانورامية رائعة.',
    purpose: 'sale',
    type: 'apartment',
    price: 1450000,
    location: {
      city: 'جدة',
      district: 'حي الشاطئ',
      address: 'طريق الكورنيش، الشاطئ',
      mapCoordinates: { lat: 21.5892, lng: 39.1234 }
    },
    area: 195,
    bedrooms: 3,
    bathrooms: 3,
    livingRooms: 1,
    parking: 1,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['إطلالة بحرية', 'مؤثثة بالكامل', 'دخول ذكي', 'نادي صحي بالبرج', 'أمن 24/7', 'موقف قبو خاص'],
    viewsCount: 312,
    whatsappClicks: 52,
    featured: true,
    createdAt: '2026-10-16T14:30:00Z'
  },
  {
    id: 'prop-3',
    code: 'REF-103',
    title: 'شقة عائلية للإيجار السنوي بتشطيب راقٍ وموقع استراتيجي',
    description: 'شقة للإيجار في مجمع سكني هادئ ومخدم بالكامل، قريبة من طريق الملك فهد والمراكز التجارية. تتضمن مطبخ راكب ومكيفات سبليت جديدة راكبة في جميع الغرف.',
    purpose: 'rent',
    type: 'apartment',
    price: 65000,
    location: {
      city: 'الرياض',
      district: 'حي الياسمين',
      address: 'شارع أنس بن مالك، الياسمين',
      mapCoordinates: { lat: 24.8311, lng: 46.6543 }
    },
    area: 165,
    bedrooms: 3,
    bathrooms: 3,
    livingRooms: 1,
    parking: 1,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['مطبخ راكب', 'مكيفات راكبة', 'مصعد', 'موقف مظلل', 'عداد كهرباء مستقل'],
    viewsCount: 198,
    whatsappClicks: 29,
    featured: false,
    createdAt: '2026-10-17T09:15:00Z'
  },
  {
    id: 'prop-4',
    code: 'REF-104',
    title: 'قصر مصغر كلاسيكي بواجهة حجر طبيعي وتصميم أندلسي',
    description: 'قصر فخم بتصميم استثنائي وتشطيب رخامي كامل من الدرجة الأولى. يتضمن مجالس ضيافة منفصلة بمغاسل ملكية، صالة طعام رئيسية، قبو ترفيهي متكامل، ومسطحات خضراء تحيط بالقصر.',
    purpose: 'sale',
    type: 'villa',
    price: 7200000,
    location: {
      city: 'الرياض',
      district: 'حي حطين',
      address: 'شارع الخير، حطين النموذجي',
      mapCoordinates: { lat: 24.7821, lng: 46.5932 }
    },
    area: 780,
    bedrooms: 6,
    bathrooms: 8,
    livingRooms: 3,
    parking: 4,
    status: 'reserved',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['حجر طبيعي بالكامل', 'أرضيات رخام روزا', 'قبو ترفيهي', 'شلالات مائية', 'جناح نوم رئيسي ملكي', 'أجنحة ضيافة منفصلة'],
    viewsCount: 420,
    whatsappClicks: 64,
    featured: true,
    createdAt: '2026-10-12T11:00:00Z'
  },
  {
    id: 'prop-5',
    code: 'REF-105',
    title: 'أرض سكنية زاوية على شارعين 20م و15م في موقع مميز',
    description: 'أرض سكنية مستوية ومفرزة بصك إلكتروني مستقل وخالية من أية شوائب، جاهزة للبناء فوراً في منطقة راقية ومكتملة الخدمات والإنارة والاتصالات وشبكات الصرف والمياه.',
    purpose: 'sale',
    type: 'land',
    price: 2150000,
    location: {
      city: 'الخبر',
      district: 'حي الحزام الذهبي',
      address: 'شارع الأمير حمود، الخبر',
      mapCoordinates: { lat: 26.2911, lng: 50.2104 }
    },
    area: 600,
    bedrooms: 0,
    bathrooms: 0,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['موقع زاوية', 'شارعين 20م و15م', 'صك إلكتروني إفراغ فوري', 'مكتملة الخدمات الحكومية', 'طبيعة أرض مستوية'],
    viewsCount: 160,
    whatsappClicks: 21,
    featured: false,
    createdAt: '2026-10-14T16:45:00Z'
  },
  {
    id: 'prop-6',
    code: 'REF-106',
    title: 'معرض تجاري فاخر على طريق رئيسي واجهة زجاجية',
    description: 'معرض تجاري بمساحة واسعة وارتفاع مزدوج (Double Height)، يقع على شريان تجاري حيوي، مناسب جداً للشركات الكبرى، البنوك، العيادات الطبية، والماركات العالمية مع مواقف أمامية واسعة.',
    purpose: 'rent',
    type: 'commercial',
    price: 320000,
    location: {
      city: 'الرياض',
      district: 'حي النرجس',
      address: 'طريق عثمان بن عفان، النرجس',
      mapCoordinates: { lat: 24.8456, lng: 46.6891 }
    },
    area: 380,
    bedrooms: 0,
    bathrooms: 2,
    parking: 8,
    status: 'sold',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['واجهة زجاجية 18 متر', 'ارتفاع سقف 6 أمتار', 'ميزانين داخلي', 'مواقف خاصة للعملاء', 'ترخيص تجاري جاهز'],
    viewsCount: 290,
    whatsappClicks: 44,
    featured: true,
    createdAt: '2026-10-10T08:20:00Z'
  }
];

export const INITIAL_REQUESTS: PropertyRequest[] = [
  {
    id: 'req-1',
    clientName: 'أبو فهد القحطاني',
    clientPhone: '+966501234567',
    purpose: 'buy',
    type: 'villa',
    city: 'الرياض',
    district: 'الملقا أو حطين أو النرجس',
    budgetMin: 3200000,
    budgetMax: 4500000,
    bedrooms: 5,
    notes: 'مطلوب فيلا مودرن درج صالة مع مسبح وغرفة خادمة، يفضل واجهة شمالية وشوارع لا تقل عن 15 متر. الشراء كاش وجاهز للإفراغ الفوري.',
    status: 'approved',
    viewsCount: 184,
    whatsappClicks: 26,
    createdAt: '2026-10-18T12:00:00Z'
  },
  {
    id: 'req-2',
    clientName: 'د. خالد الزهراني',
    clientPhone: '+966559876543',
    purpose: 'rent',
    type: 'apartment',
    city: 'جدة',
    district: 'الشاطئ أو الروضة أو الحمراء',
    budgetMin: 55000,
    budgetMax: 80000,
    bedrooms: 3,
    notes: 'مطلوب شقة عائلية فاخرة مؤثثة أو نصف مؤثثة بمطبخ ومكيفات راكبة في عمارة حديثة ومصعد وموقف خاص، الدفع كل 6 أشهر.',
    status: 'approved',
    viewsCount: 142,
    whatsappClicks: 19,
    createdAt: '2026-10-19T09:30:00Z'
  },
  {
    id: 'req-3',
    clientName: 'م. عبدالله الشهري',
    clientPhone: '+966543219876',
    purpose: 'buy',
    type: 'land',
    city: 'الرياض',
    district: 'العارض أو النرجس',
    budgetMin: 1800000,
    budgetMax: 2600000,
    notes: 'مطلوب قطعة أرض سكنية مساحة من 400 إلى 550 متر مربع شارع 20م، صك إلكتروني سليم.',
    status: 'approved',
    viewsCount: 96,
    whatsappClicks: 14,
    createdAt: '2026-10-19T15:20:00Z'
  },
  {
    id: 'req-4',
    clientName: 'سارة التميمي',
    clientPhone: '+966567890123',
    purpose: 'buy',
    type: 'apartment',
    city: 'الرياض',
    district: 'الياسمين أو الصحافة',
    budgetMin: 850000,
    budgetMax: 1100000,
    bedrooms: 3,
    notes: 'مطلوب شقة تمليك جديدة بالضمانات، 3 غرف وصالة ومجلس، قريبة من المترو.',
    status: 'pending',
    viewsCount: 20,
    whatsappClicks: 3,
    createdAt: '2026-10-20T11:45:00Z'
  }
];

export const AGENCY_SERVICES: AgencyService[] = [
  {
    id: 'serv-1',
    title: 'التسويق والوساطة العقارية الحصرية',
    slug: 'marketing',
    iconName: 'Megaphone',
    shortDesc: 'حملات تسويقية احترافية وتصوير سينمائي ثلاثي الأبعاد ليصل عقارك لأكبر شريحة من المشترين الجادين.',
    fullDesc: 'نعتمد أحدث استراتيجيات التسويق الرقمي وتصوير الدرون والجولات الافتراضية 3D مع توظيف شبكة علاقاتنا الواسعة مع نخبة المستثمرين وصناديق الاستثمار العقاري لتحقيق أفضل سعر بيع في زمن قياسي.',
    benefits: [
      'تصوير فوتوغرافي وجولات افتراضية ثلاثية الأبعاد',
      'إعلانات ممولة مستهدفة في منصات التواصل العقارية',
      'تجهيز العقود الموحدة عبر منصة إيجار وبورصة العقار',
      'فريق مبيعات تفاوضي محترف لضمان أعلى عائد'
    ]
  },
  {
    id: 'serv-2',
    title: 'إدارة الأملاك والمرافق الشاملة',
    slug: 'property-management',
    iconName: 'Building2',
    shortDesc: 'إدارة تشغيلية وصيانة متكاملة وتحصيل للإيجارات تضمن لك عائداً استثمارياً مستداماً وراحة بال تامة.',
    fullDesc: 'نتولى دورة الحياة الكاملة للعقارات الاستثمارية، بدءاً من فحص المستأجرين وصياغة عقود إيجار الموثقة، مروراً بمتابعة الصيانة الدورية والطارئة، وحتى التحصيل الفوري والتقارير المالية الدقيقة للمالك.',
    benefits: [
      'تحصيل الإيجارات ومتابعة الإيداعات البنكية للمالك',
      'إدارة الصيانة الدورية والطارئة بفريق فني معتمد',
      'تسويق الوحدات الشاغرة لتقليل فترات الفراغ التأجيري',
      'لوحة تحكم إلكترونية للمالك لمتابعة الإيرادات والمصروفات'
    ]
  },
  {
    id: 'serv-3',
    title: 'الاستشارات العقارية والتحليل الاستثماري',
    slug: 'consultations',
    iconName: 'TrendingUp',
    shortDesc: 'دراسات جدوى متخصصة واستشارات استثمارية مبنية على بيانات موثوقة لتحقيق أفضل العوائد.',
    fullDesc: 'يقدم خبراؤنا استشارات استراتيجية للأفراد والشركات في اقتناص الفرص العقارية وتوزيع المحفظة الاستثمارية، بالإضافة لدراسات الجدوى للمشاريع السكنية والتجارية وأعلى وأفضل استخدام للأراضي.',
    benefits: [
      'تحليل اتجاهات السوق وحركة العرض والطلب والمؤشرات العقارية',
      'دراسات أعلى وأفضل استخدام للأراضي الخام والمواقع الحيوية',
      'إعادة هيكلة المحافظ العقارية لتعظيم العائد المالي',
      'استشارات الشراء وإجراءات التمويل العقاري والرهن'
    ]
  },
  {
    id: 'serv-4',
    title: 'التقييم والتثمين العقاري المعتمد',
    slug: 'valuation',
    iconName: 'Award',
    shortDesc: 'تقييم عقاري دقيق ومعتمد لدى الهيئة السعودية للمقيّمين المعتمدين (تقييم) والبنوك والمحاكم.',
    fullDesc: 'نصدر تقارير تقييم رسمية معتمدة وفق المعايير الدولية ومقررات هيئة تقييم، تفيدك في أغراض البيع، التمويل البنكي، تصفية التركات، الاندماج والاستحواذ، والنزاعات القضائية.',
    benefits: [
      'معتمدون لدى هيئة المقيّمين المعتمدين (تقييم)',
      'تقارير مفصلة مدعومة بأحدث صفقات البورصة العقارية',
      'سرعة الإنجاز ودقة فحص الموقع والمواصفات الإنشائية',
      'معتمد لدى البنوك والجهات التمويلية الرسمية'
    ]
  }
];

export const AGENCY_CONFIG = {
  name: 'رؤية العقارية',
  subtitle: 'الريادة والتميز في الوساطة والاستثمار العقاري',
  falLicense: '1200028491',
  crNumber: '1010789423',
  phone: '+966 11 456 7890',
  mobile: '+966 50 123 4567',
  whatsappNumber: '966501234567',
  email: 'info@ruya-aqar.sa',
  address: 'طريق الملك فهد، حي الملقا، برج النخبة - الدور 14، الرياض',
  workingHours: 'السبت - الخميس: 9:00 ص - 9:00 م | الجمعة: مغلق',
  social: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    snapchat: 'https://snapchat.com'
  }
};
