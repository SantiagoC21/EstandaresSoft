import React, { useState, useEffect } from 'react';
import { Check, X, ChevronDown, ChevronRight } from 'lucide-react';
import { api, ISOStandard, ISOClause, ProductISOCompliance } from '../services/api';

interface Props {
  productId: number;
}

export function ISOComplianceChecklist({ productId }: Props) {
  const [standards, setStandards] = useState<ISOStandard[]>([]);
  const [clauses, setClauses] = useState<{ [key: number]: ISOClause[] }>({});
  const [compliance, setCompliance] = useState<ProductISOCompliance[]>([]);
  const [expandedStandards, setExpandedStandards] = useState<number[]>([]);
  const [expandedClauses, setExpandedClauses] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [standardsData, complianceData] = await Promise.all([
          api.getISOStandards(),
          api.getProductCompliance(productId)
        ]);
        
        setStandards(standardsData);
        setCompliance(complianceData);
        
        // Fetch clauses for each standard
        const clausesData: { [key: number]: ISOClause[] } = {};
        await Promise.all(
          standardsData.map(async (standard) => {
            clausesData[standard.id] = await api.getISOClauses(standard.id);
          })
        );
        setClauses(clausesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ISO data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const toggleStandard = (standardId: number) => {
    setExpandedStandards(prev =>
      prev.includes(standardId)
        ? prev.filter(id => id !== standardId)
        : [...prev, standardId]
    );
  };

  const toggleClause = (clauseId: number) => {
    setExpandedClauses(prev =>
      prev.includes(clauseId)
        ? prev.filter(id => id !== clauseId)
        : [...prev, clauseId]
    );
  };

  const handleComplianceChange = async (clauseId: number, stepIndex: number, isCompliant: boolean) => {
    try {
      const existingCompliance = compliance.find(c => c.clause_id === clauseId);
      const currentSteps = existingCompliance?.notes ? JSON.parse(existingCompliance.notes) : {};
      const updatedSteps = { ...currentSteps, [stepIndex]: isCompliant };
      
      await api.updateProductCompliance(productId, clauseId, {
        is_compliant: Object.values(updatedSteps).every(step => step === true),
        notes: JSON.stringify(updatedSteps)
      });

      // Update local state
      const updatedCompliance = compliance.map(c =>
        c.clause_id === clauseId
          ? {
              ...c,
              is_compliant: Object.values(updatedSteps).every(step => step === true),
              notes: JSON.stringify(updatedSteps)
            }
          : c
      );

      if (!existingCompliance) {
        updatedCompliance.push({
          id: Date.now(),
          product_id: productId,
          clause_id: clauseId,
          is_compliant: Object.values(updatedSteps).every(step => step === true),
          notes: JSON.stringify(updatedSteps),
          last_updated: new Date().toISOString()
        });
      }

      setCompliance(updatedCompliance);
    } catch (error) {
      console.error('Error updating compliance:', error);
    }
  };

  const getStepCompliance = (clauseId: number, stepIndex: number): boolean => {
    const clauseCompliance = compliance.find(c => c.clause_id === clauseId);
    if (!clauseCompliance?.notes) return false;
    try {
      const steps = JSON.parse(clauseCompliance.notes);
      return steps[stepIndex] || false;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {standards.map(standard => (
        <div key={standard.id} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleStandard(standard.id)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              {expandedStandards.includes(standard.id) ? (
                <ChevronDown className="w-5 h-5 mr-2" />
              ) : (
                <ChevronRight className="w-5 h-5 mr-2" />
              )}
              <span className="font-medium">{standard.name}</span>
            </div>
          </button>

          {expandedStandards.includes(standard.id) && (
            <div className="p-4 space-y-4">
              {clauses[standard.id]?.map(clause => (
                <div key={clause.id} className="border rounded-lg">
                  <button
                    onClick={() => toggleClause(clause.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      {expandedClauses.includes(clause.id) ? (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-2" />
                      )}
                      <span>{clause.clause_number} - {clause.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {compliance.find(c => c.clause_id === clause.id)?.is_compliant ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Cumple
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          En Proceso
                        </span>
                      )}
                    </div>
                  </button>

                  {expandedClauses.includes(clause.id) && (
                    <div className="p-3 border-t space-y-2">
                      {clause.compliance_steps?.map((step, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{step}</span>
                          <button
                            onClick={() => handleComplianceChange(clause.id, index, !getStepCompliance(clause.id, index))}
                            className={`p-1 rounded-md transition-colors ${
                              getStepCompliance(clause.id, index)
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {getStepCompliance(clause.id, index) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}