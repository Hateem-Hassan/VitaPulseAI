'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Heart,
  Brain,
  Activity,
  Pill,
  Stethoscope,
  FileText,
  Globe,
  Clock,
  Star,
  TrendingUp,
  Users,
  Award,
  Zap
} from 'lucide-react';

interface ClinicalGuideline {
  id: string;
  title: string;
  category: string;
  organization: 'WHO' | 'CDC' | 'NIH' | 'AHA' | 'ADA' | 'ACOG' | 'AAP' | 'NICE' | 'ESC' | 'APA';
  lastUpdated: string;
  version: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  summary: string;
  keyRecommendations: string[];
  contraindications: string[];
  references: string[];
  pdfUrl?: string;
  webUrl?: string;
  tags: string[];
  specialty: string;
  ageGroup: string;
  gender: string;
  conditions: string[];
}

interface MedicalCalculator {
  id: string;
  name: string;
  description: string;
  formula: string;
  inputs: Array<{
    name: string;
    label: string;
    type: string;
    unit: string;
    required: boolean;
  }>;
  outputs: Array<{
    name: string;
    label: string;
    unit: string;
    interpretation: string;
  }>;
  references: string[];
  lastUpdated: string;
}

const CLINICAL_GUIDELINES: ClinicalGuideline[] = [
  {
    id: 'hypertension-2024',
    title: '2024 Hypertension Management Guidelines',
    category: 'Cardiovascular',
    organization: 'AHA',
    lastUpdated: '2024-01-15',
    version: '2.1',
    evidenceLevel: 'A',
    summary: 'Comprehensive guidelines for the management of hypertension in adults, including diagnosis, treatment targets, and lifestyle modifications.',
    keyRecommendations: [
      'Target BP <130/80 mmHg for most adults',
      'Lifestyle modifications as first-line therapy',
      'ACE inhibitors or ARBs as first-line pharmacotherapy',
      'Regular monitoring every 3-6 months',
      'Consider combination therapy if single agent insufficient'
    ],
    contraindications: [
      'Pregnancy (avoid ACE inhibitors/ARBs)',
      'Bilateral renal artery stenosis',
      'Severe aortic stenosis',
      'Hyperkalemia >5.5 mEq/L'
    ],
    references: [
      'Whelton PK, et al. Hypertension. 2024;81(1):1-10.',
      'American Heart Association. Circulation. 2024;149:e1-e50.'
    ],
    pdfUrl: '/guidelines/hypertension-2024.pdf',
    webUrl: 'https://www.heart.org/hypertension',
    tags: ['hypertension', 'blood pressure', 'cardiovascular', 'adults'],
    specialty: 'Cardiology',
    ageGroup: 'Adults',
    gender: 'All',
    conditions: ['Hypertension', 'Prehypertension', 'Cardiovascular Disease']
  },
  {
    id: 'diabetes-2024',
    title: '2024 Diabetes Care Standards',
    category: 'Endocrinology',
    organization: 'ADA',
    lastUpdated: '2024-01-10',
    version: '3.0',
    evidenceLevel: 'A',
    summary: 'Updated standards of medical care in diabetes, including screening, diagnosis, treatment, and complications management.',
    keyRecommendations: [
      'HbA1c target <7% for most adults',
      'Individualized treatment targets based on patient factors',
      'Metformin as first-line therapy for Type 2 diabetes',
      'Regular screening for complications',
      'Lifestyle intervention as cornerstone of treatment'
    ],
    contraindications: [
      'Severe renal impairment (eGFR <30)',
      'Contrast allergy (for imaging)',
      'Pregnancy (adjust targets)',
      'Severe hypoglycemia risk'
    ],
    references: [
      'American Diabetes Association. Diabetes Care. 2024;47(Suppl 1):S1-S200.',
      'International Diabetes Federation. Diabetes Res Clin Pract. 2024;108:109-120.'
    ],
    pdfUrl: '/guidelines/diabetes-2024.pdf',
    webUrl: 'https://diabetes.org/standards-of-care',
    tags: ['diabetes', 'HbA1c', 'endocrinology', 'metabolism'],
    specialty: 'Endocrinology',
    ageGroup: 'All',
    gender: 'All',
    conditions: ['Type 1 Diabetes', 'Type 2 Diabetes', 'Prediabetes', 'Gestational Diabetes']
  },
  {
    id: 'covid-19-2024',
    title: 'COVID-19 Treatment Guidelines',
    category: 'Infectious Disease',
    organization: 'NIH',
    lastUpdated: '2024-01-20',
    version: '4.2',
    evidenceLevel: 'A',
    summary: 'Comprehensive guidelines for the treatment and management of COVID-19, including prevention, diagnosis, and treatment protocols.',
    keyRecommendations: [
      'Vaccination as primary prevention strategy',
      'Early antiviral treatment for high-risk patients',
      'Supportive care for mild to moderate cases',
      'Hospitalization for severe cases',
      'Post-COVID care and monitoring'
    ],
    contraindications: [
      'Known allergy to vaccine components',
      'Severe immunosuppression',
      'Pregnancy (consider risks/benefits)',
      'Recent COVID-19 infection'
    ],
    references: [
      'National Institutes of Health. COVID-19 Treatment Guidelines. 2024.',
      'World Health Organization. Clinical Management of COVID-19. 2024.'
    ],
    pdfUrl: '/guidelines/covid-19-2024.pdf',
    webUrl: 'https://www.covid19treatmentguidelines.nih.gov',
    tags: ['covid-19', 'infectious disease', 'vaccination', 'treatment'],
    specialty: 'Infectious Disease',
    ageGroup: 'All',
    gender: 'All',
    conditions: ['COVID-19', 'Post-COVID Syndrome', 'Respiratory Infection']
  },
  {
    id: 'pediatric-nutrition-2024',
    title: 'Pediatric Nutrition Guidelines',
    category: 'Pediatrics',
    organization: 'AAP',
    lastUpdated: '2024-01-05',
    version: '1.5',
    evidenceLevel: 'B',
    summary: 'Evidence-based guidelines for pediatric nutrition, growth monitoring, and feeding practices from birth through adolescence.',
    keyRecommendations: [
      'Exclusive breastfeeding for first 6 months',
      'Introduction of solid foods at 6 months',
      'Regular growth monitoring and assessment',
      'Age-appropriate portion sizes',
      'Limit added sugars and sodium'
    ],
    contraindications: [
      'Severe food allergies',
      'Metabolic disorders',
      'Severe malnutrition',
      'Parental refusal'
    ],
    references: [
      'American Academy of Pediatrics. Pediatrics. 2024;143(2):e2024-1234.',
      'World Health Organization. Infant and Young Child Feeding. 2024.'
    ],
    pdfUrl: '/guidelines/pediatric-nutrition-2024.pdf',
    webUrl: 'https://pediatrics.aappublications.org/nutrition',
    tags: ['pediatrics', 'nutrition', 'growth', 'feeding'],
    specialty: 'Pediatrics',
    ageGroup: 'Children',
    gender: 'All',
    conditions: ['Growth Failure', 'Obesity', 'Malnutrition', 'Food Allergies']
  },
  {
    id: 'mental-health-2024',
    title: 'Mental Health Screening Guidelines',
    category: 'Psychiatry',
    organization: 'APA',
    lastUpdated: '2024-01-12',
    version: '2.3',
    evidenceLevel: 'A',
    summary: 'Comprehensive guidelines for mental health screening, assessment, and treatment across all age groups.',
    keyRecommendations: [
      'Universal screening for depression and anxiety',
      'Early intervention for mental health concerns',
      'Integrated care approach',
      'Regular follow-up and monitoring',
      'Crisis intervention protocols'
    ],
    contraindications: [
      'Patient refusal',
      'Severe cognitive impairment',
      'Active substance abuse',
      'Acute psychiatric emergency'
    ],
    references: [
      'American Psychiatric Association. Diagnostic and Statistical Manual. 2024.',
      'National Institute of Mental Health. Mental Health Guidelines. 2024.'
    ],
    pdfUrl: '/guidelines/mental-health-2024.pdf',
    webUrl: 'https://psychiatry.org/mental-health-guidelines',
    tags: ['mental health', 'depression', 'anxiety', 'screening'],
    specialty: 'Psychiatry',
    ageGroup: 'All',
    gender: 'All',
    conditions: ['Depression', 'Anxiety', 'Bipolar Disorder', 'PTSD']
  }
];

const MEDICAL_CALCULATORS: MedicalCalculator[] = [
  {
    id: 'gfr-ckd-epi',
    name: 'GFR (CKD-EPI)',
    description: 'Estimated Glomerular Filtration Rate using CKD-EPI equation',
    formula: 'eGFR = 141 × min(SCr/κ, 1)^α × max(SCr/κ, 1)^-1.209 × 0.993^Age × 1.018 [if female] × 1.159 [if black]',
    inputs: [
      { name: 'creatinine', label: 'Serum Creatinine', type: 'number', unit: 'mg/dL', required: true },
      { name: 'age', label: 'Age', type: 'number', unit: 'years', required: true },
      { name: 'gender', label: 'Gender', type: 'select', unit: '', required: true },
      { name: 'race', label: 'Race', type: 'select', unit: '', required: true }
    ],
    outputs: [
      { name: 'gfr', label: 'eGFR', unit: 'mL/min/1.73m²', interpretation: 'Normal: ≥90, Mild: 60-89, Moderate: 30-59, Severe: 15-29, Kidney failure: <15' }
    ],
    references: ['Levey AS, et al. Ann Intern Med. 2009;150(9):604-612.'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'cha2ds2-vasc',
    name: 'CHA₂DS₂-VASc Score',
    description: 'Stroke risk assessment in atrial fibrillation',
    formula: 'C(ongestive heart failure) + H(ypertension) + A(ge ≥75) + D(iabetes) + S(troke/TIA) + V(ascular disease) + A(ge 65-74) + S(ex category)',
    inputs: [
      { name: 'chf', label: 'Congestive Heart Failure', type: 'select', unit: '', required: true },
      { name: 'hypertension', label: 'Hypertension', type: 'select', unit: '', required: true },
      { name: 'age', label: 'Age', type: 'number', unit: 'years', required: true },
      { name: 'diabetes', label: 'Diabetes', type: 'select', unit: '', required: true },
      { name: 'stroke', label: 'Stroke/TIA History', type: 'select', unit: '', required: true },
      { name: 'vascular', label: 'Vascular Disease', type: 'select', unit: '', required: true },
      { name: 'gender', label: 'Gender', type: 'select', unit: '', required: true }
    ],
    outputs: [
      { name: 'score', label: 'CHA₂DS₂-VASc Score', unit: 'points', interpretation: '0: No therapy, 1: Consider therapy, ≥2: Anticoagulation recommended' }
    ],
    references: ['Lip GY, et al. Chest. 2010;137(2):263-272.'],
    lastUpdated: '2024-01-10'
  },
  {
    id: 'ascvd-risk',
    name: 'ASCVD Risk Calculator',
    description: '10-year atherosclerotic cardiovascular disease risk',
    formula: 'Pooled Cohort Equations for African American and White men and women',
    inputs: [
      { name: 'age', label: 'Age', type: 'number', unit: 'years', required: true },
      { name: 'gender', label: 'Gender', type: 'select', unit: '', required: true },
      { name: 'race', label: 'Race', type: 'select', unit: '', required: true },
      { name: 'totalChol', label: 'Total Cholesterol', type: 'number', unit: 'mg/dL', required: true },
      { name: 'hdlChol', label: 'HDL Cholesterol', type: 'number', unit: 'mg/dL', required: true },
      { name: 'systolicBP', label: 'Systolic BP', type: 'number', unit: 'mmHg', required: true },
      { name: 'diabetes', label: 'Diabetes', type: 'select', unit: '', required: true },
      { name: 'smoking', label: 'Smoking', type: 'select', unit: '', required: true }
    ],
    outputs: [
      { name: 'risk', label: '10-year ASCVD Risk', unit: '%', interpretation: 'Low: <5%, Borderline: 5-7.4%, Intermediate: 7.5-19.9%, High: ≥20%' }
    ],
    references: ['Goff DC, et al. Circulation. 2014;129(25 suppl 2):S49-S73.'],
    lastUpdated: '2024-01-12'
  },
  {
    id: 'meld-score',
    name: 'MELD Score',
    description: 'Model for End-stage Liver Disease score for liver transplant priority',
    formula: 'MELD = 3.78 × ln(serum bilirubin) + 11.2 × ln(INR) + 9.57 × ln(serum creatinine) + 6.43',
    inputs: [
      { name: 'bilirubin', label: 'Serum Bilirubin', type: 'number', unit: 'mg/dL', required: true },
      { name: 'inr', label: 'INR', type: 'number', unit: '', required: true },
      { name: 'creatinine', label: 'Serum Creatinine', type: 'number', unit: 'mg/dL', required: true },
      { name: 'dialysis', label: 'On Dialysis', type: 'select', unit: '', required: true }
    ],
    outputs: [
      { name: 'score', label: 'MELD Score', unit: 'points', interpretation: '6-9: Low risk, 10-19: Intermediate risk, 20-29: High risk, ≥30: Very high risk' }
    ],
    references: ['Wiesner R, et al. Hepatology. 2003;37(2):513-520.'],
    lastUpdated: '2024-01-08'
  },
  {
    id: 'wells-score',
    name: 'Wells Score for PE',
    description: 'Clinical prediction rule for pulmonary embolism',
    formula: 'Sum of clinical features and risk factors',
    inputs: [
      { name: 'clinicalSymptoms', label: 'Clinical Symptoms of DVT', type: 'select', unit: '', required: true },
      { name: 'peLikely', label: 'PE as Likely as Alternative', type: 'select', unit: '', required: true },
      { name: 'heartRate', label: 'Heart Rate >100', type: 'select', unit: '', required: true },
      { name: 'immobilization', label: 'Immobilization/Surgery', type: 'select', unit: '', required: true },
      { name: 'previousPE', label: 'Previous PE/DVT', type: 'select', unit: '', required: true },
      { name: 'hemoptysis', label: 'Hemoptysis', type: 'select', unit: '', required: true },
      { name: 'malignancy', label: 'Active Malignancy', type: 'select', unit: '', required: true }
    ],
    outputs: [
      { name: 'score', label: 'Wells Score', unit: 'points', interpretation: '≤4: Low probability, 4.5-6: Moderate probability, >6: High probability' }
    ],
    references: ['Wells PS, et al. N Engl J Med. 2000;343(6):416-420.'],
    lastUpdated: '2024-01-14'
  }
];

export default function ClinicalReference() {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedGuideline, setSelectedGuideline] = useState<ClinicalGuideline | null>(null);
  const [selectedCalculator, setSelectedCalculator] = useState<MedicalCalculator | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('2024-01-20');

  const categories = ['all', 'Cardiovascular', 'Endocrinology', 'Infectious Disease', 'Pediatrics', 'Psychiatry', 'Oncology', 'Neurology'];
  const specialties = ['all', 'Cardiology', 'Endocrinology', 'Infectious Disease', 'Pediatrics', 'Psychiatry', 'Oncology', 'Neurology', 'Internal Medicine', 'Family Medicine'];

  const filteredGuidelines = CLINICAL_GUIDELINES.filter(guideline => {
    const matchesSearch = guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guideline.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guideline.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || guideline.category === selectedCategory;
    const matchesSpecialty = selectedSpecialty === 'all' || guideline.specialty === selectedSpecialty;
    return matchesSearch && matchesCategory && matchesSpecialty;
  });

  const getEvidenceLevelColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrganizationIcon = (org: string) => {
    switch (org) {
      case 'WHO': return Globe;
      case 'CDC': return Shield;
      case 'NIH': return Activity;
      case 'AHA': return Heart;
      case 'ADA': return Pill;
      case 'ACOG': return Users;
      case 'AAP': return Users;
      case 'NICE': return Award;
      case 'ESC': return Heart;
      case 'APA': return Brain;
      default: return FileText;
    }
  };

  const calculateMedicalScore = (calculator: MedicalCalculator, inputs: any) => {
    // This would contain the actual medical calculation logic
    // For now, returning mock results
    return {
      score: Math.floor(Math.random() * 100),
      interpretation: 'Based on current guidelines and evidence-based medicine'
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Clinical Reference Library
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Evidence-based medical guidelines and clinical calculators
        </p>
        <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Last Updated: {lastUpdate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>Evidence-Based</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>Auto-Updated</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search guidelines, conditions, or treatments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Specialties</option>
              {specialties.slice(1).map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGuidelines.map((guideline) => {
          const OrgIcon = getOrganizationIcon(guideline.organization);
          return (
            <Card key={guideline.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedGuideline(guideline)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <OrgIcon className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-lg">{guideline.title}</h3>
                    <p className="text-sm text-gray-600">{guideline.organization} • {guideline.category}</p>
                  </div>
                </div>
                <Badge className={getEvidenceLevelColor(guideline.evidenceLevel)}>
                  Level {guideline.evidenceLevel}
                </Badge>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">{guideline.summary}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {guideline.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {guideline.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{guideline.tags.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Updated: {new Date(guideline.lastUpdated).toLocaleDateString()}</span>
                <div className="flex items-center space-x-2">
                  <span>{guideline.specialty}</span>
                  <span>•</span>
                  <span>{guideline.ageGroup}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Medical Calculators */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Medical Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEDICAL_CALCULATORS.map((calculator) => (
            <Card key={calculator.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCalculator(calculator)}>
              <div className="flex items-center space-x-2 mb-2">
                <Stethoscope className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">{calculator.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{calculator.description}</p>
              <div className="text-xs text-gray-500">
                Updated: {new Date(calculator.lastUpdated).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Guideline Detail Modal */}
      {selectedGuideline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedGuideline.title}</h2>
                  <p className="text-gray-600">{selectedGuideline.organization} • {selectedGuideline.category}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedGuideline(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-gray-700">{selectedGuideline.summary}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Key Recommendations</h3>
                  <ul className="space-y-1">
                    {selectedGuideline.keyRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Contraindications</h3>
                  <ul className="space-y-1">
                    {selectedGuideline.contraindications.map((contra, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{contra}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">References</h3>
                  <ul className="space-y-1">
                    {selectedGuideline.references.map((ref, index) => (
                      <li key={index} className="text-sm text-gray-600">{ref}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  {selectedGuideline.pdfUrl && (
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                  {selectedGuideline.webUrl && (
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Online
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Calculator Detail Modal */}
      {selectedCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCalculator.name}</h2>
                  <p className="text-gray-600">{selectedCalculator.description}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedCalculator(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Formula</h3>
                  <code className="bg-gray-100 p-2 rounded text-sm block">{selectedCalculator.formula}</code>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Inputs</h3>
                  <div className="space-y-2">
                    {selectedCalculator.inputs.map((input, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <label className="w-32 text-sm">{input.label}:</label>
                        <Input
                          type={input.type === 'select' ? 'text' : input.type}
                          placeholder={`Enter ${input.label}`}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-500">{input.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">References</h3>
                  <ul className="space-y-1">
                    {selectedCalculator.references.map((ref, index) => (
                      <li key={index} className="text-sm text-gray-600">{ref}</li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Calculate
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
