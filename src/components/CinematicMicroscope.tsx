import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Layers, 
  Activity, 
  Sparkles, 
  Sliders, 
  Play, 
  Pause, 
  Crosshair, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Dna,
  ShieldAlert,
  HelpCircle,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { sound } from '../utils/audio';

export type MicroscopeMode = 'fluorescence' | 'phase-contrast' | 'brightfield';

export interface MicroscopeSpecimen {
  id: string;
  name: string;
  organ: string;
  scientificName: string;
  color: string;
  healthy: {
    title: string;
    description: string;
    membraneIntegrity: number; // percentage
    atpProduction: number; // pmol/min
    oxidativeStress: number; // index 0-100
    receptorActivity: string;
    tags: string[];
  };
  pathology: {
    title: string;
    description: string;
    membraneIntegrity: number;
    atpProduction: number;
    oxidativeStress: number;
    receptorActivity: string;
    tags: string[];
  };
}

export const SPECIMENS: MicroscopeSpecimen[] = [
  {
    id: 'diabetes',
    name: 'مرض السكري ومقاومة الأنسولين',
    organ: 'البنكرياس وخلايا بيتا ومستقبلات GLUT-4',
    scientificName: 'Insulin Resistance & Glucotoxicity',
    color: '#06b6d4',
    healthy: {
      title: 'خلايا نشطة مع مستقبلات GLUT-4 طبيعية',
      description: 'يرتبط الأنسولين بسلاسة بمستقبلات الغشاء الخلوي، فتفتح قنوات الجلوكوز لتغذية الميتوكوندريا وتوليد الطاقة (ATP) دون أي إجهاد تأكسدي.',
      membraneIntegrity: 98,
      atpProduction: 420,
      oxidativeStress: 12,
      receptorActivity: 'ارتباط فعال بنسبة 99%',
      tags: ['مستقبلات نشطة', 'تدفق سلس للجلوكوز', 'طاقة خلوية مثالية']
    },
    pathology: {
      title: 'مقاومة الأنسولين وتراكم سمية الجلوكوز',
      description: 'تتبلد مستقبلات الأنسولين وتغلق بوابات الدخول؛ تتراكم بلورات الجلوكوز الحرة خارج الخلية وتتأكسد مشكلة جذوراً حرة تفتك بجدار الخلية وتجوع العضيات.',
      membraneIntegrity: 46,
      atpProduction: 110,
      oxidativeStress: 88,
      receptorActivity: 'تبلد وانسداد بنسبة 74%',
      tags: ['سمية الجلوكوز', 'جذور حرة (ROS)', 'خلل إفراز بيتا']
    }
  },
  {
    id: 'hypertension',
    name: 'تصلب الشرايين وارتفاع ضغط الدم',
    organ: 'البطانة الوعائية التاجية (Endothelium)',
    scientificName: 'Vascular Endothelial Shear & Plaque',
    color: '#f43f5e',
    healthy: {
      title: 'بطانة وعائية مرنة وتدفق صفائحي ناعم',
      description: 'تفرز خلايا البطانة أكسيد النيتريك (NO) بانتظام لترخية العضلات الملساء؛ تتدفق كريات الدم الحمراء بانسيابية لزجة دون أي خدش للجدار.',
      membraneIntegrity: 96,
      atpProduction: 380,
      oxidativeStress: 15,
      receptorActivity: 'إفراز غاز NO طبيعي ومرونة 95%',
      tags: ['مرونة وعائية', 'تدفق هادئ', 'أكسيد النيتريك']
    },
    pathology: {
      title: 'تمزق البطانة وتصلب الألياف وتراكم الكولسترول',
      description: 'قوة القص العالية تسبب شروخاً مجهرية بالبطانة الوعائية، فتهاجمها صفائح الدم وتترسب كريات الكولسترول المؤكسد مشكلة لويحات ضخمة تصدم كريات الدم.',
      membraneIntegrity: 38,
      atpProduction: 140,
      oxidativeStress: 92,
      receptorActivity: 'انعدام المرونة وتكلس الألياف',
      tags: ['لويحات الكولسترول', 'تمزقات ميكروسكوبية', 'اضطراب الجريان']
    }
  },
  {
    id: 'anemia',
    name: 'الأنيميا وتكسر كريات الدم الحمراء',
    organ: 'الشعيرات الدموية وخلايا الدم (Erythrocytes)',
    scientificName: 'Erythrocyte Hemolysis & Sickle Distortion',
    color: '#ef4444',
    healthy: {
      title: 'كريات مقعرة الوجهين مشبعة بالهيموجلوبين',
      description: 'خلايا دم حمراء مرنة ومطاطة تعبر أضيق الشعيرات دون تمزق؛ غنية بسلاسل الهيموجلوبين النشطة المرتبطة بجزيئات الأكسجين.',
      membraneIntegrity: 99,
      atpProduction: 310,
      oxidativeStress: 10,
      receptorActivity: 'تشبع أوكسيجيني كامل 99%',
      tags: ['أقراص مقعرة', 'تشبع أكسجين', 'مرونة شعرية']
    },
    pathology: {
      title: 'تشوه منجلي وتكسر دموي (Hemolysis)',
      description: 'تتبلمر ألياف الهيموجلوبين المشوه فتمد الخلية لتصبح منجلية هشة حادة؛ تتصادم وتغلق الشعيرات الدقيقة وتنفجر محررة الهيموجلوبين الحر السام.',
      membraneIntegrity: 32,
      atpProduction: 75,
      oxidativeStress: 94,
      receptorActivity: 'فقدان حاد للأكسجين وتكسر خلوي',
      tags: ['خلايا منجلية حادة', 'تخثر وانسداد', 'انفجار الغشاء']
    }
  },
  {
    id: 'obesity',
    name: 'تضخم الخلايا الدهنية والالتهاب الحشوي',
    organ: 'النسيج الدهني الحشوي (Adipose Matrix)',
    scientificName: 'Adipocyte Hypertrophy & Macrophage Crown',
    color: '#eab308',
    healthy: {
      title: 'خلايا شحمية مرنة ومروية شعرية متوازنة',
      description: 'حجم خلوي متناسق يخزن الدهون الثلاثية باعتدال؛ محاطة بشبكة شعيرات تغذيها بالأكسجين وتفرز هرمون الأديبونيكتين المضاد للالتهاب.',
      membraneIntegrity: 94,
      atpProduction: 340,
      oxidativeStress: 18,
      receptorActivity: 'حساسية لبتين طبيعية 92%',
      tags: ['حجم متوازن', 'تروية دموية كافية', 'أديبونيكتين واقٍ']
    },
    pathology: {
      title: 'تضخم مميت واختناق نسيجي وهجوم بلعمي',
      description: 'تتضخم الخلية الشحمية لأربعة أضعاف حجمها فتنقطع عنها التروية الدموية، مسببة موتاً نسيجياً (Hypoxia) تلتف حوله الخلايا البلعمية لتكوين تيجان التهابية تفرز سيتوكينات حارقة.',
      membraneIntegrity: 41,
      atpProduction: 95,
      oxidativeStress: 85,
      receptorActivity: 'مقاومة اللبتين وسيتوكينات التهابية',
      tags: ['تيجان بلعمية (CLS)', 'نقص أكسجين نسيجي', 'التهاب مزمن']
    }
  }
];

export interface OrganelleStructure {
  id: string;
  name: string;
  scientificName: string;
  icon: string;
  color: string;
  healthyFunction: string;
  pathologyDamage: string;
  clinicalSignificance: string;
  targetCoord: { x: number; y: number };
}

export const ORGANELLES_BY_SPECIMEN: Record<string, OrganelleStructure[]> = {
  diabetes: [
    {
      id: 'glut4',
      name: 'مستقبلات الأنسولين وقنوات GLUT-4',
      scientificName: 'Insulin Receptors & GLUT-4 Transporters',
      icon: '🚪',
      color: '#06b6d4',
      healthyFunction: 'تستشعر هرمون الأنسولين كالمفتاح في القفل، فتفتح بوابات الغشاء لتسمح بتدفق الجلوكوز إلى سيتوبلازم الخلية لحرقه.',
      pathologyDamage: 'تتبلد المستقبلات وتتراجع إلى داخل الخلية، رافضة الاستجابة للأنسولين فتظل البوابات مغلقة ويتراكم السكر بالدم.',
      clinicalSignificance: 'المسؤول الأول عن ارتفاع السكر التراكمي (HbA1c > 6.5%) والجوع الخلوي المستمر.',
      targetCoord: { x: 140, y: 40 }
    },
    {
      id: 'mitochondria',
      name: 'الميتوكوندريا (محطة توليد الطاقة ATP)',
      scientificName: 'Cellular Mitochondria & Energy Powerhouse',
      icon: '⚡',
      color: '#38bdf8',
      healthyFunction: 'تستهلك الجلوكوز والأكسجين بانتظام وتنتج أكثر من 400 pmol/min من طاقة ATP الحيوية لتغذية نشاط الخلية.',
      pathologyDamage: 'تتضور جوعاً لانعدام وصول الجلوكوز، وتتعرض لتلف بنيوي مجهري وتطلق إشارات الإجهاد الخلوي.',
      clinicalSignificance: 'تفسر سبب شعور مريض السكري بالإرهاق المزمن والخمول وضعف العضلات المستمر.',
      targetCoord: { x: -60, y: -45 }
    },
    {
      id: 'glucose_crystals',
      name: 'بلورات الجلوكوز الحرة خارج الخلية',
      scientificName: 'Extracellular Free Glucose & Glucotoxicity',
      icon: '💎',
      color: '#f59e0b',
      healthyFunction: 'تتواجد بتركيز متوازن وآمن (70 - 99 mg/dL)، تمتصه الخلايا بانسيابية دون أي ترسبات ضارة.',
      pathologyDamage: 'تتكدس خارج الخلية بتركيزات سامة، وتلتصق بالبروتينات مسببة مركبات سكرية متقدمة (AGEs) تدمر الأنسجة.',
      clinicalSignificance: 'تتلف الأعصاب الطرفية الدقيقة (Neuropathy) وتسبب ضعف الإحساس بالقدمين واعتلال الشبكية.',
      targetCoord: { x: 210, y: -120 }
    },
    {
      id: 'ros_stress',
      name: 'الجذور الحرة والإجهاد التأكسدي (ROS)',
      scientificName: 'Reactive Oxygen Species & Oxidative Stress',
      icon: '🔥',
      color: '#f43f5e',
      healthyFunction: 'مستويات منخفضة جداً يفككها إنزيم الكاتاليز والجلوتاثيون فوراً ليظل الوسط الداخلي نقياً وآمناً.',
      pathologyDamage: 'تنفجر جزيئات الأكسجين التفاعلية بأعداد هائلة، مسببة ثقوباً في جدار الخلية وتكسيراً لسلاسل الـ DNA.',
      clinicalSignificance: 'تسرّع شيخوخة وتلف خلايا بيتا في البنكرياس وتزيد خطر تصلب الشرايين والجلطات.',
      targetCoord: { x: 80, y: 160 }
    },
    {
      id: 'cell_membrane',
      name: 'الغشاء البلازمي المزدوج لخلية بيتا',
      scientificName: 'Phospholipid Bilayer & Fluidity',
      icon: '🛡️',
      color: '#10b981',
      healthyFunction: 'غشاء دهني فوسفوري مرن ومطاط، يحمي محتويات الخلية وينظم النفاذية الاختيارية للمغذيات والأيونات.',
      pathologyDamage: 'يفقد سيولته ومرونته ويصاب بتصلب وشروخ مجهرية نتيجة أكسدة الدهون (Lipid Peroxidation).',
      clinicalSignificance: 'تسرب المكونات الداخلية وعجز الخلية عن إفراز حويصلات الأنسولين وموتها المبرمج.',
      targetCoord: { x: -160, y: 80 }
    }
  ],
  hypertension: [
    {
      id: 'endothelium',
      name: 'البطانة الوعائية التاجية (Endothelium)',
      scientificName: 'Vascular Endothelial Monolayer',
      icon: '🌊',
      color: '#38bdf8',
      healthyFunction: 'طبقة خلايا ملساء ناعمة زجاجية تفرز أكسيد النيتريك (NO) بانتظام لترخية الشرايين وتسهيل انسياب الدم.',
      pathologyDamage: 'تتعرض لشروخ وتمزقات مجهرية متواصلة نتيجة قوة القص والضغط العالي المستمر (Shear Stress).',
      clinicalSignificance: 'تفقد الأوعية قدرتها على التمدد المرن، مما يرفع المقاومة الطرفية ويفاقم قراءات الضغط.',
      targetCoord: { x: 0, y: 140 }
    },
    {
      id: 'cholesterol_plaque',
      name: 'لويحات الكولسترول المؤكسد (LDL Plaque)',
      scientificName: 'Atherosclerotic Foam Cells & Calcification',
      icon: '🪨',
      color: '#f59e0b',
      healthyFunction: 'جزيئات كولسترول سابحة بتركيز منخفض لا تلتصق بالسطح المبطن الأملس للشرايين.',
      pathologyDamage: 'تتسلل جزيئات الكولسترول المؤكسد تحت البطانة الممزقة، فتلتهمها المناعة مشكلة كتلاً صلبة تسد المجرى.',
      clinicalSignificance: 'تضيّق مجرى الشريان التاجي، وهو المسبب المباشر للذبحة الصدرية والنوبات القلبية.',
      targetCoord: { x: -80, y: 155 }
    },
    {
      id: 'nitric_oxide',
      name: 'غاز أكسيد النيتريك الموسع للأوعية (NO)',
      scientificName: 'Endothelial Nitric Oxide Molecule',
      icon: '💨',
      color: '#a855f7',
      healthyFunction: 'يحافظ على ارتخاء الألياف العضلية حول الشريان، ويضمن نزول الضغط الانبساطي لأقل من 80 mmHg.',
      pathologyDamage: 'نضوب حاد في إفراز NO؛ تنقبض العضلات الملساء بعنف وتتشنج الشرايين مسببة قفزات خطيرة للضغط.',
      clinicalSignificance: 'ارتفاع الضغط الانقباضي فوق 140 mmHg وظهور الصداع القفوي والدوخة.',
      targetCoord: { x: 120, y: 130 }
    },
    {
      id: 'turbulent_rbcs',
      name: 'كريات الدم المتصادمة واضطراب الجريان',
      scientificName: 'Turbulent Shear Erythrocytes',
      icon: '🩸',
      color: '#ef4444',
      healthyFunction: 'تدفق صفائحي هادئ وانسيابي في منتصف الوعاء الدموي دون أي احتكاك عنيف بالجدران.',
      pathologyDamage: 'دوامات عنيفة وتصادمات متكررة باللويحات الصلبة، مما يؤدي لتنشيط الصفائح وتخثر الدم.',
      clinicalSignificance: 'تكون الجلطات الدموية المفاجئة (Thrombosis) وانفصال اللويحة الشريانية.',
      targetCoord: { x: -140, y: 180 }
    }
  ],
  anemia: [
    {
      id: 'hemoglobin',
      name: 'رباعيات سلاسل الهيموجلوبين الحامل للأكسجين',
      scientificName: 'Hemoglobin Tetramer & Heme Porphyrin',
      icon: '🧬',
      color: '#ef4444',
      healthyFunction: '4 سلاسل بروتينية تحوي ذرات حديد ترتبط بـ 4 جزيئات أكسجين بكفاءة تشبع تفوق 98%.',
      pathologyDamage: 'نقص حاد في عدد السلاسل أو عجز في ذرات الحديد، مما يجعل الخلية فارغة وشاحبة وعاجزة عن حمل الأكسجين.',
      clinicalSignificance: 'انخفاض نسبة الهيموجلوبين لأقل من 11 g/dL وشحوب ملحوظ في الوجه وملتحمة العين.',
      targetCoord: { x: 0, y: 0 }
    },
    {
      id: 'sickle_distortion',
      name: 'التشوه المنجلي والتبلمر الصلب (Sickle HbS)',
      scientificName: 'Polymerized Sickle Fiber Distortion',
      icon: '🌙',
      color: '#dc2626',
      healthyFunction: 'هيموجلوبين ذائب ومرن يسمح للكرية بالتكيف والمرور في أضيق الشعيرات الدقيقة (5 ميكرومتر).',
      pathologyDamage: 'تتبلمر السلاسل المشوهة في ألياف صلبة تدفع جدار الخلية لتصبح على شكل منجل حاد وقاسٍ.',
      clinicalSignificance: 'انحباس الخلايا وانسداد الأوعية الدموية مسببة نوبات ألم عظمي مبرح (Vaso-occlusive Crisis).',
      targetCoord: { x: -90, y: 20 }
    },
    {
      id: 'hemolysis_debris',
      name: 'تكسر الغشاء وحطام الكريات المنفجرة (Hemolysis)',
      scientificName: 'Erythrocyte Membrane Lysis & Free Heme',
      icon: '💥',
      color: '#fbbf24',
      healthyFunction: 'عمر افتراضي طويل للكرية يصل لـ 120 يوماً قبل أن تُعاد تدويرها بهدوء في الطحال.',
      pathologyDamage: 'تنفجر الكريات الهشة مبكراً داخل مجرى الدم محررة الهيموجلوبين الحر السام المسبب لليرقان.',
      clinicalSignificance: 'اصفرار بياض العين والجلد (اليرقان) وإرهاق الكليتين لتصفية الصبغات الصفراوية.',
      targetCoord: { x: 80, y: -70 }
    }
  ],
  obesity: [
    {
      id: 'hypertrophy',
      name: 'القطيرة الدهنية المتضخمة (Hypertrophic Droplet)',
      scientificName: 'Enlarged Triglyceride Lipid Droplet',
      icon: '🟡',
      color: '#eab308',
      healthyFunction: 'حجم خلوي متناسق (أقل من 60 ميكرون) يخزن الدهون باعتدال وتغذيه شبكة شعرية غنية.',
      pathologyDamage: 'تتضخم لأكثر من 150 ميكرون؛ تضغط على النواة وتتمدد حتى تنقطع عنها التغذية الدموية وتبدأ بالموت.',
      clinicalSignificance: 'إفراز مفرط للأحماض الدهنية الحرة في مجرى الدم مما يسبب تشحم الكبد ومقاومة الأنسولين.',
      targetCoord: { x: 0, y: 0 }
    },
    {
      id: 'crown_macrophage',
      name: 'التيجان البلعمية الالتهابية (Crown-Like Structures)',
      scientificName: 'M1 Pro-inflammatory Macrophage Crown',
      icon: '👑',
      color: '#f97316',
      healthyFunction: 'خلايا مناعية بلعمية حامية (M2) تحافظ على هدوء النسيج وتوازن استقلاب الطاقة.',
      pathologyDamage: 'تتحول إلى نمط هجومي (M1)؛ تحاصر الخلية الدهنية الميتة وتفرز سيتوكينات حارقة ومحفزة للالتهاب.',
      clinicalSignificance: 'توليد التهاب جهازي مزمن منخفض الحدة يرفع بروتين C التفاعلي (hs-CRP) وخطر السكري.',
      targetCoord: { x: -140, y: -60 }
    },
    {
      id: 'hypoxia_capillary',
      name: 'الشعيرات الدموية المختنقة ونقص الأكسجة (Hypoxia)',
      scientificName: 'Adipose Microvascular Rarefaction & Ischemia',
      icon: '🫁',
      color: '#38bdf8',
      healthyFunction: 'تفرز الخلية هرمون VEGF بانتظام لنمو شعيرات دموية كافية لمواكبة تروية كل خلية.',
      pathologyDamage: 'يفشل نمو الأوعية في ملاحقة التضخم الشحمي السريع، فتختنق الخلية من نقص الأكسجين وتتليف.',
      clinicalSignificance: 'تصلب النسيج الدهني وعجزه عن تخزين فائض السعرات مما يدفع الدهون للترسب حول القلب والبنكرياس.',
      targetCoord: { x: 130, y: 90 }
    }
  ]
};

interface CinematicMicroscopeProps {
  initialSpecimenId?: string;
}

export const CinematicMicroscope: React.FC<CinematicMicroscopeProps> = ({ 
  initialSpecimenId = 'diabetes' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Microscope state
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string>(initialSpecimenId);
  const [isPathological, setIsPathological] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(400); // 40x to 25000x
  const [opticalMode, setOpticalMode] = useState<MicroscopeMode>('fluorescence');
  const [focusOffset, setFocusOffset] = useState<number>(0); // -10 to +10 (0 = pin sharp)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [probePos, setProbePos] = useState<{ x: number; y: number } | null>(null);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeOrganelleId, setActiveOrganelleId] = useState<string | null>(null);

  // Current specimen
  const currentSpecimen = useMemo(() => {
    return SPECIMENS.find(s => s.id === selectedSpecimenId) || SPECIMENS[0];
  }, [selectedSpecimenId]);

  // Sync initialSpecimenId if changed externally
  useEffect(() => {
    if (initialSpecimenId) {
      setSelectedSpecimenId(initialSpecimenId);
    }
  }, [initialSpecimenId]);

  // Interactive probe on canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setProbePos({ x, y });
    sound.playCellProbe();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.15 : 0.87;
    setZoomLevel(prev => {
      const next = Math.max(40, Math.min(25000, Math.round(prev * delta)));
      return next;
    });
    sound.playMicroscopeZoom(zoomLevel);
  };

  const handleSetZoom = (val: number) => {
    setZoomLevel(val);
    sound.playMicroscopeZoom(val);
  };

  const handleTogglePathology = () => {
    setIsPathological(prev => !prev);
    sound.playMicroscopeToggle();
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Simulation entities (cells, organelles, molecules)
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, (_, idx) => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 600,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: 3 + Math.random() * 8,
      type: idx % 4, // 0: receptor/molecule, 1: vesicle, 2: ROS / glucose, 3: protein
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.04
    }));

    const render = () => {
      if (isPlaying) {
        time += 0.018 * simSpeed;
      }

      // Handle retina / high-DPI
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);

      // --- Optical Blur (Focus offset simulation) ---
      const blurAmount = Math.abs(focusOffset) * 0.65;
      ctx.filter = blurAmount > 0.1 ? `blur(${blurAmount.toFixed(1)}px)` : 'none';

      // --- 1. Background per Microscope Optical Mode ---
      if (opticalMode === 'fluorescence') {
        // Deep confocal dark laser field
        const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.8);
        bgGrad.addColorStop(0, '#040b17');
        bgGrad.addColorStop(0.7, '#02060f');
        bgGrad.addColorStop(1, '#000205');
        ctx.fillStyle = bgGrad;
      } else if (opticalMode === 'phase-contrast') {
        // High-contrast medical phase monochromatic
        ctx.fillStyle = '#111827';
      } else {
        // Brightfield classical histology microscopy
        const bGrad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w);
        bGrad.addColorStop(0, '#f8fafc');
        bGrad.addColorStop(0.8, '#e2e8f0');
        bGrad.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = bGrad;
      }
      ctx.fillRect(0, 0, w, h);

      // --- 2. Camera Transformations (Zoom & Pan) ---
      ctx.save();
      ctx.translate(w / 2 + panOffset.x, h / 2 + panOffset.y);

      // Scale factor mapped logarithmically from zoomLevel (40x to 25,000x)
      // 40x -> 0.45, 400x -> 1.0, 2500x -> 2.4, 25000x -> 5.8
      const normZoom = Math.log10(zoomLevel / 40) / Math.log10(25000 / 40);
      const scale = 0.45 + normZoom * 5.2;
      ctx.scale(scale, scale);

      // --- 3. Cellular Specimen Rendering ---
      const diseaseId = currentSpecimen.id;

      // Primary Cell Boundary
      const mainCellRadius = 140;
      ctx.save();

      // Fluid membrane breathing & undulation
      ctx.beginPath();
      const points = 32;
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * Math.PI * 2;
        // Healthy has gentle wave; pathological has ragged/jagged disruption
        let wave = Math.sin(theta * 4 + time * 2) * 4 + Math.cos(theta * 3 - time) * 3;
        if (isPathological) {
          wave += (Math.sin(theta * 11 + time * 5) * 8 + Math.cos(theta * 8) * 6);
        }
        const r = mainCellRadius + wave;
        const px = Math.cos(theta) * r;
        const py = Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Membrane Fill & Outline
      if (opticalMode === 'fluorescence') {
        const cellGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, mainCellRadius * 1.1);
        if (isPathological) {
          cellGrad.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
          cellGrad.addColorStop(0.7, 'rgba(185, 28, 28, 0.15)');
          cellGrad.addColorStop(1, 'rgba(225, 29, 72, 0.45)');
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 18;
        } else {
          cellGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
          cellGrad.addColorStop(0.7, 'rgba(14, 116, 144, 0.18)');
          cellGrad.addColorStop(1, 'rgba(6, 182, 212, 0.55)');
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#22d3ee';
          ctx.shadowBlur = 16;
        }
        ctx.fillStyle = cellGrad;
        ctx.fill();
        ctx.stroke();
      } else if (opticalMode === 'phase-contrast') {
        ctx.fillStyle = isPathological ? 'rgba(75, 85, 99, 0.4)' : 'rgba(107, 114, 128, 0.3)';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#e5e7eb';
        ctx.stroke();
      } else {
        // Brightfield
        ctx.fillStyle = isPathological ? 'rgba(254, 202, 202, 0.65)' : 'rgba(199, 210, 254, 0.65)';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isPathological ? '#b91c1c' : '#4338ca';
        ctx.stroke();
      }
      ctx.restore();

      // --- 4. Cell Nucleus & Chromatin ---
      ctx.save();
      const nucRadius = isPathological && diseaseId === 'obesity' ? 32 : 48;
      const nucOffset = isPathological && diseaseId === 'obesity' ? -65 : 0; // squished in adipocyte
      ctx.beginPath();
      ctx.arc(nucOffset, 0, nucRadius, 0, Math.PI * 2);
      if (opticalMode === 'fluorescence') {
        ctx.fillStyle = isPathological ? 'rgba(244, 63, 94, 0.5)' : 'rgba(56, 189, 248, 0.65)';
        ctx.shadowColor = isPathological ? '#fb7185' : '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.strokeStyle = isPathological ? '#fda4af' : '#7dd3fc';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (opticalMode === 'phase-contrast') {
        ctx.fillStyle = '#374151';
        ctx.fill();
        ctx.strokeStyle = '#f3f4f6';
        ctx.stroke();
      } else {
        ctx.fillStyle = '#6366f1';
        ctx.fill();
      }
      // Chromatin strands inside nucleus
      ctx.beginPath();
      ctx.arc(nucOffset - 10, -8, nucRadius * 0.35, 0, Math.PI * 2);
      ctx.arc(nucOffset + 12, 10, nucRadius * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = opticalMode === 'brightfield' ? '#312e81' : 'rgba(255,255,255,0.45)';
      ctx.fill();
      ctx.restore();

      // --- 5. Mitochondria & Cristae (Energy Plants) ---
      const mitoCount = 5;
      for (let m = 0; m < mitoCount; m++) {
        const ang = (m / mitoCount) * Math.PI * 2 + 0.4;
        const dist = 85;
        const mx = Math.cos(ang) * dist;
        const my = Math.sin(ang) * dist;

        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(ang + Math.PI / 2);

        ctx.beginPath();
        // Elliptical bean shape
        ctx.ellipse(0, 0, 18, 9, 0, 0, Math.PI * 2);

        if (isPathological) {
          // Fragmented, swollen, damaged mitochondria
          ctx.fillStyle = opticalMode === 'brightfield' ? 'rgba(220, 38, 38, 0.5)' : 'rgba(239, 68, 68, 0.35)';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
        } else {
          // Vibrant pulsing energic mitochondria
          const pulse = 1.0 + Math.sin(time * 3 + m) * 0.08;
          ctx.scale(pulse, pulse);
          ctx.fillStyle = opticalMode === 'brightfield' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.4)';
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2;
        }
        ctx.fill();
        ctx.stroke();

        // Internal cristae folds
        ctx.beginPath();
        ctx.moveTo(-10, -4); ctx.lineTo(-6, 4);
        ctx.moveTo(-2, -4); ctx.lineTo(2, 4);
        ctx.moveTo(6, -4); ctx.lineTo(10, 4);
        ctx.strokeStyle = opticalMode === 'brightfield' ? '#065f46' : 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
      }

      // --- 6. Disease-Specific Microscopic Structures ---
      if (diseaseId === 'diabetes') {
        // Membrane GLUT-4 Receptors & Floating Glucose Crystals
        const receptorCount = 12;
        for (let r = 0; r < receptorCount; r++) {
          const theta = (r / receptorCount) * Math.PI * 2;
          const rx = Math.cos(theta) * mainCellRadius;
          const ry = Math.sin(theta) * mainCellRadius;

          ctx.save();
          ctx.translate(rx, ry);
          ctx.rotate(theta);

          // Receptor Y-shape channel
          ctx.beginPath();
          ctx.moveTo(-4, -8); ctx.lineTo(0, 0); ctx.lineTo(4, -8);
          ctx.moveTo(0, 0); ctx.lineTo(0, 8);
          ctx.strokeStyle = isPathological ? '#f43f5e' : '#22d3ee';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // If healthy: insulin molecule docked & open gate
          if (!isPathological) {
            ctx.beginPath();
            ctx.arc(0, -9, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#a7f3d0';
            ctx.fill();
          } else {
            // Pathological: blocked, receptor locked with glucose spike
            ctx.beginPath();
            ctx.rect(-3, -11, 6, 6);
            ctx.fillStyle = '#fbbf24';
            ctx.fill();
          }
          ctx.restore();
        }

        // Extracellular Glucose Crystals (Floating sharp hexagons)
        const glucCount = isPathological ? 35 : 8;
        for (let g = 0; g < glucCount; g++) {
          const gAngle = (g / glucCount) * Math.PI * 2 + time * 0.2;
          const gDist = mainCellRadius + 28 + (g % 5) * 22;
          const gx = Math.cos(gAngle) * gDist;
          const gy = Math.sin(gAngle) * gDist;

          ctx.save();
          ctx.translate(gx, gy);
          ctx.rotate(time * 1.2 + g);
          ctx.beginPath();
          for (let side = 0; side < 6; side++) {
            const sAngle = (side / 6) * Math.PI * 2;
            const sx = Math.cos(sAngle) * 5.5;
            const sy = Math.sin(sAngle) * 5.5;
            if (side === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.fillStyle = isPathological ? '#fbbf24' : '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      } 
      else if (diseaseId === 'hypertension') {
        // Vascular Endothelial Plaque & Flowing RBCs under shear stress
        // Collagen fibers outside cell
        ctx.save();
        ctx.strokeStyle = isPathological ? '#ea580c' : '#38bdf8';
        ctx.lineWidth = isPathological ? 3.5 : 1.5;
        for (let f = 0; f < 6; f++) {
          ctx.beginPath();
          const startX = -260;
          const startY = 160 + f * 24;
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(
            -100, startY + Math.sin(time + f) * 15,
            100, startY - Math.cos(time + f) * 15,
            260, startY
          );
          ctx.stroke();
        }

        // Flowing Red Blood Cells colliding
        const rbcCount = 14;
        for (let b = 0; b < rbcCount; b++) {
          const bx = -220 + ((b * 40 + time * (isPathological ? 180 : 100)) % 480);
          const by = 180 + Math.sin(b * 1.5) * 35;

          ctx.save();
          ctx.translate(bx, by);
          ctx.rotate(time * 2 + b);
          ctx.beginPath();
          ctx.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2);
          ctx.fillStyle = isPathological ? '#b91c1c' : '#e11d48';
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(0, 0, 6, 3.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = isPathological ? '#7f1d1d' : '#881337';
          ctx.fill();
          ctx.restore();
        }

        // Cholesterol plaques (Yellow jagged clumps)
        if (isPathological) {
          ctx.fillStyle = '#f59e0b';
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 2;
          for (let p = 0; p < 4; p++) {
            ctx.beginPath();
            ctx.arc(-140 + p * 90, 150, 16 + p * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }
        ctx.restore();
      }
      else if (diseaseId === 'anemia') {
        // Red Blood Cells: Biconcave Plump vs Crescent Sickle
        const cellGrid = 8;
        for (let c = 0; c < cellGrid; c++) {
          const ang = (c / cellGrid) * Math.PI * 2;
          const dist = 70 + (c % 2) * 45;
          const cx = Math.cos(ang) * dist;
          const cy = Math.sin(ang) * dist;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(ang + time * 0.8);

          if (isPathological) {
            // Sickle / Crescent shape
            ctx.beginPath();
            ctx.arc(0, 0, 24, 0.3 * Math.PI, 1.4 * Math.PI, false);
            ctx.arc(8, 0, 20, 1.35 * Math.PI, 0.35 * Math.PI, true);
            ctx.closePath();
            ctx.fillStyle = '#b91c1c';
            ctx.fill();
            ctx.strokeStyle = '#fca5a5';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Crystallized hemoglobin needle streaks
            ctx.beginPath();
            ctx.moveTo(-10, -5); ctx.lineTo(10, 5);
            ctx.moveTo(-6, -8); ctx.lineTo(8, 2);
            ctx.strokeStyle = '#f87171';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          } else {
            // Healthy biconcave disc
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 14, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#e11d48';
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#881337';
            ctx.fill();
            ctx.strokeStyle = '#fda4af';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      else if (diseaseId === 'obesity') {
        // Massive lipid droplet filling the adipocyte
        ctx.save();
        const lipidRad = isPathological ? 105 : 55;
        ctx.beginPath();
        ctx.arc(15, 0, lipidRad, 0, Math.PI * 2);
        ctx.fillStyle = isPathological ? 'rgba(234, 179, 8, 0.55)' : 'rgba(250, 204, 21, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Macrophages invading (Crown-like structure)
        if (isPathological) {
          const macroCount = 6;
          for (let m = 0; m < macroCount; m++) {
            const mAng = (m / macroCount) * Math.PI * 2;
            const mx = Math.cos(mAng) * (mainCellRadius + 8);
            const my = Math.sin(mAng) * (mainCellRadius + 8);

            ctx.save();
            ctx.translate(mx, my);
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fillStyle = '#7c2d12';
            ctx.fill();
            ctx.strokeStyle = '#ea580c';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Cytokine spark
            ctx.beginPath();
            ctx.arc(Math.sin(time * 4 + m) * 6, Math.cos(time * 4 + m) * 6, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#f97316';
            ctx.fill();
            ctx.restore();
          }
        }
        ctx.restore();
      }

      // --- 7. Cytoplasmic Molecules & Brownian Motion Particles ---
      particles.forEach(p => {
        p.x += p.vx * simSpeed;
        p.y += p.vy * simSpeed;
        // bounce boundary
        if (p.x > 380) p.x = -380;
        if (p.x < -380) p.x = 380;
        if (p.y > 280) p.y = -280;
        if (p.y < -280) p.y = 280;

        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.type === 2 && isPathological) {
          // Reactive Oxygen Species (ROS) - Spiky red sparks
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            const spAng = (s / 5) * Math.PI * 2 + time * 3;
            const r1 = 8;
            const r2 = 3;
            ctx.lineTo(Math.cos(spAng) * r1, Math.sin(spAng) * r1);
            ctx.lineTo(Math.cos(spAng + 0.6) * r2, Math.sin(spAng + 0.6) * r2);
          }
          ctx.closePath();
          ctx.fillStyle = '#ef4444';
          ctx.fill();
        } else {
          // Normal vesicles or ATP sparks
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = opticalMode === 'brightfield' 
            ? 'rgba(79, 70, 229, 0.4)' 
            : (isPathological ? 'rgba(239, 68, 68, 0.6)' : 'rgba(56, 189, 248, 0.6)');
          ctx.fill();
        }
        ctx.restore();
      });

      // Highlight active organelle on the specimen
      const currentOrganelles = ORGANELLES_BY_SPECIMEN[diseaseId] || [];
      const activeOrganelle = currentOrganelles.find(o => o.id === activeOrganelleId);

      if (activeOrganelle) {
        ctx.save();
        ctx.translate(activeOrganelle.targetCoord.x, activeOrganelle.targetCoord.y);
        
        // Pulsing targeting reticle
        const pulse = 1 + Math.sin(time * 6) * 0.15;
        ctx.beginPath();
        ctx.arc(0, 0, 28 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = activeOrganelle.color;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 4]);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fillStyle = activeOrganelle.color;
        ctx.fill();

        // Callout line & tag
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(14, -14);
        ctx.lineTo(40, -32);
        ctx.lineTo(135, -32);
        ctx.strokeStyle = activeOrganelle.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
        ctx.fillRect(40, -50, 115, 18);
        ctx.strokeStyle = activeOrganelle.color;
        ctx.strokeRect(40, -50, 115, 18);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(activeOrganelle.name.slice(0, 16), 44, -37);

        ctx.restore();
      }

      ctx.restore(); // end camera transform

      // --- 8. Microscope Reticle, Crosshair & HUD Overlay ---
      ctx.save();
      // Optical Field Circular Aperture Vignette
      const apertureGrad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.min(w, h) * 0.58);
      apertureGrad.addColorStop(0, 'transparent');
      apertureGrad.addColorStop(0.7, 'rgba(2, 6, 23, 0.6)');
      apertureGrad.addColorStop(1, '#020617');
      ctx.fillStyle = apertureGrad;
      ctx.fillRect(0, 0, w, h);

      // Fine crosshair at center
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(w / 2 - 35, h / 2); ctx.lineTo(w / 2 + 35, h / 2);
      ctx.moveTo(w / 2, h / 2 - 35); ctx.lineTo(w / 2, h / 2 + 35);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center target ring
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.stroke();

      // Clicked Probe indicator
      if (probePos) {
        ctx.save();
        ctx.translate(probePos.x, probePos.y);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 16 + Math.sin(time * 6) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-22, 0); ctx.lineTo(22, 0);
        ctx.moveTo(0, -22); ctx.lineTo(0, 22);
        ctx.stroke();
        ctx.restore();
      }

      // Micrometer Scale Bar
      const scaleBarWidth = 100;
      const micronValue = Math.max(0.1, (2000 / zoomLevel)).toFixed(1);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(w - 180, h - 55, 155, 38);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.strokeRect(w - 180, h - 55, 155, 38);

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(w - 165, h - 30, scaleBarWidth, 3);
      ctx.font = '11px monospace';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`${micronValue} µm (ميكرومتر)`, w - 165, h - 38);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedSpecimenId, isPathological, zoomLevel, opticalMode, focusOffset, isPlaying, simSpeed, panOffset, currentSpecimen, probePos]);

  // Current clinical readout
  const activeMetrics = isPathological ? currentSpecimen.pathology : currentSpecimen.healthy;

  return (
    <section id="microscope" className="py-16 sm:py-24 bg-[#020617] relative overflow-hidden border-t border-cyan-500/20">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.06),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>المجهر السينمائي فائق الدقة | NANO-CELLULAR EXPLORER</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-4">
            تغلغل مجهري إلى <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-300">أعماق الخلية الحية</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            استخدم عجلة التقريب (Zoom-in) لاختراق الأنسجة ومراقبة نشاط العضيات والمستقبلات الخلوية، وقارن بين الخلية السليمة وتأثير المرض في الوقت الحقيقي.
          </p>
        </div>

        {/* Specimen Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {SPECIMENS.map((specimen) => {
            const isSelected = specimen.id === selectedSpecimenId;
            return (
              <button
                key={specimen.id}
                onClick={() => {
                  setSelectedSpecimenId(specimen.id);
                  setProbePos(null);
                  sound.playClick(1200);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-105'
                    : 'bg-slate-900/60 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: specimen.color }} 
                />
                <span>{specimen.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Microscope Viewport & Control Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Center: Interactive Canvas (8 Cols on LG) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            
            {/* Viewport Frame */}
            <div 
              ref={containerRef}
              className="relative w-full h-[460px] sm:h-[540px] rounded-3xl overflow-hidden bg-slate-950 border border-cyan-500/30 shadow-[0_0_40px_rgba(2,6,23,0.9)] select-none group"
            >
              {/* Canvas element */}
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className="w-full h-full cursor-crosshair block"
              />

              {/* Floating Top Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                
                {/* Status Badge */}
                <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs font-mono text-slate-200">
                  <span className={`w-2.5 h-2.5 rounded-full ${isPathological ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
                  <span>{isPathological ? 'الحالة المرضية النشطة (Pathology)' : 'الخلية السليمة (Physiological Normal)'}</span>
                </div>

                {/* Magnification Readout Badge */}
                <div className="pointer-events-auto flex items-center gap-2 bg-cyan-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-cyan-500/40 text-xs font-mono text-cyan-300">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  <span>تكبير: {zoomLevel.toLocaleString()}x</span>
                </div>
              </div>

              {/* Floating Bottom Quick Zoom Toolbar */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                
                {/* Zoom Quick Presets */}
                <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
                  {[
                    { label: '40x نسيج', val: 40 },
                    { label: '400x خلية', val: 400 },
                    { label: '2,500x عضيات', val: 2500 },
                    { label: '15,000x جزيئات', val: 15000 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      onClick={() => handleSetZoom(preset.val)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                        zoomLevel === preset.val
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Simulation Play / Pause & Speed */}
                <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
                  <button
                    onClick={() => {
                      setIsPlaying(p => !p);
                      sound.playClick(900);
                    }}
                    className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الحركة'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => {
                      setSimSpeed(s => s === 1 ? 2 : s === 2 ? 0.5 : 1);
                      sound.playClick(1000);
                    }}
                    className="px-2 py-1 rounded-xl text-xs font-mono text-cyan-300 hover:bg-slate-800 cursor-pointer"
                    title="تعديل سرعة الحركة الخلوية"
                  >
                    {simSpeed}x
                  </button>
                </div>
              </div>

            </div>

            {/* Viewport Instructions */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-2">
              <span className="flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                انقر في أي مكان لفحص المؤشرات الحيوية الخلوية | اسحب لتحريك العينة
              </span>
              <span>استخدم عجلة الفأرة للتقريب المستمر</span>
            </div>

          </div>

          {/* Right: Microscope Controls & Real-time Cellular Diagnostics (4 Cols on LG) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* 1. Pathology Comparison Switch */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md">
              <div className="text-xs font-mono text-slate-400 mb-2 uppercase">مقارنة الحالة الخلوية</div>
              <button
                onClick={handleTogglePathology}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border shadow-lg ${
                  isPathological
                    ? 'bg-rose-950/50 border-rose-500/50 text-rose-200 hover:bg-rose-900/60 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                    : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200 hover:bg-emerald-900/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isPathological ? (
                    <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  <div className="text-right">
                    <div className="font-black">{isPathological ? 'مشاهدة التلف المرضي' : 'مشاهدة الخلية السليمة'}</div>
                    <div className="text-[11px] opacity-80">انقر للتبديل بين الحالتين</div>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-black/40 text-xs font-mono">
                  {isPathological ? 'مرضي' : 'سليم'}
                </div>
              </button>
            </div>

            {/* 2. Optical Mode & Focus Adjustments */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">نمط المجهر والصبغة</span>
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              </div>

              {/* Microscopy Filter Modes */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fluorescence', label: 'فلوري GFP' },
                  { id: 'phase-contrast', label: 'تباين طور' },
                  { id: 'brightfield', label: 'ضوئي طبي' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setOpticalMode(mode.id as MicroscopeMode);
                      sound.playClick(1100);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      opticalMode === mode.id
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Fine Focus Knob Slider */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">ضبط البؤرة والحدة (Focus):</span>
                  <span className={focusOffset === 0 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {focusOffset === 0 ? 'بؤرة مثالية (Sharp)' : `${focusOffset > 0 ? '+' : ''}${focusOffset}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  value={focusOffset}
                  onChange={(e) => setFocusOffset(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Continuous Zoom Slider */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">مستوى التكبير الدقيق:</span>
                  <span className="text-cyan-400 font-bold">{zoomLevel.toLocaleString()}x</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="25000"
                  step="20"
                  value={zoomLevel}
                  onChange={(e) => handleSetZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* 3. Real-Time Microscopic Biometrics HUD */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  المؤشرات الخلوية الحيوية
                </h4>
                <span className="text-[10px] font-mono text-cyan-400/80">LIVE SENSOR</span>
              </div>

              {/* Metric 1: Membrane Integrity */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">سلامة الغشاء الخلوي:</span>
                  <span className={`font-mono font-bold ${activeMetrics.membraneIntegrity > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeMetrics.membraneIntegrity}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${activeMetrics.membraneIntegrity > 70 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ width: `${activeMetrics.membraneIntegrity}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: ATP Energy Production */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">إنتاج طاقة الميتوكوندريا (ATP):</span>
                  <span className={`font-mono font-bold ${activeMetrics.atpProduction > 250 ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {activeMetrics.atpProduction} pmol/min
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${activeMetrics.atpProduction > 250 ? 'bg-cyan-400' : 'bg-amber-400'}`}
                    style={{ width: `${Math.min(100, (activeMetrics.atpProduction / 450) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: Oxidative Stress Index */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">مؤشر الإجهاد التأكسدي (ROS):</span>
                  <span className={`font-mono font-bold ${activeMetrics.oxidativeStress < 30 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeMetrics.oxidativeStress} / 100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${activeMetrics.oxidativeStress < 30 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ width: `${activeMetrics.oxidativeStress}%` }}
                  />
                </div>
              </div>

              {/* Receptor Status */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">حالة المستقبلات:</span>
                <span className="text-slate-200 font-bold">{activeMetrics.receptorActivity}</span>
              </div>
            </div>

            {/* 4. Scientific Mechanism Explanation Card */}
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
              <h4 className="text-sm font-black text-white mb-2 flex items-center gap-2">
                <Dna className="w-4 h-4 text-cyan-400" />
                {activeMetrics.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {activeMetrics.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeMetrics.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] text-cyan-300 border border-cyan-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* 5. Cellular Organelles Guide & Clinical Explanations Section */}
        {(() => {
          const organelles = ORGANELLES_BY_SPECIMEN[currentSpecimen.id] || [];
          const activeOrganelle = organelles.find(o => o.id === activeOrganelleId) || organelles[0];

          return (
            <div className="mt-8 pt-8 border-t border-cyan-500/20">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      دليل وفهرس التراكيب الخلوية والشرح المجهري
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    انقر على أي تركيب مجهري لتحديده فوراً تحت العدسة والاطلاع على وظيفته والتلف الناتج عن المرض
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    {organelles.length} تراكيب حيوية مفصلة
                  </span>
                </div>
              </div>

              {/* Organelle Chips Selection */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                {organelles.map((organelle) => {
                  const isActive = activeOrganelle?.id === organelle.id;
                  return (
                    <button
                      key={organelle.id}
                      onClick={() => {
                        setActiveOrganelleId(organelle.id);
                        sound.playCellProbe();
                        setPanOffset({
                          x: -organelle.targetCoord.x * 0.4,
                          y: -organelle.targetCoord.y * 0.4
                        });
                      }}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                          : 'bg-slate-900/70 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base">{organelle.icon}</span>
                      <span>{organelle.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation Breakdown for the Active Organelle */}
              {activeOrganelle && (
                <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md shadow-2xl relative overflow-hidden">
                  
                  {/* Top Header of Active Organelle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-inner"
                        style={{ backgroundColor: `${activeOrganelle.color}20`, borderColor: activeOrganelle.color }}
                      >
                        {activeOrganelle.icon}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          {activeOrganelle.name}
                        </h4>
                        <span className="text-xs font-mono text-cyan-400/80">
                          {activeOrganelle.scientificName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sound.playCellProbe();
                          setPanOffset({
                            x: -activeOrganelle.targetCoord.x * 0.5,
                            y: -activeOrganelle.targetCoord.y * 0.5
                          });
                          setZoomLevel(prev => Math.max(1200, prev));
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer hover:bg-cyan-900/60"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>توجيه العدسة نحو التركيب</span>
                      </button>

                      <button
                        onClick={handleTogglePathology}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                          isPathological 
                            ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                            : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>تبديل الحالة ({isPathological ? 'مرضي' : 'سليم'})</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Comparative Analysis Panels */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    
                    {/* 1. Healthy Physiological Role */}
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>الحالة والوظيفة في الجسم السليم</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeOrganelle.healthyFunction}
                      </p>
                    </div>

                    {/* 2. Pathological Damage */}
                    <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                        <AlertTriangle className="w-4 h-4" />
                        <span>ما الذي يصيبها عند المرض؟ (التلف المجهري)</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeOrganelle.pathologyDamage}
                      </p>
                    </div>

                    {/* 3. Clinical & Laboratory Significance */}
                    <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                        <Activity className="w-4 h-4" />
                        <span>الدلالة السريرية والأثر في الفحوصات</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeOrganelle.clinicalSignificance}
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>
          );
        })()}

      </div>
    </section>
  );
};
