--
-- PostgreSQL database dump
--

\restrict Mama4l9WELN3tmWr1BXgupL3UyTjkh1xEWDkhQUunx9SKtRzHFw7ObOq4nvy7cd

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: bank_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bank_accounts VALUES (1, 1, 607094864113, 'SAVINGS', 125000.50, 'ACTIVE', '2026-07-25 20:18:38.998681');
INSERT INTO public.bank_accounts VALUES (2, 2, 136410289065, 'SAVINGS', 89500.00, 'ACTIVE', '2026-07-25 20:18:38.998681');
INSERT INTO public.bank_accounts VALUES (3, 3, 979612868280, 'SAVINGS', 45000.75, 'ACTIVE', '2026-07-25 20:18:38.998681');
INSERT INTO public.bank_accounts VALUES (4, 4, 162134716875, 'SAVINGS', 210000.00, 'ACTIVE', '2026-07-25 20:18:38.998681');
INSERT INTO public.bank_accounts VALUES (5, 5, 289151296346, 'SAVINGS', 67000.25, 'ACTIVE', '2026-07-25 20:18:38.998681');
INSERT INTO public.bank_accounts VALUES (6, 6, 368760125019, 'SAVINGS', 98500.00, 'ACTIVE', '2026-07-25 20:18:38.998681');
INSERT INTO public.bank_accounts VALUES (7, 7, 254444296027, 'SAVINGS', 350000.40, 'ACTIVE', '2026-07-25 20:18:38.998681');
INSERT INTO public.bank_accounts VALUES (8, 8, 571120935862, 'SAVINGS', 12800.50, 'ACTIVE', '2026-07-25 20:18:38.998681');
INSERT INTO public.bank_accounts VALUES (9, 9, 361733325945, 'SAVINGS', 77500.90, 'ACTIVE', '2026-07-25 20:18:38.998681');
INSERT INTO public.bank_accounts VALUES (10, 10, 343686295684, 'SAVINGS', 156000.00, 'ACTIVE', '2026-07-25 20:18:38.998681');


--
-- Data for Name: beneficiaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.beneficiaries VALUES (1, 1, 'Rahul Sharma', '554433221100', 'HDFC0001234', 'HDFC Bank', 'Rahul', '2026-07-25 20:20:03.68045');
INSERT INTO public.beneficiaries VALUES (2, 2, 'Priya Patel', '665544332211', 'ICIC0005678', 'ICICI Bank', 'Priya', '2026-07-25 20:20:03.68045');
INSERT INTO public.beneficiaries VALUES (3, 3, 'Amit Verma', '776655443322', 'SBIN0009876', 'State Bank of India', 'Amit', '2026-07-25 20:20:03.68045');
INSERT INTO public.beneficiaries VALUES (4, 4, 'Sneha Joshi', '887766554433', 'AXIS0001111', 'Axis Bank', 'Sneha', '2026-07-25 20:20:03.68045');
INSERT INTO public.beneficiaries VALUES (5, 5, 'Karan Mehta', '998877665544', 'KKBK0002222', 'Kotak Mahindra Bank', 'Karan', '2026-07-25 20:20:03.68045');
INSERT INTO public.beneficiaries VALUES (6, 6, 'Neha Singh', '443322110099', 'YESB0003333', 'Yes Bank', 'Neha', '2026-07-25 20:20:03.68045');
INSERT INTO public.beneficiaries VALUES (7, 7, 'Rohit Kulkarni', '334455667788', 'BARB0004444', 'Bank of Baroda', 'Rohit', '2026-07-25 20:20:03.68045');
INSERT INTO public.beneficiaries VALUES (8, 8, 'Anjali Desai', '223344556677', 'UBIN0005555', 'Union Bank', 'Anjali', '2026-07-25 20:20:03.68045');
INSERT INTO public.beneficiaries VALUES (9, 9, 'Vikas Gupta', '112233445566', 'PUNB0006666', 'Punjab National Bank', 'Vikas', '2026-07-25 20:20:03.68045');
INSERT INTO public.beneficiaries VALUES (10, 10, 'Pooja Nair', '667788990011', 'IDIB0007777', 'Indian Bank', 'Pooja', '2026-07-25 20:20:03.68045');


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transactions VALUES (1, 1, '554433221100', 2500.00, 'TRANSFER', 'SUCCESS', 3.20, 'LEGIT', '2026-07-25 20:22:43.282475');
INSERT INTO public.transactions VALUES (2, 2, '665544332211', 8500.00, 'TRANSFER', 'SUCCESS', 5.40, 'LEGIT', '2026-07-25 20:22:43.282475');
INSERT INTO public.transactions VALUES (3, 3, '776655443322', 50000.00, 'TRANSFER', 'SUCCESS', 28.10, 'LEGIT', '2026-07-25 20:22:43.282475');
INSERT INTO public.transactions VALUES (4, 4, '887766554433', 120000.00, 'TRANSFER', 'SUCCESS', 81.70, 'FRAUD', '2026-07-25 20:22:43.282475');
INSERT INTO public.transactions VALUES (5, 5, '998877665544', 4500.00, 'TRANSFER', 'SUCCESS', 4.80, 'LEGIT', '2026-07-25 20:22:43.282475');
INSERT INTO public.transactions VALUES (6, 6, '443322110099', 70000.00, 'TRANSFER', 'SUCCESS', 76.90, 'FRAUD', '2026-07-25 20:22:43.282475');
INSERT INTO public.transactions VALUES (7, 7, '334455667788', 900.00, 'TRANSFER', 'SUCCESS', 1.50, 'LEGIT', '2026-07-25 20:22:43.282475');
INSERT INTO public.transactions VALUES (8, 8, '223344556677', 250000.00, 'TRANSFER', 'SUCCESS', 95.60, 'FRAUD', '2026-07-25 20:22:43.282475');
INSERT INTO public.transactions VALUES (9, 9, '112233445566', 18000.00, 'TRANSFER', 'SUCCESS', 18.40, 'LEGIT', '2026-07-25 20:22:43.282475');
INSERT INTO public.transactions VALUES (10, 10, '667788990011', 95000.00, 'TRANSFER', 'SUCCESS', 67.80, 'FRAUD', '2026-07-25 20:22:43.282475');


--
-- Name: bank_accounts_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bank_accounts_account_id_seq', 10, true);


--
-- Name: beneficiaries_beneficiary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beneficiaries_beneficiary_id_seq', 10, true);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_transaction_id_seq', 10, true);

INSERT INTO mutual_funds
(fund_name, fund_type, nav, risk_level, annual_return, created_at)
VALUES
(
'ICICI Bluechip Fund',
'Large Cap',
102.45,
'Moderate',
14.20,
CURRENT_TIMESTAMP
),

(
'SBI Small Cap Fund',
'Small Cap',
84.30,
'High',
18.50,
CURRENT_TIMESTAMP
),

(
'Nippon India Mid Cap Fund',
'Mid Cap',
121.75,
'Moderate',
16.80,
CURRENT_TIMESTAMP
);


--
-- PostgreSQL database dump complete
--

\unrestrict Mama4l9WELN3tmWr1BXgupL3UyTjkh1xEWDkhQUunx9SKtRzHFw7ObOq4nvy7cd

