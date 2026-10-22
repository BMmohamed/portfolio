import { Property, PropertyRequest, AgencyService } from '@/types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    code: 'REF-101',
    title: 'فيلا مودرن فاخرة مع مسبح خاص وحديقة واسعة في يعفور',
    description: 'فيلا فخمة بتصميم معماري حديث وتشطيبات سوبر ديلوكس VIP في أرقى مناطق ريف دمشق (يعفور). تتألف من طابقين وتراس بانورامي، مسبح خاص بنظام تدفئة، طاقة شمسية متكاملة، بئر ماء خاص مرخص، مولدة كهرباء، غرفة حارس وخدم، وحديقة منسقة بمساحة واسعة. طابو أخضر 2400 سهم نظامي جاهز للفراغ الفوري.',
    purpose: 'sale',
    type: 'villa',
    price: 8500000000,
    location: {
      city: 'ريف دمشق',
      district: 'يعفور',
      address: 'شارع الفلل الحديثة، يعفور، ريف دمشق',
      mapCoordinates: { lat: 33.5138, lng: 36.1425 }
    },
    area: 650,
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
    features: ['طابو أخضر 2400 سهم', 'مسبح خاص مجهز', 'طاقة شمسية كاملة', 'بئر ماء مرخص', 'حديقة واسعة', 'تدفئة وتكييف مركزي', 'غرفة حارس', 'مولدة كهرباء'],
    viewsCount: 245,
    whatsappClicks: 38,
    featured: true,
    createdAt: '2026-10-15T10:00:00Z'
  },
  {
    id: 'prop-2',
    code: 'REF-102',
    title: 'شقة سكنية فخمة بتشطيب سوبر ديلوكس في أبو رمانة',
    description: 'شقة راقية في قلب أرقى أحياء دمشق (أبو رمانة). تتميز بكسوة رخامية إيطالية، إطلالة رائعة على حديقة الجاحظ، مصعد خاص، تدفئة وتكييف مركزي، وموقف سيارة خاص بالقبو. طابو ملك نظامي جاهز للتسجيل الفوري.',
    purpose: 'sale',
    type: 'apartment',
    price: 4200000000,
    location: {
      city: 'دمشق',
      district: 'أبو رمانة',
      address: 'بالقرب من حديقة الجاحظ، أبو رمانة، دمشق',
      mapCoordinates: { lat: 33.5192, lng: 36.2845 }
    },
    area: 220,
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
    features: ['طابو أخضر نظامي', 'كسوة رخام إيطالي', 'موقف قبو خاص', 'مصعد حديث', 'طاقة شمسية', 'موقع دبلوماسي راقٍ'],
    viewsCount: 312,
    whatsappClicks: 52,
    featured: true,
    createdAt: '2026-10-16T14:30:00Z'
  },
  {
    id: 'prop-3',
    code: 'REF-103',
    title: 'شقة مفروشة بالكامل للإيجار السنوي في تنظيم كفرسوسة',
    description: 'شقة دوبلكس مفروشة بأرقى المفروشات العصرية في منطقة كفرسوسة الراقية، قريبة من الشام سيتي سنتر والمراكز الحيوية. مجهزة بنظام طاقة شمسية متكامل يغذي كامل المنزل، ومطبخ متكامل بجميع الأدوات الكهربائية.',
    purpose: 'rent',
    type: 'apartment',
    price: 35000000,
    location: {
      city: 'دمشق',
      district: 'كفرسوسة',
      address: 'بالقرب من الشام سيتي سنتر، كفرسوسة، دمشق',
      mapCoordinates: { lat: 33.4981, lng: 36.2734 }
    },
    area: 180,
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
    features: ['مفروشة بالكامل VIP', 'نظام طاقة شمسية 24 ساعة', 'مصعد يعمل باستمرار', 'موقف سيارات', 'حراسة مدار الساعة'],
    viewsCount: 198,
    whatsappClicks: 29,
    featured: false,
    createdAt: '2026-10-17T09:15:00Z'
  },
  {
    id: 'prop-4',
    code: 'REF-104',
    title: 'شقة بانورامية بإطلالة بحرية مباشرة على كورنيش اللاذقية',
    description: 'شقة سكنية استثنائية في أرقى أبراج الكورنيش الغربي باللاذقية بإطلالة بحرية خلابة ومفتوحة لا تُحجب. تشطيبات فاخرة، شرفة بحرية واسعة، دخول أمني وبوابات إلكترونية ومصاعد حديثة تعمل بنظام الطاقة.',
    purpose: 'sale',
    type: 'apartment',
    price: 2800000000,
    location: {
      city: 'اللاذقية',
      district: 'الكورنيش الغربي',
      address: 'شارع الكورنيش الغربي، مقابل الواجهة البحرية، اللاذقية',
      mapCoordinates: { lat: 35.5312, lng: 35.7814 }
    },
    area: 210,
    bedrooms: 3,
    bathrooms: 3,
    livingRooms: 2,
    parking: 1,
    status: 'reserved',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['إطلالة بحرية مفتوحة', 'طابو أخضر نظامي 2400 سهم', 'مصعد يعمل على الطاقة', 'موقف خاص بالقبو', 'شرفة واسعة'],
    viewsCount: 420,
    whatsappClicks: 64,
    featured: true,
    createdAt: '2026-10-12T11:00:00Z'
  },
  {
    id: 'prop-5',
    code: 'REF-105',
    title: 'أرض سكنية مستوية ومفرزة في صيدنايا بإطلالة جبلية خلابة',
    description: 'أرض سكنية مفرزة بصك طابو أخضر نظامي 2400 سهم، تقع في موقع هادئ وإطلالة ساحرة على جبال صيدنايا. واصلة لكافة الخدمات (كهرباء، ماء، هاتف، طريق معبد)، ومناسبة جداً لبناء فيلا أو مزرعة خاصة.',
    purpose: 'sale',
    type: 'land',
    price: 1950000000,
    location: {
      city: 'ريف دمشق',
      district: 'صيدنايا',
      address: 'طريق دير السيدة، صيدنايا، ريف دمشق',
      mapCoordinates: { lat: 33.6931, lng: 36.3712 }
    },
    area: 800,
    bedrooms: 0,
    bathrooms: 0,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['طابو أخضر نظامي', 'إطلالة جبلية خلابة', 'واصلة كافة الخدمات', 'طريق معبد 12 متر', 'صلاحية بناء فورية'],
    viewsCount: 160,
    whatsappClicks: 21,
    featured: false,
    createdAt: '2026-10-14T16:45:00Z'
  },
  {
    id: 'prop-6',
    code: 'REF-106',
    title: 'محل تجاري فاخر بموقع حيوي في الشعلان واجهة زجاجية',
    description: 'محل تجاري بموقع استثنائي في قلب حي الشعلان الحيوي بدمشق، واجهة زجاجية عريضة على الشارع مباشرة، بارتفاع عالي مع سدة داخلية (ميزانين)، مناسب لكبرى الماركات، الصيدليات، أو مقار الشركات.',
    purpose: 'rent',
    type: 'commercial',
    price: 60000000,
    location: {
      city: 'دمشق',
      district: 'الشعلان',
      address: 'شارع ميسلون، الشعلان، دمشق',
      mapCoordinates: { lat: 33.5175, lng: 36.2912 }
    },
    area: 120,
    bedrooms: 0,
    bathrooms: 2,
    parking: 2,
    status: 'sold',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['واجهة زجاجية عريضة', 'سدة داخلية مجهزة', 'موقع تجاري حيوي من الدرجة الأولى', 'طاقة شمسية', 'سجل تجاري نظامي'],
    viewsCount: 290,
    whatsappClicks: 44,
    featured: true,
    createdAt: '2026-10-10T08:20:00Z'
  }
];

export const INITIAL_REQUESTS: PropertyRequest[] = [
  {
    id: 'req-1',
    clientName: 'المهندس عمر الحلبي',
    clientPhone: '+963 944 112 233',
    purpose: 'buy',
    type: 'villa',
    city: 'ريف دمشق',
    district: 'يعفور أو الصبورة أو قرى الأسد',
    budgetMin: 6000000000,
    budgetMax: 10000000000,
    bedrooms: 5,
    notes: 'مطلوب فيلا مع مسبح وطاقة شمسية وحديقة، يفضل طابو أخضر 2400 سهم والدفع كاش وجاهز للإفراغ الفوري.',
    status: 'approved',
    viewsCount: 184,
    whatsappClicks: 26,
    createdAt: '2026-10-18T12:00:00Z'
  },
  {
    id: 'req-2',
    clientName: 'د. سامر كلاس',
    clientPhone: '+963 933 554 433',
    purpose: 'rent',
    type: 'apartment',
    city: 'دمشق',
    district: 'المالكي أو أبورمانة أو المزة فيلات',
    budgetMin: 30000000,
    budgetMax: 50000000,
    bedrooms: 3,
    notes: 'مطلوب شقة مفروشة راقية مع طاقة شمسية مستمرة وتدفئة ومصعد شغال، عقد سنوي موثق رسمي.',
    status: 'approved',
    viewsCount: 142,
    whatsappClicks: 19,
    createdAt: '2026-10-19T09:30:00Z'
  },
  {
    id: 'req-3',
    clientName: 'أحمد الصباغ',
    clientPhone: '+963 955 887 766',
    purpose: 'buy',
    type: 'apartment',
    city: 'حلب',
    district: 'الشهباء أو الفرقان أو المحافظة',
    budgetMin: 1800000000,
    budgetMax: 2500000000,
    notes: 'مطلوب شقة 3 غرف وصالون عمارة حديثة طابو نظامي، إفراغ فوري بدون أية إشارات أو رهونات.',
    status: 'approved',
    viewsCount: 96,
    whatsappClicks: 14,
    createdAt: '2026-10-19T15:20:00Z'
  },
  {
    id: 'req-4',
    clientName: 'ليلى المرادي',
    clientPhone: '+963 991 223 344',
    purpose: 'buy',
    type: 'apartment',
    city: 'اللاذقية',
    district: 'الكورنيش أو الزراعة أو الشاطئ الأزرق',
    budgetMin: 1500000000,
    budgetMax: 2200000000,
    bedrooms: 3,
    notes: 'مطلوب شقة إطلالة بحرية أو قريبة من الكورنيش، تشطيب ديلوكس ومصعد يعمل بنظام الطاقة.',
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
    fullDesc: 'نعتمد أحدث استراتيجيات التسويق الرقمي وتصوير الدرون والجولات الافتراضية 3D مع توظيف شبكة علاقاتنا الواسعة مع نخبة المستثمرين والشركات لتحقيق أفضل صفقة بيع في زمن قياسي.',
    benefits: [
      'تصوير فوتوغرافي وجولات افتراضية ثلاثية الأبعاد',
      'إعلانات رقمية مستهدفة لكافة المهتمين والمغتربين',
      'تجهيز العقود الرسمية وتدقيق القيود العقارية بالمصالح العقارية',
      'فريق مبيعات تفاوضي محترف لضمان أعلى عائد للمالك'
    ]
  },
  {
    id: 'serv-2',
    title: 'إدارة الأملاك والمرافق الشاملة',
    slug: 'property-management',
    iconName: 'Building2',
    shortDesc: 'إدارة تشغيلية وصيانة متكاملة وتحصيل للإيجارات تضمن لك عائداً استثمارياً مستداماً وراحة بال تامة.',
    fullDesc: 'نتولى إدارة العقارات للمغتربين والمستثمرين، بدءاً من اختيار المستأجرين وصياغة العقود الموثقة، مروراً بمتابعة الصيانة الدورية وتأمين الطاقة البديلة، وحتى التحصيل الفوري للإيجارات.',
    benefits: [
      'تحصيل الإيجارات الدورية وتحويل المستحقات للمالك',
      'إدارة الصيانة الدورية وأنظمة الطاقة البديلة والكهرباء',
      'تسويق الوحدات الشاغرة لتقليل فترات الفراغ التأجيري',
      'تقارير دورية شفافة للمالك لمتابعة كافة التفاصيل المالية'
    ]
  },
  {
    id: 'serv-3',
    title: 'الاستشارات العقارية والتحليل الاستثماري',
    slug: 'consultations',
    iconName: 'TrendingUp',
    shortDesc: 'دراسات جدوى متخصصة واستشارات استثمارية مبنية على بيانات موثوقة لتحقيق أفضل العوائد في سوريا.',
    fullDesc: 'يقدم خبراؤنا استشارات استراتيجية للأفراد والمغتربين في اقتناص الفرص العقارية السكنية والتجارية في دمشق وحلب والمدن الساحلية ومشاريع التطوير الحديثة.',
    benefits: [
      'تحليل حركة الأسعار واتجاهات العرض والطلب بالمحافظات السورية',
      'دراسات جدوى للمشاريع السكنية والتجارية والمزارع',
      'إعادة هيكلة المحافظ العقارية لتعظيم العائد المالي',
      'استشارات الأمان القانوني وفحص الصحائف العقارية بدقة'
    ]
  },
  {
    id: 'serv-4',
    title: 'التقييم والتثمين العقاري المعتمد',
    slug: 'valuation',
    iconName: 'Award',
    shortDesc: 'تقييم عقاري دقيق وموثوق لدى الجمعيات والجهات المصرفية والقضائية المعتمدة في سوريا.',
    fullDesc: 'نصدر تقارير تقييم رسمية مفصلة وفق أعلى المعايير الفنية والمهنية، تفيدك في أغراض البيع والشراء، تصفية التركات، الرهونات، والنزاعات القانونية.',
    benefits: [
      'خبراء تقييم معتمدون من ذوي الخبرة الطويلة',
      'تقارير مفصلة مدعومة بأحدث صفقات وأسعار السوق الفعلي',
      'سرعة الإنجاز ودقة فحص الموقع والمواصفات الإنشائية',
      'معتمد لدى البنوك والجهات الرسمية والقضائية'
    ]
  }
];

export const AGENCY_CONFIG = {
  name: 'رؤية العقارية',
  subtitle: 'الريادة والتميز في الوساطة والاستثمار العقاري في سوريا',
  crNumber: '48921 / دمشق',
  phone: '+963 11 334 5678',
  mobile: '+963 944 123 456',
  whatsappNumber: '963944123456',
  email: 'info@ruya-aqar.sy',
  address: 'دمشق، أوتوستراد المزة، برج الفردوس - الطابق الخامس، سوريا',
  workingHours: 'السبت - الخميس: 9:00 ص - 8:00 م | الجمعة: مغلق',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    telegram: 'https://t.me'
  }
};
