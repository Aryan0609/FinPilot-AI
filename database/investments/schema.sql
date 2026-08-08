CREATE TABLE mutual_funds (
    fund_id SERIAL PRIMARY KEY,
    fund_name VARCHAR(150) NOT NULL,
    fund_type VARCHAR(50),
    nav NUMERIC(10,2),
    risk_level VARCHAR(20),
    annual_return NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
