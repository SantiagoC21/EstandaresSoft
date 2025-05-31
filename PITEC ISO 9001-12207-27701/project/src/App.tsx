import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Database, 
  Brain, 
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  FileText,
  ListChecks,
  MessageSquare,
  Book,
  ArrowRight,
  Send,
  Bot,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import ReactMarkdown from 'react-markdown';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import OpenAI from 'openai';
import 'react-day-picker/dist/style.css';
import { ISOComplianceChecklist } from './components/ISOComplianceChecklist';

interface Product {
  id: number;
  name: string;
  icon: React.ReactNode;
  complianceScore: number;
  lastAudit: string;
  pendingTasks: number;
  processes: ProductProcess[];
}

const [products, setProducts] = useState<Product[]>([]);

interface ProductProcess {
  id: number;
  name: string;
  observations: ProcessObservation[];
}

interface ProcessObservation {
  id: number;
  description: string;
  auditDate: string;
  status: 'pending' | 'completed';
  compliance: number;
}

interface ISORequirement {
  id: number;
  section: string;
  requirement: string;
  status: 'compliant' | 'in-progress' | 'non-compliant';
  dueDate: string;
}

interface AuditSchedule {
  id: number;
  productId: number;
  productName: string;
  date: Date | undefined;
  time: string;
  assignedTo: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Feedback {
  id: number;
  productId: number;
  userName: string;
  comment: string;
  rating: number;
  date: string;
}

interface ISODocument {
  id: number;
  title: string;
  type: 'procedure' | 'policy' | 'manual';
  content: string;
  lastUpdated: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'requirements' | 'products' | 'schedules' | 'documentation' | 'feedback' | 'chat'>('dashboard');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProcessId, setSelectedProcessId] = useState<number | null>(null);
  const [auditSchedule, setAuditSchedule] = useState<Omit<AuditSchedule, 'id' | 'productId' | 'productName' | 'status'>>({
    date: undefined,
    time: '',
    assignedTo: ''
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProductForFeedback, setSelectedProductForFeedback] = useState<Product | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    userName: '',
    comment: '',
    rating: 5
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true
  });

  const [scheduledAudits, setScheduledAudits] = useState<AuditSchedule[]>([
    {
      id: 1,
      productId: 1,
      productName: "Sistema CRM",
      date: new Date(2024, 2, 15),
      time: "10:00",
      assignedTo: "Juan Pérez",
      status: 'scheduled'
    },
    {
      id: 2,
      productId: 2,
      productName: "Sistema de Gestión de Activos",
      date: new Date(2024, 2, 20),
      time: "14:30",
      assignedTo: "María García",
      status: 'completed'
    }
  ]);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: 1,
      productId: 1,
      userName: "Carlos Rodríguez",
      comment: "El CRM ha mejorado significativamente nuestra gestión de clientes",
      rating: 5,
      date: "01/03/2024"
    },
    {
      id: 2,
      productId: 2,
      userName: "Ana Martínez",
      comment: "Necesita mejoras en la interfaz de usuario",
      rating: 3,
      date: "02/03/2024"
    }
  ]);

  const isoDocuments: ISODocument[] = [
    {
      id: 1,
      title: "Procedimiento de Control de Documentos",
      type: "procedure",
      content: `# Control de Documentos
## 1. Objetivo
Establecer los lineamientos para el control de documentos del Sistema de Gestión de Calidad.

## 2. Alcance
Aplica a todos los documentos del Sistema de Gestión de Calidad.

## 3. Responsabilidades
- Gerencia de Calidad
- Líderes de Proceso
- Personal en general`,
      lastUpdated: "01/03/2024"
    },
    {
      id: 2,
      title: "Política de Calidad",
      type: "policy",
      content: `# Política de Calidad
PI-TEC se compromete a:
- Satisfacer las necesidades de nuestros clientes
- Mejorar continuamente nuestros procesos
- Cumplir con los requisitos legales y reglamentarios`,
      lastUpdated: "28/02/2024"
    }
  ];

  const products: Product[] = [
    {
      id: 1,
      name: "Sistema CRM",
      icon: <Users className="w-6 h-6" />,
      complianceScore: 87,
      lastAudit: "15/02/2024",
      pendingTasks: 3,
      processes: [
        {
          id: 1,
          name: "Registro de Clientes",
          observations: [
            {
              id: 1,
              description: "Falta validación de correos duplicados",
              auditDate: "15/02/2024",
              status: 'completed',
              compliance: 90
            },
            {
              id: 2,
              description: "No se registra historial de cambios",
              auditDate: "15/02/2024",
              status: 'pending',
              compliance: 60
            }
          ]
        },
        {
          id: 2,
          name: "Gestión de Oportunidades",
          observations: [
            {
              id: 3,
              description: "Proceso de seguimiento no documentado",
              auditDate: "15/02/2024",
              status: 'pending',
              compliance: 70
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Sistema de Gestión de Activos",
      icon: <Database className="w-6 h-6" />,
      complianceScore: 92,
      lastAudit: "20/02/2024",
      pendingTasks: 1,
      processes: [
        {
          id: 3,
          name: "Registro de Activos",
          observations: [
            {
              id: 4,
              description: "Falta categorización automática",
              auditDate: "20/02/2024",
              status: 'completed',
              compliance: 95
            }
          ]
        },
        {
          id: 4,
          name: "Mantenimiento Preventivo",
          observations: [
            {
              id: 5,
              description: "Alertas no configuradas",
              auditDate: "20/02/2024",
              status: 'pending',
              compliance: 80
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "IA de Gestión Documentaria",
      icon: <Brain className="w-6 h-6" />,
      complianceScore: 78,
      lastAudit: "10/02/2024",
      pendingTasks: 5,
      processes: [
        {
          id: 5,
          name: "Clasificación de Documentos",
          observations: [
            {
              id: 6,
              description: "Precisión del modelo por debajo del 90%",
              auditDate: "10/02/2024",
              status: 'pending',
              compliance: 75
            }
          ]
        },
        {
          id: 6,
          name: "Extracción de Datos",
          observations: [
            {
              id: 7,
              description: "No procesa documentos escaneados",
              auditDate: "10/02/2024",
              status: 'pending',
              compliance: 65
            }
          ]
        }
      ]
    }
  ];

  const requirements: ISORequirement[] = [
    {
      id: 1,
      section: "4.1",
      requirement: "Comprensión de la organización y su contexto",
      status: "compliant",
      dueDate: "30/03/2024"
    },
    {
      id: 2,
      section: "4.2",
      requirement: "Comprensión de las necesidades y expectativas de las partes interesadas",
      status: "in-progress",
      dueDate: "15/04/2024"
    },
    {
      id: 3,
      section: "4.4",
      requirement: "Sistema de gestión de calidad y sus procesos",
      status: "non-compliant",
      dueDate: "25/03/2024"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
      case 'pending':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress':
      case 'scheduled':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'non-compliant':
      case 'pending':
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'Cumple';
      case 'in-progress':
        return 'En Proceso';
      case 'non-compliant':
        return 'No Cumple';
      case 'completed':
        return 'Completada';
      case 'scheduled':
        return 'Programada';
      case 'cancelled':
        return 'Cancelada';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const handleScheduleAudit = (product: Product) => {
    setSelectedProduct(product);
    setShowAuditModal(true);
  };

  const handleSaveAudit = () => {
    if (selectedProduct && auditSchedule.date) {
      const newAudit: AuditSchedule = {
        id: scheduledAudits.length + 1,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        date: auditSchedule.date,
        time: auditSchedule.time,
        assignedTo: auditSchedule.assignedTo,
        status: 'scheduled'
      };
      setScheduledAudits([...scheduledAudits, newAudit]);
      setShowAuditModal(false);
      setAuditSchedule({
        date: undefined,
        time: '',
        assignedTo: ''
      });
    }
  };

  const handleFeedbackSubmit = () => {
    if (selectedProductForFeedback) {
      const newFeedback: Feedback = {
        id: feedbacks.length + 1,
        productId: selectedProductForFeedback.id,
        userName: feedbackForm.userName,
        comment: feedbackForm.comment,
        rating: feedbackForm.rating,
        date: format(new Date(), 'dd/MM/yyyy')
      };
      setFeedbacks([...feedbacks, newFeedback]);
      setShowFeedbackModal(false);
      setFeedbackForm({ userName: '', comment: '', rating: 5 });
    }
  };

  const calculateOverallCompliance = (product: Product) => {
    let totalCompliance = 0;
    let totalObservations = 0;

    product.processes.forEach(process => {
      process.observations.forEach(observation => {
        totalCompliance += observation.compliance;
        totalObservations++;
      });
    });

    return totalObservations > 0 ? Math.round(totalCompliance / totalObservations) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header remains the same */}
      <header className="bg-white shadow">
        {/* ... Header content remains the same ... */}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ... Other tab contents remain the same ... */}

        {activeTab === 'products' && (
          <div className="space-y-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {product.icon}
                      <h2 className="text-xl font-semibold text-gray-800 ml-2">{product.name}</h2>
                    </div>
                    <button
                      onClick={() => handleScheduleAudit(product)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Programar Auditoría
                    </button>
                  </div>

                  <Tabs.Root defaultValue="compliance">
                    <Tabs.List className="flex border-b mb-4">
                      <Tabs.Trigger
                        value="compliance"
                        className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500 focus:outline-none"
                      >
                        Cumplimiento ISO
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        value="processes"
                        className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500 focus:outline-none"
                      >
                        Procesos y Observaciones
                      </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="compliance">
                      <ISOComplianceChecklist productId={product.id} />
                    </Tabs.Content>

                    <Tabs.Content value="processes">
                      <div className="space-y-4">
                        {product.processes.map(process => (
                          <div key={process.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-md font-medium">{process.name}</h4>
                              <button
                                onClick={() => setSelectedProcessId(selectedProcessId === process.id ? null : process.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {selectedProcessId === process.id ? 'Ocultar' : 'Ver'} Observaciones
                              </button>
                            </div>
                            
                            {selectedProcessId === process.id && (
                              <div className="space-y-3 mt-3">
                                {process.observations.map(obs => (
                                  <div key={obs.id} className="bg-gray-50 p-3 rounded-md">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-sm">{obs.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Fecha de auditoría: {obs.auditDate}
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(obs.status)}`}>
                                          {getStatusText(obs.status)}
                                        </span>
                                        <span className="text-sm font-medium">
                                          {obs.compliance}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Tabs.Content>
                  </Tabs.Root>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ... Rest of the tab contents remain the same ... */}
      </main>

      {/* ... Rest of the components (Chatbot Button, Dialog, etc.) remain the same ... */}
    </div>
  );
}

export default App;