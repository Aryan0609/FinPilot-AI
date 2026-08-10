--
-- PostgreSQL database dump
--

\restrict VjGDhvjXSRbekoGNMHKq6Oz1fgJgQLbpIe8MjksX5w4EJnFcIBhrahYs80DxQte

-- Dumped from database version 14.23 (Debian 14.23-1.pgdg13+1)
-- Dumped by pg_dump version 14.23 (Debian 14.23-1.pgdg13+1)

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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, banking_pin_hash, created_at, email, name, password, phone, pin_failed_attempts, pin_locked_until, status) FROM stdin;
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts (id, account_number, account_type, balance, created_at, user_id) FROM stdin;
\.


--
-- Data for Name: fixed_deposits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fixed_deposits (id, created_at, interest_rate, maturity_amount, maturity_date, principal_amount, start_date, status, tenure_months, user_id) FROM stdin;
\.


--
-- Data for Name: fraud_alerts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fraud_alerts (id, account_id, created_at, fraud_probability, prediction, reasons, risk_level, risk_score, status, transaction_id, user_id) FROM stdin;
\.


--
-- Data for Name: mutual_funds; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mutual_funds (id, annual_return, created_at, fund_name, fund_type, nav, risk_level) FROM stdin;
\.


--
-- Data for Name: investments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.investments (id, investment_amount, investment_date, purchase_nav, units_purchased, account_id, fund_id) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (role_id, role_name) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transactions (id, amount, created_at, description, reference_number, status, transaction_type, account_id) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (user_id, role_id) FROM stdin;
\.


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accounts_id_seq', 1, false);


--
-- Name: fixed_deposits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.fixed_deposits_id_seq', 1, false);


--
-- Name: fraud_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.fraud_alerts_id_seq', 1, false);


--
-- Name: investments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.investments_id_seq', 1, false);


--
-- Name: mutual_funds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mutual_funds_id_seq', 1, false);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 1, false);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict VjGDhvjXSRbekoGNMHKq6Oz1fgJgQLbpIe8MjksX5w4EJnFcIBhrahYs80DxQte

