export interface Instructor {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  bio: string;
  experienceYears: number;
  rating: number;
  studentsCount: number;
  coursesCount: number;
}

export interface TrainingLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'interactive_lab' | 'quiz' | 'project';
  isFreePreview?: boolean;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  topics: string[];
  lessons: TrainingLesson[];
}

export interface TrainingTrack {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'شامل الاحتراف';
  instructor: Instructor;
  description: string;
  summary: string;
  badgeColor: string;
  icon: string;
  thumbnail: string;
  skills: string[];
  prerequisites: string[];
  durationWeeks: number;
  totalHours: number;
  projectsCount: number;
  totalModules: number;
  rating: number;
  reviewsCount: number;
  enrolledStudentsCount: number;
  price: number;
  discountPrice?: number;
  certificateProvided: boolean;
  featured: boolean;
  learningOutcomes: string[];
  curriculum: TrainingModule[];
}

export const INSTRUCTORS: Record<string, Instructor> = {
  frontendLead: {
    id: 'inst-fe-01',
    name: 'م. طارق المهندس',
    role: 'كبير مهندسي واجهات الويب وتجربة المستخدم',
    title: 'Lead Frontend Architect & Google GDE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'خبير في تطوير الواجهات المعقدة وهندسة تطبيقات React & TypeScript مع خبرة تفوق 10 سنوات في الشركات التقنية الكبرى.',
    experienceYears: 10,
    rating: 4.95,
    studentsCount: 3420,
    coursesCount: 8
  },
  backendLead: {
    id: 'inst-be-02',
    name: 'م. حسام الدين عبد الله',
    role: 'كبير مهندسي النظم الخلفية والبنية التحتية السحابية',
    title: 'Principal Cloud & Backend Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'متخصص في تصميم النظم الموزعة عالية التوفر، قواعد البيانات الحديثة وحماية خوادم الويب السحابية.',
    experienceYears: 12,
    rating: 4.92,
    studentsCount: 2890,
    coursesCount: 6
  },
  aiLead: {
    id: 'inst-ai-03',
    name: 'د. ياسمين الشريف',
    role: 'باحثة ومهندسة ذكاء اصطناعي ونماذج لغوية',
    title: 'Senior AI Engineer & GenAI Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'متخصصة في هندسة الذكاء الاصطناعي التوليدي، وتطوير الوكلاء الأذكياء واستدعاء الأدوات بواسطة Gemini API.',
    experienceYears: 8,
    rating: 4.98,
    studentsCount: 1950,
    coursesCount: 5
  },
  devOpsLead: {
    id: 'inst-ops-04',
    name: 'م. كريم سامي',
    role: 'مهندس DevOps وأمان سيبراني سحابي',
    title: 'DevSecOps & Cloud Reliability Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'خبير في أتمتة خطوط النشر CI/CD، إدارة الحاويات Docker/Kubernetes وهندسة الأمان السيبراني للتطبيقات.',
    experienceYears: 9,
    rating: 4.88,
    studentsCount: 1420,
    coursesCount: 4
  }
};

export const TRAINING_TRACKS: TrainingTrack[] = [
  {
    id: 'frontend-track-pro',
    slug: 'frontend-development',
    title: 'مسار تطوير واجهات المستخدم المتقدمة (Modern Frontend Engineering)',
    category: 'هندسة البرمجيات والويب',
    level: 'شامل الاحتراف',
    instructor: INSTRUCTORS.frontendLead,
    summary: 'إتقان بناء وتطوير تطبيقات الويب التفاعلية الحديثة باستخدام React 19، TypeScript، Tailwind CSS وهندسة الحالة المتقدمة.',
    description: 'مسار تدريبي شامل يغطي أسس وتقنيات هندسة الواجهات الأمامية الحديثة، بدءاً من البنية التحتية لهندسة المكونات المعيارية وحتى إدارة الحالة المعقدة وتحسين سرعة الأداء وتجربة المستخدم، مع بناء 6 مشاريع عملية حقيقية قابلة للإضافة لمعرض أعمالك.',
    badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    icon: 'Layout',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    skills: [
      'TypeScript 5.x',
      'React 19 & Next.js',
      'Tailwind CSS Architecture',
      'Zustand & Cache Management',
      'Clean Code & Design Patterns',
      'REST & GraphQL Client Integration',
      'Web Performance & Core Web Vitals'
    ],
    prerequisites: [
      'أساسيات HTML5 و CSS3 المعيارية',
      'مبادئ البرمجة بـ JavaScript الحديثة ES6+'
    ],
    durationWeeks: 12,
    totalHours: 72,
    projectsCount: 6,
    totalModules: 4,
    rating: 4.95,
    reviewsCount: 320,
    enrolledStudentsCount: 1840,
    price: 1200,
    discountPrice: 850,
    certificateProvided: true,
    featured: true,
    learningOutcomes: [
      'بناء واجهات مستخدم معقدة وسريعة الاستجابة بأعلى معايير جودة الكود المعياري.',
      'تطبيق نمط هندسة المكونات المعيارية والـ Atomic Design System.',
      'دمج واستدعاء واجهات البرمجة الخلفية ومعالجة الأخطاء وحالات التحميل بمرونة وكفاءة.',
      'تحسين مؤشرات أداء الويب الأساسية Core Web Vitals وتقديم أفضل تجربة للمستخدم.'
    ],
    curriculum: [
      {
        id: 'fe-mod-1',
        title: 'الأسس البرمجية المتقدمة لـ TypeScript و Modern JavaScript',
        description: 'التعامل مع الأنواع المتقدمة، الـ Generics، والبرمجة الوظيفية وهندسة الأنواع الصارمة.',
        estimatedHours: 16,
        topics: ['Advanced Types & Generics', 'Async/Await & Event Loop', 'Clean Code Principles'],
        lessons: [
          { id: 'fe-l1', title: 'مقدمة في نمط البيانات الصارم ونظام TypeScript', duration: '25 دقيقة', type: 'video', isFreePreview: true },
          { id: 'fe-l2', title: 'الـ Generics والـ Utility Types في كتابة واجهات مرنة', duration: '40 دقيقة', type: 'video' },
          { id: 'fe-l3', title: 'مختبر تفاعلي: إعادة بناء مكتبة دوال بأنواع TypeScript محكمة', duration: '60 دقيقة', type: 'interactive_lab' }
        ]
      },
      {
        id: 'fe-mod-2',
        title: 'بناء تطبيقات React الحديثة وهندسة المكونات',
        description: 'إتقان الـ Hooks المخصصة، الـ Render Lifecycle، والـ Memoization والتحولات التفاعلية.',
        estimatedHours: 20,
        topics: ['Custom Hooks Design', 'Context & State Composition', 'React 19 Actions & Transitions'],
        lessons: [
          { id: 'fe-l4', title: 'بنية دورة حياة المكون والـ Render Optimization', duration: '35 دقيقة', type: 'video', isFreePreview: true },
          { id: 'fe-l5', title: 'بناء Design System متكامل ومخصص بواسطة Tailwind CSS', duration: '50 دقيقة', type: 'video' },
          { id: 'fe-l6', title: 'مشروع تطبيقي: بناء لوحة تحكم تفاعلية مع أنظمة الثيمات المتعددة', duration: '90 دقيقة', type: 'project' }
        ]
      },
      {
        id: 'fe-mod-3',
        title: 'إدارة الحالة والمزامنة اللحظية (State Management & Caching)',
        description: 'إدارة الحالة العامة والتخزين المؤقت للبيانات السحابية عبر Zustand و TanStack Query.',
        estimatedHours: 18,
        topics: ['Zustand Store Architecture', 'TanStack Query Data Caching', 'Real-time WebSocket Listeners'],
        lessons: [
          { id: 'fe-l7', title: 'هندسة مخزن البيانات المركزي بحجم كود خفيف مع Zustand', duration: '30 دقيقة', type: 'video' },
          { id: 'fe-l8', title: 'التعامل مع الـ Cache والـ Optimistic Updates', duration: '45 دقيقة', type: 'video' },
          { id: 'fe-l9', title: 'اختبار تقييم استيعاب إدارة الحالة', duration: '30 دقيقة', type: 'quiz' }
        ]
      },
      {
        id: 'fe-mod-4',
        title: 'الأداء والتجهيز للإنتاج واختبارات الجودة',
        description: 'تحسين سرعة التحميل، حزم الـ Bundle، واختبار الواجهات الأمامية.',
        estimatedHours: 18,
        topics: ['Bundle Splitting', 'Lighthouse & Core Web Vitals', 'Unit & Integration Testing'],
        lessons: [
          { id: 'fe-l10', title: 'تحليل حجم الحزم وأفضل ممارسات Code Splitting', duration: '35 دقيقة', type: 'video' },
          { id: 'fe-l11', title: 'مشروع التخرج النهائي لمسار الواجهات الأمامية', duration: '120 دقيقة', type: 'project' }
        ]
      }
    ]
  },
  {
    id: 'backend-track-pro',
    slug: 'backend-architecture',
    title: 'مسار هندسة النظم الخلفية والسحابية (Backend & Cloud Architecture)',
    category: 'هندسة الخوادم وقواعد البيانات',
    level: 'شامل الاحتراف',
    instructor: INSTRUCTORS.backendLead,
    summary: 'تصميم وبناء خوادم API عالية الكفاءة وقابلة للتوسع باستخدام Node.js، Express، قواعد بيانات SQL/NoSQL والبنى التحتية السحابية.',
    description: 'يركز هذا المسار على هندسة النظم الخلفية القوية، وتصميم قواعد البيانات العلائقية وغير العلائقية، وحماية أمن المعلومات، وإدارة التوثيق وصلاحيات المستخدمين RBAC، مع مشاريع إنتاجية فعلية.',
    badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    icon: 'Server',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    skills: [
      'Node.js & Express.js',
      'PostgreSQL / Drizzle ORM',
      'Firestore & NoSQL Architecture',
      'JWT, OAuth2 & RBAC Security',
      'RESTful API Best Practices',
      'Microservices Principles',
      'Docker & Cloud Deployment'
    ],
    prerequisites: [
      'معرفة جيدة بلغة JavaScript أو TypeScript',
      'فهم مبادئ بروتوكول HTTP والشبكات'
    ],
    durationWeeks: 10,
    totalHours: 65,
    projectsCount: 5,
    totalModules: 3,
    rating: 4.92,
    reviewsCount: 260,
    enrolledStudentsCount: 1420,
    price: 1300,
    discountPrice: 900,
    certificateProvided: true,
    featured: true,
    learningOutcomes: [
      'هندسة وبناء RESTful APIs آمنة وذات اعتمادية عالية وقابلة للتوسع.',
      'تصميم مخططات قواعد البيانات Schema Design وإجراء الاستعلامات المحسنة.',
      'تطبيق بروتوكولات الأمان والتوثيق وحماية البيانات الحساسة من الاختراق.',
      'نشر التطبيقات على البيئات السحابية ومراقبة وتتبع الأداء.'
    ],
    curriculum: [
      {
        id: 'be-mod-1',
        title: 'هندسة خوادم الويب وتصميم الـ REST APIs',
        description: 'بناء خوادم متينة باستخدام Node.js و TypeScript وتوزيع الطبقات Controller-Service-Repository.',
        estimatedHours: 20,
        topics: ['Express.js Architecture', 'Input Validation & Error Handling', 'Middleware Pipeline'],
        lessons: [
          { id: 'be-l1', title: 'مبادئ تصميم الخوادم النظيفة وتوزيع الطبقات البرمجية', duration: '30 دقيقة', type: 'video', isFreePreview: true },
          { id: 'be-l2', title: 'بناء منظومة متقدمة للتحقق من المدخلات عبر Zod ومعالجة الاستثناءات', duration: '45 دقيقة', type: 'video' },
          { id: 'be-l3', title: 'مختبر عملي: بناء خادم API متكامل مع وثائق Swagger التلقائية', duration: '75 دقيقة', type: 'interactive_lab' }
        ]
      },
      {
        id: 'be-mod-2',
        title: 'قواعد البيانات العلائقية وغير العلائقية (Relational & NoSQL)',
        description: 'تصميم الجداول، العلاقات، الفهارس، والتفاعل عبر الـ ORM الحديث وقواعد Firestore السحابية.',
        estimatedHours: 25,
        topics: ['PostgreSQL Schema Design', 'Firestore NoSQL Best Practices', 'Database Migrations & Indexing'],
        lessons: [
          { id: 'be-l4', title: 'تصميم الـ Schemas والعلاقات في PostgreSQL مع Drizzle ORM', duration: '50 دقيقة', type: 'video' },
          { id: 'be-l5', title: 'قواعد بيانات NoSQL: متى وكيف تصمم المستندات في Firestore', duration: '40 دقيقة', type: 'video' },
          { id: 'be-l6', title: 'مشروع تطبيقي: بناء محرك فواتير واشتراكات متقدم مع معاملات ذرية Transactions', duration: '90 دقيقة', type: 'project' }
        ]
      },
      {
        id: 'be-mod-3',
        title: 'الأمان والتحقق والتفويض والنشر السحابي (Security & Deployments)',
        description: 'حماية التطبيقات بأنظمة الأدوار المتعددة ومفاتيح التشفير، والنشر على بيئات الإنتاج السحابية.',
        estimatedHours: 20,
        topics: ['JWT & Refresh Tokens', 'Role-Based Access Control (RBAC)', 'Dockerization & Cloud Run Deploy'],
        lessons: [
          { id: 'be-l7', title: 'تأمين الـ APIs وتطبيق الـ Rate Limiting والحماية من هجمات الحقن', duration: '40 دقيقة', type: 'video' },
          { id: 'be-l8', title: 'حزم التطبيق داخل Docker Container والنشر السحابي التلقائي', duration: '55 دقيقة', type: 'video' },
          { id: 'be-l9', title: 'مشروع التخرج النهائي لمسار النظم الخلفية', duration: '120 دقيقة', type: 'project' }
        ]
      }
    ]
  },
  {
    id: 'ai-gemini-track',
    slug: 'ai-engineering',
    title: 'مسار هندسة الذكاء الاصطناعي والتطبيقات الذكية (GenAI & Gemini Integration)',
    category: 'الذكاء الاصطناعي وتحليل البيانات',
    level: 'متقدم',
    instructor: INSTRUCTORS.aiLead,
    summary: 'دمج نماذج الذكاء الاصطناعي المتطورة Gemini 2.5/3.0 لبناء وكلاء أذكياء وتطبيقات تحليل النصوص والصور المتزامنة.',
    description: 'مسار تقني متقدم لمهندسي البرمجيات يركز على هندسة الأوامر المتقدمة (Prompt Engineering)، ونظم الاسترجاع المعزز بالمعرفة (RAG)، واستدعاء الدوال المدمجة (Function Calling/Tools) ومعالجة الوسائط المتعددة.',
    badgeColor: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
    icon: 'Sparkles',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    skills: [
      '@google/genai SDK',
      'Advanced Prompt Engineering',
      'Structured JSON Outputs',
      'Function Calling & Tools',
      'Multimodal Processing (Audio/Vision/PDF)',
      'Embeddings & Semantic Search'
    ],
    prerequisites: [
      'إتقان JavaScript / TypeScript أو Python',
      'التعامل مع الـ REST APIs وتدفق البيانات Streaming'
    ],
    durationWeeks: 8,
    totalHours: 48,
    projectsCount: 4,
    totalModules: 3,
    rating: 4.98,
    reviewsCount: 195,
    enrolledStudentsCount: 980,
    price: 1400,
    discountPrice: 950,
    certificateProvided: true,
    featured: true,
    learningOutcomes: [
      'دمج وكلاء الذكاء الاصطناعي داخل التطبيقات لتقديم حلول مؤتمتة ذكية.',
      'بناء أنظمة الدردشة التوليدية التفاعلية ومعالجة الوسائط المتعددة (صوت، صور، مستندات).',
      'تطبيق مبادئ هندسة التوجيه وتوليد المخرجات الهيكلية الدقيقة Schema-conforming Outputs.',
      'بناء أنظمة استدعاء الأدوات والربط التلقائي بقواعد البيانات والخدمات الخارجية.'
    ],
    curriculum: [
      {
        id: 'ai-mod-1',
        title: 'الأسس والتكامل مع Google GenAI SDK',
        description: 'إعداد البيئة، استدعاء النماذج، وضبط معايير التوليد Temperature & Safety Settings.',
        estimatedHours: 15,
        topics: ['Gemini 2.5 Flash & Pro Models', 'Streaming Responses', 'Multimodal Input Handling'],
        lessons: [
          { id: 'ai-l1', title: 'مقدمة في بنية نماذج Gemini والـ SDK الرسمي الجديد', duration: '30 دقيقة', type: 'video', isFreePreview: true },
          { id: 'ai-l2', title: 'الاستجابة الحية المتدفقة Streaming في تطبيقات React', duration: '40 دقيقة', type: 'video' },
          { id: 'ai-l3', title: 'مختبر عملي: تحليل المستندات والصور المتعددة واستخراج البيانات بدقة', duration: '60 دقيقة', type: 'interactive_lab' }
        ]
      },
      {
        id: 'ai-mod-2',
        title: 'هندسة التوجيه وتوليد البيانات المنظمة (Structured Outputs)',
        description: 'إجبار النموذج على مخرجات JSON دقيقة مطابقة لمخططات TypeScript المعرفة.',
        estimatedHours: 16,
        topics: ['System Instructions Engineering', 'Response Schemas', 'Few-Shot Grounding'],
        lessons: [
          { id: 'ai-l4', title: 'تقنيات الـ Structured Outputs وإلزام النموذج بـ Type Schemas', duration: '45 دقيقة', type: 'video' },
          { id: 'ai-l5', title: 'مشروع تطبيقي: بناء مساعد تدقيق برمجي وتوليد اختبارات آلية ذكية', duration: '80 دقيقة', type: 'project' }
        ]
      },
      {
        id: 'ai-mod-3',
        title: 'استدعاء الأدوات والوكلاء المستقلين (Function Calling & Agents)',
        description: 'تمكين النماذج من تنفيذ الأوامر، والاستعلام من قواعد البيانات واستدعاء الـ APIs.',
        estimatedHours: 17,
        topics: ['Declarations & Tool Calling', 'Agentic Loop Control', 'Multimodal Live Interactions'],
        lessons: [
          { id: 'ai-l6', title: 'تصميم الأدوات Tool Declarations ومعالجة ردود الوكيل التلقائية', duration: '50 دقيقة', type: 'video' },
          { id: 'ai-l7', title: 'مشروع التخرج النهائي: وكيل دعم ذكي متكامل مع قاعدة بيانات المنصة', duration: '110 دقيقة', type: 'project' }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity-devops-track',
    slug: 'devops-security',
    title: 'مسار الأمان السيبراني وهندسة الاعتمادية والـ DevOps (SecOps)',
    category: 'البنية التحتية والأمان',
    level: 'متقدم',
    instructor: INSTRUCTORS.devOpsLead,
    summary: 'تأمين التطبيقات والبيئات السحابية، أتمتة خطوط النشر CI/CD، ومراقبة استقرار النظم والبنى التحتية البرمجية.',
    description: 'مسار احترافي لحماية البنى التحتية والتطبيقات من الثغرات الأمنية، وتنظيم عمليات الدمج والنشر المستمر والتشغيل السحابي الموثوق.',
    badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    icon: 'Shield',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    skills: [
      'CI/CD Pipelines (GitHub Actions)',
      'Docker & Container Security',
      'OWASP Top 10 Mitigation',
      'Nginx & SSL/TLS Configuration',
      'Secrets & Environment Management',
      'Cloud Monitoring & Reliability'
    ],
    prerequisites: [
      'أساسيات أنظمة تشغيل Linux وخوادم الويب',
      'فهم دورة حياة تطوير البرمجيات SDLC'
    ],
    durationWeeks: 8,
    totalHours: 45,
    projectsCount: 4,
    totalModules: 2,
    rating: 4.88,
    reviewsCount: 140,
    enrolledStudentsCount: 720,
    price: 1250,
    discountPrice: 800,
    certificateProvided: true,
    featured: false,
    learningOutcomes: [
      'تطبيق أفضل ممارسات أمان التطبيقات وحمايتها من هجمات OWASP الشهيرة.',
      'أتمتة بناء واختبار ونشر التطبيقات السحابية بدون انقطاع في الخدمة Zero-Downtime.',
      'إدارة أسرار التطبيقات والمفاتيح المشفرة في بيئات الإنتاج بأعلى معايير الحماية.',
      'مراقبة استقرار الخدمات واكتشاف الأعطال وحلها استباقياً.'
    ],
    curriculum: [
      {
        id: 'sec-mod-1',
        title: 'أمن تطبيقات الويب وفحص الثغرات (Web Security & OWASP)',
        description: 'حماية التطبيقات من الـ XSS, CSRF, Injection, وتأمين الرؤوس الأمنية والـ Cookies.',
        estimatedHours: 22,
        topics: ['OWASP Top 10 Mitigation', 'CORS & CSP Configuration', 'Secure Cookie Handling'],
        lessons: [
          { id: 'sec-l1', title: 'فحص ثغرات الـ Web Security ومعالجة أشهر 10 ثغرات برمجية', duration: '40 دقيقة', type: 'video', isFreePreview: true },
          { id: 'sec-l2', title: 'مختبر عملي: تأمين تطبيق ويب مفتوح الثغرات وإغلاق منافذ الاختراق', duration: '75 دقيقة', type: 'interactive_lab' }
        ]
      },
      {
        id: 'sec-mod-2',
        title: 'الحاويات وأتمتة النشر (Docker & CI/CD Pipelines)',
        description: 'بناء صور Docker خفيفة الوزن وأتمتة خطوط الاختبار والنشر السحابي المستمر.',
        estimatedHours: 23,
        topics: ['Container Best Practices', 'Cloud Auto-scaling', 'Continuous Integration Pipelines'],
        lessons: [
          { id: 'sec-l3', title: 'بناء خطوط النشر الآلي CI/CD مع فحص الأمان التلقائي', duration: '50 دقيقة', type: 'video' },
          { id: 'sec-l4', title: 'مشروع التخرج: نشر بيئة إنتاجية متكاملة مؤمنة بالكامل', duration: '100 دقيقة', type: 'project' }
        ]
      }
    ]
  }
];

export const TRAINING_CATEGORIES = [
  'الكل',
  'هندسة البرمجيات والويب',
  'هندسة الخوادم وقواعد البيانات',
  'الذكاء الاصطناعي وتحليل البيانات',
  'البنية التحتية والأمان'
];

export const getTrackById = (id: string): TrainingTrack | undefined => {
  return TRAINING_TRACKS.find(track => track.id === id || track.slug === id);
};

export const getTracksByCategory = (category: string): TrainingTrack[] => {
  if (!category || category === 'الكل') return TRAINING_TRACKS;
  return TRAINING_TRACKS.filter(track => track.category === category);
};

export const getFeaturedTracks = (): TrainingTrack[] => {
  return TRAINING_TRACKS.filter(track => track.featured);
};
