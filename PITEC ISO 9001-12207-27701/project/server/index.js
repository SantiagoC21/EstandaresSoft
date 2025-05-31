import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// ISO Standards endpoints
app.get('/api/iso-standards', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('iso_standards')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching ISO standards' });
  }
});

app.get('/api/iso-standards/:standardId/clauses', async (req, res) => {
  try {
    const { standardId } = req.params;
    const { data, error } = await supabase
      .from('iso_clauses')
      .select('*')
      .eq('standard_id', standardId);
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching clauses' });
  }
});

// Product ISO Compliance endpoints
app.get('/api/products/:productId/compliance', async (req, res) => {
  try {
    const { productId } = req.params;
    const { data, error } = await supabase
      .from('product_iso_compliance')
      .select('*')
      .eq('product_id', productId);
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching compliance' });
  }
});

app.put('/api/products/:productId/compliance/:clauseId', async (req, res) => {
  try {
    const { productId, clauseId } = req.params;
    const { is_compliant, notes } = req.body;
    
    const { data, error } = await supabase
      .from('product_iso_compliance')
      .upsert({
        product_id: productId,
        clause_id: clauseId,
        is_compliant,
        notes,
        last_updated: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating compliance' });
  }
});

// Audits endpoints
app.post('/api/audits', async (req, res) => {
  try {
    const { productId, productName, date, time, assignedTo } = req.body;
    
    const { data, error } = await supabase
      .from('audits')
      .insert({
        product_id: productId,
        product_name: productName,
        audit_date: date,
        audit_time: time,
        assigned_to: assignedTo,
        status: 'scheduled'
      })
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating audit' });
  }
});

app.get('/api/audits', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .order('audit_date', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching audits' });
  }
});

// Feedback endpoints
app.post('/api/feedback', async (req, res) => {
  try {
    const { productId, userName, comment, rating } = req.body;
    
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        product_id: productId,
        user_name: userName,
        comment,
        rating,
        date: new Date().toISOString().split('T')[0]
      })
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating feedback' });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching feedback' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});