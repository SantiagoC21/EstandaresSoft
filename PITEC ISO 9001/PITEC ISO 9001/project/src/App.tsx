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
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import ReactMarkdown from 'react-markdown';
import * as Tabs from '@radix-ui/react-tabs';
import 'react-day-picker/dist/style.css';

interface Product {
  id: number;
  name: string;
  icon: React.ReactNode;
  complianceScore: number;
  lastAudit: string;
  pendingTasks: number;
  processes: ProductProcess[];
}

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'requirements' | 'products' | 'schedules' | 'documentation' | 'feedback'>('dashboard');
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="https://i.imgur.com/YiNkCYb.png" 
                alt="PI-TEC Logo" 
                className="h-10 w-auto"
              />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Gestión ISO 9001</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-md ${
                  activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('requirements')}
                className={`px-3 py-2 rounded-md ${
                  activeTab === 'requirements' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Requisitos
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-2 rounded-md ${
                  activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Productos
              </button>
              <button
                onClick={() => setActiveTab('schedules')}
                className={`px-3 py-2 rounded-md ${
                  activeTab === 'schedules' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Auditorías
              </button>
              <button
                onClick={() => setActiveTab('documentation')}
                className={`px-3 py-2 rounded-md ${
                  activeTab === 'documentation' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Documentación
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-3 py-2 rounded-md ${
                  activeTab === 'feedback' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Feedback
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <BarChart3 className="w-10 h-10 text-blue-500" />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-700">Cumplimiento General</h2>
                    <p className="text-3xl font-bold text-blue-600">85.6%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ClipboardCheck className="w-10 h-10 text-green-500" />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-700">Tareas Completadas</h2>
                    <p className="text-3xl font-bold text-green-600">24/31</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <AlertCircle className="w-10 h-10 text-yellow-500" />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-700">Acciones Pendientes</h2>
                    <p className="text-3xl font-bold text-yellow-600">9</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Overview */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Cumplimiento de Productos</h2>
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        {product.icon}
                        <span className="ml-3 font-medium">{product.name}</span>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div>
                          <span className="text-sm text-gray-500">Puntuación de Cumplimiento</span>
                          <div className="text-lg font-semibold">{calculateOverallCompliance(product)}%</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Última Auditoría</span>
                          <div className="text-lg font-semibold">{product.lastAudit}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Tareas Pendientes</span>
                          <div className="text-lg font-semibold">{product.pendingTasks}</div>
                        </div>
                        <button
                          onClick={() => handleScheduleAudit(product)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Programar Auditoría
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Requisitos ISO 9001:2015</h2>
              <div className="space-y-4">
                {requirements.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(req.status)}
                      <div>
                        <div className="font-medium">{req.section} - {req.requirement}</div>
                        <div className="text-sm text-gray-500">Fecha límite: {req.dueDate}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(req.status)}`}>
                      {getStatusText(req.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
                  
                  {/* Procesos y Observaciones */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Procesos y Observaciones</h3>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Auditorías Programadas</h2>
              <div className="space-y-4">
                {scheduledAudits.map(audit => (
                  <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(audit.status)}
                      <div>
                        <div className="font-medium">{audit.productName}</div>
                        <div className="text-sm text-gray-500">
                          {audit.date && format(audit.date, 'dd/MM/yyyy')} - {audit.time}
                        </div>
                        <div className="text-sm text-gray-500">
                          Responsable: {audit.assignedTo}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(audit.status)}`}>
                      {getStatusText(audit.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documentation' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Documentación ISO 9001</h2>
              <Tabs.Root defaultValue="procedures">
                <Tabs.List className="flex border-b mb-4">
                  <Tabs.Trigger
                    value="procedures"
                    className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500 focus:outline-none"
                  >
                    Procedimientos
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="policies"
                    className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500 focus:outline-none"
                  >
                    Políticas
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="manuals"
                    className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500 focus:outline-none"
                  >
                    Manuales
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="procedures">
                  {isoDocuments.filter(doc => doc.type === 'procedure').map(doc => (
                    <div key={doc.id} className="mb-6 p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">{doc.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">Última actualización: {doc.lastUpdated}</p>
                      <div className="prose">
                        <ReactMarkdown>{doc.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </Tabs.Content>
                <Tabs.Content value="policies">
                  {isoDocuments.filter(doc => doc.type === 'policy').map(doc => (
                    <div key={doc.id} className="mb-6 p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">{doc.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">Última actualización: {doc.lastUpdated}</p>
                      <div className="prose">
                        <ReactMarkdown>{doc.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </Tabs.Content>
                <Tabs.Content value="manuals">
                  {isoDocuments.filter(doc => doc.type === 'manual').map(doc => (
                    <div key={doc.id} className="mb-6 p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">{doc.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">Última actualización: {doc.lastUpdated}</p>
                      <div className="prose">
                        <ReactMarkdown>{doc.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
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
                      onClick={() => {
                        setSelectedProductForFeedback(product);
                        setShowFeedbackModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Dar Feedback
                    </button>
                  </div>
                  <div className="space-y-4">
                    {feedbacks
                      .filter(f => f.productId === product.id)
                      .map(feedback => (
                        <div key={feedback.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{feedback.userName}</span>
                            <span className="text-sm text-gray-500">{feedback.date}</span>
                          </div>
                          <p className="text-gray-700">{feedback.comment}</p>
                          <div className="mt-2 flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Dar Feedback - {selectedProductForFeedback?.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={feedbackForm.userName}
                    onChange={(e) => setFeedbackForm({...feedbackForm, userName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario
                  </label>
                  <textarea
                    className="w-full border rounded-md p-2"
                    rows={4}
                    value={feedbackForm.comment}
                    onChange={(e) => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calificación
                  </label>
                  <div className="flex space-x-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFeedbackForm({...feedbackForm, rating: i + 1})}
                        className={`text-2xl ${
                          i < feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleFeedbackSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Programación de Auditoría */}
        {showAuditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Programar Auditoría - {selectedProduct?.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Auditoría
                  </label>
                  <div className="border rounded-md p-2">
                    <DayPicker
                      mode="single"
                      selected={auditSchedule.date}
                      onSelect={(date) => setAuditSchedule({...auditSchedule, date})}
                      locale={es}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded-md p-2"
                    value={auditSchedule.time}
                    onChange={(e) => setAuditSchedule({...auditSchedule, time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignar a
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="Nombre del responsable"
                    value={auditSchedule.assignedTo}
                    onChange={(e) => setAuditSchedule({...auditSchedule, assignedTo: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAuditModal(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveAudit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
