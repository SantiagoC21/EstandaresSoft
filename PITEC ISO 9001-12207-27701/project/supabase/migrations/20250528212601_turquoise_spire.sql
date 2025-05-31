-- Crear base de datos
CREATE DATABASE PITEC_DB;
GO

USE PITEC_DB;
GO

-- Tabla de Auditorías
CREATE TABLE Audits (
    id INT IDENTITY(1,1) PRIMARY KEY,
    productId INT NOT NULL,
    productName NVARCHAR(255) NOT NULL,
    auditDate DATE NOT NULL,
    auditTime NVARCHAR(5) NOT NULL,
    assignedTo NVARCHAR(255) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Tabla de Feedback
CREATE TABLE Feedback (
    id INT IDENTITY(1,1) PRIMARY KEY,
    productId INT NOT NULL,
    userName NVARCHAR(255) NOT NULL,
    comment NVARCHAR(MAX) NOT NULL,
    rating INT NOT NULL,
    date DATE NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Tabla de Observaciones de Auditoría
CREATE TABLE AuditObservations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    auditId INT NOT NULL,
    processId INT NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    compliance INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (auditId) REFERENCES Audits(id)
);