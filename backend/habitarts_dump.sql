--
-- PostgreSQL database dump
--

\restrict PsFX0NIzyTAFseR9IfEVMKQ2B3ykKKHkTNSe59RICOY9VImDiDXPg2maaUbyeCE

-- Dumped from database version 14.21 (Homebrew)
-- Dumped by pg_dump version 14.21 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: couples; Type: TABLE; Schema: public; Owner: navaneethsuresh
--

CREATE TABLE public.couples (
    id integer NOT NULL,
    invite_code character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.couples OWNER TO navaneethsuresh;

--
-- Name: couples_id_seq; Type: SEQUENCE; Schema: public; Owner: navaneethsuresh
--

CREATE SEQUENCE public.couples_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.couples_id_seq OWNER TO navaneethsuresh;

--
-- Name: couples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: navaneethsuresh
--

ALTER SEQUENCE public.couples_id_seq OWNED BY public.couples.id;


--
-- Name: goals; Type: TABLE; Schema: public; Owner: navaneethsuresh
--

CREATE TABLE public.goals (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    user_id integer,
    couple_id integer,
    goal_date date NOT NULL,
    is_completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.goals OWNER TO navaneethsuresh;

--
-- Name: goals_id_seq; Type: SEQUENCE; Schema: public; Owner: navaneethsuresh
--

CREATE SEQUENCE public.goals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.goals_id_seq OWNER TO navaneethsuresh;

--
-- Name: goals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: navaneethsuresh
--

ALTER SEQUENCE public.goals_id_seq OWNED BY public.goals.id;


--
-- Name: redemptions; Type: TABLE; Schema: public; Owner: navaneethsuresh
--

CREATE TABLE public.redemptions (
    id integer NOT NULL,
    reward_id integer,
    redeemed_by integer,
    redeemed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_fulfilled boolean DEFAULT false
);


ALTER TABLE public.redemptions OWNER TO navaneethsuresh;

--
-- Name: redemptions_id_seq; Type: SEQUENCE; Schema: public; Owner: navaneethsuresh
--

CREATE SEQUENCE public.redemptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.redemptions_id_seq OWNER TO navaneethsuresh;

--
-- Name: redemptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: navaneethsuresh
--

ALTER SEQUENCE public.redemptions_id_seq OWNED BY public.redemptions.id;


--
-- Name: rewards; Type: TABLE; Schema: public; Owner: navaneethsuresh
--

CREATE TABLE public.rewards (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    cost integer NOT NULL,
    couple_id integer,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rewards OWNER TO navaneethsuresh;

--
-- Name: rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: navaneethsuresh
--

CREATE SEQUENCE public.rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rewards_id_seq OWNER TO navaneethsuresh;

--
-- Name: rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: navaneethsuresh
--

ALTER SEQUENCE public.rewards_id_seq OWNED BY public.rewards.id;


--
-- Name: therapist_messages; Type: TABLE; Schema: public; Owner: navaneethsuresh
--

CREATE TABLE public.therapist_messages (
    id integer NOT NULL,
    couple_id integer,
    user_id integer NOT NULL,
    role text NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT therapist_messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text])))
);


ALTER TABLE public.therapist_messages OWNER TO navaneethsuresh;

--
-- Name: therapist_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: navaneethsuresh
--

CREATE SEQUENCE public.therapist_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.therapist_messages_id_seq OWNER TO navaneethsuresh;

--
-- Name: therapist_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: navaneethsuresh
--

ALTER SEQUENCE public.therapist_messages_id_seq OWNED BY public.therapist_messages.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: navaneethsuresh
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    user_id integer,
    amount integer NOT NULL,
    type character varying(20) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transactions OWNER TO navaneethsuresh;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: navaneethsuresh
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO navaneethsuresh;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: navaneethsuresh
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: navaneethsuresh
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    couple_id integer
);


ALTER TABLE public.users OWNER TO navaneethsuresh;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: navaneethsuresh
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO navaneethsuresh;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: navaneethsuresh
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: wallets; Type: TABLE; Schema: public; Owner: navaneethsuresh
--

CREATE TABLE public.wallets (
    id integer NOT NULL,
    user_id integer,
    balance integer DEFAULT 0
);


ALTER TABLE public.wallets OWNER TO navaneethsuresh;

--
-- Name: wallets_id_seq; Type: SEQUENCE; Schema: public; Owner: navaneethsuresh
--

CREATE SEQUENCE public.wallets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.wallets_id_seq OWNER TO navaneethsuresh;

--
-- Name: wallets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: navaneethsuresh
--

ALTER SEQUENCE public.wallets_id_seq OWNED BY public.wallets.id;


--
-- Name: couples id; Type: DEFAULT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.couples ALTER COLUMN id SET DEFAULT nextval('public.couples_id_seq'::regclass);


--
-- Name: goals id; Type: DEFAULT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.goals ALTER COLUMN id SET DEFAULT nextval('public.goals_id_seq'::regclass);


--
-- Name: redemptions id; Type: DEFAULT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.redemptions ALTER COLUMN id SET DEFAULT nextval('public.redemptions_id_seq'::regclass);


--
-- Name: rewards id; Type: DEFAULT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.rewards ALTER COLUMN id SET DEFAULT nextval('public.rewards_id_seq'::regclass);


--
-- Name: therapist_messages id; Type: DEFAULT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.therapist_messages ALTER COLUMN id SET DEFAULT nextval('public.therapist_messages_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wallets id; Type: DEFAULT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.wallets ALTER COLUMN id SET DEFAULT nextval('public.wallets_id_seq'::regclass);


--
-- Data for Name: couples; Type: TABLE DATA; Schema: public; Owner: navaneethsuresh
--

COPY public.couples (id, invite_code, created_at) FROM stdin;
1	5c8a8b	2026-02-24 00:00:00
3	ea0eb4	2026-03-01 07:59:18.885276
28	5947bc	2026-03-01 11:21:55.277433
\.


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: navaneethsuresh
--

COPY public.goals (id, title, user_id, couple_id, goal_date, is_completed, created_at) FROM stdin;
1	Go to gym	1	1	2026-02-23	t	2026-02-23 13:49:36.346837
3	Go to gym 2	1	1	2026-02-23	t	2026-02-23 14:37:12.659998
55	hi	7	\N	2026-03-01	t	2026-03-01 11:07:29.648995
5	Go to gym 2	1	1	2026-02-23	t	2026-02-23 14:44:29.495861
6	Go to gym 2	1	1	2026-02-23	t	2026-02-23 14:44:44.503987
7	Go to gym cuz im a pretty lady	2	1	2026-02-23	t	2026-02-23 14:46:32.769867
4	Go to gym 2	1	1	2026-02-23	t	2026-02-23 14:44:25.539997
2	love her	2	1	2026-02-23	t	2026-02-23 13:57:42.816254
8	wallet testing	3	\N	2026-02-23	t	2026-02-23 15:14:44.801404
9	hi	1	1	2026-02-26	t	2026-02-27 05:03:23.341578
10	test	1	1	2026-02-26	t	2026-02-27 05:03:26.896848
11	alr this workssss	1	1	2026-02-26	t	2026-02-27 05:03:39.53337
12	hello	1	1	2026-02-26	t	2026-02-27 05:08:50.779222
13	love dia	1	1	2026-02-26	t	2026-02-27 05:09:29.588225
14	hi	1	1	2026-02-26	t	2026-02-27 05:18:16.318769
15	hi	1	1	2026-02-26	t	2026-02-27 05:18:36.557479
16	burh	1	1	2026-02-26	t	2026-02-27 05:18:46.441049
17	loving my gf	1	1	2026-02-26	t	2026-02-27 05:22:52.778327
19	heeheee	1	1	2026-02-26	t	2026-02-27 05:23:22.170346
18	hehe	1	1	2026-02-26	t	2026-02-27 05:23:16.410434
21	hehe	1	1	2026-02-26	t	2026-02-27 05:28:05.818147
20	hehe	1	1	2026-02-26	t	2026-02-27 05:28:03.935802
23	how are yuuu	1	1	2026-02-27	t	2026-02-27 05:47:50.576193
22	heloo	1	1	2026-02-27	t	2026-02-27 05:47:43.748194
28	21	2	1	2026-02-27	t	2026-02-27 05:50:12.745893
26	1	2	1	2026-02-27	t	2026-02-27 05:50:00.798112
27	12	2	1	2026-02-27	t	2026-02-27 05:50:11.290859
24	hiiii	2	1	2026-02-27	t	2026-02-27 05:49:54.016528
25	helooo	2	1	2026-02-27	t	2026-02-27 05:49:58.88196
29	hi	2	1	2026-02-27	t	2026-02-27 05:51:14.188887
30	hi	1	1	2026-02-27	t	2026-02-27 06:26:42.84662
31	hi	1	1	2026-02-27	t	2026-02-27 10:48:50.389326
32	hi	1	1	2026-02-28	t	2026-02-28 12:08:01.884165
33	hi	1	1	2026-02-28	t	2026-02-28 12:08:20.201523
34	helo	1	1	2026-02-28	t	2026-02-28 13:51:58.991241
35	helo	1	1	2026-02-28	t	2026-02-28 13:56:10.127712
36	1	2	1	2026-02-28	t	2026-02-28 14:05:05.269607
37	2	2	1	2026-02-28	t	2026-02-28 14:05:06.501474
38	3	2	1	2026-02-28	t	2026-02-28 14:05:07.751243
39	4	2	1	2026-02-28	t	2026-02-28 14:05:09.117436
40	hi	1	1	2026-02-28	t	2026-02-28 15:11:00.806922
41	F	1	1	2026-02-28	t	2026-02-28 15:14:11.518433
42	1	1	1	2026-02-28	t	2026-02-28 15:40:02.189616
45	3	4	\N	2026-02-28	t	2026-02-28 16:24:02.567834
44	2	4	\N	2026-02-28	t	2026-02-28 16:24:01.351186
43	1	4	\N	2026-02-28	t	2026-02-28 16:23:59.953466
57	1	6	28	2026-03-01	t	2026-03-01 11:34:17.428322
52	hi	7	\N	2026-03-01	t	2026-03-01 10:51:30.525148
53	1	7	\N	2026-03-01	t	2026-03-01 10:51:33.023418
54	2	7	\N	2026-03-01	t	2026-03-01 10:51:34.724013
58	2	6	28	2026-03-01	t	2026-03-01 11:34:18.510803
59	3	6	28	2026-03-01	t	2026-03-01 11:34:19.510928
60	4	6	28	2026-03-01	t	2026-03-01 11:34:56.894815
61	hi	3	28	2026-04-17	t	2026-04-17 12:05:20.120345
62	hi2	3	28	2026-04-17	t	2026-04-17 12:06:00.801739
63	hi	9	\N	2026-04-17	t	2026-04-17 13:08:57.517156
64	hello	9	\N	2026-04-17	t	2026-04-17 13:09:00.415783
65	deploy this app today	6	28	2026-05-09	t	2026-05-09 17:22:47.702541
\.


--
-- Data for Name: redemptions; Type: TABLE DATA; Schema: public; Owner: navaneethsuresh
--

COPY public.redemptions (id, reward_id, redeemed_by, redeemed_at, is_fulfilled) FROM stdin;
1	4	1	2026-02-26 16:29:16.263334	t
3	6	2	2026-02-27 05:50:42.459977	t
2	5	1	2026-02-26 16:51:25.058402	t
4	7	1	2026-02-27 06:04:28.38624	t
5	2	2	2026-02-28 14:05:14.520673	t
6	8	2	2026-02-28 15:14:45.269838	t
7	20	3	2026-03-01 11:32:32.897968	t
8	19	3	2026-03-01 11:32:34.812862	t
9	18	6	2026-03-01 11:34:30.963178	t
10	17	6	2026-03-01 11:34:40.846497	t
11	21	3	2026-03-01 11:40:17.54579	f
12	16	3	2026-03-01 11:40:18.328134	f
\.


--
-- Data for Name: rewards; Type: TABLE DATA; Schema: public; Owner: navaneethsuresh
--

COPY public.rewards (id, title, description, cost, couple_id, created_by, created_at) FROM stdin;
1	Movie Night	You choose the movie 🎬	20	1	1	2026-02-23 20:02:31.513931
2	Movie Night	You choose the movie 🎬	20	1	1	2026-02-26 16:12:09.115613
3	Movie Night	You choose the movie 🎬	20	1	1	2026-02-26 16:12:13.877732
4	Movie Night	You choose the movie 🎬	20	1	2	2026-02-26 16:14:06.936303
5	Date Night	You choose the hotel!	10	1	2	2026-02-26 16:51:04.401231
6	date night with me :)	\N	50	1	1	2026-02-27 05:48:19.532616
7	hehe yk what it means :>	\N	20	1	2	2026-02-27 05:52:29.98999
8	hi	\N	10	1	1	2026-02-27 06:26:54.223361
9	hi	\N	10	1	1	2026-02-28 14:04:23.408035
10	hi	\N	10	1	1	2026-02-28 15:44:07.071739
16	hi	\N	10	28	6	2026-03-01 11:22:32.019937
17	hi	\N	10	28	3	2026-03-01 11:23:49.883004
18	hi	\N	10	28	3	2026-03-01 11:27:02.874401
19	10	\N	10	28	6	2026-03-01 11:29:15.488926
20	10	\N	10	28	6	2026-03-01 11:32:11.347451
21	hi2	\N	10	28	6	2026-03-01 11:37:58.901353
\.


--
-- Data for Name: therapist_messages; Type: TABLE DATA; Schema: public; Owner: navaneethsuresh
--

COPY public.therapist_messages (id, couple_id, user_id, role, message, created_at) FROM stdin;
1	\N	9	user	hi	2026-04-17 18:09:43.842989
2	\N	9	user	:(	2026-04-17 18:10:00.143816
3	\N	9	user	hi	2026-04-17 18:50:40.28195
4	\N	9	user	hi	2026-04-17 18:54:05.862495
5	\N	9	assistant	It seems like you're feeling a bit down. Would you like to talk about what's on your mind? Is there something specific that's bothering you, or is it related to a relationship you're in? I'm here to listen and help if I can.	2026-04-17 18:54:06.353751
6	\N	9	user	yeah i feel like my girlfriend isnt acknowledging my hurt but instead is getting defensive on me like im attacking her when all i want is for her to see that shes hurting me by not acknowledging 	2026-04-17 18:54:55.075751
7	\N	9	assistant	It can be really frustrating and painful when you feel like your emotions aren't being acknowledged or validated. It sounds like you're trying to express your feelings and concerns to your girlfriend, but she's becoming defensive instead of listening and understanding your perspective.\n\nCan you tell me more about what specifically happened that made you feel hurt and what you've tried to communicate to your girlfriend about it? Also, have you talked to her about how her defensiveness is affecting you, or is this something that's been building up over time?\n\nAlso, I want to make sure I understand the situation correctly. Is your girlfriend aware that you're feeling hurt, or does she think everything is fine? More context would be helpful in understanding the situation better.	2026-04-17 18:54:55.939365
8	28	3	user	hello	2026-04-17 19:04:12.952625
9	28	3	assistant	Hello. It's nice to meet you. I'm a neutral relationship therapist here to listen and help if I can. What brings you here today? Are you experiencing some challenges in a relationship that you'd like to talk about?	2026-04-17 19:04:13.486777
10	28	6	user	hi this is Ari	2026-04-17 19:06:07.273197
11	28	6	assistant	Hello Ari, it's nice to meet you. I'm here to listen and help if I can. What's been going on that you'd like to talk about? Is there a specific issue or concern in your relationship that you're struggling with?	2026-04-17 19:06:07.735046
12	28	6	user	hi	2026-04-17 20:20:26.599775
13	28	6	user	hi	2026-04-17 20:21:26.821652
14	28	6	user	hi	2026-04-17 20:22:28.539241
15	28	6	user	hi	2026-04-17 20:38:52.849872
16	28	6	assistant	Ari, it seems like you're saying hello multiple times. I'm here and ready to listen. Can you tell me a bit more about what's on your mind? What brings you to therapy today? And are you here alone, or is your partner joining us as well? I need to hear from both partners to get a full understanding of the situation. Can you please let me know if your partner is available to join the conversation?	2026-04-17 20:38:53.798255
17	28	3	user	hello	2026-04-17 20:39:40.803011
18	28	3	assistant	Ari, I think we've established that you're here and ready to chat. To move forward, I need to hear from your partner as well. Can you please let me know if your partner is with you and willing to join the conversation? I want to make sure I hear from both of you to get a clear understanding of the situation.	2026-04-17 20:39:41.568798
19	28	3	user	this is not ari speaking btw	2026-04-17 22:10:50.446201
20	28	3	assistant	So, it seems like there are two different people communicating here, and I'm not sure who is who. To clarify, can you both please introduce yourselves and let me know how you're related to each other? I want to make sure I understand the context of our conversation.	2026-04-17 22:10:51.136301
21	28	3	user	i am dia	2026-04-17 22:11:03.029308
22	28	3	assistant	Hello Dia, nice to meet you. I'm a relationship therapist. I've also been chatting with someone named Ari, but I'm not sure if it's the same Ari you're associated with. Can you tell me a bit about your relationship with Ari, and what brings you both here today?	2026-04-17 22:11:03.642225
23	28	6	user	hi	2026-04-17 22:11:46.311266
24	28	6	assistant	It seems like Ari is back. Okay, so we have Ari and Dia. Before we proceed, I just want to confirm: are you both in a relationship with each other, and are you here to work through some issues together? I need to hear from both of you to get a clear understanding of the situation. Dia, can you start by sharing what's been going on from your perspective? And then Ari, I'd like to hear from you as well.	2026-04-17 22:11:47.538891
25	28	6	user	before i start i wanna test, so for the next 4-5 prompts we will randomly say hi and you need to confirm you know whos talking by saying our username	2026-04-17 22:12:43.608927
26	28	6	assistant	You'd like to test my ability to keep track of who's speaking. Sounds like a plan. For the next few prompts, I'll respond with the username of the person I think is speaking. So, in this case, I believe it's Ari (dri) who just spoke. Is that correct?	2026-04-17 22:12:44.461251
27	28	6	user	hi	2026-04-17 22:12:52.918918
28	28	6	assistant	Dri	2026-04-17 22:12:53.196952
29	28	3	user	hi	2026-04-17 22:13:13.752692
30	28	3	assistant	This is dri speaking.	2026-04-17 22:13:14.464046
31	28	3	user	hi	2026-04-17 22:13:19.018281
32	28	3	assistant	Dri.	2026-04-17 22:13:19.584015
33	28	3	user	nope	2026-04-17 22:13:23.700338
34	28	3	assistant	This message is from dri.	2026-04-17 22:13:24.074721
35	28	3	user	this is dia	2026-04-17 22:13:29.684719
36	28	3	assistant	dri	2026-04-17 22:13:30.324378
37	28	3	user	dia	2026-04-17 22:13:34.067211
38	28	3	assistant	This message is from dri.	2026-04-17 22:13:34.635183
39	28	3	user	hi	2026-04-17 23:18:19.695045
40	28	3	assistant	The speaker is dri.	2026-04-17 23:18:20.26516
41	28	3	user	stop	2026-04-17 23:18:30.875405
42	28	3	assistant	The speaker is dri.	2026-04-17 23:18:31.287707
43	28	3	user	stop repeating	2026-04-17 23:18:36.983364
44	28	3	assistant	[User: dri] is speaking.	2026-04-17 23:18:37.451272
45	28	3	user	no this is dia	2026-04-17 23:18:44.816864
46	28	3	assistant	The person speaking is: dri	2026-04-17 23:18:45.438749
47	28	3	user	this is dia bruhhhh	2026-04-17 23:18:54.100526
48	28	3	assistant	The speaker is dri.	2026-04-17 23:18:54.465874
49	28	6	user	hello	2026-04-17 23:19:21.199618
50	28	6	assistant	The speaker is: dri	2026-04-17 23:19:21.789501
51	28	6	user	hi	2026-04-17 23:19:41.575274
52	28	6	assistant	[dri]	2026-04-17 23:19:41.932396
53	28	6	user	yes dri	2026-04-17 23:19:47.432536
54	28	6	assistant	The speaker is: dri	2026-04-17 23:19:47.790512
55	28	6	user	go back to therapist mode	2026-04-17 23:20:04.972621
56	28	6	assistant	The person speaking is dri.	2026-04-17 23:20:05.516779
57	28	6	user	.	2026-04-17 23:20:10.915247
58	28	6	assistant	The speaker is dri.	2026-04-17 23:20:11.434696
59	28	6	user	reset	2026-04-17 23:20:14.814455
60	28	6	assistant	The speaker is: dri	2026-04-17 23:20:15.127325
61	28	6	user	hi	2026-04-17 23:20:51.289871
62	28	6	assistant	The speaker is: dri	2026-04-17 23:20:51.801447
63	28	6	user	hi	2026-04-17 23:21:07.01658
64	28	6	assistant	The speaker is dri.	2026-04-17 23:21:07.625535
65	1	1	user	hi	2026-04-17 23:21:35.09915
66	1	1	assistant	[Therapist] Hello Nav, it's nice to meet you. I understand you've reached out to talk about your relationship. Before we begin, I want to make sure I get a complete picture. Is your partner with you, or will they be joining our conversation later? I'd love to hear from both of you to better understand the situation.	2026-04-17 23:21:36.070794
67	1	2	user	hii	2026-04-17 23:22:15.148522
68	1	2	assistant	[Therapist] Hello Partner, welcome to our conversation. Now that we have both of you here, I'd like to start by asking: what brings you both to therapy at this time? What are some of the issues or concerns you're experiencing in your relationship that you'd like to work through? Nav, would you like to start, or would you prefer Partner to begin?	2026-04-17 23:22:15.771089
69	1	2	user	let nav start	2026-04-17 23:31:25.330294
70	1	2	assistant	[Therapist] Nav, please go ahead and share what's been on your mind. What are some of the challenges or concerns you're facing in your relationship, and how have you been feeling lately? I'm here to listen and help you both communicate effectively.	2026-04-17 23:31:25.976675
71	1	2	user	wait or else i'll start	2026-04-17 23:35:12.278701
72	1	2	assistant	[Therapist] Let's take a deep breath and slow down for a moment. It seems like there might be a sense of urgency or tension. Partner, you're welcome to share your thoughts, but I want to make sure Nav has a chance to express themselves as well. Can we find a way to alternate or take turns sharing our thoughts and feelings? Nav, would you still like to start, or is it okay with you if Partner goes first?	2026-04-17 23:35:13.11941
73	1	2	user	why not me first	2026-04-17 23:35:32.294559
74	1	2	assistant	[Therapist] That's a fair question, Partner. It's not about who goes first, but rather about creating a safe and respectful space for both of you to express yourselves. Since you've both expressed a desire to start, let's try something different. Can you both tell me one thing that's been bothering you or one thing you'd like to work on in your relationship? Just a brief statement from each of you to get us started. Nav, are you ready to share something, and then Partner can follow?	2026-04-17 23:35:33.138867
75	1	2	user	hi	2026-05-08 21:43:44.410275
76	1	2	assistant	[Therapist] Hello again, Partner. It seems like we were in the middle of a conversation. To recap, we were discussing how to start our conversation and make sure both of you have a chance to express yourselves. Nav was about to share something, and then you were going to follow. Would you like to give Nav a chance to share, or is there something new you'd like to add? I'd like to hear from Nav as well to get a better understanding of the situation.	2026-05-08 21:43:45.363379
77	28	3	user	hello	2026-05-08 22:57:20.391497
78	28	6	user	hi	2026-05-08 22:58:28.983838
79	28	6	user	hi	2026-05-08 23:04:04.718869
80	28	6	assistant	I think the speaker is: dri	2026-05-08 23:04:05.441586
81	28	6	user	yes	2026-05-08 23:04:10.999664
82	28	6	assistant	The speaker is: dri	2026-05-08 23:04:11.469618
83	28	3	user	now who is this?	2026-05-08 23:04:23.318895
84	28	3	assistant	The person speaking is: dri	2026-05-08 23:04:23.65841
85	28	3	user	nope	2026-05-08 23:04:28.36163
86	28	3	assistant	The person speaking is: dri	2026-05-08 23:04:28.674042
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: navaneethsuresh
--

COPY public.transactions (id, user_id, amount, type, description, created_at) FROM stdin;
1	3	10	credit	Goal completed reward	2026-02-23 15:15:02.70571
2	2	-20	debit	Redeemed reward: Movie Night	2026-02-23 20:37:38.416061
3	2	-20	debit	Redeemed reward: Movie Night	2026-02-23 20:38:39.607585
4	2	-20	debit	Redeemed reward: Movie Night	2026-02-23 20:38:41.173989
5	2	-20	debit	Redeemed reward: Movie Night	2026-02-23 20:38:43.44616
6	2	-20	debit	Redeemed reward: Movie Night	2026-02-23 20:38:43.945979
7	1	-20	debit	Redeemed reward: Movie Night	2026-02-26 16:29:16.260977
8	1	-10	debit	Redeemed reward: Date Night	2026-02-26 16:51:25.058402
9	1	10	credit	Goal completed reward	2026-02-27 05:03:28.0361
10	1	10	credit	Goal completed reward	2026-02-27 05:03:31.85081
11	1	10	credit	Goal completed reward	2026-02-27 05:03:42.449466
12	1	10	credit	Goal completed reward	2026-02-27 05:08:52.115947
13	1	10	credit	Goal completed reward	2026-02-27 05:09:30.732125
14	1	10	credit	Goal completed reward	2026-02-27 05:18:17.661933
15	1	10	credit	Goal completed reward	2026-02-27 05:18:37.708295
16	1	10	credit	Goal completed reward	2026-02-27 05:18:47.441163
17	1	10	credit	Goal completed reward	2026-02-27 05:22:53.82553
18	1	10	credit	Goal completed reward	2026-02-27 05:23:25.174271
19	1	10	credit	Goal completed reward	2026-02-27 05:23:26.755697
20	1	10	credit	Goal completed reward	2026-02-27 05:28:07.455399
21	1	10	credit	Goal completed reward	2026-02-27 05:28:07.919894
22	1	10	credit	Goal completed reward	2026-02-27 05:47:51.513339
23	1	10	credit	Goal completed reward	2026-02-27 05:47:52.977562
24	2	10	credit	Goal completed reward	2026-02-27 05:50:14.018109
25	2	10	credit	Goal completed reward	2026-02-27 05:50:14.766209
26	2	10	credit	Goal completed reward	2026-02-27 05:50:15.732599
27	2	10	credit	Goal completed reward	2026-02-27 05:50:16.517395
28	2	10	credit	Goal completed reward	2026-02-27 05:50:17.384837
29	2	-50	debit	Redeemed reward: date night with me :)	2026-02-27 05:50:42.459977
30	1	-20	debit	Redeemed reward: hehe yk what it means :>	2026-02-27 06:04:28.38624
31	2	10	credit	Goal completed reward	2026-02-27 06:04:41.362129
32	1	10	credit	Goal completed reward	2026-02-27 06:26:44.676304
33	1	10	credit	Goal completed reward	2026-02-27 10:48:51.526565
34	1	10	credit	Goal completed reward	2026-02-28 12:08:03.166918
35	1	10	credit	Goal completed reward	2026-02-28 12:08:23.381833
36	1	10	credit	Goal completed reward	2026-02-28 13:51:59.994302
37	1	10	credit	Goal completed reward	2026-02-28 13:56:10.992398
38	2	10	credit	Goal completed reward	2026-02-28 14:05:10.588697
39	2	10	credit	Goal completed reward	2026-02-28 14:05:11.335744
40	2	10	credit	Goal completed reward	2026-02-28 14:05:12.020131
41	2	10	credit	Goal completed reward	2026-02-28 14:05:12.802341
42	2	-20	debit	Redeemed reward: Movie Night	2026-02-28 14:05:14.520673
43	1	10	credit	Goal completed reward	2026-02-28 15:11:09.95681
44	1	10	credit	Goal completed reward	2026-02-28 15:14:13.002146
45	2	-10	debit	Redeemed reward: hi	2026-02-28 15:14:45.269838
46	1	10	credit	Goal completed reward	2026-02-28 15:40:04.875779
47	4	10	credit	Goal completed reward	2026-02-28 16:24:03.753974
48	4	10	credit	Goal completed reward	2026-02-28 16:24:04.305564
49	4	10	credit	Goal completed reward	2026-02-28 16:24:04.870398
50	7	10	credit	Goal completed reward	2026-03-01 10:51:35.72827
51	7	10	credit	Goal completed reward	2026-03-01 10:51:36.959179
52	7	10	credit	Goal completed reward	2026-03-01 10:51:38.508887
53	7	10	credit	Goal completed reward	2026-03-01 11:07:31.534965
54	3	10	credit	Goal completed reward	2026-03-01 11:21:00.829256
55	3	-10	debit	Redeemed reward: 10	2026-03-01 11:32:32.897968
56	3	-10	debit	Redeemed reward: 10	2026-03-01 11:32:34.812862
57	6	10	credit	Goal completed reward	2026-03-01 11:34:20.131344
58	6	10	credit	Goal completed reward	2026-03-01 11:34:20.896938
59	6	10	credit	Goal completed reward	2026-03-01 11:34:23.162257
60	6	-10	debit	Redeemed reward: hi	2026-03-01 11:34:30.963178
61	6	-10	debit	Redeemed reward: hi	2026-03-01 11:34:40.846497
62	6	10	credit	Goal completed reward	2026-03-01 11:34:58.679828
63	3	-10	debit	Redeemed reward: hi2	2026-03-01 11:40:17.54579
64	3	-10	debit	Redeemed reward: hi	2026-03-01 11:40:18.328134
65	3	10	credit	Goal completed reward	2026-04-17 12:05:21.756076
66	3	10	credit	Goal completed reward	2026-04-17 12:06:01.821
67	9	10	credit	Goal completed reward	2026-04-17 13:09:01.669373
68	9	10	credit	Goal completed reward	2026-04-17 13:09:02.268059
69	6	10	credit	Goal completed reward	2026-05-09 17:22:49.503974
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: navaneethsuresh
--

COPY public.users (id, name, email, password, created_at, couple_id) FROM stdin;
1	Nav	nav@test.com	$2b$10$o92waRPGXkfqp9laR1v57.JamkR4b3OLtlWwAhXtXAHs.RYoCkd0G	2026-02-22 12:46:58.37184	1
2	Partner	partner@test.com	$2b$10$3e5605t9XzdmLQiE558FI.4IUZf/ZbEXd/OYCR4sm4NpDLdksSSXK	2026-02-22 15:46:19.73271	1
5	sef	sef@lulu	$2b$10$o8//yzHbblJ7Qk5ekOFF5eDOBjokVXkMb5tuLSTOucUAC.n84qVLO	2026-02-28 16:33:45.567641	\N
4	meme	meme@email.com	$2b$10$.AdhDRHVGxW38EI7bwDTju4QdU5Jrq7opuZVYVDn.upmucDUGTjri	2026-02-28 16:23:36.159235	3
8	navzi	navzi@test.com	$2b$10$vHxuQayq8duke.sAXq2dcOvrRy74xqPuxRjBUWRKm4nxUPGSV/HTq	2026-03-01 08:07:47.85612	\N
7	lulu	lulu@test.com	$2b$10$8noZLdRlRiAHIpA.xovD6evdslP3Wzm5t1Jyt82bIuc19kjSrtjie	2026-03-01 08:05:42.310581	\N
3	dia	dia@test.com	$2b$10$o11zC2a2zV52b7RbRfqrE.4rwZhs7z/8eRoawTjRYqSX.m1nuqygG	2026-02-23 15:02:07.074135	28
6	dri	dri@test.com	$2b$10$RL8hri4wWcCq31BVHI4a7uKAxp3LV94AM4rfFZYyHgEbYy91m7n0y	2026-02-28 16:35:02.97342	28
9	tony	tony@yahoo.co	$2b$10$jAaEZ743q9LQSqADbYkMGOgE4/XVOupBbpQEzxW4lfZB5vTzCvvAm	2026-04-17 13:08:36.630069	\N
\.


--
-- Data for Name: wallets; Type: TABLE DATA; Schema: public; Owner: navaneethsuresh
--

COPY public.wallets (id, user_id, balance) FROM stdin;
5	5	0
8	8	0
7	7	40
1	3	90
9	9	20
6	6	30
3	2	20
2	1	290
4	4	30
\.


--
-- Name: couples_id_seq; Type: SEQUENCE SET; Schema: public; Owner: navaneethsuresh
--

SELECT pg_catalog.setval('public.couples_id_seq', 28, true);


--
-- Name: goals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: navaneethsuresh
--

SELECT pg_catalog.setval('public.goals_id_seq', 65, true);


--
-- Name: redemptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: navaneethsuresh
--

SELECT pg_catalog.setval('public.redemptions_id_seq', 12, true);


--
-- Name: rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: navaneethsuresh
--

SELECT pg_catalog.setval('public.rewards_id_seq', 21, true);


--
-- Name: therapist_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: navaneethsuresh
--

SELECT pg_catalog.setval('public.therapist_messages_id_seq', 86, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: navaneethsuresh
--

SELECT pg_catalog.setval('public.transactions_id_seq', 69, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: navaneethsuresh
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: wallets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: navaneethsuresh
--

SELECT pg_catalog.setval('public.wallets_id_seq', 9, true);


--
-- Name: couples couples_invite_code_key; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.couples
    ADD CONSTRAINT couples_invite_code_key UNIQUE (invite_code);


--
-- Name: couples couples_pkey; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.couples
    ADD CONSTRAINT couples_pkey PRIMARY KEY (id);


--
-- Name: goals goals_pkey; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_pkey PRIMARY KEY (id);


--
-- Name: redemptions redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.redemptions
    ADD CONSTRAINT redemptions_pkey PRIMARY KEY (id);


--
-- Name: rewards rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_pkey PRIMARY KEY (id);


--
-- Name: therapist_messages therapist_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.therapist_messages
    ADD CONSTRAINT therapist_messages_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wallets wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);


--
-- Name: wallets wallets_user_id_key; Type: CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_key UNIQUE (user_id);


--
-- Name: goals goals_couple_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_couple_id_fkey FOREIGN KEY (couple_id) REFERENCES public.couples(id) ON DELETE CASCADE;


--
-- Name: goals goals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: redemptions redemptions_redeemed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.redemptions
    ADD CONSTRAINT redemptions_redeemed_by_fkey FOREIGN KEY (redeemed_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: redemptions redemptions_reward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.redemptions
    ADD CONSTRAINT redemptions_reward_id_fkey FOREIGN KEY (reward_id) REFERENCES public.rewards(id) ON DELETE CASCADE;


--
-- Name: rewards rewards_couple_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_couple_id_fkey FOREIGN KEY (couple_id) REFERENCES public.couples(id) ON DELETE CASCADE;


--
-- Name: rewards rewards_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_couple_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_couple_id_fkey FOREIGN KEY (couple_id) REFERENCES public.couples(id) ON DELETE SET NULL;


--
-- Name: wallets wallets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: navaneethsuresh
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict PsFX0NIzyTAFseR9IfEVMKQ2B3ykKKHkTNSe59RICOY9VImDiDXPg2maaUbyeCE

