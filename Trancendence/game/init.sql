--
-- PostgreSQL database dump
--

\restrict 6TEemYXiZwugcKrmeJdNhX5WjRfFzEGxBPHuggVkiiUcNQFKGboQ1D02BV7I6Nq

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

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
-- Name: admin_audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_audit_log (
    id integer NOT NULL,
    admin_user_id integer NOT NULL,
    action text NOT NULL,
    target_type text NOT NULL,
    target_id integer,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    ip text,
    user_agent text
);


ALTER TABLE public.admin_audit_log OWNER TO postgres;

--
-- Name: admin_audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_audit_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_audit_log_id_seq OWNER TO postgres;

--
-- Name: admin_audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_audit_log_id_seq OWNED BY public.admin_audit_log.id;


--
-- Name: auth_logins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_logins (
    id integer NOT NULL,
    user_id integer NOT NULL,
    logged_in_at timestamp with time zone DEFAULT now() NOT NULL,
    ip text,
    user_agent text
);


ALTER TABLE public.auth_logins OWNER TO postgres;

--
-- Name: auth_logins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_logins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auth_logins_id_seq OWNER TO postgres;

--
-- Name: auth_logins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_logins_id_seq OWNED BY public.auth_logins.id;


--
-- Name: friend_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friend_requests (
    id integer NOT NULL,
    from_user_id integer NOT NULL,
    to_user_id integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT friend_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text])))
);


ALTER TABLE public.friend_requests OWNER TO postgres;

--
-- Name: friend_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.friend_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.friend_requests_id_seq OWNER TO postgres;

--
-- Name: friend_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.friend_requests_id_seq OWNED BY public.friend_requests.id;


--
-- Name: friendships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friendships (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    friend_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_no_self_friend CHECK ((user_id <> friend_id)),
    CONSTRAINT ck_no_self_friend CHECK ((user_id <> friend_id))
);


ALTER TABLE public.friendships OWNER TO postgres;

--
-- Name: friendships_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.friendships_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.friendships_id_seq OWNER TO postgres;

--
-- Name: friendships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.friendships_id_seq OWNED BY public.friendships.id;


--
-- Name: game_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_history (
    id integer NOT NULL,
    match_date date NOT NULL,
    player_id integer NOT NULL,
    opponent_id integer NOT NULL,
    player_score integer NOT NULL,
    opponent_score integer NOT NULL,
    player_points integer[] NOT NULL,
    opponent_points integer[] NOT NULL,
    CONSTRAINT game_history_points_len CHECK (((array_length(player_points, 1) = 4) AND (array_length(opponent_points, 1) = 4)))
);


ALTER TABLE public.game_history OWNER TO postgres;

--
-- Name: game_invites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_invites (
    id bigint NOT NULL,
    from_user_id integer NOT NULL,
    to_user_id integer NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    responded_at timestamp with time zone,
    CONSTRAINT game_invites_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'completed'::text])))
);


ALTER TABLE public.game_invites OWNER TO postgres;

--
-- Name: game_invites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.game_invites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.game_invites_id_seq OWNER TO postgres;

--
-- Name: game_invites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.game_invites_id_seq OWNED BY public.game_invites.id;


--
-- Name: match_games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.match_games (
    id bigint NOT NULL,
    match_id bigint NOT NULL,
    game_number integer NOT NULL,
    player1_points integer NOT NULL,
    player2_points integer NOT NULL,
    winner_id bigint,
    ended_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT match_games_game_number_check CHECK (((game_number >= 1) AND (game_number <= 5))),
    CONSTRAINT match_games_player1_points_check CHECK (((player1_points >= 0) AND (player1_points <= 21))),
    CONSTRAINT match_games_player2_points_check CHECK (((player2_points >= 0) AND (player2_points <= 21))),
    CONSTRAINT match_games_points_nonnegative CHECK (((player1_points >= 0) AND (player2_points >= 0)))
);


ALTER TABLE public.match_games OWNER TO postgres;

--
-- Name: match_games_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.match_games_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.match_games_id_seq OWNER TO postgres;

--
-- Name: match_games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.match_games_id_seq OWNED BY public.match_games.id;


--
-- Name: matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matches (
    id bigint NOT NULL,
    played_at timestamp with time zone DEFAULT now() NOT NULL,
    mode text DEFAULT 'private'::text NOT NULL,
    status text DEFAULT 'finished'::text NOT NULL,
    player1_id bigint,
    player2_id bigint,
    winner_id bigint,
    player1_games_won integer DEFAULT 0 NOT NULL,
    player2_games_won integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    tournament_id integer,
    CONSTRAINT matches_mode_check CHECK ((mode = ANY (ARRAY['public'::text, 'private'::text, 'tournament'::text, 'friendly'::text]))),
    CONSTRAINT matches_player1_games_won_check CHECK (((player1_games_won >= 0) AND (player1_games_won <= 4))),
    CONSTRAINT matches_player2_games_won_check CHECK (((player2_games_won >= 0) AND (player2_games_won <= 4))),
    CONSTRAINT matches_status_check CHECK ((status = ANY (ARRAY['finished'::text, 'abandoned'::text, 'forfeit'::text])))
);


ALTER TABLE public.matches OWNER TO postgres;

--
-- Name: matches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.matches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matches_id_seq OWNER TO postgres;

--
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    sender_id bigint NOT NULL,
    receiver_id bigint NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    read_at timestamp with time zone,
    deleted_at timestamp without time zone,
    CONSTRAINT messages_check CHECK ((sender_id <> receiver_id))
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players (
    id integer NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    first_name text,
    last_name text,
    gender text,
    country text,
    p_name text,
    avatar_url text,
    available boolean NOT NULL
);


ALTER TABLE public.players OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    image text NOT NULL,
    p_name text NOT NULL,
    country text NOT NULL,
    available boolean
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: system_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_messages (
    id integer NOT NULL,
    from_user_id integer NOT NULL,
    to_user_id integer NOT NULL,
    type text NOT NULL,
    payload jsonb,
    created_at timestamp without time zone DEFAULT now(),
    read_at timestamp with time zone
);


ALTER TABLE public.system_messages OWNER TO postgres;

--
-- Name: system_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_messages_id_seq OWNER TO postgres;

--
-- Name: system_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_messages_id_seq OWNED BY public.system_messages.id;


--
-- Name: tournament_bracket_matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournament_bracket_matches (
    id bigint NOT NULL,
    tournament_id bigint NOT NULL,
    round_number integer NOT NULL,
    round_name text NOT NULL,
    slot_number integer NOT NULL,
    player1_id bigint,
    player2_id bigint,
    winner_id bigint,
    status text DEFAULT 'pending'::text NOT NULL,
    source_match1_id bigint,
    source_match2_id bigint,
    played_match_id bigint,
    scheduled_at timestamp with time zone,
    started_at timestamp with time zone,
    finished_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    player1_name_snapshot text,
    player2_name_snapshot text,
    winner_name_snapshot text,
    player1_image_snapshot text,
    player2_image_snapshot text
);


ALTER TABLE public.tournament_bracket_matches OWNER TO postgres;

--
-- Name: tournament_bracket_matches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tournament_bracket_matches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tournament_bracket_matches_id_seq OWNER TO postgres;

--
-- Name: tournament_bracket_matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tournament_bracket_matches_id_seq OWNED BY public.tournament_bracket_matches.id;


--
-- Name: tournament_matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournament_matches (
    id bigint NOT NULL,
    tournament_id bigint NOT NULL,
    round_number integer NOT NULL,
    round_name text NOT NULL,
    match_id bigint NOT NULL,
    match_order integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT tournament_matches_match_order_check CHECK ((match_order >= 1)),
    CONSTRAINT tournament_matches_round_number_check CHECK ((round_number >= 1))
);


ALTER TABLE public.tournament_matches OWNER TO postgres;

--
-- Name: tournament_matches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tournament_matches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tournament_matches_id_seq OWNER TO postgres;

--
-- Name: tournament_matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tournament_matches_id_seq OWNED BY public.tournament_matches.id;


--
-- Name: tournament_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournament_participants (
    id bigint NOT NULL,
    tournament_id bigint NOT NULL,
    user_id bigint NOT NULL,
    alias text,
    status text DEFAULT 'subscribed'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    seed_rank integer,
    slot_status text,
    CONSTRAINT tournament_participants_status_check CHECK ((status = ANY (ARRAY['subscribed'::text, 'cancelled'::text, 'checked_in'::text])))
);


ALTER TABLE public.tournament_participants OWNER TO postgres;

--
-- Name: tournament_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tournament_participants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tournament_participants_id_seq OWNER TO postgres;

--
-- Name: tournament_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tournament_participants_id_seq OWNED BY public.tournament_participants.id;


--
-- Name: tournament_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tournament_schedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tournament_schedule_id_seq OWNER TO postgres;

--
-- Name: tournament_schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournament_schedule (
    id integer DEFAULT nextval('public.tournament_schedule_id_seq'::regclass) NOT NULL,
    tournament_id integer,
    t_name text NOT NULL,
    t_date text NOT NULL,
    t_date_iso date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    t_starts_at timestamp with time zone
);


ALTER TABLE public.tournament_schedule OWNER TO postgres;

--
-- Name: tournament_seed_snapshot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournament_seed_snapshot (
    tournament_id integer NOT NULL,
    user_id integer NOT NULL,
    seed_rank integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tournament_seed_snapshot OWNER TO postgres;

--
-- Name: tournament_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournament_subscriptions (
    id integer NOT NULL,
    tournament_id integer NOT NULL,
    player_id integer NOT NULL,
    created_at date NOT NULL,
    status text NOT NULL
);


ALTER TABLE public.tournament_subscriptions OWNER TO postgres;

--
-- Name: tournaments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournaments (
    id bigint NOT NULL,
    name text NOT NULL,
    visibility text DEFAULT 'public'::text NOT NULL,
    status text DEFAULT 'not_started'::text NOT NULL,
    created_by bigint,
    starts_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    registration_open_offset_ms bigint,
    registration_close_offset_ms bigint,
    registration_opens_offset_ms bigint DEFAULT ((((10 * 24) * 60) * 60) * 1000) NOT NULL,
    registration_closes_offset_ms bigint DEFAULT ((((5 * 24) * 60) * 60) * 1000) NOT NULL,
    CONSTRAINT tournaments_status_check CHECK ((status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'finished'::text]))),
    CONSTRAINT tournaments_visibility_check CHECK ((visibility = ANY (ARRAY['public'::text, 'private'::text])))
);


ALTER TABLE public.tournaments OWNER TO postgres;

--
-- Name: tournaments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tournaments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tournaments_id_seq OWNER TO postgres;

--
-- Name: tournaments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tournaments_id_seq OWNED BY public.tournaments.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    first_name text,
    last_name text,
    gender text,
    country text,
    p_name text,
    avatar_url text,
    is_available boolean NOT NULL,
    password_hash text NOT NULL,
    image text,
    available boolean DEFAULT true NOT NULL,
    last_seen timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    deleted_at timestamp with time zone,
    token_version integer DEFAULT 0 NOT NULL,
    refresh_token text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: admin_audit_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_audit_log ALTER COLUMN id SET DEFAULT nextval('public.admin_audit_log_id_seq'::regclass);


--
-- Name: auth_logins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_logins ALTER COLUMN id SET DEFAULT nextval('public.auth_logins_id_seq'::regclass);


--
-- Name: friend_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend_requests ALTER COLUMN id SET DEFAULT nextval('public.friend_requests_id_seq'::regclass);


--
-- Name: friendships id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships ALTER COLUMN id SET DEFAULT nextval('public.friendships_id_seq'::regclass);


--
-- Name: game_invites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_invites ALTER COLUMN id SET DEFAULT nextval('public.game_invites_id_seq'::regclass);


--
-- Name: match_games id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_games ALTER COLUMN id SET DEFAULT nextval('public.match_games_id_seq'::regclass);


--
-- Name: matches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: system_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_messages ALTER COLUMN id SET DEFAULT nextval('public.system_messages_id_seq'::regclass);


--
-- Name: tournament_bracket_matches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_bracket_matches ALTER COLUMN id SET DEFAULT nextval('public.tournament_bracket_matches_id_seq'::regclass);


--
-- Name: tournament_matches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_matches ALTER COLUMN id SET DEFAULT nextval('public.tournament_matches_id_seq'::regclass);


--
-- Name: tournament_participants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_participants ALTER COLUMN id SET DEFAULT nextval('public.tournament_participants_id_seq'::regclass);


--
-- Name: tournaments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournaments ALTER COLUMN id SET DEFAULT nextval('public.tournaments_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: admin_audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_audit_log (id, admin_user_id, action, target_type, target_id, meta, created_at, ip, user_agent) FROM stdin;
1	1	user.deactivate	user	7	{"invitesRejected": 0}	2026-01-04 02:56:29.51577+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
2	1	match.delete	match	34	{}	2026-01-04 02:56:44.779249+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
3	1	match.delete	match	33	{}	2026-01-04 04:02:23.833907+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
4	1	invite.cancel	invite	70	{"newStatus": "rejected"}	2026-01-04 21:10:49.934405+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
5	1	user.deactivate	user	8	{"invitesRejected": 0}	2026-01-07 07:33:39.9195+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
6	1	user.deactivate	user	8	{"invitesRejected": 0}	2026-01-07 07:33:55.369324+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
7	1	user.update	user	4	{"role": "admin"}	2026-01-07 11:01:08.730644+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
8	1	user.update	user	4	{"role": "user"}	2026-01-07 11:01:29.31615+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
9	1	user.update	user	4	{"forceOffline": true}	2026-01-07 11:01:55.277592+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
10	1	user.update	user	4	{"forceOffline": true}	2026-01-07 11:06:36.254008+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
11	1	user.reset_state	user	4	{"invitesRejected": 0}	2026-01-07 11:07:16.57599+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
12	1	user.update	user	4	{"forceOffline": true}	2026-01-07 11:07:56.67895+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
13	1	user.update	user	4	{"forceOffline": true}	2026-01-07 11:08:25.369585+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
14	1	user.update	user	4	{"is_active": false}	2026-01-07 11:32:11.389083+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
15	1	user.update	user	4	{"is_active": true}	2026-01-07 11:51:15.264954+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
16	1	user.update	user	4	{"is_active": false}	2026-01-07 11:52:06.099296+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
17	1	user.update	user	4	{"is_active": true}	2026-01-07 11:52:20.635519+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
18	1	user.update	user	9	{"role": "admin"}	2026-01-08 13:11:09.283937+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
19	1	user.update	user	9	{"role": "user"}	2026-01-08 13:11:30.602204+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
20	1	user.update	user	9	{"forceOffline": true}	2026-01-08 13:15:34.117769+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
21	1	user.reset_state	user	9	{"invitesRejected": 0}	2026-01-08 13:18:19.663638+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
22	1	user.deactivate	user	11	{"softDelete": true, "tokenRevoked": true, "invitesRejected": 0}	2026-01-08 13:18:31.959512+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
23	1	invite.cancel	invite	82	{"newStatus": "rejected"}	2026-01-08 13:21:07.891867+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
24	1	user.reset_state	user	9	{"invitesRejected": 0}	2026-01-09 04:50:36.212281+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
25	1	user.reset_state	user	4	{"invitesRejected": 0}	2026-01-09 04:50:42.403712+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
26	1	tournament.delete	tournament	1	{"status": "not_started", "participantsCount": 0}	2026-01-09 17:10:41.428182+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
27	1	tournament.create	tournament	103	{"name": "Autumn Cup", "status": "not_started", "startsAt": "2026-09-09T00:00:00Z", "visibility": "private"}	2026-01-09 17:32:53.67235+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
28	1	tournament.archive	tournament	101	{}	2026-01-09 19:18:12.584151+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
29	1	tournament.subscription.cancel	tournament_participant	\N	{"userId": 3, "tournamentId": 2}	2026-01-10 02:04:27.340708+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
30	1	tournament.create	tournament	105	{"name": "Test_1", "status": "not_started", "startsAt": "2026-01-10T00:00:00Z", "visibility": "private", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-10 15:45:08.586073+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
31	1	tournament.delete	tournament	105	{"status": "not_started", "participantsCount": 0}	2026-01-10 15:53:15.353948+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
32	1	tournament.create	tournament	106	{"name": "test_2", "status": "not_started", "startsAt": "2026-01-10T00:00:00Z", "visibility": "private", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-10 15:53:51.740234+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
33	1	tournament.delete	tournament	104	{"status": "not_started", "participantsCount": 0}	2026-01-10 16:05:02.440687+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
34	1	tournament.create	tournament	107	{"name": "test_3", "status": "not_started", "startsAt": "2026-01-10T00:00:00Z", "visibility": "private", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-10 16:06:02.20768+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
35	1	tournament.create	tournament	108	{"name": "test_4", "status": "not_started", "startsAt": "2026-01-10T00:00:00Z", "visibility": "private", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-10 16:38:24.060759+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
36	1	tournament.delete	tournament	108	{"status": "not_started", "participantsCount": 0}	2026-01-10 16:39:11.302823+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
37	1	tournament.create	tournament	109	{"name": "tes_5", "status": "not_started", "startsAt": "2026-01-10T00:00:00Z", "visibility": "private", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-10 16:39:37.961276+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
38	1	tournament.delete	tournament	109	{"status": "not_started", "participantsCount": 0}	2026-01-10 16:44:37.119485+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
39	1	tournament.create	tournament	110	{"name": "test_6", "status": "not_started", "startsAt": "2026-01-10T00:00:00Z", "visibility": "private", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-10 16:45:05.11614+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
40	1	tournament.create	tournament	111	{"name": "test_7", "status": "not_started", "startsAt": "2026-01-10T11:00:00.000Z", "visibility": "private", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-10 18:09:58.467044+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
41	1	tournament.delete	tournament	110	{"status": "not_started", "participantsCount": 0}	2026-01-10 18:16:07.352129+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
42	1	tournament.create	tournament	112	{"name": "test_9", "status": "not_started", "startsAt": "2026-01-10T18:43:07.287Z", "visibility": "private", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-10 18:38:22.235934+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
43	1	tournament.create	tournament	113	{"name": "test_10", "status": "not_started", "startsAt": "2026-01-10T19:20:00.000Z", "visibility": "public", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-10 18:51:15.649811+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
44	1	tournament.create	tournament	114	{"name": "test_11", "status": "not_started", "startsAt": "2026-01-10T19:03:09.049Z", "visibility": "private", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-10 18:58:09.093882+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
45	1	tournament.delete	tournament	113	{"status": "not_started", "participantsCount": 0}	2026-01-11 11:40:26.127047+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
46	1	tournament.delete	tournament	114	{"status": "not_started", "participantsCount": 0}	2026-01-11 11:40:32.960454+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
47	1	tournament.delete	tournament	111	{"status": "not_started", "participantsCount": 0}	2026-01-11 11:40:38.370059+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
48	1	tournament.delete	tournament	112	{"status": "not_started", "participantsCount": 0}	2026-01-11 11:40:43.302348+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
49	1	tournament.delete	tournament	107	{"status": "not_started", "participantsCount": 0}	2026-01-11 11:40:47.305741+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
50	1	tournament.delete	tournament	106	{"status": "not_started", "participantsCount": 0}	2026-01-11 11:40:54.878067+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
51	1	tournament.create	tournament	115	{"name": "test_14", "status": "not_started", "startsAt": "2026-01-11T11:48:44.828Z", "visibility": "private", "registrationOpensOffsetMs": 864000000, "registrationClosesOffsetMs": 432000000}	2026-01-11 11:41:44.834524+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
52	1	tournament.delete	tournament	115	{"status": "not_started", "participantsCount": 0}	2026-01-11 11:53:12.078447+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
53	1	tournament.create	tournament	116	{"name": "test_15", "status": "not_started", "startsAt": "2026-01-11T12:00:45.377Z", "visibility": "private", "registrationOpensOffsetMs": 300000, "registrationClosesOffsetMs": 60000}	2026-01-11 11:53:45.382674+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
54	1	tournament.delete	tournament	116	{"status": "not_started", "participantsCount": 1}	2026-01-11 12:22:20.347566+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
55	1	tournament.create	tournament	117	{"name": "test_16", "status": "not_started", "startsAt": "2026-01-11T12:29:43.803Z", "visibility": "public", "registrationOpensOffsetMs": 300000, "registrationClosesOffsetMs": 60000}	2026-01-11 12:22:43.80891+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
56	1	tournament.create	tournament	118	{"name": "test_16", "status": "not_started", "startsAt": "2026-01-12T08:16:33.819Z", "visibility": "private", "registrationOpensOffsetMs": 300000, "registrationClosesOffsetMs": 60000}	2026-01-12 08:09:33.883338+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
57	1	tournament.delete	tournament	117	{"status": "not_started", "participantsCount": 2}	2026-01-12 08:20:59.418795+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
58	1	tournament.delete	tournament	118	{"status": "not_started", "participantsCount": 8}	2026-01-12 08:21:08.192625+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
59	1	tournament.create	tournament	119	{"name": "test_1", "status": "not_started", "startsAt": "2026-01-12T08:44:12.530Z", "visibility": "private", "registrationOpensOffsetMs": 300000, "registrationClosesOffsetMs": 60000}	2026-01-12 08:37:12.612517+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
60	1	tournament.create	tournament	120	{"name": "test_7", "status": "not_started", "startsAt": "2026-01-12T09:25:43.967Z", "visibility": "private", "registrationOpensOffsetMs": 300000, "registrationClosesOffsetMs": 60000}	2026-01-12 09:18:44.010254+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
61	1	tournament.create	tournament	121	{"name": "test_11", "status": "not_started", "startsAt": "2026-01-12T10:16:04.922Z", "visibility": "private", "registrationOpensOffsetMs": 300000, "registrationClosesOffsetMs": 60000}	2026-01-12 10:09:04.939522+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
62	1	tournament.delete	tournament	119	{"status": "in_progress", "participantsCount": 8}	2026-01-13 13:38:53.844661+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
63	1	tournament.create	tournament	122	{"name": "test_77", "status": "not_started", "startsAt": "2026-01-13T13:49:58.636Z", "visibility": "private", "registrationOpensOffsetMs": 300000, "registrationClosesOffsetMs": 60000}	2026-01-13 13:42:58.641944+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
64	1	tournament.delete	tournament	120	{"status": "finished", "participantsCount": 8}	2026-01-13 13:49:38.449632+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
65	1	tournament.delete	tournament	102	{"status": "in_progress", "participantsCount": 6}	2026-01-13 14:12:20.903589+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
66	1	tournament.create	tournament	123	{"name": "tst", "status": "not_started", "startsAt": "2026-01-13T14:21:14.284Z", "visibility": "private", "registrationOpensOffsetMs": 300000, "registrationClosesOffsetMs": 60000}	2026-01-13 14:19:14.333352+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
67	1	tournament.delete	tournament	123	{"status": "in_progress", "participantsCount": 0}	2026-01-13 14:22:49.753553+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
68	1	tournament.create	tournament	124	{"name": "tst", "status": "not_started", "startsAt": "2026-01-13T14:28:39.283Z", "visibility": "private", "registrationOpensOffsetMs": 600000, "registrationClosesOffsetMs": 360000}	2026-01-13 14:23:39.289718+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
69	1	tournament.delete	tournament	124	{"status": "not_started", "participantsCount": 0}	2026-01-13 14:24:48.482575+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
70	1	invite.clear_stuck	invite	\N	{"cleared": 3, "minutes": 5}	2026-01-13 14:52:46.047877+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
71	1	match.delete	match	77	{}	2026-01-13 15:19:59.314442+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
72	1	match.delete	match	65	{}	2026-01-13 15:22:23.591247+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
73	1	tournament.archive	tournament	101	{}	2026-01-13 15:23:55.2251+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
74	1	tournament.archive	tournament	122	{}	2026-01-13 15:24:18.445158+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
75	1	user.reset_state	user	12	{"invitesRejected": 0}	2026-01-13 15:27:56.338466+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
76	1	user.update	user	12	{"forceOffline": true}	2026-01-13 15:29:00.186931+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
77	1	user.update	user	12	{"forceOffline": true}	2026-01-13 15:29:46.993016+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
78	1	user.reset_state	user	12	{"invitesRejected": 0}	2026-01-13 15:30:22.489393+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
79	1	user.update	user	6	{"role": "admin"}	2026-01-13 17:30:57.613239+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
80	1	user.update	user	6	{"role": "user"}	2026-01-13 17:31:10.937038+00	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
\.


--
-- Data for Name: auth_logins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_logins (id, user_id, logged_in_at, ip, user_agent) FROM stdin;
\.


--
-- Data for Name: friend_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.friend_requests (id, from_user_id, to_user_id, status, created_at) FROM stdin;
10	1	4	accepted	2026-01-04 21:46:31.468637+00
47	11	1	accepted	2026-01-08 12:47:22.464592+00
2	4	1	accepted	2026-01-04 21:39:40.649494+00
51	12	1	accepted	2026-01-11 10:40:05.429409+00
46	9	1	accepted	2026-01-08 10:07:35.340187+00
55	1	6	accepted	2026-01-13 17:27:56.668289+00
\.


--
-- Data for Name: friendships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.friendships (id, user_id, friend_id, created_at) FROM stdin;
5	2	3	2025-12-29 21:01:22.08779+00
6	2	5	2025-12-29 21:01:22.08779+00
7	3	4	2025-12-29 21:01:22.08779+00
8	3	6	2025-12-29 21:01:22.08779+00
9	4	5	2025-12-29 21:01:22.08779+00
10	4	7	2025-12-29 21:01:22.08779+00
11	5	6	2025-12-29 21:01:22.08779+00
12	5	7	2025-12-29 21:01:22.08779+00
13	6	7	2025-12-29 21:01:22.08779+00
16	1	5	2025-12-30 15:21:14.040028+00
27	4	2	2026-01-04 21:20:14.741138+00
53	1	11	2026-01-08 12:48:39.772183+00
56	1	4	2026-01-09 15:50:13.926604+00
57	1	12	2026-01-11 10:40:17.793212+00
58	1	9	2026-01-13 13:20:55.940709+00
59	1	6	2026-01-13 17:28:03.357102+00
\.


--
-- Data for Name: game_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_history (id, match_date, player_id, opponent_id, player_score, opponent_score, player_points, opponent_points) FROM stdin;
18	2025-12-27	5	6	4	0	{21,21,21,21}	{0,0,1,0}
17	2025-12-27	1	3	0	4	{0,1,0,1}	{21,21,21,21}
16	2025-12-27	1	3	1	3	{1,0,0,21}	{21,21,21,10}
1	2025-12-17	1	3	3	1	{21,21,12,21}	{15,9,21,18}
2	2025-12-17	4	6	1	3	{21,8,14,19}	{17,21,21,21}
3	2025-12-16	2	5	4	0	{21,21,21,21}	{8,13,19,6}
4	2025-12-16	3	4	0	4	{7,10,18,6}	{21,21,21,21}
5	2025-12-15	6	1	1	3	{16,21,9,11}	{21,14,21,21}
6	2025-12-15	5	2	3	1	{21,21,21,14}	{12,18,9,21}
7	2025-12-14	1	4	4	0	{21,21,21,21}	{6,11,17,8}
8	2025-12-14	3	6	1	3	{13,21,7,19}	{21,16,21,21}
9	2025-12-13	2	1	0	4	{9,14,6,18}	{21,21,21,21}
10	2025-12-13	4	5	3	1	{21,21,17,21}	{19,8,21,15}
11	2025-12-12	6	3	4	0	{21,21,21,21}	{10,7,16,12}
12	2025-12-12	5	1	1	3	{18,21,6,12}	{21,17,21,21}
13	2025-12-11	2	4	3	1	{21,21,10,21}	{16,19,21,9}
14	2025-12-11	6	5	0	4	{11,9,20,6}	{21,21,21,21}
15	2025-12-10	3	2	3	1	{21,21,13,21}	{19,7,21,18}
\.


--
-- Data for Name: game_invites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_invites (id, from_user_id, to_user_id, status, created_at, responded_at) FROM stdin;
102	1	2	rejected	2026-01-13 11:28:50.317695+00	\N
24	1	2	completed	2026-01-02 08:31:49.186425+00	\N
62	1	2	rejected	2026-01-03 05:43:20.105709+00	\N
103	1	2	completed	2026-01-13 11:31:34.270671+00	\N
25	1	2	rejected	2026-01-02 08:37:48.186433+00	\N
63	1	2	completed	2026-01-03 06:35:45.468845+00	\N
26	1	2	rejected	2026-01-02 18:17:14.248986+00	\N
104	1	9	completed	2026-01-13 13:22:38.413223+00	\N
27	2	1	rejected	2026-01-02 18:21:11.499568+00	\N
64	1	2	completed	2026-01-03 06:44:00.500189+00	\N
28	1	2	rejected	2026-01-02 18:30:20.094914+00	\N
29	1	2	rejected	2026-01-02 18:31:58.787978+00	\N
65	1	2	completed	2026-01-03 06:48:42.956794+00	\N
105	5	12	completed	2026-01-13 13:52:10.937586+00	\N
4	5	3	rejected	2025-12-31 03:00:03.553707+00	\N
30	1	2	rejected	2026-01-02 19:18:32.124228+00	\N
19	1	5	rejected	2025-12-31 06:19:31.765481+00	\N
66	1	2	completed	2026-01-03 06:57:42.645901+00	\N
31	2	1	rejected	2026-01-02 19:27:42.692531+00	\N
20	1	5	rejected	2025-12-31 06:20:16.478338+00	\N
22	1	3	rejected	2025-12-31 06:39:43.617072+00	\N
6	1	3	rejected	2025-12-31 04:49:21.411277+00	\N
32	2	1	rejected	2026-01-02 19:33:27.517225+00	\N
67	1	2	rejected	2026-01-04 14:57:44.641361+00	\N
33	1	2	rejected	2026-01-02 19:35:11.812922+00	\N
106	5	12	rejected	2026-01-13 14:53:35.387231+00	\N
34	1	2	rejected	2026-01-02 21:26:12.957556+00	\N
68	1	4	completed	2026-01-04 20:37:46.561889+00	\N
35	1	2	rejected	2026-01-02 21:54:45.586703+00	\N
36	1	2	completed	2026-01-02 22:17:00.999644+00	\N
69	1	4	rejected	2026-01-04 20:57:58.656323+00	\N
5	1	3	completed	2025-12-31 04:09:55.803572+00	\N
107	1	6	completed	2026-01-13 17:24:15.338639+00	\N
37	1	2	completed	2026-01-03 03:00:18.176475+00	\N
70	1	4	rejected	2026-01-04 21:10:32.509047+00	\N
38	1	2	rejected	2026-01-03 03:11:54.964096+00	\N
39	1	2	rejected	2026-01-03 03:12:38.807607+00	\N
71	1	4	rejected	2026-01-06 13:12:58.689384+00	\N
40	1	2	rejected	2026-01-03 03:17:33.18396+00	\N
41	1	2	rejected	2026-01-03 03:18:26.303701+00	\N
72	1	4	completed	2026-01-06 13:14:14.220234+00	\N
1	1	5	completed	2025-12-30 23:47:06.302569+00	2025-12-30 23:54:42.34098+00
2	1	3	completed	2025-12-31 01:15:16.903998+00	2025-12-31 01:15:39.313189+00
3	5	3	completed	2025-12-31 02:46:50.831288+00	\N
7	1	3	completed	2025-12-31 05:00:12.924588+00	\N
8	1	3	completed	2025-12-31 05:00:23.921028+00	\N
9	1	3	completed	2025-12-31 05:03:10.417761+00	\N
10	1	3	completed	2025-12-31 05:07:03.870566+00	\N
11	1	3	completed	2025-12-31 05:15:22.79874+00	\N
12	1	3	completed	2025-12-31 05:15:48.081791+00	\N
13	1	3	completed	2025-12-31 05:31:56.017647+00	\N
14	1	3	completed	2025-12-31 05:32:11.759675+00	\N
15	1	3	completed	2025-12-31 05:39:27.00822+00	\N
16	1	3	completed	2025-12-31 05:39:45.271773+00	\N
17	1	3	completed	2025-12-31 05:50:58.275835+00	\N
18	1	3	completed	2025-12-31 06:00:22.692601+00	\N
42	1	2	rejected	2026-01-03 03:22:52.047703+00	\N
73	1	4	rejected	2026-01-07 10:38:07.751812+00	\N
43	1	2	completed	2026-01-03 03:23:07.614054+00	\N
44	1	2	rejected	2026-01-03 03:27:36.527196+00	\N
45	1	2	rejected	2026-01-03 03:30:55.814621+00	\N
74	1	4	rejected	2026-01-07 10:45:44.630258+00	\N
46	1	2	rejected	2026-01-03 03:31:10.28505+00	\N
75	1	9	rejected	2026-01-08 10:08:31.746147+00	\N
47	1	2	rejected	2026-01-03 03:41:54.136082+00	\N
76	1	9	rejected	2026-01-08 10:09:10.933757+00	\N
48	1	2	rejected	2026-01-03 03:42:16.673348+00	\N
49	1	2	rejected	2026-01-03 03:53:10.385429+00	\N
50	1	2	rejected	2026-01-03 03:53:42.441748+00	\N
77	1	9	completed	2026-01-08 10:10:57.57293+00	\N
51	1	2	rejected	2026-01-03 04:09:15.733214+00	\N
52	1	2	rejected	2026-01-03 04:22:00.544484+00	\N
78	1	9	completed	2026-01-08 10:23:08.134566+00	\N
53	1	2	rejected	2026-01-03 04:22:26.912769+00	\N
54	1	2	rejected	2026-01-03 04:22:50.675357+00	\N
79	1	11	rejected	2026-01-08 12:56:48.268372+00	\N
55	1	2	completed	2026-01-03 04:23:16.756229+00	\N
80	1	11	rejected	2026-01-08 12:57:38.316487+00	\N
56	1	2	completed	2026-01-03 04:36:01.15764+00	\N
81	9	11	completed	2026-01-08 12:59:07.378591+00	\N
57	1	2	completed	2026-01-03 04:50:04.732577+00	\N
58	1	2	rejected	2026-01-03 05:02:27.24244+00	\N
82	1	9	rejected	2026-01-08 13:20:55.957988+00	\N
59	1	2	rejected	2026-01-03 05:02:49.312993+00	\N
60	1	2	completed	2026-01-03 05:04:16.457884+00	\N
83	1	12	completed	2026-01-12 09:25:05.838667+00	\N
21	5	1	completed	2025-12-31 06:22:54.934616+00	\N
61	1	2	completed	2026-01-03 05:12:15.286482+00	\N
84	1	12	rejected	2026-01-12 10:44:14.506689+00	\N
85	9	4	completed	2026-01-12 10:53:37.299764+00	\N
86	12	6	completed	2026-01-12 10:58:31.158696+00	\N
23	1	3	rejected	2025-12-31 07:05:57.526277+00	\N
87	3	2	completed	2026-01-12 11:05:03.488257+00	\N
88	2	6	rejected	2026-01-12 11:27:25.260266+00	\N
89	2	3	rejected	2026-01-12 11:27:59.742699+00	\N
90	9	5	completed	2026-01-12 12:41:49.933984+00	\N
91	2	12	completed	2026-01-12 13:08:37.39235+00	\N
92	9	12	completed	2026-01-12 13:36:13.915097+00	\N
93	1	9	rejected	2026-01-13 06:12:08.622136+00	\N
94	1	9	rejected	2026-01-13 06:21:53.450913+00	\N
95	1	9	rejected	2026-01-13 06:27:06.614013+00	\N
96	1	2	rejected	2026-01-13 06:30:09.547357+00	\N
97	1	2	rejected	2026-01-13 10:38:48.235335+00	\N
98	1	2	rejected	2026-01-13 10:57:54.021894+00	\N
99	1	2	rejected	2026-01-13 11:04:49.153547+00	\N
100	1	2	rejected	2026-01-13 11:12:24.820568+00	\N
101	1	2	completed	2026-01-13 11:21:09.560886+00	\N
108	1	5	rejected	2026-02-05 13:56:16.065774+00	\N
109	1	5	rejected	2026-02-05 13:56:58.938219+00	\N
110	1	5	accepted	2026-02-05 13:57:47.875234+00	\N
111	1	12	completed	2026-02-05 14:12:47.183859+00	\N
\.


--
-- Data for Name: match_games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.match_games (id, match_id, game_number, player1_points, player2_points, winner_id, ended_at) FROM stdin;
5	2	1	12	21	6	2025-12-19 22:00:00+00
6	2	2	17	21	6	2025-12-19 22:00:00+00
7	2	3	21	19	4	2025-12-19 22:00:00+00
8	2	4	14	21	6	2025-12-19 22:00:00+00
9	3	1	21	16	2	2025-12-19 22:00:00+00
10	3	2	21	15	2	2025-12-19 22:00:00+00
11	3	3	12	21	5	2025-12-19 22:00:00+00
12	3	4	21	11	2	2025-12-19 22:00:00+00
13	4	1	12	21	1	2025-12-19 22:00:00+00
14	4	2	21	19	3	2025-12-19 22:00:00+00
15	4	3	21	16	3	2025-12-19 22:00:00+00
16	4	4	14	21	1	2025-12-19 22:00:00+00
17	5	1	21	18	6	2025-12-20 22:00:00+00
18	5	2	21	16	6	2025-12-20 22:00:00+00
19	5	3	12	21	2	2025-12-20 22:00:00+00
20	5	4	21	19	6	2025-12-20 22:00:00+00
21	6	1	12	21	4	2025-12-20 22:00:00+00
22	6	2	21	18	5	2025-12-20 22:00:00+00
23	6	3	14	21	4	2025-12-20 22:00:00+00
24	6	4	19	21	4	2025-12-20 22:00:00+00
25	7	1	21	6	1	2025-12-21 22:00:00+00
26	7	2	21	8	1	2025-12-21 22:00:00+00
27	7	3	21	12	1	2025-12-21 22:00:00+00
28	7	4	21	10	1	2025-12-21 22:00:00+00
29	8	1	21	12	2	2025-12-22 22:00:00+00
30	8	2	21	15	2	2025-12-22 22:00:00+00
31	8	3	21	14	2	2025-12-22 22:00:00+00
32	8	4	21	13	2	2025-12-22 22:00:00+00
33	9	1	12	21	1	2025-12-23 22:00:00+00
34	9	2	21	19	5	2025-12-23 22:00:00+00
35	9	3	14	21	1	2025-12-23 22:00:00+00
36	9	4	19	21	1	2025-12-23 22:00:00+00
37	10	1	21	18	4	2025-12-24 22:00:00+00
38	10	2	21	16	4	2025-12-24 22:00:00+00
39	10	3	12	21	5	2025-12-24 22:00:00+00
40	10	4	21	19	4	2025-12-24 22:00:00+00
41	11	1	21	10	6	2025-12-24 22:00:00+00
42	11	2	21	8	6	2025-12-24 22:00:00+00
43	11	3	21	0	6	2025-12-24 22:00:00+00
44	11	4	21	0	6	2025-12-24 22:00:00+00
45	12	1	21	18	2	2025-12-25 22:00:00+00
46	12	2	21	16	2	2025-12-25 22:00:00+00
47	12	3	12	21	1	2025-12-25 22:00:00+00
48	12	4	21	19	2	2025-12-25 22:00:00+00
49	13	1	21	10	3	2025-12-25 22:00:00+00
50	13	2	21	8	3	2025-12-25 22:00:00+00
51	13	3	21	0	3	2025-12-25 22:00:00+00
52	13	4	21	0	3	2025-12-25 22:00:00+00
53	14	1	21	18	4	2025-12-25 22:00:00+00
54	14	2	21	16	4	2025-12-25 22:00:00+00
55	14	3	12	21	6	2025-12-25 22:00:00+00
56	14	4	21	19	4	2025-12-25 22:00:00+00
57	15	1	21	6	1	2025-12-26 22:00:00+00
58	15	2	21	8	1	2025-12-26 22:00:00+00
59	15	3	21	12	1	2025-12-26 22:00:00+00
60	15	4	21	10	1	2025-12-26 22:00:00+00
61	16	1	12	21	4	2025-12-26 22:00:00+00
62	16	2	17	21	4	2025-12-26 22:00:00+00
63	16	3	21	19	3	2025-12-26 22:00:00+00
64	16	4	14	21	4	2025-12-26 22:00:00+00
65	17	1	21	10	6	2025-12-26 22:00:00+00
66	17	2	21	8	6	2025-12-26 22:00:00+00
67	17	3	21	0	6	2025-12-26 22:00:00+00
68	17	4	21	0	6	2025-12-26 22:00:00+00
69	18	1	21	0	5	2025-12-26 22:00:00+00
70	18	2	21	0	5	2025-12-26 22:00:00+00
71	18	3	21	1	5	2025-12-26 22:00:00+00
72	18	4	21	0	5	2025-12-26 22:00:00+00
77	20	1	21	0	1	2025-12-30 15:23:34.814129+00
78	20	2	21	0	1	2025-12-30 15:23:34.819235+00
79	20	3	21	0	1	2025-12-30 15:23:34.820309+00
80	20	4	6	21	3	2025-12-30 15:23:34.82084+00
81	21	1	2	21	3	2025-12-31 01:51:24.434675+00
82	21	2	0	21	3	2025-12-31 01:51:24.43879+00
83	21	3	0	21	3	2025-12-31 01:51:24.439258+00
84	21	4	0	21	3	2025-12-31 01:51:24.439695+00
85	22	1	21	0	1	2025-12-31 02:06:27.85267+00
86	22	2	21	0	1	2025-12-31 02:06:27.857211+00
87	22	3	21	0	1	2025-12-31 02:06:27.857839+00
88	22	4	21	0	1	2025-12-31 02:06:27.858301+00
89	23	1	21	0	1	2025-12-31 02:15:09.469989+00
90	23	2	21	17	1	2025-12-31 02:15:09.4745+00
91	23	3	21	2	1	2025-12-31 02:15:09.475645+00
92	23	4	21	0	1	2025-12-31 02:15:09.476271+00
93	24	1	21	0	1	2025-12-31 02:30:11.251948+00
94	24	2	21	0	1	2025-12-31 02:30:11.256268+00
95	24	3	21	2	1	2025-12-31 02:30:11.256986+00
96	24	4	21	4	1	2025-12-31 02:30:11.257543+00
97	25	1	0	21	3	2025-12-31 02:49:16.715018+00
98	25	2	1	21	3	2025-12-31 02:49:16.718444+00
99	25	3	0	21	3	2025-12-31 02:49:16.71899+00
100	25	4	0	21	3	2025-12-31 02:49:16.719484+00
105	27	1	21	0	1	2025-12-31 04:22:01.889912+00
106	27	2	21	0	1	2025-12-31 04:22:01.894176+00
107	27	3	21	1	1	2025-12-31 04:22:01.894735+00
108	27	4	21	1	1	2025-12-31 04:22:01.895274+00
109	28	1	0	21	2	2026-01-02 08:36:38.249043+00
110	28	2	0	21	2	2026-01-02 08:36:38.253497+00
111	28	3	4	21	2	2026-01-02 08:36:38.254015+00
112	28	4	0	21	2	2026-01-02 08:36:38.25448+00
113	29	1	21	0	1	2026-01-03 02:59:00.756106+00
114	29	2	21	0	1	2026-01-03 02:59:00.763341+00
115	29	3	21	0	1	2026-01-03 02:59:00.765912+00
116	29	4	21	0	1	2026-01-03 02:59:00.766526+00
117	30	1	21	0	1	2026-01-03 03:03:09.235719+00
118	30	2	0	21	2	2026-01-03 03:03:09.239434+00
119	30	3	2	21	2	2026-01-03 03:03:09.240112+00
120	30	4	0	21	2	2026-01-03 03:03:09.240704+00
121	31	1	0	21	2	2026-01-03 03:25:32.331992+00
122	31	2	3	21	2	2026-01-03 03:25:32.336123+00
123	31	3	0	21	2	2026-01-03 03:25:32.336689+00
124	31	4	0	21	2	2026-01-03 03:25:32.337152+00
125	32	1	0	21	2	2026-01-03 04:34:24.83016+00
126	32	2	0	21	2	2026-01-03 04:34:24.833406+00
127	32	3	1	21	2	2026-01-03 04:34:24.833871+00
128	32	4	0	21	2	2026-01-03 04:34:24.834431+00
161	41	1	0	21	4	2026-01-04 20:40:48.054826+00
162	41	2	1	21	4	2026-01-04 20:40:48.060225+00
163	41	3	1	21	4	2026-01-04 20:40:48.060849+00
164	41	4	0	21	4	2026-01-04 20:40:48.06134+00
165	42	1	7	21	4	2026-01-06 13:18:32.903402+00
166	42	2	21	0	1	2026-01-06 13:18:32.910753+00
167	42	3	21	0	1	2026-01-06 13:18:32.911262+00
168	42	4	21	4	1	2026-01-06 13:18:32.91172+00
178	45	1	21	17	\N	2026-01-07 06:12:34.246251+00
179	45	2	19	21	\N	2026-01-07 06:12:34.246251+00
180	45	3	21	14	\N	2026-01-07 06:12:34.246251+00
181	45	4	21	12	\N	2026-01-07 06:12:34.246251+00
182	47	1	16	21	\N	2026-01-07 06:12:34.246251+00
183	47	2	21	18	\N	2026-01-07 06:12:34.246251+00
184	47	3	12	21	\N	2026-01-07 06:12:34.246251+00
185	47	4	15	21	\N	2026-01-07 06:12:34.246251+00
186	46	1	21	11	\N	2026-01-07 06:12:34.246251+00
187	46	2	18	21	\N	2026-01-07 06:12:34.246251+00
188	46	3	21	14	\N	2026-01-07 06:12:34.246251+00
189	46	4	21	16	\N	2026-01-07 06:12:34.246251+00
190	49	1	13	21	4	2026-01-07 06:12:34.246251+00
191	49	2	21	17	3	2026-01-07 06:12:34.246251+00
192	49	3	12	21	4	2026-01-07 06:12:34.246251+00
193	49	4	9	21	4	2026-01-07 06:12:34.246251+00
194	48	1	21	10	1	2026-01-07 06:12:34.246251+00
195	48	2	18	21	2	2026-01-07 06:12:34.246251+00
196	48	3	21	12	1	2026-01-07 06:12:34.246251+00
197	48	4	21	19	1	2026-01-07 06:12:34.246251+00
198	50	1	21	17	\N	2026-01-07 06:15:44.825109+00
199	50	2	19	21	\N	2026-01-07 06:15:44.825109+00
200	50	3	21	14	\N	2026-01-07 06:15:44.825109+00
201	50	4	21	12	\N	2026-01-07 06:15:44.825109+00
202	52	1	16	21	\N	2026-01-07 06:15:44.825109+00
203	52	2	21	18	\N	2026-01-07 06:15:44.825109+00
204	52	3	12	21	\N	2026-01-07 06:15:44.825109+00
205	52	4	15	21	\N	2026-01-07 06:15:44.825109+00
206	51	1	21	11	1	2026-01-07 06:15:44.825109+00
207	51	2	18	21	4	2026-01-07 06:15:44.825109+00
208	51	3	21	14	1	2026-01-07 06:15:44.825109+00
209	51	4	21	16	1	2026-01-07 06:15:44.825109+00
222	56	1	21	13	5	2026-01-07 07:38:35.253444+00
223	56	2	18	21	6	2026-01-07 07:38:35.253444+00
224	56	3	21	15	5	2026-01-07 07:38:35.253444+00
225	56	4	21	17	5	2026-01-07 07:38:35.253444+00
226	57	1	14	21	8	2026-01-07 07:38:35.253444+00
227	57	2	21	18	7	2026-01-07 07:38:35.253444+00
228	57	3	13	21	8	2026-01-07 07:38:35.253444+00
229	57	4	16	21	8	2026-01-07 07:38:35.253444+00
230	58	1	21	17	1	2026-01-07 07:41:44.909014+00
231	58	2	19	21	6	2026-01-07 07:41:44.909014+00
232	58	3	21	14	1	2026-01-07 07:41:44.909014+00
233	58	4	21	12	1	2026-01-07 07:41:44.909014+00
234	60	1	15	21	8	2026-01-07 07:41:44.909014+00
235	60	2	21	18	5	2026-01-07 07:41:44.909014+00
236	60	3	12	21	8	2026-01-07 07:41:44.909014+00
237	60	4	16	21	8	2026-01-07 07:41:44.909014+00
238	59	1	21	12	1	2026-01-07 07:41:44.909014+00
239	59	2	18	21	4	2026-01-07 07:41:44.909014+00
240	59	3	21	14	1	2026-01-07 07:41:44.909014+00
241	59	4	21	16	1	2026-01-07 07:41:44.909014+00
246	62	1	21	14	1	2026-01-07 07:46:11.266976+00
247	62	2	18	21	4	2026-01-07 07:46:11.266976+00
248	62	3	21	16	1	2026-01-07 07:46:11.266976+00
249	62	4	21	17	1	2026-01-07 07:46:11.266976+00
258	63	1	15	21	8	2026-01-07 07:48:54.230457+00
259	63	2	21	18	5	2026-01-07 07:48:54.230457+00
260	63	3	12	21	8	2026-01-07 07:48:54.230457+00
261	63	4	16	21	8	2026-01-07 07:48:54.230457+00
262	64	1	21	17	1	2026-01-07 07:48:54.230457+00
263	64	2	19	21	8	2026-01-07 07:48:54.230457+00
264	64	3	21	14	1	2026-01-07 07:48:54.230457+00
265	64	4	21	12	1	2026-01-07 07:48:54.230457+00
270	66	1	1	21	9	2026-01-08 10:25:30.201036+00
271	66	2	0	21	9	2026-01-08 10:25:30.2048+00
272	66	3	0	21	9	2026-01-08 10:25:30.205831+00
273	66	4	21	9	1	2026-01-08 10:25:30.206519+00
274	67	1	21	2	9	2026-01-08 13:02:35.087987+00
275	67	2	21	0	9	2026-01-08 13:02:35.092067+00
276	67	3	21	0	9	2026-01-08 13:02:35.092831+00
277	67	4	21	0	9	2026-01-08 13:02:35.093288+00
278	68	1	21	0	1	2026-01-12 09:27:30.010032+00
279	68	2	21	0	1	2026-01-12 09:27:30.017881+00
280	68	3	21	0	1	2026-01-12 09:27:30.018521+00
281	68	4	21	0	1	2026-01-12 09:27:30.019141+00
282	69	1	0	21	5	2026-01-12 10:19:22.039787+00
283	69	2	21	0	1	2026-01-12 10:19:22.045104+00
284	69	3	0	21	5	2026-01-12 10:19:22.04757+00
285	69	4	1	21	5	2026-01-12 10:19:22.04873+00
286	70	1	21	12	9	2026-01-12 10:56:09.195291+00
287	70	2	21	0	9	2026-01-12 10:56:09.199139+00
288	70	3	21	0	9	2026-01-12 10:56:09.19974+00
289	70	4	21	3	9	2026-01-12 10:56:09.200258+00
290	71	1	21	0	12	2026-01-12 11:00:50.33189+00
291	71	2	21	0	12	2026-01-12 11:00:50.335305+00
292	71	3	21	2	12	2026-01-12 11:00:50.335793+00
293	71	4	21	0	12	2026-01-12 11:00:50.336314+00
294	72	1	0	21	2	2026-01-12 11:08:19.922651+00
295	72	2	3	21	2	2026-01-12 11:08:19.926238+00
296	72	3	0	21	2	2026-01-12 11:08:19.926913+00
297	72	4	0	21	2	2026-01-12 11:08:19.927799+00
298	73	1	21	0	9	2026-01-12 12:44:34.652629+00
299	73	2	21	4	9	2026-01-12 12:44:34.656576+00
300	73	3	21	2	9	2026-01-12 12:44:34.657147+00
301	73	4	12	21	5	2026-01-12 12:44:34.657635+00
302	74	1	0	21	12	2026-01-12 13:10:48.587972+00
303	74	2	2	21	12	2026-01-12 13:10:48.592915+00
304	74	3	0	21	12	2026-01-12 13:10:48.593662+00
305	74	4	0	21	12	2026-01-12 13:10:48.594239+00
306	75	1	2	21	12	2026-01-12 13:38:18.318163+00
307	75	2	0	21	12	2026-01-12 13:38:18.322804+00
308	75	3	1	21	12	2026-01-12 13:38:18.323515+00
309	75	4	0	21	12	2026-01-12 13:38:18.324035+00
310	76	1	21	0	1	2026-01-13 11:14:22.192832+00
311	76	2	21	2	1	2026-01-13 11:14:22.198761+00
312	76	3	21	0	1	2026-01-13 11:14:22.199555+00
313	76	4	0	21	2	2026-01-13 11:14:22.200186+00
318	78	1	21	0	1	2026-01-13 11:39:42.260736+00
319	78	2	21	0	1	2026-01-13 11:39:42.264492+00
320	78	3	21	0	1	2026-01-13 11:39:42.265286+00
321	78	4	0	21	2	2026-01-13 11:39:42.266125+00
322	79	1	21	0	1	2026-01-13 11:45:54.225888+00
323	79	2	0	21	2	2026-01-13 11:45:54.238388+00
324	79	3	0	21	2	2026-01-13 11:45:54.239102+00
325	79	4	21	0	1	2026-01-13 11:45:54.239623+00
326	80	1	21	0	1	2026-01-13 13:24:46.165207+00
327	80	2	21	0	1	2026-01-13 13:24:46.169968+00
328	80	3	21	0	1	2026-01-13 13:24:46.170982+00
329	80	4	21	0	1	2026-01-13 13:24:46.171776+00
330	81	1	0	21	12	2026-01-13 14:11:24.748637+00
331	81	2	0	21	12	2026-01-13 14:11:24.752888+00
332	81	3	0	21	12	2026-01-13 14:11:24.753411+00
333	81	4	0	21	12	2026-01-13 14:11:24.753895+00
334	82	1	0	21	6	2026-01-13 17:26:28.41781+00
335	82	2	21	0	1	2026-01-13 17:26:28.425743+00
336	82	3	21	0	1	2026-01-13 17:26:28.426922+00
337	82	4	21	0	1	2026-01-13 17:26:28.428149+00
338	83	1	0	21	5	2026-02-05 14:00:39.903022+00
339	83	2	1	21	5	2026-02-05 14:00:39.922741+00
340	83	3	21	9	1	2026-02-05 14:00:39.939573+00
341	83	4	21	0	1	2026-02-05 14:00:39.956621+00
343	84	1	21	0	1	2026-02-05 14:15:33.436659+00
344	84	2	21	0	1	2026-02-05 14:15:33.456528+00
345	84	3	0	21	12	2026-02-05 14:15:33.505318+00
346	84	4	0	21	12	2026-02-05 14:15:33.522379+00
347	84	5	21	0	1	2026-02-05 14:15:33.539428+00
\.


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.matches (id, played_at, mode, status, player1_id, player2_id, winner_id, player1_games_won, player2_games_won, created_at, tournament_id) FROM stdin;
8	2025-12-22 22:00:00+00	friendly	finished	2	3	2	4	0	2025-12-29 00:10:06.364279+00	\N
9	2025-12-23 22:00:00+00	friendly	finished	5	1	1	1	3	2025-12-29 00:10:06.364279+00	\N
10	2025-12-24 22:00:00+00	friendly	finished	4	5	4	3	1	2025-12-29 00:10:06.364279+00	\N
11	2025-12-24 22:00:00+00	friendly	finished	6	3	6	4	0	2025-12-29 00:10:06.364279+00	\N
12	2025-12-25 22:00:00+00	friendly	finished	2	1	2	3	1	2025-12-29 00:10:06.364279+00	\N
13	2025-12-25 22:00:00+00	friendly	finished	3	5	3	4	0	2025-12-29 00:10:06.364279+00	\N
14	2025-12-25 22:00:00+00	friendly	finished	4	6	4	3	1	2025-12-29 00:10:06.364279+00	\N
15	2025-12-26 22:00:00+00	friendly	finished	1	2	1	4	0	2025-12-29 00:10:06.364279+00	\N
16	2025-12-26 22:00:00+00	friendly	finished	3	4	4	2	4	2025-12-29 00:10:06.364279+00	\N
17	2025-12-26 22:00:00+00	friendly	finished	6	7	6	4	0	2025-12-29 00:10:06.364279+00	\N
18	2025-12-26 22:00:00+00	friendly	finished	5	6	5	4	0	2025-12-29 00:10:06.364279+00	\N
2	2025-12-19 22:00:00+00	tournament	finished	4	6	6	2	4	2025-12-29 00:10:06.364279+00	\N
3	2025-12-19 22:00:00+00	tournament	finished	2	5	2	3	1	2025-12-29 00:10:06.364279+00	\N
4	2025-12-19 22:00:00+00	tournament	finished	3	1	1	1	3	2025-12-29 00:10:06.364279+00	\N
56	2025-12-26 07:38:35.253444+00	tournament	finished	5	6	5	3	1	2026-01-07 07:38:35.253444+00	\N
57	2025-12-26 07:38:35.253444+00	tournament	finished	7	8	8	1	3	2026-01-07 07:38:35.253444+00	\N
58	2025-12-28 07:41:44.909014+00	tournament	finished	1	6	1	3	1	2026-01-07 07:41:44.909014+00	\N
5	2025-12-20 22:00:00+00	tournament	finished	5	6	5	3	1	2025-12-29 00:10:06.364279+00	\N
6	2025-12-20 22:00:00+00	tournament	finished	2	1	1	1	3	2025-12-29 00:10:06.364279+00	\N
7	2025-12-21 22:00:00+00	tournament	finished	5	1	1	4	0	2025-12-29 00:10:06.364279+00	\N
20	2025-12-29 22:00:00+00	private	finished	1	3	1	3	1	2025-12-30 15:23:34.807258+00	\N
21	2025-12-30 22:00:00+00	private	finished	1	3	3	0	4	2025-12-31 01:51:24.430879+00	\N
22	2025-12-30 22:00:00+00	private	finished	1	3	1	4	0	2025-12-31 02:06:27.835814+00	\N
23	2025-12-30 22:00:00+00	private	finished	1	3	1	4	0	2025-12-31 02:15:09.453616+00	\N
24	2025-12-30 22:00:00+00	private	finished	1	3	1	4	0	2025-12-31 02:30:11.234406+00	\N
25	2025-12-30 22:00:00+00	private	finished	5	3	3	0	4	2025-12-31 02:49:16.711252+00	\N
27	2025-12-30 22:00:00+00	private	finished	1	3	1	4	0	2025-12-31 04:22:01.871843+00	\N
28	2026-01-01 22:00:00+00	private	finished	1	2	2	0	4	2026-01-02 08:36:38.245035+00	\N
29	2026-01-02 22:00:00+00	private	finished	1	2	1	4	0	2026-01-03 02:59:00.739333+00	\N
30	2026-01-02 22:00:00+00	private	finished	1	2	2	1	3	2026-01-03 03:03:09.222909+00	\N
31	2026-01-02 22:00:00+00	private	finished	1	2	2	0	4	2026-01-03 03:25:32.328585+00	\N
32	2026-01-02 22:00:00+00	private	finished	1	2	2	0	4	2026-01-03 04:34:24.825703+00	\N
41	2026-01-03 22:00:00+00	private	finished	1	4	4	0	4	2026-01-04 20:40:48.043655+00	\N
42	2026-01-05 22:00:00+00	private	finished	1	4	1	3	1	2026-01-06 13:18:32.895996+00	\N
45	2025-12-28 06:12:34.246251+00	tournament	finished	\N	\N	\N	3	1	2026-01-07 06:12:34.246251+00	\N
46	2025-12-27 06:12:34.246251+00	tournament	finished	\N	\N	\N	3	1	2026-01-07 06:12:34.246251+00	\N
47	2025-12-27 06:12:34.246251+00	tournament	finished	\N	\N	\N	1	3	2026-01-07 06:12:34.246251+00	\N
48	2025-12-26 06:12:34.246251+00	tournament	finished	1	2	1	3	1	2026-01-07 06:12:34.246251+00	\N
49	2025-12-26 06:12:34.246251+00	tournament	finished	3	4	4	1	3	2026-01-07 06:12:34.246251+00	\N
50	2025-12-28 06:15:44.825109+00	tournament	finished	\N	\N	\N	3	1	2026-01-07 06:15:44.825109+00	\N
51	2025-12-27 06:15:44.825109+00	tournament	finished	1	4	1	3	1	2026-01-07 06:15:44.825109+00	\N
52	2025-12-27 06:15:44.825109+00	tournament	finished	\N	\N	\N	1	3	2026-01-07 06:15:44.825109+00	\N
59	2025-12-27 07:41:44.909014+00	tournament	finished	1	4	1	3	1	2026-01-07 07:41:44.909014+00	\N
60	2025-12-27 07:41:44.909014+00	tournament	finished	5	8	8	1	3	2026-01-07 07:41:44.909014+00	\N
62	2025-12-27 07:46:11.266976+00	tournament	finished	1	4	1	3	1	2026-01-07 07:46:11.266976+00	\N
63	2025-12-27 07:46:11.266976+00	tournament	finished	5	8	8	1	3	2026-01-07 07:46:11.266976+00	\N
64	2025-12-28 07:46:11.266976+00	tournament	finished	1	8	1	3	1	2026-01-07 07:46:11.266976+00	\N
66	2026-01-07 22:00:00+00	private	finished	1	9	9	1	3	2026-01-08 10:25:30.186588+00	\N
67	2026-01-07 22:00:00+00	private	finished	9	11	9	4	0	2026-01-08 13:02:35.085067+00	\N
68	2026-01-11 22:00:00+00	private	finished	1	12	1	4	0	2026-01-12 09:27:29.986967+00	\N
69	2026-01-11 22:00:00+00	private	finished	1	5	5	1	3	2026-01-12 10:19:22.026241+00	\N
70	2026-01-11 22:00:00+00	private	finished	9	4	9	4	0	2026-01-12 10:56:09.191384+00	\N
71	2026-01-11 22:00:00+00	private	finished	12	6	12	4	0	2026-01-12 11:00:50.315093+00	\N
72	2026-01-11 22:00:00+00	private	finished	3	2	2	0	4	2026-01-12 11:08:19.918963+00	\N
73	2026-01-11 22:00:00+00	private	finished	9	5	9	3	1	2026-01-12 12:44:34.634493+00	\N
74	2026-01-11 22:00:00+00	private	finished	2	12	12	0	4	2026-01-12 13:10:48.569382+00	\N
75	2026-01-11 22:00:00+00	private	finished	9	12	12	0	4	2026-01-12 13:38:18.302294+00	\N
76	2026-01-12 22:00:00+00	private	finished	1	2	1	3	1	2026-01-13 11:14:22.188317+00	\N
78	2026-01-12 22:00:00+00	private	finished	1	2	1	3	1	2026-01-13 11:39:42.255703+00	\N
79	2026-01-12 22:00:00+00	private	finished	1	2	\N	2	2	2026-01-13 11:45:54.205309+00	\N
80	2026-01-12 22:00:00+00	private	finished	1	9	1	4	0	2026-01-13 13:24:46.160254+00	\N
81	2026-01-12 22:00:00+00	private	finished	5	12	12	0	4	2026-01-13 14:11:24.745361+00	\N
82	2026-01-12 22:00:00+00	private	finished	1	6	1	3	1	2026-01-13 17:26:28.408121+00	\N
83	2026-02-05 00:00:00+00	private	finished	1	5	1	3	2	2026-02-05 14:00:39.885786+00	\N
84	2026-02-05 00:00:00+00	private	finished	1	12	1	3	2	2026-02-05 14:15:33.417552+00	\N
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_id, receiver_id, body, created_at, read_at, deleted_at) FROM stdin;
2	1	4	hello peter	2026-01-04 23:40:39.918037+00	2026-01-04 23:40:39.925797+00	\N
3	4	1	hi john	2026-01-04 23:41:10.222063+00	2026-01-04 23:41:10.224944+00	\N
4	4	1	how are you	2026-01-04 23:46:34.552773+00	2026-01-04 23:46:34.563349+00	\N
5	1	4	i am good and you	2026-01-04 23:47:16.536813+00	2026-01-04 23:47:16.607515+00	\N
7	4	1	yes John	2026-01-04 23:56:06.616479+00	2026-01-05 00:09:25.657863+00	\N
8	4	1	yoy yoy John	2026-01-05 00:09:06.774901+00	2026-01-05 00:09:25.657863+00	\N
9	1	4	let's play	2026-01-05 00:09:35.518877+00	2026-01-05 00:09:53.937418+00	\N
10	4	1	ok	2026-01-05 00:10:05.826818+00	2026-01-05 00:10:10.911641+00	\N
11	1	4	yohoohooo	2026-01-05 00:10:33.743878+00	2026-01-05 00:10:39.24082+00	\N
55	4	1	hi john	2026-01-07 10:47:06.438664+00	2026-01-07 10:47:06.480979+00	\N
13	1	5	hello harry	2026-01-05 00:14:10.52897+00	\N	\N
14	1	4	ops are you here	2026-01-05 00:16:10.618824+00	2026-01-05 00:16:23.686704+00	\N
15	4	1	yes, i am here	2026-01-05 00:16:40.058408+00	2026-01-05 00:16:49.169037+00	\N
17	1	4	hi peter	2026-01-05 06:50:24.537521+00	2026-01-05 06:50:33.37853+00	\N
18	4	1	what is up john	2026-01-05 06:51:00.653264+00	2026-01-05 06:51:18.622884+00	\N
19	1	5	sf\\gj	2026-01-05 07:51:28.61821+00	\N	\N
20	1	5	agg	2026-01-05 07:51:29.251558+00	\N	\N
21	1	5	ag	2026-01-05 07:51:29.69508+00	\N	\N
22	1	5	aeg	2026-01-05 07:51:29.995557+00	\N	\N
23	1	5	a	2026-01-05 07:51:30.126039+00	\N	\N
24	1	5	g	2026-01-05 07:51:30.442574+00	\N	\N
25	1	5	aeggtrrera	2026-01-05 07:51:31.133654+00	\N	\N
26	1	5	ge	2026-01-05 07:51:31.456022+00	\N	\N
27	1	5	agr	2026-01-05 07:51:31.781392+00	\N	\N
28	1	5	arg	2026-01-05 07:51:32.169708+00	\N	\N
29	1	5	erg	2026-01-05 07:51:32.645201+00	\N	\N
30	1	5	a	2026-01-05 07:51:32.770621+00	\N	\N
31	3	1	hi john	2026-01-05 08:28:43.055206+00	2026-01-05 08:29:05.136777+00	\N
32	3	1	\\sgfljgf\\l\n\n\n\nsdfv\\\\kjbv\\\n\\	2026-01-05 08:44:00.119339+00	2026-01-05 08:51:50.866265+00	\N
33	3	1	dsff\\\\vs	2026-01-05 08:44:03.177501+00	2026-01-05 08:51:50.866265+00	\N
34	3	1	zvdsvzs	2026-01-05 08:44:06.35889+00	2026-01-05 08:51:50.866265+00	\N
35	3	1	dszjghfkshdfz	2026-01-05 08:44:11.303646+00	2026-01-05 08:51:50.866265+00	\N
36	3	1	asjfgkuws	2026-01-05 08:44:15.873669+00	2026-01-05 08:51:50.866265+00	\N
37	3	1	sdjhjkghfsd	2026-01-05 08:44:19.709688+00	2026-01-05 08:51:50.866265+00	\N
38	3	1	adsfglkjs	2026-01-05 08:44:23.470993+00	2026-01-05 08:51:50.866265+00	\N
39	3	1	sdjkfgsadf	2026-01-05 08:44:27.603806+00	2026-01-05 08:51:50.866265+00	\N
40	3	1	asdfkjlsa\\	2026-01-05 08:44:31.101674+00	2026-01-05 08:51:50.866265+00	\N
41	1	3	gsd\\fhjkgsJ	2026-01-05 08:50:40.575941+00	2026-01-05 08:51:50.976374+00	\N
42	1	3	SGFDKJGDSZHFG	2026-01-05 08:50:45.086489+00	2026-01-05 08:51:50.976374+00	\N
43	1	4	hi peter	2026-01-05 09:14:14.373117+00	2026-01-05 09:14:17.737657+00	\N
47	5	6	hi bilbo	2026-01-05 09:24:25.142974+00	\N	\N
48	6	5	hi harry	2026-01-05 09:24:48.076499+00	\N	\N
44	4	1	hi john	2026-01-05 09:16:49.109537+00	2026-01-05 10:58:27.428634+00	\N
56	4	1	how are you	2026-01-07 10:47:28.377818+00	2026-01-07 13:27:00.997858+00	\N
49	4	1	hi John	2026-01-05 10:59:06.953065+00	2026-01-05 10:59:19.745073+00	\N
57	1	4	still here	2026-01-07 14:06:28.193647+00	2026-01-07 14:06:37.492387+00	\N
51	4	1	ok, when	2026-01-05 11:01:26.11475+00	2026-01-05 11:01:48.602765+00	\N
6	1	4		2026-01-04 23:55:28.879115+00	2026-01-04 23:55:55.73372+00	2026-01-05 14:55:26.60765
52	1	4	hi peter	2026-01-06 13:23:37.771225+00	2026-01-06 13:23:47.2388+00	\N
53	4	1	hi john	2026-01-06 13:24:02.119597+00	2026-01-06 13:24:14.256856+00	\N
45	1	4		2026-01-05 09:17:10.527998+00	2026-01-05 10:58:50.70729+00	2026-01-06 15:25:59.371541
50	1	4		2026-01-05 11:00:50.549173+00	2026-01-05 11:01:14.201779+00	2026-01-06 15:26:06.836097
54	1	4	hi peter	2026-01-07 10:46:55.666197+00	2026-01-07 10:47:00.996328+00	\N
58	4	1	yes	2026-01-07 14:06:42.166008+00	2026-01-07 14:06:42.196029+00	\N
59	1	4	fancy a game	2026-01-07 14:06:54.628452+00	2026-01-07 14:06:54.969938+00	\N
60	1	9	Hi donald	2026-01-08 10:22:05.390119+00	2026-01-08 10:22:11.691238+00	\N
61	9	1	Hi John	2026-01-08 10:22:18.452834+00	2026-01-08 10:22:18.520662+00	\N
62	9	1	how are you	2026-01-08 10:22:34.03825+00	2026-01-08 10:22:38.296229+00	\N
63	1	9	Good evening	2026-01-08 12:50:49.748055+00	2026-01-08 12:50:58.053805+00	\N
64	9	1	bbb	2026-01-08 12:51:12.139078+00	2026-01-08 12:51:12.216771+00	\N
65	9	1	fancy a game	2026-01-08 12:51:30.654923+00	2026-01-08 12:51:35.786821+00	\N
66	1	6	Hi Bilbo	2026-01-13 17:28:27.83161+00	2026-01-13 17:28:44.262093+00	\N
67	6	1	Hi John	2026-01-13 17:28:51.718079+00	2026-01-13 17:28:51.777117+00	\N
68	1	6	fancy a game	2026-01-13 17:49:39.054503+00	2026-01-13 17:49:49.765248+00	\N
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (id, email, role, first_name, last_name, gender, country, p_name, avatar_url, available) FROM stdin;
1	john@demo.local	user	John	Doe	male	Oz	John Doe	/img/player_1.png	t
2	path@demo.local	user	Path	Smith	male	Narnia	Path Smith	/img/player_2.png	t
3	alf@demo.local	user	Alf	Achmoneck	male	Melmak	Alf Achmoneck	/img/player_3.png	t
4	peter@demo.local	user	Peter	Pan	male	Neverland	Peter Pan	/img/player_4.png	f
5	harry@demo.local	user	Harry	Potter	male	Hogwarts	Harry Potter	/img/player_5.png	f
6	bilbo@demo.local	user	Bilbo	Baggins	male	Hobbiton	Bilbo Baggins	/img/player_6.png	t
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, image, p_name, country, available) FROM stdin;
\.


--
-- Data for Name: system_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_messages (id, from_user_id, to_user_id, type, payload, created_at, read_at) FROM stdin;
6	2	1	invite_cancelled	{"message": "The host cancelled the game invitation.", "inviteId": 32}	2026-01-02 21:34:40.399277	2026-01-02 21:23:51.540062+00
5	2	1	invite_cancelled	{"message": "The host cancelled the game invitation.", "inviteId": 31}	2026-01-02 21:33:16.884708	2026-01-02 21:23:52.435864+00
2	2	1	invite_cancelled	{"message": "The host cancelled the game invitation.", "inviteId": 27}	2026-01-02 20:21:29.978953	2026-01-02 21:23:52.628794+00
7	1	2	invite_cancelled	{"message": "The host cancelled the game invitation.", "inviteId": 33}	2026-01-02 21:35:21.456989	2026-01-02 21:24:24.297763+00
4	1	2	invite_cancelled	{"message": "The host cancelled the game invitation.", "inviteId": 30}	2026-01-02 21:19:12.443158	2026-01-02 21:24:26.765872+00
3	1	2	invite_cancelled	{"message": "The host cancelled the game invitation.", "inviteId": 28}	2026-01-02 20:31:27.410838	2026-01-02 21:24:27.423406+00
1	1	2	invite_cancelled	{"message": "The host cancelled the game invitation.", "inviteId": 26}	2026-01-02 20:17:25.56881	2026-01-02 21:24:27.680281+00
8	1	2	invite_cancelled	{"message": "The host cancelled the game invitation.", "inviteId": 34}	2026-01-02 23:40:10.521231	2026-01-02 22:16:38.576165+00
9	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 40}	2026-01-03 05:17:59.403871	2026-01-03 03:18:21.125872+00
10	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 46}	2026-01-03 05:40:07.960563	2026-01-03 03:40:18.859411+00
11	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 48}	2026-01-03 05:49:26.882061	2026-01-03 03:49:36.509529+00
12	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 51}	2026-01-03 06:12:16.770194	2026-01-03 04:22:34.626669+00
13	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 59}	2026-01-03 07:02:57.646674	2026-01-03 05:03:11.765334+00
14	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 62}	2026-01-03 08:35:26.828556	2026-01-03 06:35:39.156899+00
15	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 67}	2026-01-04 16:58:53.811594	2026-01-04 14:59:01.58249+00
16	1	4	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 69}	2026-01-04 22:58:10.303155	2026-01-04 20:58:17.313453+00
17	1	4	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 74}	2026-01-07 13:06:01.761356	2026-01-07 11:06:09.335119+00
19	1	11	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 80}	2026-01-08 14:57:52.615619	2026-01-08 12:58:12.802523+00
18	1	9	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 76}	2026-01-08 12:09:27.656929	2026-01-08 12:59:28.695342+00
20	1	12	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 84}	2026-01-12 12:44:16.093966	2026-01-12 10:58:40.430483+00
23	1	9	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 93}	2026-01-13 08:21:23.400333	2026-01-13 06:21:36.398794+00
24	1	9	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 94}	2026-01-13 08:26:53.078232	2026-01-13 06:27:01.96769+00
26	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 96}	2026-01-13 12:38:32.934079	2026-01-13 10:38:44.74035+00
27	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 97}	2026-01-13 12:57:41.334302	2026-01-13 10:57:48.794356+00
28	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 98}	2026-01-13 13:03:16.099676	2026-01-13 11:03:24.685096+00
29	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 99}	2026-01-13 13:11:35.047216	2026-01-13 11:12:14.216262+00
30	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 100}	2026-01-13 13:16:52.321641	2026-01-13 11:17:00.614181+00
31	1	2	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 102}	2026-01-13 13:30:27.404333	2026-01-13 11:30:38.414286+00
25	1	9	invite_cancelled	{"message": "John Doe cancelled the game invitation.", "hostName": "John Doe", "inviteId": 95}	2026-01-13 08:28:17.082781	2026-01-13 13:21:35.522209+00
22	2	3	invite_cancelled	{"message": "Path Smith cancelled the game invitation.", "hostName": "Path Smith", "inviteId": 89}	2026-01-12 13:28:01.046795	2026-01-13 14:45:01.90703+00
21	2	6	invite_cancelled	{"message": "Path Smith cancelled the game invitation.", "hostName": "Path Smith", "inviteId": 88}	2026-01-12 13:27:26.709413	2026-01-13 15:29:37.565182+00
\.


--
-- Data for Name: tournament_bracket_matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tournament_bracket_matches (id, tournament_id, round_number, round_name, slot_number, player1_id, player2_id, winner_id, status, source_match1_id, source_match2_id, played_match_id, scheduled_at, started_at, finished_at, created_at, updated_at, player1_name_snapshot, player2_name_snapshot, winner_name_snapshot, player1_image_snapshot, player2_image_snapshot) FROM stdin;
31	121	1	Quarterfinals	2	4	9	9	finished	\N	\N	70	\N	\N	2026-01-12 11:19:25.989425+00	2026-01-12 10:15:11.870862+00	2026-01-12 10:15:11.870862+00	\N	\N	\N	\N	\N
32	121	1	Quarterfinals	3	12	6	12	finished	\N	\N	71	\N	\N	2026-01-12 11:19:48.07098+00	2026-01-12 10:15:11.871584+00	2026-01-12 10:15:11.871584+00	\N	\N	\N	\N	\N
34	121	2	Semifinals	1	5	9	9	finished	30	31	73	\N	\N	2026-01-12 13:06:19.822988+00	2026-01-12 10:15:11.874653+00	2026-01-12 10:15:11.874653+00	\N	\N	\N	\N	\N
36	121	3	Final	1	9	12	12	finished	34	35	75	\N	\N	2026-01-13 13:35:31.538267+00	2026-01-12 10:15:11.876421+00	2026-01-12 10:15:11.876421+00	\N	\N	\N	\N	\N
1	101	2	Quarterfinals	1	1	2	1	finished	\N	\N	48	\N	\N	\N	2026-01-07 05:53:59.557985+00	2026-01-07 07:36:18.97422+00	John Doe	Path Smith	John Doe	\N	\N
2	101	2	Quarterfinals	2	3	4	4	finished	\N	\N	49	\N	\N	\N	2026-01-07 05:53:59.557985+00	2026-01-07 07:36:18.97422+00	Alf Achmoneck	Peter Pan	Peter Pan	\N	\N
3	101	2	Quarterfinals	3	5	6	5	finished	\N	\N	56	\N	\N	2025-12-26 07:38:35.253444+00	2026-01-07 05:53:59.557985+00	2026-01-07 07:38:35.253444+00	Harry Potter	Bilbo Baggins	Harry Potter	\N	\N
4	101	2	Quarterfinals	4	7	8	8	finished	\N	\N	57	\N	\N	2025-12-26 07:38:35.253444+00	2026-01-07 05:53:59.557985+00	2026-01-07 07:38:35.253444+00	Micky Mouse	mini mouse	mini mouse	\N	\N
5	101	3	Semifinals	1	1	4	1	finished	1	2	62	\N	\N	2025-12-27 06:24:11.593885+00	2026-01-07 05:53:59.557985+00	2026-01-07 07:46:11.266976+00	John Doe	Peter Pan	John Doe	\N	\N
33	121	1	Quarterfinals	4	2	3	2	finished	\N	\N	72	\N	\N	2026-01-12 11:13:13.299038+00	2026-01-12 10:15:11.873901+00	2026-01-12 10:15:11.873901+00	\N	\N	\N	\N	\N
30	121	1	Quarterfinals	1	1	5	5	finished	\N	\N	69	\N	\N	2026-01-12 11:14:06.743203+00	2026-01-12 10:15:11.867738+00	2026-01-12 10:15:11.867738+00	\N	\N	\N	\N	\N
35	121	2	Semifinals	2	12	2	12	finished	32	33	74	\N	\N	2026-01-12 13:19:44.653994+00	2026-01-12 10:15:11.875553+00	2026-01-12 10:15:11.875553+00	\N	\N	\N	\N	\N
41	122	2	Semifinals	1	\N	12	\N	pending	37	38	\N	\N	\N	\N	2026-01-13 13:49:45.287444+00	2026-01-13 13:49:45.287444+00	\N	\N	\N	\N	\N
38	122	1	Quarterfinals	2	5	12	12	finished	\N	\N	\N	\N	\N	2026-01-13 15:22:08.875448+00	2026-01-13 13:49:45.284327+00	2026-01-13 13:49:45.284327+00	\N	\N	\N	\N	\N
6	101	3	Semifinals	2	5	8	8	finished	3	4	63	\N	\N	2025-12-27 06:24:11.593885+00	2026-01-07 05:53:59.557985+00	2026-01-07 07:48:54.230457+00	Harry Potter	mini mouse	mini mouse	\N	\N
7	101	4	Final	1	1	8	1	finished	5	6	64	\N	\N	2025-12-28 06:24:11.593885+00	2026-01-07 05:53:59.557985+00	2026-01-07 07:48:54.230457+00	John Doe	mini mouse	John Doe	\N	\N
37	122	1	Quarterfinals	1	2	\N	\N	scheduled	\N	\N	\N	\N	\N	\N	2026-01-13 13:49:45.280551+00	2026-01-13 13:49:45.280551+00	\N	\N	\N	\N	\N
39	122	1	Quarterfinals	3	4	6	\N	scheduled	\N	\N	\N	\N	\N	\N	2026-01-13 13:49:45.285477+00	2026-01-13 13:49:45.285477+00	\N	\N	\N	\N	\N
40	122	1	Quarterfinals	4	9	3	\N	scheduled	\N	\N	\N	\N	\N	\N	2026-01-13 13:49:45.286707+00	2026-01-13 13:49:45.286707+00	\N	\N	\N	\N	\N
42	122	2	Semifinals	2	\N	\N	\N	pending	39	40	\N	\N	\N	\N	2026-01-13 13:49:45.288178+00	2026-01-13 13:49:45.288178+00	\N	\N	\N	\N	\N
43	122	3	Final	1	\N	\N	\N	pending	41	42	\N	\N	\N	\N	2026-01-13 13:49:45.288753+00	2026-01-13 13:49:45.288753+00	\N	\N	\N	\N	\N
\.


--
-- Data for Name: tournament_matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tournament_matches (id, tournament_id, round_number, round_name, match_id, match_order, created_at, updated_at) FROM stdin;
11	101	1	Quarterfinals	2	2	2025-12-29 08:11:58.219753+00	2025-12-29 08:11:58.219753+00
12	101	1	Quarterfinals	3	3	2025-12-29 08:11:58.219753+00	2025-12-29 08:11:58.219753+00
13	101	1	Quarterfinals	4	4	2025-12-29 08:11:58.219753+00	2025-12-29 08:11:58.219753+00
14	101	2	Semifinals	5	1	2025-12-29 08:11:58.219753+00	2025-12-29 08:11:58.219753+00
15	101	2	Semifinals	6	2	2025-12-29 08:11:58.219753+00	2025-12-29 08:11:58.219753+00
16	101	3	Final	7	1	2025-12-29 08:11:58.219753+00	2025-12-29 08:11:58.219753+00
\.


--
-- Data for Name: tournament_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tournament_participants (id, tournament_id, user_id, alias, status, created_at, seed_rank, slot_status) FROM stdin;
4	101	1	John Doe	checked_in	2025-12-29 00:10:06.364279+00	\N	\N
5	101	2	Path Smith	checked_in	2025-12-29 00:10:06.364279+00	\N	\N
6	101	3	Alf Achmoneck	checked_in	2025-12-29 00:10:06.364279+00	\N	\N
7	101	4	Jane Doe	checked_in	2025-12-29 00:10:06.364279+00	\N	\N
8	101	5	David Pill	checked_in	2025-12-29 00:10:06.364279+00	\N	\N
9	101	6	Lisa Morrison	checked_in	2025-12-29 00:10:06.364279+00	\N	\N
75	121	1	\N	subscribed	2026-01-12 10:11:11.797198+00	\N	\N
76	121	4	\N	subscribed	2026-01-12 10:11:22.186911+00	\N	\N
77	121	12	\N	subscribed	2026-01-12 10:11:33.658016+00	\N	\N
78	121	2	\N	subscribed	2026-01-12 10:12:00.620777+00	\N	\N
79	121	3	\N	subscribed	2026-01-12 10:12:22.13801+00	\N	\N
80	121	6	\N	subscribed	2026-01-12 10:12:55.216189+00	\N	\N
81	121	9	\N	subscribed	2026-01-12 10:13:22.239866+00	\N	\N
82	121	5	\N	subscribed	2026-01-12 10:13:55.842437+00	\N	\N
83	122	9	\N	subscribed	2026-01-13 13:44:59.467959+00	\N	\N
84	122	2	\N	subscribed	2026-01-13 13:45:28.168859+00	\N	\N
85	122	6	\N	subscribed	2026-01-13 13:45:57.766346+00	\N	\N
86	122	4	\N	subscribed	2026-01-13 13:46:21.974177+00	\N	\N
87	122	3	\N	subscribed	2026-01-13 13:46:51.522349+00	\N	\N
88	122	5	\N	subscribed	2026-01-13 13:47:14.051852+00	\N	\N
89	122	12	\N	subscribed	2026-01-13 13:48:25.606084+00	\N	\N
\.


--
-- Data for Name: tournament_schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tournament_schedule (id, tournament_id, t_name, t_date, t_date_iso, created_at, updated_at, t_starts_at) FROM stdin;
2	2	Spring Cup #1	01/3/2026	2026-03-01	2025-12-29 02:13:13.998745+00	2025-12-29 02:13:13.998745+00	2026-02-28 22:00:00+00
3	3	Summer Cup #1	10/7/2026	2026-07-10	2025-12-29 02:13:13.998745+00	2025-12-29 02:13:13.998745+00	2026-07-09 21:00:00+00
6	103	Autumn Cup	09/09/2026	2026-09-09	2026-01-09 17:32:53.67235+00	2026-01-09 17:32:53.67235+00	2026-09-09 00:00:00+00
24	121	test_11	12/01/2026	2026-01-12	2026-01-12 10:09:04.939522+00	2026-01-12 10:09:04.939522+00	2026-01-12 10:16:04.922+00
\.


--
-- Data for Name: tournament_seed_snapshot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tournament_seed_snapshot (tournament_id, user_id, seed_rank, created_at) FROM stdin;
\.


--
-- Data for Name: tournament_subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tournament_subscriptions (id, tournament_id, player_id, created_at, status) FROM stdin;
1	2	1	2025-12-23	subscribed
2	2	3	2025-12-23	subscribed
3	3	4	2025-12-23	subscribed
\.


--
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tournaments (id, name, visibility, status, created_by, starts_at, created_at, updated_at, registration_open_offset_ms, registration_close_offset_ms, registration_opens_offset_ms, registration_closes_offset_ms) FROM stdin;
2	Spring Cup #1	public	not_started	1	2026-02-28 22:00:00+00	2025-12-29 00:10:06.364279+00	2025-12-29 00:10:06.364279+00	\N	\N	864000000	432000000
3	Summer Cup #1	public	not_started	1	2026-07-09 21:00:00+00	2025-12-29 00:10:06.364279+00	2025-12-29 00:10:06.364279+00	\N	\N	864000000	432000000
103	Autumn Cup	private	not_started	1	2026-09-09 00:00:00+00	2026-01-09 17:32:53.67235+00	2026-01-09 17:32:53.67235+00	\N	\N	864000000	432000000
121	test_11	private	finished	1	2026-01-12 10:16:04.922+00	2026-01-12 10:09:04.939522+00	2026-01-13 13:37:14.048764+00	\N	\N	300000	60000
101	Winter Cup #1	private	finished	1	2025-12-16 22:00:00+00	2025-12-29 00:10:06.364279+00	2025-12-29 00:10:06.364279+00	\N	\N	864000000	432000000
122	test_77	private	in_progress	1	2026-01-13 13:49:58.636+00	2026-01-13 13:42:58.641944+00	2026-01-13 15:21:50.981451+00	\N	\N	300000	60000
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, role, first_name, last_name, gender, country, p_name, avatar_url, is_available, password_hash, image, available, last_seen, is_active, deleted_at, token_version, refresh_token) FROM stdin;
9	donald@demo.local	user	Donal	Duck	male	Disneyland	Donald Duck	\N	f	$2b$10$ZOudzjA4u94neKRc3bf3tuzNITWDfLtin4VFDTQWZAzWmCGI8Vv3u	/img/player_default.png	t	2026-01-13 13:45:01.914444+00	t	\N	2	\N
2	path@demo.local	user	Path	Smith	male	Narnia	Path Smith	/img/player_2.png	f	$2b$10$SXguk6NFmXCWc0QePAx9qeSFUB0dn18kIoPsu6QroWSpmAPDZ088u	/img/player_2.png	t	2026-01-13 13:45:21.0928+00	t	\N	0	\N
6	bilbo@demo.local	user	Bilbo	Baggins	male	Hobbiton	Bilbo Baggins	/img/player_6.png	t	$2b$10$SspT1hn1CkjXz/T65Eraee4y4d2icI8235VsJG1Jrz0tUuRAwYRBS	/img/player_6.png	t	2026-01-13 17:57:48.466347+00	t	\N	0	\N
4	peter@demo.local	user	Peter	Pan	male	Neverland	Peter Pan	/img/player_4.png	f	$2b$10$Uw7wl7nCw6BxN6EmGujyQ.Die5rhZJIGN9IhsJfS44qtbMg0Wn1EG	/img/player_4.png	t	2026-01-13 13:46:12.380597+00	t	\N	3	\N
7	micky@demo.local	user	Micky	Mouse	male	DisneyLand	Micky Mouse	/img/player_1.png	f	$2b$10$YkkxuYQgglmS9qKscw73cO.2paC0qBlrbD4MSYXnh5iH5g7yOFFbC	/img/player_default.png	t	2026-01-04 02:56:29.499058+00	f	2026-01-07 08:18:36.793095+00	0	\N
11	bob@demo.local	user	Bob	Glasko	male	Poland	Bob Glasko	\N	f	$2b$10$N6ftctOVRj3w8JGPZBz4MuE4llrJMjko7cy9.26n0Pq/WICW.xwXu	/img/player_default.png	t	2026-01-08 13:18:31.938837+00	f	2026-01-08 13:18:31.938837+00	2	\N
8	mini@demo.local	user	mini	mouse	female	Disneyland	mini mouse	\N	f	$2b$10$KBED5BrLb.tsZaXQn5lOQevmAUUcQ.0QPrmh9WD5.Lga4L6nPVKQ6	/img/player_default.png	t	2026-01-07 07:33:55.350345+00	f	2026-01-07 08:49:33.21322+00	0	\N
10	scroodge@demo.local	user	Scroodge	McDuck	male	Disneyland	Scroodge McDuck	\N	f	$2b$10$ky8uI5oJ276lgRs7FnvNPO6vW4VKw4N.VgBTylMy5hIb5ZBS3Mnmi	/img/player_default.png	t	2026-01-11 04:29:10.877758+00	f	2026-01-11 04:29:10.877758+00	1	\N
3	alf@demo.local	user	Alf	Achmoneck	male	Melmak	Alf Achmoneck	/img/player_3.png	f	$2b$10$mcWrRngpkEJC8lsn5Kd8t.2h8FPcg1WaU57gmkJDa.F.rfavF58uW	/uploads/avatar_3_1768315667428.png	t	2026-01-13 14:54:32.552295+00	t	\N	0	\N
5	harry@demo.local	user	Harry	Potter	male	Hogwarts	Harry Potter	/img/player_5.png	t	$2b$10$81wi.lxjL0J4bnerPcMX6.uZI1Lz5FrAHMripxwgHPsNcXmYydMti	/img/player_5.png	t	2026-02-05 14:11:34.754341+00	t	\N	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJoYXJyeUBkZW1vLmxvY2FsIiwidG9rZW5WZXJzaW9uIjoxLCJpYXQiOjE3NzAyOTk3NjYsImV4cCI6MTc3MDMwNjk2Nn0.yzLzyz7UB4vXoblQoHYOql1uTWZ-VV0ZtOKF_AiqfDk
12	minimouse@demo.local	user	Mini	Mouse	female	Disneyland	Mini Mouse	\N	t	$2b$10$Dg18Qe73NPBm1cVYqmrX7O1Q/K9y5TuNypwTwLRG0oVjw26I8cq/.	/uploads/avatar_12_1768107316688.png	t	2026-02-05 14:38:12.445955+00	t	\N	3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJyb2xlIjoidXNlciIsImVtYWlsIjoibWluaW1vdXNlQGRlbW8ubG9jYWwiLCJ0b2tlblZlcnNpb24iOjMsImlhdCI6MTc3MDMwMDczOCwiZXhwIjoxNzcwMzA3OTM4fQ.p9mDDle1q2c-MN11ydggleCi3d04aAVtEtd4Jem7TpU
1	john@demo.local	admin	John	Doe	male	Oz	John Doe	/img/player_1.png	t	$2b$10$Pn/dY4WWNf2BZku.A8cdAuWkftFjcWsye/gHTXs2PDuSsAX0DfSSq	/img/player_1.png	t	2026-02-05 14:38:14.86756+00	t	\N	0	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiam9obkBkZW1vLmxvY2FsIiwidG9rZW5WZXJzaW9uIjowLCJpYXQiOjE3NzAzMDEwODcsImV4cCI6MTc3MDMwODI4N30.k-LATWAVkJckuyUWGNoecEFwyyJ5qwtKLZChB49-X90
\.


--
-- Name: admin_audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_audit_log_id_seq', 80, true);


--
-- Name: auth_logins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_logins_id_seq', 1, false);


--
-- Name: friend_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.friend_requests_id_seq', 55, true);


--
-- Name: friendships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.friendships_id_seq', 59, true);


--
-- Name: game_invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.game_invites_id_seq', 111, true);


--
-- Name: match_games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.match_games_id_seq', 347, true);


--
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.matches_id_seq', 84, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 68, true);


--
-- Name: system_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_messages_id_seq', 31, true);


--
-- Name: tournament_bracket_matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tournament_bracket_matches_id_seq', 43, true);


--
-- Name: tournament_matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tournament_matches_id_seq', 16, true);


--
-- Name: tournament_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tournament_participants_id_seq', 89, true);


--
-- Name: tournament_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tournament_schedule_id_seq', 27, true);


--
-- Name: tournaments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tournaments_id_seq', 124, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 12, true);


--
-- Name: admin_audit_log admin_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_audit_log
    ADD CONSTRAINT admin_audit_log_pkey PRIMARY KEY (id);


--
-- Name: auth_logins auth_logins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_logins
    ADD CONSTRAINT auth_logins_pkey PRIMARY KEY (id);


--
-- Name: friend_requests friend_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_pkey PRIMARY KEY (id);


--
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (id);


--
-- Name: game_history game_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_history
    ADD CONSTRAINT game_history_pkey PRIMARY KEY (id);


--
-- Name: game_invites game_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_invites
    ADD CONSTRAINT game_invites_pkey PRIMARY KEY (id);


--
-- Name: match_games match_games_match_id_game_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_games
    ADD CONSTRAINT match_games_match_id_game_number_key UNIQUE (match_id, game_number);


--
-- Name: match_games match_games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_games
    ADD CONSTRAINT match_games_pkey PRIMARY KEY (id);


--
-- Name: match_games match_games_unique_game_per_match; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_games
    ADD CONSTRAINT match_games_unique_game_per_match UNIQUE (match_id, game_number);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: players players_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_email_key UNIQUE (email);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: system_messages system_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_messages
    ADD CONSTRAINT system_messages_pkey PRIMARY KEY (id);


--
-- Name: tournament_bracket_matches tournament_bracket_matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_bracket_matches
    ADD CONSTRAINT tournament_bracket_matches_pkey PRIMARY KEY (id);


--
-- Name: tournament_bracket_matches tournament_bracket_matches_tournament_id_round_number_slot__key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_bracket_matches
    ADD CONSTRAINT tournament_bracket_matches_tournament_id_round_number_slot__key UNIQUE (tournament_id, round_number, slot_number);


--
-- Name: tournament_matches tournament_matches_order_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_matches
    ADD CONSTRAINT tournament_matches_order_unique UNIQUE (tournament_id, round_number, match_order);


--
-- Name: tournament_matches tournament_matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_matches
    ADD CONSTRAINT tournament_matches_pkey PRIMARY KEY (id);


--
-- Name: tournament_matches tournament_matches_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_matches
    ADD CONSTRAINT tournament_matches_unique UNIQUE (tournament_id, round_number, match_id);


--
-- Name: tournament_participants tournament_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_pkey PRIMARY KEY (id);


--
-- Name: tournament_participants tournament_participants_tournament_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_tournament_id_user_id_key UNIQUE (tournament_id, user_id);


--
-- Name: tournament_participants tournament_participants_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_unique UNIQUE (tournament_id, user_id);


--
-- Name: tournament_schedule tournament_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_schedule
    ADD CONSTRAINT tournament_schedule_pkey PRIMARY KEY (id);


--
-- Name: tournament_schedule tournament_schedule_tournament_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_schedule
    ADD CONSTRAINT tournament_schedule_tournament_id_key UNIQUE (tournament_id);


--
-- Name: tournament_schedule tournament_schedule_tournament_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_schedule
    ADD CONSTRAINT tournament_schedule_tournament_unique UNIQUE (tournament_id);


--
-- Name: tournament_seed_snapshot tournament_seed_snapshot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_seed_snapshot
    ADD CONSTRAINT tournament_seed_snapshot_pkey PRIMARY KEY (tournament_id, user_id);


--
-- Name: tournament_seed_snapshot tournament_seed_snapshot_tournament_id_seed_rank_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_seed_snapshot
    ADD CONSTRAINT tournament_seed_snapshot_tournament_id_seed_rank_key UNIQUE (tournament_id, seed_rank);


--
-- Name: tournament_subscriptions tournament_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_subscriptions
    ADD CONSTRAINT tournament_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: friendships ux_friendships_pair; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT ux_friendships_pair UNIQUE (user_id, friend_id);


--
-- Name: friendships ux_friendships_user_friend; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT ux_friendships_user_friend UNIQUE (user_id, friend_id);


--
-- Name: friend_requests_from_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX friend_requests_from_idx ON public.friend_requests USING btree (from_user_id);


--
-- Name: friend_requests_to_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX friend_requests_to_idx ON public.friend_requests USING btree (to_user_id);


--
-- Name: friend_requests_unique_pair; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX friend_requests_unique_pair ON public.friend_requests USING btree (from_user_id, to_user_id);


--
-- Name: idx_admin_audit_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_audit_action ON public.admin_audit_log USING btree (action);


--
-- Name: idx_admin_audit_admin_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_audit_admin_user_id ON public.admin_audit_log USING btree (admin_user_id);


--
-- Name: idx_admin_audit_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_audit_created_at ON public.admin_audit_log USING btree (created_at DESC);


--
-- Name: idx_auth_logins_user_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auth_logins_user_time ON public.auth_logins USING btree (user_id, logged_in_at DESC);


--
-- Name: idx_friendships_friend_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_friendships_friend_id ON public.friendships USING btree (friend_id);


--
-- Name: idx_friendships_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_friendships_user_id ON public.friendships USING btree (user_id);


--
-- Name: idx_game_invites_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_game_invites_created_at ON public.game_invites USING btree (created_at DESC);


--
-- Name: idx_game_invites_from; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_game_invites_from ON public.game_invites USING btree (from_user_id, created_at DESC);


--
-- Name: idx_game_invites_status_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_game_invites_status_created ON public.game_invites USING btree (status, created_at DESC);


--
-- Name: idx_game_invites_to_pending; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_game_invites_to_pending ON public.game_invites USING btree (to_user_id, created_at DESC) WHERE (status = 'pending'::text);


--
-- Name: idx_invites_from_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invites_from_user ON public.game_invites USING btree (from_user_id, created_at DESC);


--
-- Name: idx_invites_to_user_pending; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invites_to_user_pending ON public.game_invites USING btree (to_user_id, status, created_at DESC);


--
-- Name: idx_match_games_match; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_match_games_match ON public.match_games USING btree (match_id);


--
-- Name: idx_match_games_match_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_match_games_match_id ON public.match_games USING btree (match_id);


--
-- Name: idx_matches_player1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_matches_player1 ON public.matches USING btree (player1_id, played_at DESC);


--
-- Name: idx_matches_player2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_matches_player2 ON public.matches USING btree (player2_id, played_at DESC);


--
-- Name: idx_matches_winner; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_matches_winner ON public.matches USING btree (winner_id);


--
-- Name: idx_messages_receiver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_receiver ON public.messages USING btree (receiver_id, created_at DESC);


--
-- Name: idx_messages_sender; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_sender ON public.messages USING btree (sender_id, created_at DESC);


--
-- Name: idx_seed_snapshot_tournament; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seed_snapshot_tournament ON public.tournament_seed_snapshot USING btree (tournament_id, seed_rank);


--
-- Name: idx_system_messages_to_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_system_messages_to_user ON public.system_messages USING btree (to_user_id, id DESC);


--
-- Name: idx_system_messages_unread; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_system_messages_unread ON public.system_messages USING btree (to_user_id, read_at, id DESC);


--
-- Name: idx_tournament_matches_tournament_round; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tournament_matches_tournament_round ON public.tournament_matches USING btree (tournament_id, round_number, match_order);


--
-- Name: idx_tournament_participants_tournament; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tournament_participants_tournament ON public.tournament_participants USING btree (tournament_id);


--
-- Name: idx_tournament_schedule_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tournament_schedule_date ON public.tournament_schedule USING btree (t_date_iso);


--
-- Name: idx_tournament_schedule_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tournament_schedule_name ON public.tournament_schedule USING btree (t_name);


--
-- Name: idx_tournaments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tournaments_status ON public.tournaments USING btree (status);


--
-- Name: idx_tournaments_vis; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tournaments_vis ON public.tournaments USING btree (visibility);


--
-- Name: idx_users_is_available; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_is_available ON public.users USING btree (is_available);


--
-- Name: idx_users_last_seen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_last_seen ON public.users USING btree (last_seen);


--
-- Name: uniq_game_invites_pending_pair; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_game_invites_pending_pair ON public.game_invites USING btree (from_user_id, to_user_id) WHERE (status = 'pending'::text);


--
-- Name: uniq_pending_invite; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_pending_invite ON public.game_invites USING btree (from_user_id, to_user_id) WHERE (status = 'pending'::text);


--
-- Name: ux_friendships_pair_sorted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_friendships_pair_sorted ON public.friendships USING btree (LEAST(user_id, friend_id), GREATEST(user_id, friend_id));


--
-- Name: admin_audit_log admin_audit_log_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_audit_log
    ADD CONSTRAINT admin_audit_log_admin_id_fkey FOREIGN KEY (admin_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: auth_logins auth_logins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_logins
    ADD CONSTRAINT auth_logins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: friend_requests friend_requests_from_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: friend_requests friend_requests_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: friendships friendships_friend_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: friendships friendships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: game_invites game_invites_from_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_invites
    ADD CONSTRAINT game_invites_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: game_invites game_invites_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_invites
    ADD CONSTRAINT game_invites_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: match_games match_games_match_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_games
    ADD CONSTRAINT match_games_match_id_fk FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- Name: match_games match_games_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_games
    ADD CONSTRAINT match_games_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- Name: matches matches_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id);


--
-- Name: tournament_bracket_matches tournament_bracket_matches_played_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_bracket_matches
    ADD CONSTRAINT tournament_bracket_matches_played_match_id_fkey FOREIGN KEY (played_match_id) REFERENCES public.matches(id) ON DELETE SET NULL;


--
-- Name: tournament_bracket_matches tournament_bracket_matches_player1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_bracket_matches
    ADD CONSTRAINT tournament_bracket_matches_player1_id_fkey FOREIGN KEY (player1_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tournament_bracket_matches tournament_bracket_matches_player2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_bracket_matches
    ADD CONSTRAINT tournament_bracket_matches_player2_id_fkey FOREIGN KEY (player2_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tournament_bracket_matches tournament_bracket_matches_source_match1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_bracket_matches
    ADD CONSTRAINT tournament_bracket_matches_source_match1_id_fkey FOREIGN KEY (source_match1_id) REFERENCES public.tournament_bracket_matches(id) ON DELETE SET NULL;


--
-- Name: tournament_bracket_matches tournament_bracket_matches_source_match2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_bracket_matches
    ADD CONSTRAINT tournament_bracket_matches_source_match2_id_fkey FOREIGN KEY (source_match2_id) REFERENCES public.tournament_bracket_matches(id) ON DELETE SET NULL;


--
-- Name: tournament_bracket_matches tournament_bracket_matches_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_bracket_matches
    ADD CONSTRAINT tournament_bracket_matches_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournament_bracket_matches tournament_bracket_matches_winner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_bracket_matches
    ADD CONSTRAINT tournament_bracket_matches_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tournament_matches tournament_matches_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_matches
    ADD CONSTRAINT tournament_matches_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- Name: tournament_matches tournament_matches_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_matches
    ADD CONSTRAINT tournament_matches_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournament_participants tournament_participants_tournament_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_tournament_fk FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournament_participants tournament_participants_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournament_schedule tournament_schedule_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_schedule
    ADD CONSTRAINT tournament_schedule_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE SET NULL;


--
-- Name: tournament_seed_snapshot tournament_seed_snapshot_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_seed_snapshot
    ADD CONSTRAINT tournament_seed_snapshot_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournament_seed_snapshot tournament_seed_snapshot_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_seed_snapshot
    ADD CONSTRAINT tournament_seed_snapshot_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 6TEemYXiZwugcKrmeJdNhX5WjRfFzEGxBPHuggVkiiUcNQFKGboQ1D02BV7I6Nq
