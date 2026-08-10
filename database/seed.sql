--
-- PostgreSQL database dump
--

\restrict cet0C3F33dP1QCcqA7DayOs04ExTQkCChADH1GVa2azdujS1Z9FobfjRQ82gVue

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

COPY public.users (id, created_at, email, name, password, phone, status, banking_pin_hash, pin_failed_attempts, pin_locked_until) FROM stdin;
7	2026-08-10 17:28:55.018983	t21@g.com	t22	$2a$10$85Wn/yfkmrzXKf.4wTaWZeAqKffmn6eRNp6FzFtjRufT6FKkR.Wmm	9876543210	ACTIVE	$2a$10$GmFCvoK9itPBKJJlhIDDseqCZTDHsbC9Uekd/xfGV6hJQaZtzg4gi	0	\N
8	2026-08-10 17:30:14.023995	backendtest123@example.com	PIN Frontend Test	$2a$10$/ETrfzKjYHS6IRt5mnK78.wEGl1xLWtsFo2YSt/0t8H4OiKKg4XQe	9876543210	ACTIVE	$2a$10$gR.FQxn1zDGGqmaxtuEFk.HZ1um8TW60mTh1GyA8.9Z5v0V6LikFu	0	\N
6	2026-08-10 15:44:13.335418	pintest@test.com	PIN Test User	$2a$10$GKKkrWdLEGKaulTjNdimDuP/ZYMgwrYA.mCALQ.vzVEP5SI5qbTZe	9999999999	ACTIVE	$2a$10$dujxXmEJfv1.itJJ0NF5pu/zXxwwFsni.fXNoLb3aSnrPFBe7GoVK	0	\N
1	2026-08-05 11:12:54.361325	test@test.com	Aryan Mankar	$2a$10$ZS4DSouyz8kxK4mBdZ3BROTg7b1iJdsQUGLlPr5W1LfD/07sf3NdW	9876543210	ACTIVE	$2a$10$D8vh31VBx1xwAkSLsn03w.EKUtUTMLmCIkSpQFRBPZ5uMEx6AuMPm	0	\N
2	2026-08-06 12:32:10.728104	test2@gmail.com	Aryan	$2a$10$Vat4I.oC0meHsRQ2IYHBsu342RjD.WDtGPQpqMXc7/lmd38kzqemC	9876543210	ACTIVE	$2a$10$D8vh31VBx1xwAkSLsn03w.EKUtUTMLmCIkSpQFRBPZ5uMEx6AuMPm	0	\N
3	2026-08-06 13:37:58.507076	a2@t.com	a2	$2a$10$0eZf5tcbAli50d.qK2Bdi.TxB.Y9wPax4vCqSdHUxA49lsC6Q3xoi	9876543210	ACTIVE	$2a$10$D8vh31VBx1xwAkSLsn03w.EKUtUTMLmCIkSpQFRBPZ5uMEx6AuMPm	0	\N
4	2026-08-08 15:19:25.787737	securitytest123@test.com	Security Test	$2a$10$WfmX0f2tdELfJACI8//pX.Vf2k8SR4Pyz13fto91iv2CrBl0q6UTO	9999999999	ACTIVE	$2a$10$D8vh31VBx1xwAkSLsn03w.EKUtUTMLmCIkSpQFRBPZ5uMEx6AuMPm	0	\N
5	2026-08-08 15:25:19.6957	aryan@test.com	test2	$2a$10$DmWnqpoSusOdB9.sNM74ye1gyjCd.PK8gEly2Z6zgnv2HjGKZrMlG	9876543210	ACTIVE	$2a$10$D8vh31VBx1xwAkSLsn03w.EKUtUTMLmCIkSpQFRBPZ5uMEx6AuMPm	0	\N
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts (id, account_number, account_type, balance, created_at, user_id) FROM stdin;
8	AC524768037	SAVINGS	2000.00	2026-08-10 17:30:14.031075	8
6	AC642892269	SAVINGS	10000.00	2026-08-10 15:44:13.376046	6
7	AC749113064	SAVINGS	7000.00	2026-08-10 17:28:55.078521	7
1	AC231174573	SAVINGS	1814.00	2026-08-05 11:12:54.461177	1
4	AC262214960	SAVINGS	1000.00	2026-08-08 15:19:25.977396	4
5	AC165079443	SAVINGS	500.00	2026-08-08 15:25:19.709599	5
3	AC319129872	SAVINGS	2800.00	2026-08-06 13:37:58.650988	3
2	AC498290216	SAVINGS	7362.00	2026-08-06 12:32:10.789505	2
\.


--
-- Data for Name: fixed_deposits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fixed_deposits (id, created_at, interest_rate, maturity_amount, maturity_date, principal_amount, start_date, status, tenure_months, user_id) FROM stdin;
3	2026-08-10 13:57:54.945677	7	5350.00	2027-08-10	5000.00	2026-08-10	ACTIVE	12	6
4	2026-08-10 19:33:03.811811	7	1140.00	2028-08-10	1000.00	2026-08-10	CLOSED	24	1
5	2026-08-10 19:41:38.804306	7	1140.00	2028-08-10	1000.00	2026-08-10	CLOSED	24	1
6	2026-08-10 19:41:54.817037	7	356.31	2027-08-10	333.00	2026-08-10	CLOSED	12	1
7	2026-08-10 19:49:52.12666	7	130.54	2027-08-10	122.00	2026-08-10	CLOSED	12	1
8	2026-08-10 19:50:01.651804	7	1404.91	2027-08-10	1313.00	2026-08-10	CLOSED	12	1
9	2026-08-10 19:50:59.278397	7	12.84	2027-08-10	12.00	2026-08-10	CLOSED	12	1
10	2026-08-10 19:53:05.5229	7	130.54	2027-08-10	122.00	2026-08-10	CLOSED	12	1
11	2026-08-10 19:55:58.143008	7	1857.35	2029-08-10	1535.00	2026-08-10	CLOSED	36	1
12	2026-08-10 19:56:33.46301	7	7346.62	2027-08-10	6866.00	2026-08-10	CLOSED	12	1
13	2026-08-10 20:05:11.78858	7	1529.55	2031-08-10	1133.00	2026-08-10	CLOSED	60	1
16	2026-08-10 20:23:08.104049	7	1070.00	2027-08-10	1000.00	2026-08-10	CLOSED	12	1
\.


--
-- Data for Name: fraud_alerts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fraud_alerts (id, transaction_id, user_id, account_id, prediction, fraud_probability, risk_score, risk_level, reasons, status, created_at) FROM stdin;
1	50	6	6	0	6.660000	6.6600	LOW	Night Transaction	OPEN	2026-08-10 18:28:08.613274
2	52	6	6	0	6.660000	6.6600	LOW	Night Transaction	OPEN	2026-08-10 18:47:55.004777
3	54	1	1	0	6.500000	6.5000	LOW	Night Transaction	OPEN	2026-08-10 18:57:42.682031
\.


--
-- Data for Name: mutual_funds; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mutual_funds (id, annual_return, created_at, fund_name, fund_type, nav, risk_level) FROM stdin;
2	18.5	2026-08-05 11:14:48.749285	SBI Small Cap Fund	Small Cap	41.49	High
3	16.8	2026-08-05 11:14:48.749285	Nippon India Mid Cap Fund	Mid Cap	175.64	Moderate
1	14.2	2026-08-05 11:14:48.749285	ICICI Bluechip Fund	Large Cap	80.19	Moderate
\.


--
-- Data for Name: investments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.investments (id, investment_amount, investment_date, purchase_nav, units_purchased, account_id, fund_id) FROM stdin;
13	2000.00	2026-08-08 15:36:37.700737	177.87	11.2442	5	3
14	1000.00	2026-08-10 05:14:42.064979	69.52	14.3835	1	1
10	276.55	2026-08-06 10:07:56.828611	102.70	2.6928	1	1
15	1.00	2026-08-10 14:06:50.988465	71.81	0.0139	1	1
16	1.00	2026-08-10 14:23:15.445118	64.28	0.0156	1	1
17	12.00	2026-08-10 19:32:09.62071	47.73	0.2514	1	2
18	1000.00	2026-08-10 20:05:59.33681	45.52	21.9671	1	2
19	2500.00	2026-08-10 20:06:19.703236	44.19	56.5784	1	2
20	1000.00	2026-08-10 20:24:30.624465	44.40	22.5232	1	2
21	1500.00	2026-08-10 20:45:35.858506	41.79	35.8944	1	2
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (role_id, role_name) FROM stdin;
1	ROLE_USER
2	ROLE_ADMIN
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transactions (id, amount, created_at, description, reference_number, status, transaction_type, account_id) FROM stdin;
1	1000.00	2026-08-05 11:25:12.543769	Cash Deposit	473faf1a-a9fc-4844-a593-0644f9161aa6	SUCCESS	DEPOSIT	1
2	2000.00	2026-08-05 17:35:28.703364	Cash Deposit	f76ebc71-b60f-4f08-af91-afb321f6e437	SUCCESS	DEPOSIT	1
3	500.00	2026-08-06 08:50:50.501551	Cash Deposit	24d9778f-8537-413d-9082-1c3922033d7a	SUCCESS	DEPOSIT	1
4	500.00	2026-08-06 11:54:36.607837	Cash Deposit	4f0ccfd5-985e-4a14-984c-87a1e787ca21	SUCCESS	DEPOSIT	1
5	500.00	2026-08-06 11:54:54.826198	Cash Deposit	4654d6c0-5d3b-4c8a-ae9e-0b0849fa5a5f	SUCCESS	DEPOSIT	1
6	1000.00	2026-08-06 12:35:27.989973	Transfer to AC231174573	13ed5e57-3dea-429c-9b62-fc3640e54198	SUCCESS	TRANSFER_OUT	2
7	1000.00	2026-08-06 12:35:27.997621	Transfer from AC498290216	13ed5e57-3dea-429c-9b62-fc3640e54198	SUCCESS	TRANSFER_IN	1
8	500.00	2026-08-06 13:10:21.635503	Cash Deposit	db4ced74-2edb-4bb5-a770-79dbfa576c20	SUCCESS	DEPOSIT	1
9	10012.00	2026-08-06 13:11:40.87311	Cash Deposit	640b2e03-941f-497f-9826-1a6afa1d4673	SUCCESS	DEPOSIT	2
10	500.00	2026-08-07 12:39:52.424831	Cash Deposit	326ebccc-d54a-47c8-8418-31511b6979d6	SUCCESS	DEPOSIT	1
11	1000.00	2026-08-07 14:56:25.067477	Cash Deposit	7ac95eca-b0cc-42e7-90a0-8e2881995d3a	SUCCESS	DEPOSIT	1
12	1000.00	2026-08-09 10:25:16.591336	Cash Deposit	8a52245c-f8a1-48af-a154-cf65e71dd343	SUCCESS	DEPOSIT	5
13	500.00	2026-08-09 10:25:25.379739	Transfer to AC231174573	e7c90dd4-3653-40e9-ae07-0eb7367162ce	SUCCESS	TRANSFER_OUT	5
14	500.00	2026-08-09 10:25:25.384231	Transfer from AC165079443	e7c90dd4-3653-40e9-ae07-0eb7367162ce	SUCCESS	TRANSFER_IN	1
15	500.00	2026-08-09 14:18:52.489609	Cash Deposit	f4df1e8d-1e4d-4989-98df-cd4c5c0c5d8c	SUCCESS	DEPOSIT	1
16	2.00	2026-08-09 14:19:12.704036	Cash Withdrawal	035b4158-61a5-42ac-a56d-0717094ef44b	SUCCESS	WITHDRAW	1
17	500.00	2026-08-09 14:47:00.187452	Transfer to AC319129872	44aa5a8c-197f-48f5-8c1f-e5a9141c24ec	SUCCESS	TRANSFER_OUT	2
18	500.00	2026-08-09 14:47:00.211928	Transfer from AC498290216	44aa5a8c-197f-48f5-8c1f-e5a9141c24ec	SUCCESS	TRANSFER_IN	3
19	100.00	2026-08-09 15:22:09.39959	Test transfer	e1f420fb-f58c-4bd7-9633-53fc49a3bda0	SUCCESS	TRANSFER_OUT	2
20	100.00	2026-08-09 15:22:09.443072	Transfer from AC498290216	e1f420fb-f58c-4bd7-9633-53fc49a3bda0	SUCCESS	TRANSFER_IN	3
21	100.00	2026-08-09 15:46:56.313677	Secure transfer test	a44c5ca9-5524-4081-a4ce-efdc3bc535b5	SUCCESS	TRANSFER_OUT	2
22	100.00	2026-08-09 15:46:56.335546	Transfer from AC498290216	a44c5ca9-5524-4081-a4ce-efdc3bc535b5	SUCCESS	TRANSFER_IN	3
23	100.00	2026-08-09 15:47:26.172696	Attack test	e737e25d-7ebe-4bf0-9472-b7e224ae4228	SUCCESS	TRANSFER_OUT	2
24	100.00	2026-08-09 15:47:26.176074	Transfer from AC498290216	e737e25d-7ebe-4bf0-9472-b7e224ae4228	SUCCESS	TRANSFER_IN	3
25	1000.00	2026-08-09 16:29:26.253192	Transfer to AC498290216	f867e10b-9de8-44e5-9964-d85ceb382559	SUCCESS	TRANSFER_OUT	1
26	1000.00	2026-08-09 16:29:26.288337	Transfer from AC231174573	f867e10b-9de8-44e5-9964-d85ceb382559	SUCCESS	TRANSFER_IN	2
27	500.00	2026-08-10 05:08:58.665932	Cash Deposit	57c6a8ad-ccdc-426c-83a5-97e6ad23eaca	SUCCESS	DEPOSIT	1
28	1000.00	2026-08-10 05:09:05.244197	Cash Withdrawal	33aa95ab-63b9-4dd4-81aa-6fe9887cba9b	SUCCESS	WITHDRAW	1
29	500.00	2026-08-10 05:14:19.656971	Cash Deposit	da274bc6-23e2-48c5-b67e-1e8c25da9d9a	SUCCESS	DEPOSIT	1
30	1000.00	2026-08-10 05:14:25.080815	Cash Withdrawal	1ce63d55-c201-4bea-8541-72de3640d26f	SUCCESS	WITHDRAW	1
31	500.00	2026-08-10 11:10:23.962393	Cash Deposit	6759d4cd-e620-409b-88ba-7203788a7ef3	SUCCESS	DEPOSIT	1
32	1000.00	2026-08-10 11:54:57.243229	Transfer to AC498290216	7a8bc61c-0fb4-40a6-a4a9-706e812ccb0e	SUCCESS	TRANSFER_OUT	1
33	1000.00	2026-08-10 11:54:57.273221	Transfer from AC231174573	7a8bc61c-0fb4-40a6-a4a9-706e812ccb0e	SUCCESS	TRANSFER_IN	2
34	100.00	2026-08-10 13:12:44.706902	Robustness test withdrawal	af34d711-1f1f-403c-8a84-50c63d44bfa7	SUCCESS	WITHDRAW	1
35	100.00	2026-08-10 13:17:06.063973	Transfer robustness test	b1d00636-8c63-4bfb-a8a6-0ac65259c8ec	SUCCESS	TRANSFER_OUT	1
36	100.00	2026-08-10 13:17:06.070138	Transfer from AC231174573	b1d00636-8c63-4bfb-a8a6-0ac65259c8ec	SUCCESS	TRANSFER_IN	2
37	100.00	2026-08-10 13:18:55.089127	Robustness test deposit	30d02a9b-9b44-42eb-910c-a1978d234f4c	SUCCESS	DEPOSIT	1
38	50.00	2026-08-10 13:25:36.079455	Final transfer test	b4a885d2-7ff5-4b1d-b86f-162b8149724e	SUCCESS	TRANSFER_OUT	1
39	50.00	2026-08-10 13:25:36.098397	Transfer from AC231174573	b4a885d2-7ff5-4b1d-b86f-162b8149724e	SUCCESS	TRANSFER_IN	2
40	5000.00	2026-08-10 15:13:05.707735	Transfer to AC231174573	5b1491b6-ade7-4a03-95a9-7b1005a51065	SUCCESS	TRANSFER_OUT	2
41	5000.00	2026-08-10 15:13:05.725478	Transfer from AC498290216	5b1491b6-ade7-4a03-95a9-7b1005a51065	SUCCESS	TRANSFER_IN	1
42	100.00	2026-08-10 15:45:49.903187	PIN security test	811a963d-d935-4b93-bc5c-97496333d22d	SUCCESS	DEPOSIT	6
43	100.00	2026-08-10 16:01:25.345973	Correct PIN security test	4149294a-06d7-4626-8881-0d3e0acbb1ec	SUCCESS	DEPOSIT	6
44	100.00	2026-08-10 16:09:12.723321	Locked PIN body test	03e4c6a2-d31a-44ee-892e-7a3da15cf98d	SUCCESS	DEPOSIT	6
45	100.00	2026-08-10 16:36:26.617016	Correct PIN test	35ea53c2-bfa4-4c6e-9ee7-3cc92f3d4bd5	SUCCESS	DEPOSIT	6
46	100.00	2026-08-10 16:41:10.095799	Correct PIN withdrawal test	f2273e33-0a95-4ca8-b9e2-e2662ae457a4	SUCCESS	WITHDRAW	6
47	100.00	2026-08-10 16:43:41.043693	Correct PIN transfer test	c15e48ca-4708-4309-be98-d8338fc30b77	SUCCESS	TRANSFER_OUT	6
48	100.00	2026-08-10 16:43:41.045399	Transfer from AC642892269	c15e48ca-4708-4309-be98-d8338fc30b77	SUCCESS	TRANSFER_IN	1
49	500.00	2026-08-10 17:14:54.898747	Cash Deposit	3849649e-654c-4f3f-89df-591af65ea193	SUCCESS	DEPOSIT	1
50	100.00	2026-08-10 18:28:08.634298	AI fraud alert test	aa70bfaf-651d-4387-8f13-0d0a69b7f462	SUCCESS	TRANSFER_OUT	6
51	100.00	2026-08-10 18:28:08.637187	Transfer from AC642892269	aa70bfaf-651d-4387-8f13-0d0a69b7f462	SUCCESS	TRANSFER_IN	1
52	100.00	2026-08-10 18:47:54.975567	Final fraud linkage test	ac9520e4-de5f-4ba0-91ae-ff3a0af43213	SUCCESS	TRANSFER_OUT	6
53	100.00	2026-08-10 18:47:55.000972	Transfer from AC642892269	ac9520e4-de5f-4ba0-91ae-ff3a0af43213	SUCCESS	TRANSFER_IN	1
54	5000.00	2026-08-10 18:57:42.641739	Transfer to AC749113064	b56b9c31-4e42-4af0-b9b4-c51e9225e97a	SUCCESS	TRANSFER_OUT	1
55	5000.00	2026-08-10 18:57:42.676626	Transfer from AC231174573	b56b9c31-4e42-4af0-b9b4-c51e9225e97a	SUCCESS	TRANSFER_IN	7
56	1000.00	2026-08-10 19:32:26.595281	Cash Withdrawal	dc2d49d3-c332-4675-8fe4-a53630494350	SUCCESS	WITHDRAW	1
59	-1000.00	2026-08-10 20:23:08.135276	Fixed Deposit investment #16	FD-INV-16-a42bb68b	SUCCESS	FD_INVESTMENT	1
60	1529.55	2026-08-10 20:24:03.975179	Fixed Deposit closure #13	FD-CLOSE-13-def9e4c3	SUCCESS	FD_CLOSURE	1
61	1070.00	2026-08-10 20:24:07.534224	Fixed Deposit closure #16	FD-CLOSE-16-0c700a8e	SUCCESS	FD_CLOSURE	1
62	-1500.00	2026-08-10 20:45:35.874476	Mutual Fund investment - SBI Small Cap Fund #21	MF-INV-21-69945066	SUCCESS	MF_INVESTMENT	1
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (user_id, role_id) FROM stdin;
1	2
4	1
5	1
2	1
3	1
6	1
7	1
8	1
\.


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accounts_id_seq', 8, true);


--
-- Name: fixed_deposits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.fixed_deposits_id_seq', 16, true);


--
-- Name: fraud_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.fraud_alerts_id_seq', 3, true);


--
-- Name: investments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.investments_id_seq', 21, true);


--
-- Name: mutual_funds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mutual_funds_id_seq', 3, true);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 2, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_id_seq', 62, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- PostgreSQL database dump complete
--

\unrestrict cet0C3F33dP1QCcqA7DayOs04ExTQkCChADH1GVa2azdujS1Z9FobfjRQ82gVue

