-- Create tables for PITEC_DB

-- Table: ISO Standards
CREATE TABLE IF NOT EXISTS iso_standards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: ISO Clauses
CREATE TABLE IF NOT EXISTS iso_clauses (
    id SERIAL PRIMARY KEY,
    standard_id INTEGER NOT NULL,
    clause_number VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    compliance_steps TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (standard_id) REFERENCES iso_standards(id)
);

-- Table: Product ISO Compliance
CREATE TABLE IF NOT EXISTS product_iso_compliance (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    clause_id INTEGER NOT NULL,
    is_compliant BOOLEAN DEFAULT false,
    notes TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clause_id) REFERENCES iso_clauses(id)
);

-- Table: Audits
CREATE TABLE IF NOT EXISTS audits (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    standard_id INTEGER NOT NULL,
    audit_date DATE NOT NULL,
    audit_time VARCHAR(5) NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (standard_id) REFERENCES iso_standards(id)
);

-- Table: Feedback
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Audit Observations
CREATE TABLE IF NOT EXISTS audit_observations (
    id SERIAL PRIMARY KEY,
    audit_id INTEGER NOT NULL,
    process_id INTEGER NOT NULL,
    clause_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    compliance INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audits(id),
    FOREIGN KEY (clause_id) REFERENCES iso_clauses(id)
);

-- Insert ISO Standards
INSERT INTO iso_standards (name, description) VALUES
('ISO 9001:2015', 'Sistema de Gestión de Calidad'),
('ISO/IEC 12207:2017', 'Procesos del Ciclo de Vida del Software'),
('ISO/IEC 27701:2019', 'Sistema de Gestión de Información de Privacidad');

-- Insert ISO 9001:2015 Clauses
INSERT INTO iso_clauses (standard_id, clause_number, title, description, compliance_steps) VALUES
(1, '4', 'Contexto de la organización', 'Comprensión de la organización y su contexto', 
    ARRAY[
        '1. Realizar análisis interno y externo (FODA, PESTEL)',
        '2. Identificar partes interesadas y sus necesidades',
        '3. Definir el alcance del sistema de gestión'
    ]),
(1, '5', 'Liderazgo', 'Liderazgo y compromiso', 
    ARRAY[
        '1. Definir política de calidad',
        '2. Asignar responsabilidades claras',
        '3. Comunicar compromiso al equipo',
        '4. Revisar periódicamente la política'
    ]),
(1, '6', 'Planificación', 'Planificación del sistema de gestión de calidad', 
    ARRAY[
        '1. Identificar riesgos y oportunidades',
        '2. Definir objetivos de calidad',
        '3. Establecer planes para mitigación y mejora',
        '4. Documentar todo'
    ]);

-- Insert ISO/IEC 12207:2017 Clauses
INSERT INTO iso_clauses (standard_id, clause_number, title, description, compliance_steps) VALUES
(2, '6', 'Procesos del ciclo de vida del software', 'Gestión de procesos del software', 
    ARRAY[
        '1. Documentar todos los procesos desde adquisición hasta mantenimiento',
        '2. Asignar responsables para cada proceso',
        '3. Revisar y actualizar procesos regularmente'
    ]),
(2, '6.3', 'Gestión de riesgos', 'Gestión de riesgos del software', 
    ARRAY[
        '1. Identificar riesgos',
        '2. Analizar probabilidad e impacto',
        '3. Planificar mitigación',
        '4. Monitorear riesgos continuamente'
    ]);

-- Insert ISO/IEC 27701:2019 Clauses
INSERT INTO iso_clauses (standard_id, clause_number, title, description, compliance_steps) VALUES
(3, '5.2', 'Evaluación de riesgos de privacidad', 'Gestión de riesgos de privacidad', 
    ARRAY[
        '1. Identificar datos personales procesados',
        '2. Evaluar riesgos para la privacidad',
        '3. Definir controles para mitigar riesgos',
        '4. Revisar evaluación periódicamente'
    ]),
(3, '6', 'Controles de privacidad', 'Implementación de controles de privacidad', 
    ARRAY[
        '1. Definir políticas y procedimientos de privacidad',
        '2. Gestionar consentimiento y derechos de los interesados',
        '3. Implementar medidas técnicas y organizativas',
        '4. Auditar controles'
    ]);