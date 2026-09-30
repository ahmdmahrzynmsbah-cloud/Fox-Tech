export interface CodeSnippet {
  title: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'tsx' | 'bash';
  code: string;
  explanation: string;
}

export interface StepGuide {
  stepNumber: number;
  title: string;
  action: string;
  explanation: string;
  codeSnippet?: string;
  expectedResult: string;
}

export interface InterviewQA {
  question: string;
  answer: string;
}

export interface HandsOnChallenge {
  title: string;
  goal: string;
  starterCode?: string;
  solutionCode: string;
  explanation: string;
}

export interface DownloadResource {
  title: string;
  category: 'editor' | 'runtime' | 'browser' | 'tools' | 'extension';
  directUrl: string;
  officialSite: string;
  platform: string;
  version: string;
  size: string;
  installCommand?: string;
  guideSteps: string[];
}

export interface VideoChapter {
  time: string;
  title: string;
  desc: string;
}

export interface AiVideoWalkthrough {
  title: string;
  duration: string;
  badge: string;
  captionAr: string;
  embedUrl?: string;
  chapters: VideoChapter[];
  visualNotes: string[];
}

export interface LivePlayground {
  initialHtml: string;
  initialCss: string;
  initialJs: string;
  previewNote: string;
}

export interface DetailedLesson {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  type: 'theory_practice' | 'code_lab' | 'project' | 'quiz';
  isLocked?: boolean;
  realWorldAnalogy: string;
  explanationAr: string;
  downloads?: DownloadResource[];
  aiVideo?: AiVideoWalkthrough;
  playground?: LivePlayground;
  steps: StepGuide[];
  keyPoints: string[];
  codeSnippets: CodeSnippet[];
  challenge?: HandsOnChallenge;
  interviewQA: InterviewQA[];
  proTip: string;
  commonMistake: string;
}

export interface DetailedModule {
  id: string;
  order: number;
  title: string;
  titleEn: string;
  durationHours: number;
  description: string;
  iconName: string;
  badge: string;
  isLocked?: boolean;
  lessons: DetailedLesson[];
}

export const FRONTEND_CURRICULUM: DetailedModule[] = [
  {
    id: 'mod-1-web-basics',
    order: 1,
    title: 'الموديول الأول: كيف يعمل الويب، بروتوكولات الإنترنت وبيئة التطوير الاحترافية',
    titleEn: 'Web Architecture, Networking & Pro Setup',
    durationHours: 6,
    description: 'فهم علمي وعملي لكيفية سريان البيانات عبر الإنترنت، رحلة الـ Request من المتصفح للسيرفر، وإعداد VS Code وأدوات التطوير.',
    iconName: 'Laptop',
    badge: 'الأساس المتين',
    isLocked: false,
    lessons: [
      {
        id: 'lesson-1-1',
        moduleId: 'mod-1-web-basics',
        title: 'الدرس 1: تشريح الإنترنت - ماذا يحدث من لحظة كتابة الرابط حتى ظهور الصفحة؟',
        duration: '30 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'تخيل أنك تطلب وجبة عبر الهاتف: أنت (العميل/Client) تبحث عن رقم المطعم في الدليل (DNS)، تطلب نوع الوجبة (HTTP Request)، الشيف يجهزها في المطبخ (السيرفر)، ويصلك الطلب جاهزاً على طاولتك (HTTP Response).',
        explanationAr: `تعال نفهم بالتفصيل المعماري الكامل رحلة البيانات خطوة بخطوة لما تكتب رابط الموقع وتضغط Enter:

1. مرحلة تحليل العنوان (URL Parsing):
   المتصفح يقسم الرابط لثلاث أجزاء: البروتوكول (HTTPS)، النطاق (Domain)، والمسار (Path).

2. مرحلة دليل الهاتف للإنترنت (DNS Resolution):
   الكمبيوتر يتعامل بأرقام الـ IP فقط (مثل 142.250.190.46). المتصفح يسأل خادم الـ DNS لتحويل اسم الموقع لرقم الـ IP المعتمد.

3. مرحلة المصافحة وتأمين الاتصال (TCP 3-Way Handshake & TLS/SSL):
   العميل يرسل إشارة SYN، السيرفر يرد بـ SYN-ACK، والعميل يؤكد بـ ACK. وفي HTTPS يتم تبادل شهادات التشفير لتأمين الاتصال بالكامل.

4. مرحلة طلب الملفات واستقبالها (HTTP Request & Response):
   المتصفح يطلب الملف الأساسي عبر طلب GET، والسيرفر يرد برمز الحالة 200 OK ومعه ملف الـ HTML.

5. مرحلة بناء الصفحة داخل المتصفح (Browser Critical Rendering Path):
   - بناء شجرة العناصر DOM من كود الـ HTML.
   - بناء شجرة التنسيقات CSSOM من كود الـ CSS.
   - دمج الشجرتين في Render Tree.
   - حساب الأبعاد والمواقع بالبكسل (Layout / Reflow).
   - رسم وتلوين البكسلات على الشاشة (Paint & Composite).`,
        aiVideo: {
          title: 'محاكاة بصرية: رحلة حزمة البيانات من المتصفح إلى السيرفر وعودتها',
          duration: '4:15 دقيقة',
          badge: 'فيديو توضيحي مونتاج ذكي بدون كلام',
          captionAr: 'عرض بصري ثلاثي الأبعاد يوضح مسار سريان حزم البيانات عبر كابلات الألياف الضوئية، خوادم الـ DNS، ومراحل بناء الـ DOM شجرة العناصر داخل محرك المتصفح.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/7_LPdPoC65s',
          chapters: [
            { time: '0:00', title: 'مقدمة وكتابة الـ URL', desc: 'تحليل أجزاء الرابط والبروتوكول' },
            { time: '1:10', title: 'البحث في خوادم DNS', desc: 'تحويل النطاق النصي إلى عنوان IP رقمي' },
            { time: '2:25', title: 'مصافحة TCP وتبادل شهادات التشفير SSL', desc: 'تأمين قناة الاتصال بين العميل والخادم' },
            { time: '3:20', title: 'تحميل الـ HTML وبناء شجرة الـ DOM', desc: 'رسم البكسلات وعرض الموقع للمستخدم' }
          ],
          visualNotes: [
            'الرسم البياني يوضح كيف يتم حفظ الـ IP في كاش المتصفح لتقليل وقت الطلبات اللاحقة إلى 0 مللي ثانية.',
            'تظهر الشاشة شجرة الـ DOM باللون الأخضر وشجرة الـ CSSOM باللون الأزرق ودمجهما في شجرة العرض Render Tree.'
          ]
        },
        downloads: [
          {
            title: 'متصفح Google Chrome للمطورين',
            category: 'browser',
            directUrl: 'https://www.google.com/chrome/',
            officialSite: 'https://www.google.com/chrome/',
            platform: 'Windows / macOS / Linux',
            version: 'Latest Stable 120+',
            size: '95 MB',
            guideSteps: [
              '1. اضغط على زر التحميل المباشر وحمل ملف التثبيت ChromeSetup.exe.',
              '2. افتح الملف واتركه يكتمل تلقائياً خلال 30 ثانية.',
              '3. افتح المتصفح واضغط F12 للتأكد من عمل لوحة أدوات المطورين DevTools بنجاح.'
            ]
          }
        ],
        playground: {
          initialHtml: `<div class="box">
  <h2>مرحباً بك في عالم الويب </h2>
  <p>اضغط على الزر لتشغيل أول تفاعل برمجي:</p>
  <button id="alertBtn">اضغط للتجربة</button>
  <div id="output"></div>
</div>`,
          initialCss: `body {
  font-family: sans-serif;
  text-align: center;
  padding: 20px;
  background: #0f172a;
  color: white;
}
.box {
  background: #1e293b;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #334155;
  max-width: 320px;
  margin: 0 auto;
}
button {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
button:hover { background: #0284c7; }
#output { margin-top: 15px; color: #38bdf8; font-weight: bold; }`,
          initialJs: `document.getElementById('alertBtn').addEventListener('click', () => {
  document.getElementById('output').textContent = ' مبروك! الكود يعمل بنجاح وبأعلى سرعة!';
});`,
          previewNote: 'محرر ومحاكي حي: يمكنك تعديل كود HTML, CSS, أو JavaScript في المربعات أدناه وستشاهد النتيجة تتغير فورياً!'
        },
        steps: [
          {
            stepNumber: 1,
            title: 'فحص عنوان الـ IP الحقيقي لأي موقع بنفسك',
            action: 'افتح الطرفية (Terminal) في جهازك واكتب الأمر ping google.com.',
            explanation: 'ستشاهد تحويل اسم النطاق لرقم IP رقمي وسرعة الاستجابة بالمللي ثانية.',
            codeSnippet: 'ping google.com',
            expectedResult: 'ظهور رد برقم IP وسرعة الاتصال في السيرفر.'
          },
          {
            stepNumber: 2,
            title: 'معاينة كود الـ HTML الخام في المتصفح',
            action: 'اضغط كليك يمين في أي صفحة ويب واختر View Page Source (Ctrl + U).',
            explanation: 'ستشاهد ملف الـ HTML كما وصل من السيرفر قبل معالجته بواسطة المتصفح.',
            expectedResult: 'عرض شفرة الـ HTML الأصلية للصفحة.'
          },
          {
            stepNumber: 3,
            title: 'بناء أول تطبيق ويب تفاعلي متكامل',
            action: 'أنشئ ملف index.html وضع فيه الهيكل والتنسيق وسكربت التفاعل البسيط.',
            explanation: 'تطبيق عملي لمثلث الويب: HTML للبناء، CSS للمظهر، و JS للتفاعل.',
            expectedResult: 'صفحة تفاعلية بزرار يسجل الضغطات فورياً بدون إعادة تحميل.'
          }
        ],
        keyPoints: [
          'الـ Client هو المتصفح الذي يطلب البيانات، والـ Server هو الخادم الذي يعالج الطلب ويرد بالملفات.',
          'الـ DNS هو مترجم أسماء النطاقات (Domains) إلى عناوين IP رقمية تفهمها الشبكة.',
          'مثلث الفرونت إند الذهبي: HTML للعظام والهيكل، CSS للمظهر والأناقة، و JavaScript للعقل والتفاعل.',
          'مرحلة الـ Critical Rendering Path هي المقياس الحقيقي لسرعة وأداء أي موقع في العالم.'
        ],
        codeSnippets: [
          {
            title: 'تطبيق عداد تفاعلي متكامل (HTML + CSS + JS)',
            language: 'html',
            code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تطبيق العداد التفاعلي</title>
  <style>
    body {
      font-family: sans-serif;
      background: #0f172a;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: #1e293b;
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      border: 1px solid #334155;
    }
    .btn {
      background: #0ea5e9;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }
    .count { font-size: 32px; color: #38bdf8; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="card">
    <h2> أول تطبيق تفاعلي</h2>
    <div class="count" id="count">0</div>
    <button class="btn" id="btn">اضغط هنا (+1)</button>
  </div>
  <script>
    let n = 0;
    const countEl = document.getElementById('count');
    document.getElementById('btn').addEventListener('click', () => {
      n++;
      countEl.textContent = n;
    });
  </script>
</body>
</html>`,
            explanation: 'الكود يوضح تكامل ملف HTML واحد ليضم الهيكل والتنسيق والسكربت التفاعلي بدون أي مكاتب خارجية.'
          }
        ],
        challenge: {
          title: 'تحدي الدرس الأول: زر تصفير العداد وتغيير اللون',
          goal: 'أضف زراً جديداً باسم (تصفير)، وعند الضغط عليه يعود العداد للصفر ويتغير لونه للأخضر.',
          solutionCode: `<button id="resetBtn" style="background:#ef4444; margin-top:8px; color:white; padding:8px 16px; border:none; border-radius:6px; cursor:pointer;">تصفير ↺</button>
<script>
  document.getElementById('resetBtn').addEventListener('click', () => {
    n = 0;
    countEl.textContent = 0;
    countEl.style.color = '#4ade80';
  });
</script>`,
          explanation: 'تم تحديد العنصر عبر معرّفه وإضافة حدث النقر لإعادة ضبط المتغير وتحديث الشاشة فوراً.'
        },
        interviewQA: [
          {
            question: 'ما هو الفرق بين HTTP و HTTPS ولماذا HTTPS إلزامي؟',
            answer: 'الـ HTTP ينقل البيانات كنصوص غير مشفرة، بينما HTTPS يضيف طبقة تشفير SSL/TLS تحمي كلمات المرور والبيانات، وهو شرط أساسي للترتيب المتقدم في محركات البحث.'
          },
          {
            question: 'ماذا يعني مفهوم الـ DOM؟',
            answer: 'الـ DOM هو تمثيل شجري برمجي لعناصر الـ HTML يتيح للـ JavaScript الوصول إليها وتعديلها ديناميكياً.'
          }
        ],
        proTip: 'في المقابلات الوظيفية رتب إجابتك برمجياً: DNS -> TCP/TLS -> HTTP Request -> Render Pipeline.',
        commonMistake: 'الاعتقاد بأن الفرونت إند مجرد تصميم ألوان؛ في الحقيقة هو هندسة برمجية متكاملة مسؤولة عن تدفق البيانات وسرعة الأداء.'
      },
      {
        id: 'lesson-1-2',
        moduleId: 'mod-1-web-basics',
        title: 'الدرس 2: بيئة العمل الاحترافية - تنزيل وتثبيت VS Code، Node.js والإضافات السرية',
        duration: '45 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'النجار الماهر يمتلك ورشة منظمة بأدوات كهربائية تقطع الخشب في ثوانٍ بدلاً من ساعات؛ VS Code هو ورشتك الرقمية المتطورة.',
        explanationAr: `لتصبح مهندس فرونت إند فائق السرعة، يجب أن تتقن تحميل وتثبيت وإعداد بيئة التطوير من الصفر:

**1. تنزيل وتثبيت محرر الأكواد العالمي Visual Studio Code:**
- هو البرنامج الأساسي الذي ستكتب فيه كل أسطر الـ HTML, CSS, JavaScript, React, و TypeScript.
- خفيف جداً، مجاني 100% من Microsoft، ويدعم آلاف الإضافات.

**2. خطوات التثبيت الصحيحة على Windows و Mac:**
- أثناء التثبيت على Windows، تأكد من تفعيل علامتي الصح:
  * "Add 'Open with Code' action to Windows Explorer context menu"
  * "Add to PATH (requires shell restart)"
  هذا يتيح لك فتح أي مجلد في المحرر بكليك يمين مباشر.

**3. إنشاء مجلد المشروع وفتح أول ملف:**
- أنشئ مجلداً على جهازك باسم \`my-web-project\`.
- افتح VS Code واسحب المجلد داخله، أو اضغط File -> Open Folder.
- أنشئ ملفاً جديداً باسم \`index.html\`.
- اكتب علامة التعجب \`!\` ثم اضغط Tab أو Enter، وسيقوم المحرر بتوليد هيكل الـ HTML5 القياسي فوراً (Emmet Abbreviation)!

**4. تثبيت الإضافات الخمسة الإلزامية:**
1. **Live Server:** لتشغيل الموقع في المتصفح مع التحديث التلقائي الفوري.
2. **Prettier - Code Formatter:** لترتيب وتنسيق الكود تلقائياً عند الضغط على Ctrl + S.
3. **Auto Rename Tag:** لتعديل تاجات البداية والنهاية معاً.
4. **Tailwind CSS IntelliSense:** لاقتراح كلاسات التصميم ومعاينة الألوان.
5. **ES7+ React Snippets:** لتوليد مكونات ريآكت بكتابة \`rafce\`.`,
        downloads: [
          {
            title: 'محرر Visual Studio Code الرسمي (Microsoft)',
            category: 'editor',
            directUrl: 'https://code.visualstudio.com/Download',
            officialSite: 'https://code.visualstudio.com/',
            platform: 'Windows 10/11 (x64) / macOS (Apple Silicon & Intel) / Linux (.deb/.rpm)',
            version: 'Latest Stable v1.85+',
            size: '88 MB',
            guideSteps: [
              '1. اضغط على زر التحميل المباشر أعلاه واختر نسختك المناسبة (User Installer للويندوز أو Universal للماك).',
              '2. افتح ملف VSCodeUserSetup.exe واقبل اتفاقية الترخيص (I accept the agreement).',
              '3. في صفحة "Select Additional Tasks"، ضع علامة صح على جميع الخيارات (Create desktop icon, Add Open with Code, Add to PATH).',
              '4. اضغط Install ثم Finish لتشغيل المحرر فوراً.'
            ]
          },
          {
            title: 'بيئة تشغيل Node.js & npm (LTS Version)',
            category: 'runtime',
            directUrl: 'https://nodejs.org/en/download',
            officialSite: 'https://nodejs.org/',
            platform: 'Windows / macOS / Linux',
            version: 'v20.x LTS (Long Term Support)',
            size: '32 MB',
            installCommand: 'node -v && npm -v',
            guideSteps: [
              '1. حمل النسخة الموصى بها (LTS) من الرابط المباشر.',
              '2. ثبت البرنامج بالضغط على Next في جميع النوافذ.',
              '3. للتأكد من نجاح التثبيت: افتح Terminal في VS Code بالضغط على Ctrl + ` واكتب: node -v و npm -v.'
            ]
          },
          {
            title: 'نظام إدارة الإصدارات Git الرسمي',
            category: 'tools',
            directUrl: 'https://git-scm.com/downloads',
            officialSite: 'https://git-scm.com/',
            platform: 'Windows / macOS / Linux',
            version: 'v2.43+',
            size: '50 MB',
            installCommand: 'git --version',
            guideSteps: [
              '1. حمل نسخة Git 64-bit واضغط Next مع ترك الإعدادات الافتراضية.',
              '2. يساعدك على رفع مشاريعك إلى GitHub وحفظ سجل التعديلات البرمجية.'
            ]
          }
        ],
        aiVideo: {
          title: 'دليل عملي مصور: تحميل وتثبيت VS Code وضبط الإضافات وأول كود',
          duration: '5:30 دقيقة',
          badge: 'مونتاج عالي الدقة شاشات محاكاة تفاعلية',
          captionAr: 'فيديو تفصيلي بدون كلام يوضح بالتسجيل البطيء والمؤثرات البصرية خطوات تحميل VS Code، فتح المجلد، كتابة أول صفحة HTML وتشغيل Live Server وتنسيق الكود تلقائياً.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/WPqXP_PZO4M',
          chapters: [
            { time: '0:00', title: 'تحميل ملف التثبيت من الموقع الرسمي', desc: 'تنزيل نسخة Windows 64-bit' },
            { time: '1:15', title: 'خطوات التثبيت وتفعيل خيارات Open with Code', desc: 'ضبط خيارات الـ Context Menu' },
            { time: '2:30', title: 'تثبيت إضافات Live Server و Prettier', desc: 'تفعيل Format on Save في الإعدادات' },
            { time: '3:45', title: 'إنشاء ملف index.html واختصار Emmet (!)', desc: 'توليد الهيكل القياسي في ثانية واحدة' },
            { time: '4:50', title: 'الضغط على Go Live ومعاينة الموقع في المتصفح', desc: 'تجربة التحديث الحي الفوري' }
          ],
          visualNotes: [
            'المؤشر يركز على شريط الحالة السفلي الأزرق في VS Code حيث يظهر زر Go Live.',
            'تظهر نافذة الإعدادات Settings وتفعيل خيار editor.formatOnSave.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'تحميل وتثبيت VS Code عبر الروابط الرسمية المباشرة',
            action: 'اضغط على زر التحميل في الأعلى لـ Visual Studio Code وثبته مع تفعيل Add to PATH.',
            explanation: 'المحرر سيعمل في بيئة نظامك بالكامل وستتمكن من فتحه من أي مجلد.',
            expectedResult: 'فتح محرر VS Code بنجاح وظهور شاشة Welcome.'
          },
          {
            stepNumber: 2,
            title: 'تثبيت إضافات Live Server و Prettier وتفعيل التنسيق التلقائي',
            action: 'اضغط Ctrl + Shift + X وابحث عن Live Server و Prettier وثبتهما، ثم فعل Format on Save من الإعدادات (Ctrl + ,).',
            explanation: 'يضمن تنظيم الكود وتحديث الشاشة ذاتياً عند الحفظ.',
            expectedResult: 'ظهور زر Go Live الأزرق أسفل يمين المحرر.'
          },
          {
            stepNumber: 3,
            title: 'إنشاء أول مجلد وكتابة ملف index.html وتشغيله',
            action: 'أنشئ مجلداً باسم my-site، افتحه في VS Code، أنشئ ملف index.html، اكتب ! واضغط Enter، ثم اضغط Go Live.',
            explanation: 'المتصفح سيفتح الصفحة فوراً على العنوان المحلي http://127.0.0.1:5500.',
            expectedResult: 'عرض أول صفحة ويب محلية جاهزة للتطوير.'
          }
        ],
        keyPoints: [
          'استخدام محرر VS Code مع الإضافات الصحيحة يوفر أكثر من 40% من وقت كتابة الكود.',
          'تفعيل Format on Save يحافظ على نظافة الكود ومسافاته القياسية تلقائياً.',
          'الـ Live Server ضروري لمحاكاة الخوادم الحقيقية وتجنب قيود مسارات file:///.'
        ],
        codeSnippets: [
          {
            title: 'ملف الإعدادات الموصى به (.vscode/settings.json)',
            language: 'bash',
            code: `{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.fontSize": 15,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}`,
            explanation: 'إعدادات قياسية لتوحيد بيئة العمل وتنسيق الكود تلقائياً عند الضغط على حفظ.'
          }
        ],
        interviewQA: [
          {
            question: 'لماذا نستخدم Live Server بدلاً من فتح الملف بالنقر المزدوج (file:///)?',
            answer: 'لأن بروتوكول file يمنع جلب البيانات الخارجية والـ Fetch بسبب قيود الأمان (CORS)، بينما Live Server يشغل خادماً حقيقياً يدعم بروتوكول HTTP.'
          }
        ],
        proTip: 'احفظ اختصار Ctrl + P لفتح أي ملف في المشروع باسمه مباشرة دون البحث في المجلدات.',
        commonMistake: 'تثبيت عشرات الإضافات غير الضرورية التي تبطئ المحرر وتسبب تعارض في الاختصارات.'
      },
      {
        id: 'lesson-1-3',
        moduleId: 'mod-1-web-basics',
        title: 'الدرس 3: أدوات المطورين الاحترافية (Chrome DevTools Mastery)',
        duration: '35 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'الـ DevTools هي جهاز الأشعة السينية لطبيب البرمجيات؛ تمكنك من رؤية كل تفاصيل وأعصاب الموقع واكتشاف الأخطاء في لحظات.',
        explanationAr: `تعتبر Chrome DevTools (بالضغط على F12) السلاح الأقوى لأي مهندس واجهات:

الأقسام الأربعة الأساسية:
1. تاب Elements: رؤية وتعديل الـ HTML والـ CSS الحي في الصفحة وفحص الـ Box Model.
2. تاب Console: عرض رسائل وأخطاء JavaScript وتنفيذ أوامر برمجية سريعة.
3. تاب Network: مراقبة طلبات السيرفر وسرعة تحميل الصور واستجابات الـ APIs.
4. أداة Toggle Device Toolbar: اختبار تجاوب الموقع على مقاسات الهواتف والأجهزة اللوحية المختلفة.`,
        aiVideo: {
          title: 'جولة بصرية في Chrome DevTools واستكشاف الأخطاء',
          duration: '4:45 دقيقة',
          badge: 'مونتاج شاشات فحص تفاعلية',
          captionAr: 'استعراض بصري لطرق فحص العناصر وتعديل ألوان الـ CSS لحظياً ومراقبة رسائل الخطأ في Console وسرعة تحميل الصور في Network.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/kUMe1FH4CHE',
          chapters: [
            { time: '0:00', title: 'فتح DevTools واختصار F12', desc: 'التعرف على الواجهة الرئيسية' },
            { time: '1:10', title: 'تعديل نصوص وألوان الموقع في Elements', desc: 'تطبيق تنسيقات فورية وتجربة الأفكار' },
            { time: '2:30', title: 'فحص مصفوفات الكائنات في Console', desc: 'استخدام أمر console.table' },
            { time: '3:40', title: 'اختبار سرعة الموقع في Network Throttling', desc: 'محاكاة سرعة 3G البطيئة' }
          ],
          visualNotes: [
            'يتم تكبير تاب Elements لتوضيح رسم الـ Box Model وألوان الـ Padding والـ Margin.',
            'تظهر محاكاة هاتف iPhone 15 Pro Max وتغير عرض الموقع بانسيابية.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'تحديد وتعديل العناصر مباشرة في المتصفح',
            action: 'اضغط F12 ثم استخدم أداة السهم (Ctrl + Shift + C) للنقر على أي نص وتعديله.',
            explanation: 'تساعدك على تجربة التغييرات البصرية فورياً دون تعديل الملفات الأصلية.',
            expectedResult: 'تغير النص في الصفحة المعروضة أمامك لحظياً.'
          },
          {
            stepNumber: 2,
            title: 'طباعة الجداول المنظمة في تاب Console',
            action: 'اكتب console.table([{id:1, tech:"HTML5"}, {id:2, tech:"React 19"}]) واضغط Enter.',
            explanation: 'الكونسول يعرض البيانات في جدول أنيق يسهل قراءته وفحصه.',
            expectedResult: 'ظهور جدول منظم بالبيانات في لوحة الكونسول.'
          }
        ],
        keyPoints: [
          'الـ DevTools أداة فحص واختبار حية لا تعدل الملفات المحفوظة على جهازك.',
          'الـ Console هو المكان الأول الذي يجب فحصه عند توقف أي زر عن العمل.',
          'لوحة Network هي المرجع الأساسي لتتبع سرعة الموقع واستجابات الخادم.'
        ],
        codeSnippets: [
          {
            title: 'أوامر كونسول احترافية لفحص الأداء والبيانات',
            language: 'javascript',
            code: `// قياس سرعة تنفيذ العمليات الحسابية
console.time("timer");
for (let i = 0; i < 100000; i++) {}
console.timeEnd("timer");

// طباعة مصفوفة كائنات في جدول منظم
const tracks = [
  { id: 1, title: "Frontend React", hours: 40 },
  { id: 2, title: "Backend Node.js", hours: 45 }
];
console.table(tracks);`,
            explanation: 'أوامر مفيدة جداً أثناء التطوير لقياس الأداء وعرض البيانات بوضوح.'
          }
        ],
        interviewQA: [
          {
            question: 'ما فائدة فحص الـ Box Model في تاب Elements؟',
            answer: 'يساعد في معرفة الأبعاد الدقيقة للعنصر والتأكد من عدم وجود مسافات Padding أو Margin غير مقصودة تسبب كسر التجاوب.'
          }
        ],
        proTip: 'استخدم اختصار Ctrl + Shift + M لتفعيل وضع معاينة شاشات الهواتف المحمولة فوراً.',
        commonMistake: 'نسيان أن تعديلات DevTools مؤقتة وتختفي مع عمل Refresh إذا لم تنقلها لكود مشروعك.'
      }
    ]
  },
  {
    id: 'mod-2-html5-semantics',
    order: 2,
    title: 'الموديول الثاني: البناء الدلالي الاحترافي (Semantic HTML5 Architecture & Forms)',
    titleEn: 'Semantic HTML5, DOM Architecture & Modern Forms',
    durationHours: 8,
    description: 'إتقان بناء هيكل صفحات الويب بالمعايير الدلالية، تحسين محركات البحث (SEO)، ونماذج الإدخال المتقدمة مع التحقق الصارم.',
    iconName: 'Layout',
    badge: 'معايير الشركات العالمية',
    isLocked: false,
    lessons: [
      {
        id: 'lesson-2-1',
        moduleId: 'mod-2-html5-semantics',
        title: 'الدرس 1: التاجات الدلالية (Semantic HTML) ولماذا نتجنب الـ Div Soup؟',
        duration: '40 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'تخيل كتاباً كل صفحاته بدون عناوين أو فصول؛ سيكون من المستحيل قراءته وفهرسته! التاجات الدلالية هي العناوين والفصول التي تفهمها محركات البحث وقارئات الشاشة للمكفوفين.',
        explanationAr: `في الويب الحديث، نبتعد تماماً عن وضع كل شيء داخل div (ما يعرف بـ Div Soup)، ونستخدم التاجات الدلالية المعبرة:

التاجات الدلالية الأساسية:
- header: ترويسة الموقع أو القسم وتحتوي على الشعار والعنوان.
- nav: شريط روابط التنقل الأساسية.
- main: المحتوى الفريد والجوهري للصفحة (عنصر واحد فقط في الصفحة).
- section: قسم عام يجمع محتوى ذو موضوع موحد وله عنوان h2 أو h3.
- article: محتوى مستقل بذاته يمكن إعادة استخدامه ونشره في أي مكان (مثل بطاقة كورس أو مقال).
- aside: محتوى جانبي مكمل (إعلانات، روابط مقترحة).
- footer: تذييل الصفحة وحقوق الملكية والتواصل.

فوائد المعايير الدلالية:
1. تحسين تصدر نتائج محركات البحث (SEO).
2. دعم إمكانية الوصول لقارئات الشاشة (Accessibility / a11y).
3. سهولة صيانة الكود وقراءته داخل فرق العمل.`,
        aiVideo: {
          title: 'مقارنة بصرية حية: الموقع المعياري الدلالي مقابل عشوائية الـ Div Soup',
          duration: '3:50 دقيقة',
          badge: 'مونتاج مقارنة هيكلية بالألوان',
          captionAr: 'استعراض بصري لكيفية مسح عناكب Google للصفحة وقراءة Screen Reader للهيكل الدلالي بالمقارنة مع صفحة مليئة بالـ Divs العشوائية.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/1PnVor36_4o',
          chapters: [
            { time: '0:00', title: 'مشكلة الـ Div Soup العشوائي', desc: 'صعوبة الفهم ومشاكل الـ SEO' },
            { time: '1:15', title: 'تحويل الهيكل للتاجات الدلالية header و nav و main', desc: 'إعادة بناء الصفحة بالمعايير' },
            { time: '2:30', title: 'الفرق البصري بين section و article', desc: 'فهم الاستقلالية وإعادة التوزيع' },
            { time: '3:20', title: 'اختبار الموقع مع قارئات الشاشة للمكفوفين', desc: 'التنقل السلس بروابط aria' }
          ],
          visualNotes: [
            'إبراز تاجات header, nav, main, footer بألوان مختلفة لتوضيح التسلسل الهرمي.'
          ]
        },
        playground: {
          initialHtml: `<header>
  <h1> أكاديمية فوكس تك</h1>
  <nav>
    <a href="#courses">الكورسات</a> | <a href="#about">عن المسار</a>
  </nav>
</header>
<main>
  <article class="card">
    <h2>مسار الـ Frontend المتقدم</h2>
    <p>تعلم بناء تطبيقات الويب السريعة بأحدث التقنيات المعيارية.</p>
  </article>
</main>
<footer>
  <p>&copy; 2026 جميع الحقوق محفوظة</p>
</footer>`,
          initialCss: `body { font-family: sans-serif; background: #0f172a; color: white; padding: 20px; text-align: center; }
header { background: #1e293b; padding: 15px; border-radius: 12px; margin-bottom: 20px; }
nav a { color: #38bdf8; text-decoration: none; margin: 0 10px; }
.card { background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #38bdf8; max-width: 400px; margin: 0 auto; }
footer { margin-top: 20px; color: #94a3b8; font-size: 12px; }`,
          initialJs: `console.log("تم تحميل الصفحة الدلالية بنجاح!");`,
          previewNote: 'جرب تعديل التاجات الدلالية في محرر الـ HTML وشاهد النتيجة فورياً!'
        },
        steps: [
          {
            stepNumber: 1,
            title: 'كتابة الهيكل الدلالي لصفحة ويب قياسية',
            action: 'أنشئ ملف HTML وابنِ الصفحة باستخدام header, nav, main, section, footer بدلاً من div.',
            explanation: 'يمنح محركات البحث وقارئات الشاشة فهماً دقيقاً لبنية المحتوى.',
            expectedResult: 'هيكل منظم وواضح ومعتمد عالمياً.'
          },
          {
            stepNumber: 2,
            title: 'إضافة نصوص بديلة للصور (alt attribute)',
            action: 'أضف وصفاً دلالياً دقيقاً لكل صورة عبر الخاصية alt.',
            explanation: 'ضروري لإمكانية الوصول ولظهور الوصف في حال فشل تحميل الصورة.',
            expectedResult: 'توافق كامل مع معايير إمكانية الوصول العالمية.'
          }
        ],
        keyPoints: [
          'يجب أن تحتوي كل صفحة على عنصر main واحد فقط للمحتوى الأساسي.',
          'استخدم article للمحتوى المستقل بذاته مثل بطاقات الكورسات والمقالات.',
          'تجنب الـ Div Soup واستخدم div فقط للحاويات الشكلية والتنسيقية عند الحاجة.'
        ],
        codeSnippets: [
          {
            title: 'هيكل صفحة كامل بالمعايير الدلالية الحديثة',
            language: 'html',
            code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>أكاديمية فوكس تك البرمجية</title>
</head>
<body>
  <header>
    <h1> أكاديمية فوكس تك</h1>
    <nav aria-label="التنقل الرئيسي">
      <ul>
        <li><a href="#home">الرئيسية</a></li>
        <li><a href="#courses">المسارات</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="courses">
      <h2>المسارات التدريبية المعتمدة</h2>
      <article class="card">
        <h3>مسار Frontend Engineering</h3>
        <p>تدريب مكثف على React 19 و TypeScript.</p>
      </article>
    </section>
  </main>

  <footer>
    <p>جميع الحقوق محفوظة &copy; 2026 فوكس تك</p>
  </footer>
</body>
</html>`,
            explanation: 'مثال يوضح الاستخدام السليم للتاجات الدلالية بدلاً من التداخل العشوائي للـ div.'
          }
        ],
        interviewQA: [
          {
            question: 'ما الفرق بين section و article؟',
            answer: 'الـ article محتوى مستقل بذاته يمكن إعادة نشره في أي مكان (مثل مقال أو بطاقة منتج)، بينما section يمثل فصلاً أو تقسيماً لموضوع داخل الصفحة وله عنوان فرعي.'
          }
        ],
        proTip: 'لا تكرر عنصر h1 أكثر من مرة واحدة في الصفحة الرئيسية لضمان قوة ترتيب الموقع في SEO.',
        commonMistake: 'استخدام التاجات القديمة مثل font و center بدلاً من التنسيق بالـ CSS الحديث.'
      },
      {
        id: 'lesson-2-2',
        moduleId: 'mod-2-html5-semantics',
        title: 'الدرس 2: نماذج الإدخال المتقدمة (Forms & HTML5 Validation)',
        duration: '45 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'النموذج هو استمارة التسجيل الرسمية؛ تتأكد من إدخال البريد والهاتف بالشكل السليم وتمنع إرسال الاستمارة إذا وُجد حقل إجباري فارغ.',
        explanationAr: `نماذج الإدخال (Forms) هي وسيلة إرسال البيانات من المتصفح للسيرفر:

القواعد الذهبية لبناء نموذج احترافي:
1. ربط كل label بحقل الإدخال المقابل له عبر مطابقة for مع id.
2. استخدام الأنواع المناسبة للـ inputs:
   - type="email": فحص وجود علامة @ وإظهار كيبورد الإيميل على الموبايل.
   - type="tel": فتح لوحة أرقام الهاتف فوراً على الهواتف.
   - type="password": إخفاء الرموز المدخلة.
3. ميزات التحقق المدمجة: required, minlength, maxlength, pattern.`,
        aiVideo: {
          title: 'دليل عملي: بناء نماذج الويب الحديثة والتحقق من صحة البيانات',
          duration: '4:20 دقيقة',
          badge: 'مونتاج تفاعلي للتحقق وتجربة المستخدم',
          captionAr: 'استعراض بصري لطريقة بناء نموذج تسجيل تفاعلي وربط الحقول بالـ Labels مع فحص الإيميل ورقم الهاتف تلقائياً قبل الإرسال.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/fNcJuPIZ2WE',
          chapters: [
            { time: '0:00', title: 'إنشاء وسم Form وتحديد طريقة الإرسال POST', desc: 'تجهيز النموذج ونقل البيانات بأمان' },
            { time: '1:10', title: 'ربط الحقول بالـ Labels عبر id و for', desc: 'تحسين إمكانية الوصول وسهولة النقر' },
            { time: '2:20', title: 'أنواع المدخلات email و password و tel', desc: 'تخصيص لوحة مفاتيح الهواتف الذكية' },
            { time: '3:30', title: 'تفعيل التحقق الأصيل required و pattern', desc: 'منع إرسال النماذج غير المكتملة' }
          ],
          visualNotes: [
            'التركيز على ظهور رسائل الخطأ الحمراء الجميلة عند محاولة كتابة إيميل غير صالح.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'إنشاء النموذج وتحديد نوع الإرسال',
            action: 'اكتب وسم form مع تعيين method="POST" لحماية البيانات الحساسة.',
            explanation: 'يحدد طريقة نقل وتشفير بيانات النموذج.',
            expectedResult: 'حاوية نموذج مهيأة لاستقبال البيانات.'
          },
          {
            stepNumber: 2,
            title: 'ربط الحقول بنصوص label دلالية',
            action: 'تأكد من مطابقة قيمة for في label مع قيمة id في input.',
            explanation: 'يتيح التركيز على الحقل بمجرد النقر على النص التوضيحي.',
            expectedResult: 'تجربة مستخدم مريحة ومتوافقة مع المعايير.'
          }
        ],
        keyPoints: [
          'يجب دائماً ربط كل حقل إدخال بـ label دلالي باستخدام for و id.',
          'استخدام أنواع الإدخال الصحيحة يحسن تجربة المستخدم على الهواتف المحمولة بشكل كبير.',
          'التحقق في المتصفح يريح المستخدم ولكن التحقق في السيرفر إلزامي للأمان.'
        ],
        codeSnippets: [
          {
            title: 'نموذج تسجيل متدرب متكامل بالتحقق الصارم',
            language: 'html',
            code: `<form action="/api/register" method="POST">
  <div>
    <label for="studentName">اسم المتدرب:</label>
    <input type="text" id="studentName" name="name" required minlength="3">
  </div>

  <div>
    <label for="studentEmail">البريد الأكاديمي:</label>
    <input type="email" id="studentEmail" name="email" required>
  </div>

  <div>
    <label for="trackSelect">المسار التدريبي:</label>
    <select id="trackSelect" name="track" required>
      <option value="">اختر المسار...</option>
      <option value="frontend">تطوير الواجهات الأمامية (Frontend)</option>
      <option value="fullstack">هندسة الويب الشاملة (Full Stack)</option>
    </select>
  </div>

  <button type="submit">تسجيل في المسار </button>
</form>`,
            explanation: 'نموذج قياسي يوضح ربط الحقول بالـ labels واستخدام خصائص التحقق الأصيلة.'
          }
        ],
        interviewQA: [
          {
            question: 'لماذا يعتبر استخدام autocomplete مهماً في حقول النماذج؟',
            answer: 'يساعد متصفحات الويب وبرامج كلمات المرور على الملء التلقائي الآمن للبيانات، مما يرفع سرعة إكمال النماذج ويقلل الأخطاء.'
          }
        ],
        proTip: 'استخدم دائماً button type="submit" داخل النموذج لتأكيد سلوك الإرسال.',
        commonMistake: 'إهمال وضع id في حقل الإدخال مما يكسر ربطه بالـ label التابع له.'
      }
    ]
  },
  {
    id: 'mod-3-css-mastery',
    order: 3,
    title: 'الموديول الثالث: إتقان التنسيق الحديث (CSS3, Flexbox, Grid & Responsive Design)',
    titleEn: 'CSS3 Deep Dive, Modern Layouts & Animations',
    durationHours: 12,
    description: 'فك شفرة الـ Box Model، إتقان توزيع العناصر بـ Flexbox في بُعد واحد و CSS Grid في بُعدين، والتصميم المتجاوب مع كل الشاشات.',
    iconName: 'Palette',
    badge: 'هندسة المظهر والتجاوب',
    isLocked: false,
    lessons: [
      {
        id: 'lesson-3-1',
        moduleId: 'mod-3-css-mastery',
        title: 'الدرس 1: فك لغز الـ Box Model وسحر box-sizing: border-box',
        duration: '40 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'تخيل صندوق هدايا مقاسه 20 سم؛ إذا وضعت بطانة حماية داخلية يظل الصندوق 20 سم (هذا هو border-box)، لكن في النظام القديم كان الصندوق يتمدد ليصبح 26 سم فيكسر الرف!',
        explanationAr: `أي عنصر في صفحة الويب عبارة عن مستطيل أو مربع يسمى Box:

المكونات الأربعة من الداخل للخارج:
1. Content: المحتوى الفعلي (النص أو الصورة أو العرض والارتفاع).
2. Padding: الحشوة والمسافة الداخلية بين المحتوى والإطار.
3. Border: الإطار والحدود الخارجية المحيطة بالحشوة.
4. Margin: الهامش الخارجي الشفاف الفاصل بين هذا العنصر وباقي العناصر.

السر العالمي:
في الوضع الافتراضي القديم يتم إضافة الـ Padding والـ Border فوق العرض المحدد مما يكسر التصميم. الحل الذي تعتمده كل الشركات هو إضافة السطر السحري:
* { box-sizing: border-box; }
بهذا السطر، يظل العرض المكتوب ثابتاً ويتم اقتطاع المسافات من الداخل تلقائياً.`,
        aiVideo: {
          title: 'محاكاة ثلاثية الأبعاد لحسابات الـ Box Model والـ Border-Box',
          duration: '4:10 دقيقة',
          badge: 'مونتاج هندسي تفاعلي',
          captionAr: 'شرح بصري متحرك يوضح الفرق بين وضع content-box و border-box ولماذا تحدث مشكلة التمرير الأفقي وكيف يحلها سطر Reset السحري.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/rIO5326FgPE',
          chapters: [
            { time: '0:00', title: 'طبقات الـ Box Model الأربعة', desc: 'Content, Padding, Border, Margin' },
            { time: '1:20', title: 'مشكلة التمدد الخارجي في content-box', desc: 'زيادة العرض بمقدار 50px بالخطأ' },
            { time: '2:40', title: 'تطبيق السطر السحري box-sizing: border-box', desc: 'ثبات العرض واقتطاع المسافات داخلياً' }
          ],
          visualNotes: [
            'الرسم يوضح بالأرقام كيف يحسب المتصفح العرض النهائي 200px بدقة متناهية.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'كتابة الـ CSS Reset الشامل للمشروع',
            action: 'أضف قاعدة النجمة * في بداية ملف التنسيق لتفعيل border-box وتصفير الهوامش العشوائية.',
            explanation: 'يضمن ظهور العناصر بنفس المقاسات الدقيقة في كل المتصفحات.',
            codeSnippet: '* { margin: 0; padding: 0; box-sizing: border-box; }',
            expectedResult: 'إلغاء الحواف والمسافات البيضاء الافتراضية حول الصفحة.'
          },
          {
            stepNumber: 2,
            title: 'توسيط الحاويات باستخدام Margin Auto',
            action: 'حدد max-width للحاوية وأضف margin: 0 auto لتوسيطها.',
            explanation: 'المتصفح يقسم المساحة المتبقية بالتساوي يميناً ويساراً.',
            expectedResult: 'توسيط دقيق للمحتوى في منتصف الشاشة.'
          }
        ],
        keyPoints: [
          'يجب تطبيق box-sizing: border-box على كل العناصر دائماً.',
          'الـ Padding مسافة داخلية تأخذ لون خلفية العنصر، والـ Margin مسافة خارجية شفافة.',
          'استخدم max-width: 100% للصور لمنع ظهور شريط التمرير الأفقي في الموبايل.'
        ],
        codeSnippets: [
          {
            title: 'قالب التهيئة الاحترافي للـ CSS Reset',
            language: 'css',
            code: `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #1e293b;
  background-color: #0f172a;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}`,
            explanation: 'القالب القياسي الذي تبدأ به الشركات العالمية أي مشروع ويب جديد.'
          }
        ],
        interviewQA: [
          {
            question: 'ما الفرق بين content-box و border-box؟',
            answer: 'في content-box يضاف الـ Padding والـ Border فوق العرض المحدد فيزيد حجم العنصر، بينما في border-box يتم حسابهما ضمن العرض الكلي دون زيادة الحجم الخارجي.'
          }
        ],
        proTip: 'افحص دائماً تاب Computed في DevTools للتأكد من حسابات أبعاد المربع.',
        commonMistake: 'استخدام margin سالب لمعالجة مشاكل التموضع بدلاً من استخدام Flexbox المنظم.'
      },
      {
        id: 'lesson-3-2',
        moduleId: 'mod-3-css-mastery',
        title: 'الدرس 2: إتقان Flexbox للتوزيع والتوسيط في بُعد واحد (1D)',
        duration: '50 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'الـ Flexbox مثل صف كراسي ذكية في قاعة مؤتمرات؛ تطلب منهم التوسع لملء المساحة أو التكدس في المنتصف بأمر واحد بسيط.',
        explanationAr: `نظام Flexbox صُمم لتوزيع العناصر ومحاذاتها في اتجاه واحد (إما صف Row أو عمود Column):

أهم الخصائص للحاوية الأب (Flex Container):
- display: flex: تفعيل نظام الفليكس.
- justify-content: لمحاذاة العناصر على المحور الرئيسي (center, space-between, space-around).
- align-items: لمحاذاة العناصر على المحور العمودي المعاكس (center, stretch).
- gap: إنشاء مسافات موحدة بين العناصر بدون margins.
- flex-wrap: wrap: السماح للعناصر بالنزول لسطر جديد عند صغر الشاشة.`,
        aiVideo: {
          title: 'ماستر كلاس Flexbox: حل عقد التوسيط وبناء القوائم المتجاوبة',
          duration: '5:10 دقيقة',
          badge: 'مونتاج تفاعلي لمحاذاة العناصر',
          captionAr: 'محاكاة بصرية لتأثير كل خاصية من خواص Flexbox (justify-content, align-items, gap) مع حركة ديناميكية للعناصر على الشاشة.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/fYq5PXgSsbE',
          chapters: [
            { time: '0:00', title: 'تفعيل display: flex وفهم المحورين Main و Cross', desc: 'أساسيات توجيه الصناديق' },
            { time: '1:15', title: 'التوسيط الشامل بـ justify-content و align-items', desc: 'حل مشكلة التوسيط في ثوانٍ' },
            { time: '2:30', title: 'بناء شريط تنقل متناسق بـ space-between', desc: 'توزيع الأزرار والروابط' },
            { time: '3:50', title: 'التجاوب عبر flex-wrap: wrap وخاصية gap', desc: 'الملاءمة التلقائية لشاشات الجوال' }
          ],
          visualNotes: [
            'تظهر الأسهم الملونة المحور الأفقي الرئيسي باللون الأخضر والمحور العمودي باللون البنفسجي.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'حل معضلة التوسيط الشهيرة بالـ Flexbox',
            action: 'اكتب display: flex; justify-content: center; align-items: center; للحاوية الأب.',
            explanation: 'يوسط العنصر أفقياً ورأسياً بدقة مطلقة في منتصف المساحة.',
            expectedResult: 'توسيط تام للعنصر في الشاشة.'
          },
          {
            stepNumber: 2,
            title: 'بناء شريط تنقل احترافي بـ Space-Between',
            action: 'طبق justify-content: space-between على شريط الملاحة لتوزيع الشعار والروابط والأزرار.',
            explanation: 'يوزع العناصر على الأطراف مع مسافات تلقائية متوازنة.',
            expectedResult: 'شريط تنقل أنيق ومتناسق الأطراف.'
          }
        ],
        keyPoints: [
          'الـ Flexbox مخصص للترتيب في اتجاه واحد (1D) ومثالي لأشرطة التنقل والأزرار والبطاقات.',
          'استخدم gap بدلاً من الهوامش الفردية لتحديد المسافات بين العناصر.',
          'خاصية flex: 1 تجعل العنصر يتمدد ليملأ أي مساحة فارغة متاحة.'
        ],
        codeSnippets: [
          {
            title: 'شريط ملاحة احترافي وتوسيط العناصر بـ Flexbox',
            language: 'html',
            code: `<nav class="navbar">
  <div class="logo"> فوكس تك</div>
  <ul class="nav-links">
    <li><a href="#home">الرئيسية</a></li>
    <li><a href="#courses">المسارات</a></li>
  </ul>
  <button class="btn">دخول</button>
</nav>

<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px;
    background: #1e293b;
    color: white;
    border-radius: 12px;
  }
  .nav-links {
    display: flex;
    gap: 20px;
    list-style: none;
  }
  .nav-links a { color: #94a3b8; text-decoration: none; }
  .btn {
    background: #0284c7;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }
</style>`,
            explanation: 'تطبيق عملي يوضح توزيع أطراف شريط الملاحة واستخدام gap بين الروابط.'
          }
        ],
        interviewQA: [
          {
            question: 'ما الفرق بين justify-content و align-items؟',
            answer: 'الـ justify-content يتحكم في محاذاة العناصر على المحور الرئيسي (Main Axis)، بينما align-items يتحكم في المحور العمودي المعاكس (Cross Axis).'
          }
        ],
        proTip: 'استخدم flex-wrap: wrap دائماً لشبكات البطاقات حتى لا تنضغط على شاشات الموبايل.',
        commonMistake: 'نسيان وضع display: flex على العنصر الأب والتعجب من عدم استجابة خواص الفليكس.'
      },
      {
        id: 'lesson-3-3',
        moduleId: 'mod-3-css-mastery',
        title: 'الدرس 3: شبكة CSS Grid ثنائية الأبعاد والتجاوب السحري بسطر واحد',
        duration: '50 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'الـ CSS Grid مثل لوحة الشطرنج؛ تتيح تقسيم الصفحة لصفوف وأعمدة متقاطعة والتحكم في مكان أي عنصر في بعدين في نفس اللحظة.',
        explanationAr: `نظام CSS Grid هو الأقوى لتخطيط الصفحات ثنائية الأبعاد (2D: صفوف وأعمدة معاً):

السطر السحري لشبكة متجاوبة بدون أي Media Queries:
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));

شرح السطر:
- repeat: تكرار إنشاء الأعمدة تلقائياً.
- auto-fit: حساب عدد الأعمدة المناسب لعرض الشاشة الحالي ووفق المساحة المتاحة.
- minmax(280px, 1fr): كل عمود لا يقل عن 280px، وإذا وجدت مساحة يتمدد بالتساوي بالتناصف (1fr).`,
        aiVideo: {
          title: 'ماستر كلاس CSS Grid: السطر السحري لبناء شبكة متجاوبة 100%',
          duration: '4:50 دقيقة',
          badge: 'مونتاج تخطيط ثنائي الأبعاد',
          captionAr: 'شرح بصري متحرك لكيفية تقسيم الشاشة إلى خطوط شبكة Grid Lines واستخدام auto-fit لتغيير عدد الأعمدة تلقائياً من 4 إلى 1 حسب حجم الشاشة.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/srvUrASNj0s',
          chapters: [
            { time: '0:00', title: 'إنشاء شبكة Grid وفهم وحدة الكسر fr', desc: 'توزيع المساحة بدقة' },
            { time: '1:20', title: 'السطر السحري repeat(auto-fit, minmax)', desc: 'تجاوب فوري بدون ميديا كويري' },
            { time: '2:45', title: 'تحديد مساحات Grid Areas وترتيب الأقسام', desc: 'رسم هيكل الموقع بالكامل' },
            { time: '3:50', title: 'اختبار التجاوب على أحجام الشاشات المختلفة', desc: 'انسيابية العرض' }
          ],
          visualNotes: [
            'تظهر خطوط شبكة الـ Grid باللون الوردي والأعمدة تتسع وتضيق مع حركة الماوس.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'إنشاء شبكة أعمدة مرنة بوحدة الكسور (fr)',
            action: 'اكتب display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;',
            explanation: 'ينشئ ثلاثة أعمدة متساوية المساحة تماماً مع فواصل موحدة.',
            expectedResult: 'شبكة ثلاثية الأعمدة متناسقة.'
          },
          {
            stepNumber: 2,
            title: 'تطبيق خاصية auto-fit للتجاوب الذاتي',
            action: 'استبدل الأعمدة الثابتة بـ repeat(auto-fit, minmax(260px, 1fr)).',
            explanation: 'تتحول الشبكة من 4 أعمدة في الكمبيوتر لعمود واحد في الموبايل تلقائياً.',
            expectedResult: 'تجاوب ذاتي مذهل على كل المقاسات.'
          }
        ],
        keyPoints: [
          'وحدة fr تمثل حصة مرنة من المساحة المتبقية داخل شبكة الـ Grid.',
          'الـ Grid مثالي لتخطيط كامل الصفحة وشبكات عرض البطاقات والمنتجات.',
          'دمج Grid لتخطيط الصفحة مع Flexbox لمكونات العناصر الداخلية يعطي أفضل نتيجة برمجية.'
        ],
        codeSnippets: [
          {
            title: 'شبكة بطاقات كورسات متجاوبة بالكامل',
            language: 'css',
            code: `.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
}

.course-card {
  background: #1e293b;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #334155;
  transition: transform 0.2s;
}

.course-card:hover {
  transform: translateY(-4px);
  border-color: #0ea5e9;
}`,
            explanation: 'كود شبكة البطاقات المتجاوبة ذاتياً بدون الحاجة لكتابة أي media query منفصلة.'
          }
        ],
        interviewQA: [
          {
            question: 'متى تفضل CSS Grid على Flexbox؟',
            answer: 'نستخدم CSS Grid عند تخطيط واجهة تعتمد على صفوف وأعمدة متزامنة (2D) أو معارض صور وبطاقات، بينما نستخدم Flexbox للعناصر أحادية البعد (1D) كأشرطة التنقل وقوائم الأزرار.'
          }
        ],
        proTip: 'استخدم minmax مع auto-fit دائماً لتجنب كتابة عشرات الأسطر في ملفات الميديا كويري.',
        commonMistake: 'استخدام أبعاد ثابتة بالبكسل للأعمدة داخل الـ Grid مما يكسر التجاوب في شاشات الهواتف.'
      }
    ]
  },
  {
    id: 'mod-4-js-es6',
    order: 4,
    title: 'الموديول الرابع: عقل الواجهات - جافاسكريبت الحديثة (Modern JavaScript ES6+ & Async)',
    titleEn: 'JavaScript ES6+, Execution Context & Asynchronous Architecture',
    durationHours: 16,
    description: 'فهم عميق لمحرك JS، سياق التنفيذ و Call Stack، دوال المصفوفات الحديثة، والـ Promises و async/await لجلب البيانات من السيرفر.',
    iconName: 'Code',
    badge: 'العصب البرمجي',
    isLocked: false,
    lessons: [
      {
        id: 'lesson-4-1',
        moduleId: 'mod-4-js-es6',
        title: 'الدرس 1: المتغيرات، سياق التنفيذ (Execution Context) ولماذا نودع var؟',
        duration: '45 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'المتغير var مثل صندوق مفتوح في الشارع يمكن لأي شخص العبث به، بينما let و const مثل خزنة شخصية مغلقة في غرفتك الخاصة (Block Scope) لا يدخلها أحد.',
        explanationAr: `لغة JavaScript أحادية المسار (Single-Threaded)، وتنفذ الكود عبر مرحلتين:
1. مرحلة حجز الذاكرة (Memory Creation): حجز أماكن للمتغيرات والدوال (Hoisting).
2. مرحلة التنفيذ (Code Execution): تشغيل الكود سطراً بسطر وتعيين القيم الحقيقية.

مقارنة شاملة بين المتغيرات:
- var (ممنوع استخدامه): نطاق دالة (Function Scope) ويسبب أخطاء تسريب المتغيرات وإعادة التعريف الخاطئ.
- let: نطاق كتلة (Block Scope) محصور بين الأقواس { }، وقابل لتغيير القيمة.
- const (الخيار الافتراضي دائماً): نطاق كتلة، ولا يمكن تغيير قيمته البدائية بعد التعيين.`,
        aiVideo: {
          title: 'تشريح محرك JavaScript: سياق التنفيذ والفرق بين var و let و const',
          duration: '5:40 دقيقة',
          badge: 'مونتاج تفاعلي لمحرك الذاكرة و Call Stack',
          captionAr: 'شرح بصري متحرك لمراحل Memory Allocation والـ Hoisting ولماذا يؤدي استخدام var لتسريب المتغيرات وكيف تحمي let و const النطاق الداخلي.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/hdI2bqOjy3c',
          chapters: [
            { time: '0:00', title: 'مراحل عمل محرك JS وسياق التنفيذ Global Execution Context', desc: 'فهم كيف يقرأ المحرك الكود' },
            { time: '1:30', title: 'ظاهرة الـ Hoisting وحجز الذاكرة للمتغيرات', desc: 'الفرق بين undefined و ReferenceError' },
            { time: '3:00', title: 'حماية الـ Block Scope ومنطقة الـ Temporal Dead Zone', desc: 'أمان let و const' },
            { time: '4:20', title: 'أفضل ممارسات الشركات في إعلان الثوابت والمتغيرات', desc: 'كتابة كود نظيف وقابل للصيانة' }
          ],
          visualNotes: [
            'تظهر لوحة الذاكرة Call Stack باللون الكحلي مع حركة صعود وهبوط الدوال أثناء التنفيذ.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'اعتماد const كخيار افتراضي واستخدام let فقط عند الحاجة لتغيير القيمة',
            action: 'عرف كافة المتغيرات بـ const وعند وجود عداد يتغير استخدم let.',
            explanation: 'يمنع الأخطاء غير المقصودة ويجعل الكود قابلاً للصيانة والتنبؤ.',
            expectedResult: 'كود آمن وخالٍ من مفاجآت إعادة التعيين العشوائية.'
          },
          {
            stepNumber: 2,
            title: 'فحص حماية الـ Block Scope داخل الشروط',
            action: 'عرف متغيراً بـ let داخل if وحاول طباعته خارج الأقواس.',
            explanation: 'سيظهر خطأ ReferenceError لتأكيد حماية المتغير داخل نطاقه.',
            expectedResult: 'حماية كاملة لنطاق المتغيرات الداخلية.'
          }
        ],
        keyPoints: [
          'قاعدة ذهبية: ابدأ دائماً بـ const، وإذا احتجت لتغيير القيمة لاحقاً استخدم let، ولا تستخدم var أبداً.',
          'الـ Block Scope يعني أن المتغير يعيش فقط داخل القوسين المعقوفين { } اللذين تم تعريفه بداخلهما.',
          'الـ TDZ (Temporal Dead Zone) هي الفترة بين بداية النطاق والسطر الذي يُعرف فيه المتغير.'
        ],
        codeSnippets: [
          {
            title: 'الاستخدام السليم لـ const و let مع الكائنات والكتل',
            language: 'javascript',
            code: `// استخدام const مع الكائنات
const student = {
  id: 101,
  name: "أحمد نبيل",
  track: "Frontend"
};

// مسموح: تعديل الخصائص الداخلية
student.track = "React 19 Engineer";

// تجربة الـ Block Scope
if (true) {
  let blockVariable = "أنا محمي داخل هذه الأقواس فقط";
  console.log(blockVariable);
}`,
            explanation: 'يوضح حماية النطاق الداخلي والتعديل الآمن لخصائص الكائنات.'
          }
        ],
        interviewQA: [
          {
            question: 'ما هي منطقة الـ Temporal Dead Zone (TDZ)؟',
            answer: 'هي الفترة الزمنية بين بداية نطاق الكتلة والسطر الذي تم الإعلان فيه عن متغير let أو const، وإذا حاولت استخدامه قبل تعريفه يرمي المحرك خطأ ReferenceError.'
          }
        ],
        proTip: 'استخدم دائماً Template Literals (باستخدام علامة الباك تيك) لدمج النصوص والمتغيرات بأناقة.',
        commonMistake: 'محاولة إعادة تعيين قيمة ثابت تم تعريفه بـ const والتعجب من ظهور خطأ TypeError.'
      },
      {
        id: 'lesson-4-2',
        moduleId: 'mod-4-js-es6',
        title: 'الدرس 2: أسلحة المصفوفات الخارقة (map, filter, reduce, find)',
        duration: '50 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'تخيل صندوق تفاح: دالة filter تختار التفاح السليم فقط، ودالة map تقشر كل تفاحة، ودالة reduce تعصر كل التفاح لتعطيك كوب عصير مركز واحد!',
        explanationAr: `في تطبيقات React والواجهات الحديثة، أكثر من 70% من الكود يعتمد على معالجة البيانات القادمة من السيرفر عبر دوال المصفوفات:

الدوال الأربعة الأساسية:
1. map: تمر على كل عنصر، وتطبق عليه دالة تحويل، وترجع مصفوفة جديدة بنفس الطول (تستخدم لتحويل البيانات لعناصر JSX).
2. filter: تفحص العناصر بشرط معين، وترجع مصفوفة جديدة تضم العناصر التي حققت الشرط فقط.
3. find: تبحث عن أول عنصر يطابق الشرط وترجعه ككائن فوراً وتتوقف عن البحث.
4. reduce: تجمع وتلخص عناصر المصفوفة في قيمة نهائية واحدة (مثل حساب إجمالي السعر).`,
        aiVideo: {
          title: 'ماستر كلاس دوال المصفوفات: تحويل وفلترة البيانات باحتراف',
          duration: '6:00 دقيقة',
          badge: 'مونتاج تدفق البيانات البرمجي',
          captionAr: 'استعراض بصري لطريقة سريان البيانات عبر دوال map و filter و reduce واستخراج إحصائيات فورية بدون تعديل المصفوفة الأصلية.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/0ik6X4DJKCc',
          chapters: [
            { time: '0:00', title: 'مفهوم الـ Immutability ونقاء الدوال', desc: 'الحفاظ على البيانات الأصلية' },
            { time: '1:20', title: 'توليد عناصر الواجهة بدالة map', desc: 'التحويل المباشر لمصفوفات الـ JSX' },
            { time: '2:40', title: 'تطبيق شروط الفلترة بـ filter و find', desc: 'استخراج السجلات المطابقة' },
            { time: '4:15', title: 'تجميع الحسابات والأسعار بدالة reduce', desc: 'الوصول للرقم الإجمالي في سطر واحد' }
          ],
          visualNotes: [
            'الرسم يوضح تحول عناصر المصفوفة واحداً تلو الآخر عبر أنبوب المعالجة البرمجي.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'تحويل مصفوفة نصوص لعناصر منسقة بـ map',
            action: 'استخدم array.map() لإنشاء نصوص تعريفية من مصفوفة الكورسات.',
            explanation: 'دالة map تحافظ على نقاء البيانات الأصلية بدون أي تعديل (Immutability).',
            expectedResult: 'مصفوفة جديدة منسقة جاهزة للعرض.'
          },
          {
            stepNumber: 2,
            title: 'فلترة الكورسات النشطة فقط بـ filter',
            action: 'طبق الشرط course => course.isPublished على المصفوفة.',
            explanation: 'استخراج العناصر المتاحة فقط بدقة وسرعة.',
            expectedResult: 'مصفوفة مفلترة تضم الكورسات المنشورة فقط.'
          }
        ],
        keyPoints: [
          'الدوال map و filter لا تعدل على المصفوفة الأصلية إطلاقاً (Pure Functions).',
          'استخدم find للبحث عن عنصر عبر الـ id لتوفير وقت المعالجة.',
          'يمكنك ربط الدوال تسلسلياً مثل: courses.filter(...).map(...).'
        ],
        codeSnippets: [
          {
            title: 'معالجة بيانات الكورسات والأسعار بأناقة',
            language: 'javascript',
            code: `const courses = [
  { id: 1, title: "HTML5 & CSS3", price: 200, isPublished: true },
  { id: 2, title: "React 19 Pro", price: 600, isPublished: true },
  { id: 3, title: "Legacy Tech", price: 100, isPublished: false }
];

// فلترة واستخراج الأسماء المنشورة
const titles = courses
  .filter(c => c.isPublished)
  .map(c => c.title + " (" + c.price + " ج.م)");

console.log("الكورسات المتاحة:", titles);

// حساب إجمالي الأسعار بـ reduce
const total = courses
  .filter(c => c.isPublished)
  .reduce((sum, c) => sum + c.price, 0);

console.log("الإجمالي:", total, "ج.م");`,
            explanation: 'مثال واقعي يوضح دمج دوال المصفوفات لمعالجة واستخراج التقارير في أسطر معدودة.'
          }
        ],
        interviewQA: [
          {
            question: 'ما هو الفرق بين forEach و map؟',
            answer: 'دالة map ترجع دائماً مصفوفة جديدة محولة ولا تعدل الأصل، بينما forEach تقوم بتنفيذ عمليات لكل عنصر ولا ترجع أي شيء (ترجع undefined) وتستخدم للآثار الجانبية.'
          }
        ],
        proTip: 'ضع دائماً القيمة الابتدائية (مثل 0) في دالة reduce لمنع الأخطاء في المصفوفات الفارغة.',
        commonMistake: 'نسيان كتابة return داخل دالة map عند استخدام الأقواس المعقوفة { }.'
      },
      {
        id: 'lesson-4-3',
        moduleId: 'mod-4-js-es6',
        title: 'الدرس 3: جلب البيانات من السيرفر (Fetch API, Promises & async/await)',
        duration: '55 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'طلب البيانات من السيرفر مثل طلب وجبة في مطعم؛ الجرسون يأخذ طلبك للمطبخ (Promise)، وأنت تكمل حديثك دون تجمد، ولما تجهز الوجبة يقدمها لك (Resolve) أو يعتذر لو نفدت (Reject).',
        explanationAr: `لغة JavaScript غير متزامنة (Asynchronous)، وهذا يعني أنها لا تجمد الصفحة أثناء انتظار تحميل البيانات من السيرفر:

رحلة الـ Promises والـ async/await:
1. الـ Promise هو كائن يمثل حالة العملية غير المتزامنة:
   - Pending: جاري جلب البيانات من السيرفر.
   - Fulfilled (Resolved): تم جلب البيانات بنجاح.
   - Rejected: حدث خطأ في الاتصال بالشبكة.
2. الـ async / await:
   - الطريقة الحديثة الأرقى التي تجعل الكود غير المتزامن يقرأ كأنه كود متزامن وبسيط مع استخدام try...catch لمعالجة الأخطاء.`,
        aiVideo: {
          title: 'رحلة جلب البيانات من الـ API والتعامل مع الـ Promises و async/await',
          duration: '5:20 دقيقة',
          badge: 'مونتاج شبكات واستجابات الخوادم',
          captionAr: 'شرح بصري متحرك لمراحل إرسال طلب Fetch للـ API واستقبال استجابة الـ JSON والتعامل مع حالات التحميل والخطأ بانسيابية.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/cuEtnrL9-H0',
          chapters: [
            { time: '0:00', title: 'مفهوم العمليات غير المتزامنة ومحرك Event Loop', desc: 'عدم تجميد واجهة المستخدم' },
            { time: '1:30', title: 'حالات الـ Promise الثلاث (Pending, Resolved, Rejected)', desc: 'دورة حياة الطلب' },
            { time: '2:50', title: 'كتابة دوال async/await واستخدام try/catch', desc: 'التعامل الاحترافي مع أخطاء الشبكة' },
            { time: '4:10', title: 'تحويل الاستجابة لـ JSON وتحديث واجهة React', desc: 'عرض البيانات فور وصولها' }
          ],
          visualNotes: [
            'تظهر إشارة مرور خضراء عند نجاح الـ 200 OK وإشارة حمراء عند 404 Not Found مع كود المعالجة.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'إنشاء دالة غير متزامنة بكلمة async',
            action: 'اكتب async function loadData() { ... } واستخدم try...catch.',
            explanation: 'يتيح استخدام كلمة await بداخلها لالتقاط الاستجابات بسهولة.',
            expectedResult: 'دالة مهيأة للتواصل مع الخوادم بأمان.'
          },
          {
            stepNumber: 2,
            title: 'إرسال طلب Fetch وتحويل الاستجابة لـ JSON',
            action: 'استخدم const res = await fetch(url); ثم const data = await res.json();',
            explanation: 'تحويل نص البيانات المشفر لمصفوفات وكائنات جافاسكريبت جاهزة للعرض.',
            expectedResult: 'بيانات حقيقية جاهزة للرسم في الشاشة.'
          }
        ],
        keyPoints: [
          'يجب دائماً إحاطة استدعاءات async/await بكتلة try...catch لحماية التطبيق من الانهيار.',
          'فحص response.ok ضروري لأن fetch لا يرمي خطأ إذا كانت الاستجابة 404 أو 500.',
          'كتلة finally تنفذ دائماً وتعتبر المكان المثالي لإيقاف مؤشر التحميل (Loading Spinner).'
        ],
        codeSnippets: [
          {
            title: 'دالة جلب بيانات احترافية مع إدارة التحميل والأخطاء',
            language: 'javascript',
            code: `async function fetchUsers() {
  const loading = document.getElementById('loading');
  try {
    loading.style.display = 'block';
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if (!response.ok) {
      throw new Error('فشل استجابة السيرفر: ' + response.status);
    }
    
    const users = await response.json();
    console.log("تم جلب المستخدمين بنجاح:", users);
  } catch (error) {
    console.error("حدث خطأ في الشبكة:", error);
  } finally {
    loading.style.display = 'none';
  }
}`,
            explanation: 'الهيكل القياسي للتعامل مع السيرفرات: Loading -> Fetch -> Check OK -> JSON -> Catch -> Finally.'
          }
        ],
        interviewQA: [
          {
            question: 'ما هو الفرق بين Promise.all و Promise.allSettled؟',
            answer: 'الـ Promise.all تفشل فوراً إذا فشل أي طلب واحد، بينما Promise.allSettled تنتظر اكتمال كل الطلبات وترجع تقريراً بحالة كل طلب على حدة سواء نجح أو فشل.'
          }
        ],
        proTip: 'استخدم دائماً finally لإيقاف مؤشرات التحميل لضمان عدم تعليق واجهة المستخدم.',
        commonMistake: 'نسيان كلمة await قبل response.json() مما ينتج عنه وعد معلق بدلاً من البيانات الحقيقية.'
      }
    ]
  },
  {
    id: 'mod-5-react-architecture',
    order: 5,
    title: 'الموديول الخامس: معمارية ريآكت الحديثة (React 19, Components & State Hooks)',
    titleEn: 'React 19 Architecture, Hooks & State Management',
    durationHours: 20,
    description: 'فهم Virtual DOM، هندسة المكونات المعيارية، خطافات الحالة والمؤثرات (useState, useEffect, useMemo)، وإدارة تدفق البيانات.',
    iconName: 'Atom',
    badge: 'معمارية التطبيقات الضخمة',
    isLocked: false,
    lessons: [
      {
        id: 'lesson-5-1',
        moduleId: 'mod-5-react-architecture',
        title: 'الدرس 1: فلسفة ريآكت، الـ Virtual DOM وبناء المكونات المعيارية (Components)',
        duration: '50 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'الـ Virtual DOM مثل المخطط الهندسي السريع للمبنى على الورق؛ لما تقرر تغيير لون نافذة، المهندس يجرب على الورق أولاً ويكتشف التعديل الدقيق في ثانية وينفذه هو فقط، بدلاً من هدم العمارة كلها وإعادة بنائها!',
        explanationAr: `لماذا تتربع React على عرش تطوير الواجهات عالمياً؟

1. مشكلة JavaScript التقليدية:
   عند تحديث عنصر واحد في الصفحة، كان المتصفح يعيد حساب كل شجرة الـ DOM مما يسبب بطء وثقل في التطبيقات الكبيرة.

2. حل React الثوري (Virtual DOM & Reconciliation):
   - تحتفظ React بنسخة خفيفة من الـ DOM في الذاكرة تسمى Virtual DOM.
   - عند تغيير البيانات تقارن الشجرة الجديدة بالقديمة بعملية سريعة تسمى Diffing Algorithm.
   - تقوم بتحديث العنصر المتغير فقط في الشاشة الحقيقية بأعلى سرعة ممكنة.

3. هندسة المكونات المعيارية (Component Architecture):
   تقسيم الصفحة لأجزاء صغيرة مستقلة وقابلة لإعادة الاستخدام (Components) مثل Button, Navbar, CourseCard.`,
        aiVideo: {
          title: 'ماستر كلاس React: فلسفة الـ Virtual DOM وبناء أول مكون معياري',
          duration: '6:15 دقيقة',
          badge: 'مونتاج هندسة وتفكيك المكونات',
          captionAr: 'شرح بصري متحرك لآلية عمل Virtual DOM وسرعة الـ Diffing Algorithm وطريقة تمرير الـ Props لبناء مكونات يعاد استخدامها في كل أنحاء الموقع.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/w7ejDZ8SWv8',
          chapters: [
            { time: '0:00', title: 'فلسفة ريآكت وثورة الـ Virtual DOM', desc: 'مقارنة الأداء مع الـ Real DOM' },
            { time: '1:45', title: 'كتابة مكونات JSX وتمرير الـ Props', desc: 'تدفق البيانات في اتجاه واحد' },
            { time: '3:30', title: 'استخدام React Fragment وتنسيقات Tailwind', desc: 'بناء واجهة بصرية عصرية' },
            { time: '5:00', title: 'إعادة استخدام المكون مع بيانات متعددة', desc: 'سرعة الإنتاج والتطوير' }
          ],
          visualNotes: [
            'تظهر شجرة الـ Virtual DOM باللون الأزرق المضيء مع وميض العناصر التي يتم تحديثها فقط.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'فهم كود الـ JSX وتمرير الخصائص (Props)',
            action: 'اكتب دالة ترجع واجهة JSX مع استقبال وتفكيك الـ Props الممررة إليها.',
            explanation: 'الـ Props تتدفق في اتجاه واحد من الأب إلى الابن وتكون للقراءة فقط.',
            expectedResult: 'مكون وظيفي React Component قابل لإعادة الاستخدام مع بيانات متعددة.'
          },
          {
            stepNumber: 2,
            title: 'استخدام الـ Fragment الفارغ <> </>',
            action: 'اجمع العناصر المجاورة داخل Fragment لمنع إضافة div زائد في الـ DOM.',
            explanation: 'يحافظ على نظافة الـ HTML وخفة شجرة العناصر.',
            expectedResult: 'مكون يرجع عناصر متعددة دون حاويات إضافية غير ضرورية.'
          }
        ],
        keyPoints: [
          'يجب أن يبدأ اسم أي مكون في React بحرف كبير (PascalCase) مثل <CourseCard />.',
          'الـ Props للقراءة فقط (Read-Only) ولا يجوز للابن تعديلها مباشرة.',
          'الـ JSX يدمج قوة JavaScript مع بساطة الـ HTML في ملف واحد.'
        ],
        codeSnippets: [
          {
            title: 'مكون بطاقة كورس معياري قابل لإعادة الاستخدام (Reusable Component)',
            language: 'tsx',
            code: `import React from 'react';

interface CourseCardProps {
  title: string;
  instructor: string;
  price: number;
  onEnroll: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ title, instructor, price, onEnroll }) => {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">المدرب: {instructor}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-emerald-400 font-bold">{price} ج.م</span>
        <button onClick={onEnroll} className="px-4 py-2 bg-cyan-500 rounded-xl font-bold text-slate-950">
          انضمام 
        </button>
      </div>
    </div>
  );
};`,
            explanation: 'مكون معياري يستقبل الخصائص ويعرضها بتنسيق Tailwind عصري.'
          }
        ],
        interviewQA: [
          {
            question: 'ما هو الـ Virtual DOM وكيف يعمل نظام الـ Diffing؟',
            answer: 'الـ Virtual DOM هو تمثيل شجري خفيف للواجهة الحقيقية في الذاكرة؛ عندما تتغير حالة المكون تقوم ريآكت بمقارنة الشجرة السابقة بالجديدة وتطبق التغييرات الفعلية فقط على الـ Real DOM بدقة فائقة.'
          }
        ],
        proTip: 'استخدم التفكيك (Destructuring) في معاملات المكون لكتابة كود أنظف وأسهل في القراءة.',
        commonMistake: 'تسمية المكون بحرف صغير مما يجعل ريآكت تعتبره تاج HTML عادي ولا تقوم بتشغيله.'
      },
      {
        id: 'lesson-5-2',
        moduleId: 'mod-5-react-architecture',
        title: 'الدرس 2: إدارة الحالة وتدفق البيانات (useState Mastery & React 19 State)',
        duration: '55 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'الـ State هي الذاكرة الحية للمكون؛ مثل لوحة النتائج في مباراة كرة القدم، كلما دخل هدف تتغير النتيجة في اللوحة تلقائياً دون الحاجة لبناء الملعب من جديد.',
        explanationAr: `الـ State (الحالة) هي البيانات الديناميكية التي تتغير بمرور الوقت داخل المكون (حقول الإدخال، عداد السلة، القوائم المفتوحة):

القواعد الذهبية للـ useState:
1. نقاء البيانات وعدم التعديل المباشر (Immutability): ممنوع تعديل الحالة مباشرة، ويجب دائماً استخدام دالة التحديث setCount(newValue).
2. التحديث المعتمد على الحالة السابقة: استخدم دالة callback مثل: setCount(prev => prev + 1).
3. إعادة الريندر (Re-rendering): عند استدعاء دالة التحديث، تعيد React تشغيل دالة المكون لتحديث الشاشة بالبيانات الجديدة.`,
        aiVideo: {
          title: 'إدارة الحالة في React: إتقان useState والتحديث التلقائي للشاشات',
          duration: '5:30 دقيقة',
          badge: 'مونتاج تفاعلي للـ State والـ Re-render',
          captionAr: 'محاكاة بصرية لكيفية تتبع React لتغيرات الحالة وإعادة رسم العناصر المتغيرة فقط في الشاشة مع تطبيق عملي لقوائم المهام.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/O6P86uwfdR0',
          chapters: [
            { time: '0:00', title: 'مفهوم الـ State ودورها في التطبيقات التفاعلية', desc: 'الفرق بين المتغير العادي والحالة' },
            { time: '1:30', title: 'استخدام خطاف useState ودالة التحديث', desc: 'قواعد التحديث السليم' },
            { time: '3:00', title: 'تحديث المصفوفات والكائنات بـ Spread Operator', desc: 'الحفاظ على نقاء البيانات' },
            { time: '4:30', title: 'تجنب الأخطاء الشائعة في الـ Re-render', desc: 'تحسين أداء الواجهة' }
          ],
          visualNotes: [
            'العداد الرقمي يرتفع على الشاشة مع إضاءة خضراء تبين دورة حياة التحديث.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'تعريف الحالة ودالة التحديث عبر تفكيك المصفوفة',
            action: 'اكتب const [count, setCount] = useState(0); داخل المكون.',
            explanation: 'القيمة الأولى هي المتغير الحاضر، والقيمة الثانية هي الدالة الحصرية لتغييره.',
            expectedResult: 'حالة ابتدائية بقيمة 0 جاهزة للتحديث.'
          },
          {
            stepNumber: 2,
            title: 'تحديث مصفوفة الحالة باستخدام الـ Spread Operator',
            action: 'استخدم setItems(prev => [...prev, newItem]) لإضافة عنصر جديد.',
            explanation: 'يحافظ على نقاء البيانات السابقة وينشئ مصفوفة جديدة تكتشفها React فوراً.',
            expectedResult: 'إضافة فورية للعنصر وتحديث شاشة المستخدم.'
          }
        ],
        keyPoints: [
          'يجب استدعاء الخطافات (Hooks) في المستوى الأعلى للمكون فقط وليس داخل شروط if أو حلقات for.',
          'استخدم الـ Spread Operator (...) عند تحديث الكائنات والمصفوفات.',
          'كل مكون يمتلك حالته المستقلة الخاصة به حتى لو تكرر المكون في الصفحة.'
        ],
        codeSnippets: [
          {
            title: 'تطبيق إدارة قائمة مهام وتدريبات بـ useState',
            language: 'tsx',
            code: `import React, { useState } from 'react';

export const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>(['تطبيق درس Flexbox']);
  const [input, setInput] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks(prev => [...prev, input]);
    setInput('');
  };

  return (
    <div className="p-6 bg-slate-900 rounded-2xl max-w-sm mx-auto">
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="مهمة جديدة..."
          className="flex-1 p-2 bg-slate-800 rounded-lg text-white"
        />
        <button className="px-4 py-2 bg-cyan-500 rounded-lg font-bold">إضافة</button>
      </form>
      <ul>
        {tasks.map((task, i) => (
          <li key={i} className="p-2 bg-slate-800 rounded-lg mb-2 text-white"> {task}</li>
        ))}
      </ul>
    </div>
  );
};`,
            explanation: 'يوضح إدارة الحالة النصية والمصفوفات وتحديث واجهة المستخدم تلقائياً.'
          }
        ],
        interviewQA: [
          {
            question: 'لماذا لا يجوز تعديل الـ State مباشرة في React مثل state.name = "Ali"؟',
            answer: 'لأن React تقارن مراجع الكائنات في الذاكرة لتكتشف التغيير؛ إذا عدلت الكائن مباشرة فلن تكتشف React التغيير ولن تقوم بإعادة الريندر فتبقى الشاشة متجمدة.'
          }
        ],
        proTip: 'قسم حالتك لحالات صغيرة مستقلة بدلاً من وضع كل بيانات الصفحة في كائن عملاق واحد.',
        commonMistake: 'استدعاء دالة التحديث داخل الـ JSX مباشرة مثل onClick={setCount(count + 1)} بدلاً من تمرير دالة () => setCount(count + 1).'
      },
      {
        id: 'lesson-5-3',
        moduleId: 'mod-5-react-architecture',
        title: 'الدرس 3: الآثار الجانبية ودورة حياة المكون (useEffect & Data Fetching)',
        duration: '60 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'الـ useEffect مثل خدمة الاستقبال في الفندق؛ أول ما يصل النزيل (Mount) يجهز الغرفة، وطول إقامته يغير الإعدادات حسب رغبته (Update)، ولما يغادر (Unmount) ينظف الغرفة ويطفئ الأنوار لتوفير الطاقة.',
        explanationAr: `الـ Side Effects (الآثار الجانبية) هي أي عملية تخرج عن نطاق رسم الـ JSX مثل طلبات السيرفر، ضبط المؤقتات، والاشتراك في قواعد البيانات:

مصفوفة الاعتماديات (Dependency Array):
1. useEffect(() => {}, []): يعمل مرة واحدة فقط عند تحميل المكون أول مرة (Mount).
2. useEffect(() => {}, [searchQuery]): يعمل عند التحميل ويعاد تشغيله فقط إذا تغيرت قيمة searchQuery.
3. دالة التنظيف (Cleanup): إرجاع دالة return () => { clearInterval(timer); } تعمل عند مغادرة الصفحة لمنع تسريب الذاكرة.`,
        aiVideo: {
          title: 'ماستر كلاس useEffect: دورة حياة المكون وجلب البيانات باحترافية',
          duration: '6:30 دقيقة',
          badge: 'مونتاج دورة حياة المكون والذاكرة',
          captionAr: 'شرح بصري لمراحل Mount و Update و Unmount ومصفوفة الاعتماديات وكيفية تنظيف الاشتراكات والمؤقتات لمنع تسريب الذاكرة.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/Ul3y1LXxzdU',
          chapters: [
            { time: '0:00', title: 'فهم الآثار الجانبية ودورة حياة المكون', desc: 'مراحل التحميل والمغادرة' },
            { time: '2:00', title: 'مصفوفة الاعتماديات [] والتحكم في مرات التشغيل', desc: 'تجنب الحلقات اللانهائية' },
            { time: '3:45', title: 'جلب البيانات من الـ API وتحديث الـ State', desc: 'عرض البيانات بكفاءة' },
            { time: '5:15', title: 'كتابة دالة التنظيف Cleanup Function', desc: 'حماية موارد المتصفح والذاكرة' }
          ],
          visualNotes: [
            'الرسم يوضح بالألوان دورة حياة المكون وموعد إطلاق دالة التنظيف عند إغلاق النافذة.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'استدعاء useEffect مع مصفوفة اعتماديات فارغة []',
            action: 'اكتب useEffect لجلب بيانات الكورسات عند فتح الصفحة لأول مرة.',
            explanation: 'يضمن تنفيذ الطلب مرة واحدة دون تكرار إجهاد السيرفر.',
            expectedResult: 'تحميل البيانات وتخزينها في الـ State تلقائياً.'
          },
          {
            stepNumber: 2,
            title: 'إضافة دالة تنظيف للمؤقتات أو الاشتراكات',
            action: 'أرجع دالة cleanup لإيقاف الـ listener عند إغلاق المكون.',
            explanation: 'يحمي التطبيق من استهلاك الذاكرة في الخلفية.',
            expectedResult: 'تطبيق مستقر وخالٍ من تسريب الذاكرة.'
          }
        ],
        keyPoints: [
          'عدم وضع مصفوفة الاعتماديات إطلاقاً يجعل useEffect يعمل مع كل ريندر مسبباً بطء شديد.',
          'دالة التنظيف (Cleanup) ضرورية لإلغاء طلبات الشبكة والمؤقتات واشتراكات البيانات الحية.',
          'في وضع التطوير (Strict Mode) يعمل useEffect مرتين للتأكد من كتابة دالة التنظيف بشكل سليم.'
        ],
        codeSnippets: [
          {
            title: 'مكون جلب وعرض البيانات مع مؤشر التحميل والتنظيف',
            language: 'tsx',
            code: `import React, { useState, useEffect } from 'react';

export const LiveUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setUsers(data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div className="text-cyan-400 p-4">⏳ جاري التحميل...</div>;

  return (
    <ul className="p-4 bg-slate-900 rounded-2xl">
      {users.map(u => (
        <li key={u.id} className="p-2 border-b border-slate-800 text-white"> {u.name}</li>
      ))}
    </ul>
  );
};`,
            explanation: 'استخدام قياسي للـ useEffect لجلب البيانات مع معالجة حالة التحميل والتنظيف.'
          }
        ],
        interviewQA: [
          {
            question: 'ماذا يحدث إذا نسيت كتابة مصفوفة الاعتماديات [] في useEffect؟',
            answer: 'سيتم تنفيذ الـ useEffect بعد كل عملية ريندر للمكون، وإذا كان بداخلها دالة تحدث الـ State فسينتج حلقة لا نهائية (Infinite Loop) تسبب انهيار المتصفح.'
          }
        ],
        proTip: 'لا تجعل دالة useEffect الرئيسية async، بل عرف دالة async منفصلة بداخلها واستدعها.',
        commonMistake: 'نسيان المتغيرات المستخدمة داخل useEffect وعدم إضافتها لمصفوفة الاعتماديات.'
      }
    ]
  },
  {
    id: 'mod-6-ts-tailwind',
    order: 6,
    title: 'الموديول السادس: التميز الهندسي (TypeScript & Tailwind CSS Mastery)',
    titleEn: 'TypeScript Type Safety & Modern Tailwind CSS Architecture',
    durationHours: 14,
    description: 'تحصين الكود ومنع أخطاء وقت التشغيل بأنظمة الأنواع الصارمة في TypeScript، وبناء واجهات عصرية فائقة السرعة بـ Tailwind CSS.',
    iconName: 'ShieldCheck',
    badge: 'معايير الشركات الكبرى',
    isLocked: false,
    lessons: [
      {
        id: 'lesson-6-1',
        moduleId: 'mod-6-ts-tailwind',
        title: 'الدرس 1: تايب سكريبت - حماية التطبيقات ومنع أخطاء undefined',
        duration: '50 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'لغة JavaScript مثل القيادة في الضباب بدون حزام أمان، بينما TypeScript هي رادار متطور يرسم لك الطريق ويكتشف الحفر قبل أن تتحرك خطوة واحدة.',
        explanationAr: `تعتمد أكبر الشركات العالمية على TypeScript لتأمين مشاريعها:

مزايا TypeScript الجوهرية:
1. اكتشاف الأخطاء أثناء كتابة الكود (Compile-Time Checking) قبل تشغيل التطبيق.
2. إكمال تلقائي ذكي وتوثيق ذاتي لكل الخصائص والدوال (IntelliSense).
3. بناء الـ Interfaces و Union Types لحصر الخيارات المعتمدة ومنع الأخطاء الإملائية.`,
        aiVideo: {
          title: 'ماستر كلاس TypeScript: حصن مشاريعك واقضِ على أخطاء الـ Runtime',
          duration: '5:50 دقيقة',
          badge: 'مونتاج فحص الأنواع الصارمة',
          captionAr: 'استعراض بصري لقوة الـ Type Safety والإكمال التلقائي الذكي IntelliSense وبناء الـ Interfaces والـ Generics في مشاريع React.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/RGOj5yH7evk',
          chapters: [
            { time: '0:00', title: 'لماذا نحتاج TypeScript في المشاريع الكبرى؟', desc: 'حماية التطبيق من أخطاء undefined' },
            { time: '1:30', title: 'تعريف الأنواع الأساسية والـ Type Inference', desc: 'اكتشاف الأخطاء فور كتابتها' },
            { time: '3:15', title: 'بناء الـ Interfaces والـ Union Types', desc: 'توحيد هيكل البيانات' },
            { time: '4:40', title: 'استخدام TypeScript مع مكونات React والـ Props', desc: 'تأمين معاملات المكونات' }
          ],
          visualNotes: [
            'الخطوط الحمراء التحذيرية تظهر وتختفي فور كتابة النوع السليم للـ Props.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'تعريف الأنواع الصارمة للمتغيرات والدوال',
            action: 'أضف الأنواع للمعاملات مثل function add(a: number, b: number): number',
            explanation: 'يمنع تمرير نصوص أو كائنات بالخطأ لهذه الدالة.',
            expectedResult: 'تأمين كامل للدوال من الأخطاء الحسابية.'
          },
          {
            stepNumber: 2,
            title: 'بناء Interface شامل لبيانات المتدربين والمسارات',
            action: 'عرف interface Trainee مع علامة ? للخصائص الاختيارية.',
            explanation: 'توحيد شكل البيانات بين الفرونت إند والباك إند بدقة متناهية.',
            expectedResult: 'اقتراحات إكمال تلقائي دقيقة في كل ملفات المشروع.'
          }
        ],
        keyPoints: [
          'الـ TypeScript هي طبقة أمان تفحص الكود قبل تحويله إلى جافاسكريبت عادية تفهمها المتصفحات.',
          'استخدم Union Types لحصر الخيارات مثل type Role = "student" | "teacher" | "admin".',
          'تجنب استخدام any لأنه يلغي كل فوائد تايب سكريبت.'
        ],
        codeSnippets: [
          {
            title: 'تعريف الأنواع والـ Interfaces والـ Generics في TypeScript',
            language: 'typescript',
            code: `type UserRole = 'student' | 'teacher' | 'admin';

interface Trainee {
  readonly id: string;
  name: string;
  role: UserRole;
  enrolledTracks: string[];
  gpa?: number;
}

function getAccessLevel(trainee: Trainee): string {
  if (trainee.role === 'admin') return 'تحكم كامل بالنظام';
  return 'متدرب مسجل في ' + trainee.enrolledTracks.length + ' مسارات';
}`,
            explanation: 'يوضح الاستخدام الاحترافي للـ Types و Interfaces والخصائص الاختيارية.'
          }
        ],
        interviewQA: [
          {
            question: 'ما الفرق بين interface و type في TypeScript؟',
            answer: 'كلاهما يحدد هياكل البيانات، لكن interface يدعم التوسيع والوراثة ومثالي لكائنات ومكونات React، بينما type أقوى في الـ Unions والـ Primitives والعمليات المنطقية.'
          }
        ],
        proTip: 'استخدم Nullish Coalescing (??) بدلاً من (||) عند التعامل مع الأرقام حتى لا يعتبر الصفر قيمة غير موجودة.',
        commonMistake: 'استخدام type: any عند مواجهة أي خطأ بدلاً من تحديد النوع الحقيقي بدقة.'
      },
      {
        id: 'lesson-6-2',
        moduleId: 'mod-6-ts-tailwind',
        title: 'الدرس 2: ثورة Tailwind CSS - بناء واجهات عصرية فائقة السرعة بـ Utility Classes',
        duration: '50 دقيقة',
        type: 'theory_practice',
        realWorldAnalogy: 'الـ CSS التقليدي مثل تفصيل بدلة من الصفر كل مرة؛ بينما Tailwind مثل مكعبات LEGO جاهزة بمقاسات دقيقة، تركبها معاً لتبني قلعة واجهات عصرية في دقائق.',
        explanationAr: `أصبحت Tailwind CSS المعيار الفعلي لتصميم الواجهات الحديثة:

مزايا Tailwind الأساسية:
1. كلاسات وظيفية مباشرة مثل flex, p-4, rounded-xl تنهي حيرة تسمية الكلاسات.
2. تصميم متجاوب بديهي بنظام Mobile-First (مثل md:grid-cols-3).
3. دعم الوضع الليلي بإضافة dark:bg-slate-900.
4. حجم ملف نهائي فائق الصغر بحذف كل الكلاسات غير المستخدمة تلقائياً.`,
        aiVideo: {
          title: 'ماستر كلاس Tailwind CSS: سرعة التطوير والتصميم المتجاوب مع Dark Mode',
          duration: '5:40 دقيقة',
          badge: 'مونتاج واجهات وتجاوب سريع',
          captionAr: 'شرح بصري لكيفية تركيب كلاسات Tailwind لبناء بطاقات إحصائيات وقوائم متجاوبة مع تفعيل الوضع الليلي وتخصيص الألوان.',
          embedUrl: 'https://www.youtube-nocookie.com/embed/22R_m7V6k7E',
          chapters: [
            { time: '0:00', title: 'فلسفة الـ Utility-First والتخلص من تضخم ملفات CSS', desc: 'سرعة بناء الواجهات' },
            { time: '1:30', title: 'شبكة المقاسات والألوان والتجاوب مع الموبايل', desc: 'Mobile-First Design' },
            { time: '3:10', title: 'إضافة تأثيرات التمرير Hover والوضع الليلي Dark Mode', desc: 'واجهات تفاعلية أنيقة' },
            { time: '4:30', title: 'تصدير الكود وبناء إنتاجي فائق الخفة والصغر', desc: 'أعلى سرعة تحميل' }
          ],
          visualNotes: [
            'التبديل الفوري بين الوضع الفاتح والداكن يوضح مرونة كلاسات dark:bg-slate-900.'
          ]
        },
        steps: [
          {
            stepNumber: 1,
            title: 'فهم نمط الكلاسات الوظيفية والمقاسات',
            action: 'استخدم p-4 للمسافات الداخلية، bg-slate-900 للخلفية، و text-cyan-400 للون.',
            explanation: 'مقاسات Tailwind تعتمد شبكة 4px قياسية (p-4 تعني 16px).',
            expectedResult: 'تنسيق منضبط ومتناسق الأبعاد.'
          },
          {
            stepNumber: 2,
            title: 'بناء شبكة متجاوبة للموبايل والكمبيوتر',
            action: 'اكتب grid grid-cols-1 md:grid-cols-3 gap-4 للبطاقات.',
            explanation: 'عمود واحد في الموبايل، و 3 أعمدة تلقائياً في الشاشات الكبيرة.',
            expectedResult: 'تجاوب فوري بدون كتابة أي أسطر CSS إضافية.'
          }
        ],
        keyPoints: [
          'تصميم Tailwind يعتمد فلسفة Mobile-First؛ الكلاس الأساسي يطبق على الموبايل والبادئات على الشاشات الأكبر.',
          'استخدام القيم المخصصة مثل h-[500px] متاح عند الحاجة لمقاسات خاصة.',
          'الدمج بين Tailwind وأيقونات Lucide يعطي واجهات مستخدم بمستوى عالمي.'
        ],
        codeSnippets: [
          {
            title: 'بطاقة إحصائيات متجاوبة بالكامل في Tailwind',
            language: 'tsx',
            code: `<div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl hover:border-cyan-500/50 transition-all">
  <div className="flex items-center justify-between">
    <div>
      <span className="text-xs font-bold text-cyan-400">معدل الإنجاز</span>
      <h3 className="text-3xl font-black text-white font-mono mt-1">94.8%</h3>
    </div>
    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
      
    </div>
  </div>
  <div className="mt-4 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
    <div className="h-full bg-cyan-500 rounded-full w-[94%]" />
  </div>
</div>`,
            explanation: 'يوضح قوة وتناسق كلاسات Tailwind في بناء البطاقات الحديثة في أسطر معدودة.'
          }
        ],
        interviewQA: [
          {
            question: 'لماذا تفضل الشركات Tailwind CSS على كتابة كلاسات CSS عادية؟',
            answer: 'لأن Tailwind تضمن اتساق التصميم عبر لوحة ألوان ومسافات موحدة، وتمنع تضخم ملفات الـ CSS مع نمو المشروع، وتوفر سرعة تطوير استثنائية دون التنقل بين الملفات.'
          }
        ],
        proTip: 'استخدم إضافة Tailwind CSS IntelliSense في VS Code للحصول على الإكمال التلقائي ومعاينة الألوان فورياً.',
        commonMistake: 'تكرار نفس مجموعات الكلاسات الطويلة يدوياً في كل مكان بدلاً من استخراجها في Component في React.'
      }
    ]
  }
];
