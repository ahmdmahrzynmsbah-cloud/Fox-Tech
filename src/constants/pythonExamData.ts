export interface PythonExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
  explanation: string;
}

export interface PythonExam {
  id: string;
  title: string;
  description: string;
  courseId: string;
  timeLimit: number; // in minutes
  maxAttempts: number; // set to 1 as requested
  isHidden: boolean;
  isComprehensive: boolean;
  questions: PythonExamQuestion[];
}

export const PYTHON_FUNDAMENTALS_FRONTEND_EXAM: PythonExam = {
  id: 'python-fundamentals-frontend-exam',
  title: 'اختبار أساسيات لغة بايثون المتقدم (مسار الواجهات الأمامية - Python Fundamentals)',
  description: 'اختبار احترافي معتمد من 20 سؤالاً تقنياً يغطي أساسيات وبنيات لغة بايثون وتكاملها البرمجي مع المسارات التقنية. (محاولة واحدة مسموحة فقط - Maximum 1 Attempt).',
  courseId: 'frontend-track-pro',
  timeLimit: 30,
  maxAttempts: 1, // محاولة واحدة فقط كما طلب المستخدم
  isHidden: false,
  isComprehensive: true,
  questions: [
    {
      id: 'py_q_1',
      text: 'ما هو الناتج المتوقع لتنفيذ الكود التالي في بايثون: print(type(5 / 2))؟',
      options: [
        '<class \'int\'>',
        '<class \'float\'>',
        '<class \'str\'>',
        '<class \'double\'>'
      ],
      correctOptionIndex: 1,
      points: 5,
      explanation: 'في بايثون 3، معامل القسمة العادية (/) يُرجع دائماً قيمة من نوع Float حتى لو كانت الأرقام صحيحة تماماً، بينما القسمة الصحيحة (//) تُرجع Int.'
    },
    {
      id: 'py_q_2',
      text: 'أي من الكلمات المفتاحية التالية تُستخدم لتعريف دالة (Function) في لغة بايثون؟',
      options: ['func', 'define', 'def', 'function'],
      correctOptionIndex: 2,
      points: 5,
      explanation: 'يتم تعريف الدوال في بايثون حصرياً باستخدام الكلمة المفتاحية def متبوعة باسم الدالة والقوسين ().'
    },
    {
      id: 'py_q_3',
      text: 'ما هو نوع البيانات الناتج عن التعبير التالي: x = [1, 2, "Python", True]؟',
      options: ['Tuple', 'List', 'Dictionary', 'Set'],
      correctOptionIndex: 1,
      points: 5,
      explanation: 'الأقواس المربعة [] تُستخدم لإنشاء قوائم List في بايثون وهي هياكل بيانات مرتبطة وقابلة للتعديل.'
    },
    {
      id: 'py_q_4',
      text: 'كيف يمكنك إضافة عنصر جديد إلى نهاية القائمة my_list = [1, 2, 3]؟',
      options: [
        'my_list.add(4)',
        'my_list.append(4)',
        'my_list.insert(4)',
        'my_list.push(4)'
      ],
      correctOptionIndex: 1,
      points: 5,
      explanation: 'الدالة append() في بايثون تُستخدم لإضافة عنصر جديد إلى نهاية القائمة الأصلية.'
    },
    {
      id: 'py_q_5',
      text: 'أي مما يلي يُعد الفرق الأساسي بين القائمة (List) والـ Tuple في بايثون؟',
      options: [
        'Tuple أسرع ولكنها غير قابلة للتعديل (Immutable)',
        'List غير مرتبة تماماً',
        'لا يوجد أي فرق جوهري بينهما',
        'Tuple تقبل نوع بيانات واحد فقط'
      ],
      correctOptionIndex: 0,
      points: 5,
      explanation: 'Tuples تُعرف بالأقواس الدائرية () ولا يمكن تعديل محتوياتها بعد إنشائها (Immutable)، مما يمنحها سرعة وأماناً أعلى في الذاكرة.'
    },
    {
      id: 'py_q_6',
      text: 'ما هو الناتج المتوقع للتعبير المنطقي: print(10 > 5 and 5 > 20)؟',
      options: ['True', 'False', 'None', 'Error'],
      correctOptionIndex: 1,
      points: 5,
      explanation: 'معامل and يتطلب صحة الطرفين. وبما أن 5 > 20 خاطئة (False)، تكون النتيجة النهائية False.'
    },
    {
      id: 'py_q_7',
      text: 'كيف يتم كتابة تعليق (Comment) لسطر واحد في كود بايثون؟',
      options: ['// تعليق', '/* تعليق */', '# تعليق', '<!-- تعليق -->'],
      correctOptionIndex: 2,
      points: 5,
      explanation: 'تبدأ تعليقات الأسطر في بايثون دائماً برمز الهاش (#).'
    },
    {
      id: 'py_q_8',
      text: 'ما هي الطريقة الصحيحة للتعامل مع الاستثناءات (Exception Handling) في بايثون؟',
      options: [
        'try...catch',
        'try...except',
        'attempt...recover',
        'error...handle'
      ],
      correctOptionIndex: 1,
      points: 5,
      explanation: 'تستخدم بايثون كتلة try و except لالتقاط ومعالجة الأخطاء الاستثنائية أثناء وقت التشغيل (Runtime).'
    },
    {
      id: 'py_q_9',
      text: 'ما هو ناتج التعبير التالي: print("Hello" * 3) في بايثون؟',
      options: [
        'Hello3',
        'Hello Hello Hello',
        'HelloHelloHello',
        'حدث خطأ تشغيلي'
      ],
      correctOptionIndex: 2,
      points: 5,
      explanation: 'معامل الضرب (*) مع النصوص (Strings) في بايثون يكرر السلسلة النصية بالعدد المحدد دون مسافات إضافية.'
    },
    {
      id: 'py_q_10',
      text: 'أي من هياكل البيانات التالية يخزن العناصر على هيئة أزواج (مفتاح وقيمة - Key-Value Pairs)؟',
      options: ['List', 'Tuple', 'Dictionary', 'Set'],
      correctOptionIndex: 2,
      points: 5,
      explanation: 'القواميس (Dictionaries) تخزن البيانات باستخدام مفاتيح فريدة ترتبط بقيم محددة داخل أقواس معقوفة {key: value}.'
    },
    {
      id: 'py_q_11',
      text: 'ماذا تفعل حلقة التكرار for i in range(1, 5):؟',
      options: [
        'تطرق الأرقام من 1 إلى 5 شاملة 5',
        'تطرق الأرقام من 1 إلى 4 وتتوقف عند 5 غير شاملة',
        'تطرق الأرقام من 0 إلى 4',
        'تكرار 5 مرات ثابتة'
      ],
      correctOptionIndex: 1,
      points: 5,
      explanation: 'دالة range(start, stop) تتوقف قبل الوصول للرقم stop، لذا تمر عبر 1 و 2 و 3 و 4 فقط.'
    },
    {
      id: 'py_q_12',
      text: 'كيف تقوم باستيراد وحدة أو مكتبة برمجية كاملة مثل math في بايثون؟',
      options: ['include math', 'import math', 'require math', 'using math'],
      correctOptionIndex: 1,
      points: 5,
      explanation: 'الكلمة المفتاحية import تُستخدم لاستيراد وحدات ومكتبات بايثون المدمجة أو الخارجية.'
    },
    {
      id: 'py_q_13',
      text: 'ما هو ناتج التعبير الرياضي لرفع الأسس: print(2 ** 3) في بايثون؟',
      options: ['6', '8', '9', '23'],
      correctOptionIndex: 1,
      points: 5,
      explanation: 'المعامل ** يمثل عملية الأسس (Exponentiation)، وبالتالي 2 مرفوعة للأس 3 تساوي 8.'
    },
    {
      id: 'py_q_14',
      text: 'ماذا يقصد بمصطلح "Dynamic Typing" في لغة بايثون؟',
      options: [
        'أن أنواع البيانات تُحدد وقت التشغيل ولا داعي لتصريح نوع المتغير صراحة',
        'أن الكود يتغير تلقائياً أثناء الكتابة',
        'أن لغة بايثون سريعة جداً في المعالجة',
        'أن المتغيرات ثابتة لا يمكن تعديلها'
      ],
      correctOptionIndex: 0,
      points: 5,
      explanation: 'بايثون لغة ذات كتابة ديناميكية، حيث يستنتج المفسر نوع المتغير تلقائياً من القيمة المسندة إليه وقت التنفيذ.'
    },
    {
      id: 'py_q_15',
      text: 'أي من الدوال التالية تُستخدم لتحويل النص بالكامل إلى حروف صغيرة (Lowercase)؟',
      options: ['text.lower()', 'text.toLowerCase()', 'text.to_lower()', 'text.down()'],
      correctOptionIndex: 0,
      points: 5,
      explanation: 'الدالة المدمجة lower() في نصوص بايثون تحول جميع الحروف الكبيرة إلى صغيرة.'
    },
    {
      id: 'py_q_16',
      text: 'ما هي الدالة المستخدمة لمعرفة عدد العناصر (طول القائمة أو النص) في بايثون؟',
      options: ['size()', 'length()', 'len()', 'count()'],
      correctOptionIndex: 2,
      points: 5,
      explanation: 'الدالة len() تُرجع عدد العناصر الموجودة داخل القوائم والنصوص والقواميس والمجموعات.'
    },
    {
      id: 'py_q_17',
      text: 'كيف يتم كتابة دالة مجهولة سريعة ومختصرة (Anonymous Function) في بايثون؟',
      options: [
        'lambda x: x + 1',
        'def(x): x + 1',
        'anon x: x + 1',
        'func(x) => x + 1'
      ],
      correctOptionIndex: 0,
      points: 5,
      explanation: 'دوال lambda تستخدم لإنشاء دوال سريعة بدون اسم وبسطر برمجي واحد.'
    },
    {
      id: 'py_q_18',
      text: 'ما هو الناتج المتوقع لتنفيذ: print(bool("Hello"))؟',
      options: ['True', 'False', 'None', 'Error'],
      correctOptionIndex: 0,
      points: 5,
      explanation: 'السلاسل النصية غير الفارغة في بايثون تُعتبر دائمًا True عند تقييمها بوليانياً (Truthy values).'
    },
    {
      id: 'py_q_19',
      text: 'كيف يمكنك حذف عنصر من القائمة باستخدام الفهرس (Index) في بايثون؟',
      options: [
        'my_list.delete(0)',
        'del my_list[0]',
        'my_list.remove(0)',
        'erase my_list[0]'
      ],
      correctOptionIndex: 1,
      points: 5,
      explanation: 'الكلمة المفتاحية del متبوعة بفهرس القائمة تستخدم لحذف العناصر بدقة.'
    },
    {
      id: 'py_q_20',
      text: 'ما هو الدور الرئيسي لاستخدام الدالة __init__ داخل الكلاسات في بايثون (OOP)؟',
      options: [
        'إنهاء عمل البرنامج وإغلاقه',
        'دالة البناء (Constructor) لتهيئة خصائص الكائن الجديد عند إنشائه',
        'طباعة بيانات الكائن على الشاشة تلقائياً',
        'تدمير الكائن وتحرير الذاكرة'
      ],
      correctOptionIndex: 1,
      points: 5,
      explanation: 'الدالة الخاصة __init__ هي دالة البناء (Constructor) التي تُنفذ تلقائياً عند إنشاء كائن جديد من الفئة (Class) لتهيئة خصائصه.'
    }
  ]
};
