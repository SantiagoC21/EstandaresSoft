const API_URL = 'http://localhost:3001/api';

export interface ISOStandard {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ISOClause {
  id: number;
  standard_id: number;
  clause_number: string;
  title: string;
  description: string | null;
  compliance_steps: string[];
  created_at: string;
}

export interface ProductISOCompliance {
  id: number;
  product_id: number;
  clause_id: number;
  is_compliant: boolean;
  notes: string | null;
  last_updated: string;
}

export const api = {
  async getISOStandards(): Promise<ISOStandard[]> {
    const response = await fetch(`${API_URL}/iso-standards`);
    if (!response.ok) {
      throw new Error('Failed to fetch ISO standards');
    }
    return response.json();
  },

  async getISOClauses(standardId: number): Promise<ISOClause[]> {
    const response = await fetch(`${API_URL}/iso-standards/${standardId}/clauses`);
    if (!response.ok) {
      throw new Error('Failed to fetch ISO clauses');
    }
    return response.json();
  },

  async getProductCompliance(productId: number): Promise<ProductISOCompliance[]> {
    const response = await fetch(`${API_URL}/products/${productId}/compliance`);
    if (!response.ok) {
      throw new Error('Failed to fetch product compliance');
    }
    return response.json();
  },

  async updateProductCompliance(
    productId: number,
    clauseId: number,
    data: { is_compliant: boolean; notes: string }
  ): Promise<void> {
    const response = await fetch(
      `${API_URL}/products/${productId}/compliance/${clauseId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to update product compliance');
    }
  },

  async createAudit(auditData: {
    productId: number;
    productName: string;
    date: string;
    time: string;
    assignedTo: string;
  }): Promise<{ id: number }> {
    const response = await fetch(`${API_URL}/audits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditData),
    });
    if (!response.ok) {
      throw new Error('Failed to create audit');
    }
    return response.json();
  },

  async getAudits() {
    const response = await fetch(`${API_URL}/audits`);
    if (!response.ok) {
      throw new Error('Failed to fetch audits');
    }
    return response.json();
  },

  async createFeedback(feedbackData: {
    productId: number;
    userName: string;
    comment: string;
    rating: number;
  }): Promise<{ id: number }> {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });
    if (!response.ok) {
      throw new Error('Failed to create feedback');
    }
    return response.json();
  },

  async getFeedback() {
    const response = await fetch(`${API_URL}/feedback`);
    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }
    return response.json();
  },
};