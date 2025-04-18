-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS demo;

-- Create stock tasks table
CREATE TABLE demo.stock_tasks (
  task_number VARCHAR(50) PRIMARY KEY,
  created_by_name VARCHAR(100) NOT NULL,
  created_by_role VARCHAR(50) NOT NULL,
  assigned_to_name VARCHAR(100),
  product VARCHAR(255) NOT NULL,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  type VARCHAR(50),
  status VARCHAR(50),
  description TEXT,
  dimensions VARCHAR(100),
  weight NUMERIC,
  special_handling_instructions TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);