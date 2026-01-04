-- -------------------------------------------------------------
-- TablePlus 6.8.1(655)
--
-- https://tableplus.com/
--
-- Database: office_calendar_local
-- Generation Time: 2026-01-04 14:52:43.5140
-- -------------------------------------------------------------




DROP TABLE IF EXISTS "public"."departments";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS departments_id_seq;

-- Table Definition
CREATE TABLE "public"."departments" (
    "id" int4 NOT NULL DEFAULT nextval('departments_id_seq'::regclass),
    "company_id" int4,
    "name" varchar NOT NULL,
    "role_description" text,
    "employee_count" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."room_bookings";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS room_bookings_id_seq;

-- Table Definition
CREATE TABLE "public"."room_bookings" (
    "id" int4 NOT NULL DEFAULT nextval('room_bookings_id_seq'::regclass),
    "room_id" int4,
    "user_id" int4,
    "starts_at" timestamp,
    "ends_at" timestamp,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "event_id" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."users";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "company_id" int4,
    "department_id" int4,
    "workplace_id" int4,
    "first_name" varchar NOT NULL,
    "last_name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "password_hash" varchar NOT NULL,
    "phone_number" varchar,
    "job_title" varchar,
    "role" varchar DEFAULT 'user'::character varying CHECK ((role)::text = ANY (ARRAY[('admin'::character varying)::text, ('user'::character varying)::text])),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "location" varchar,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."rooms";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS rooms_id_seq;

-- Table Definition
CREATE TABLE "public"."rooms" (
    "id" int4 NOT NULL DEFAULT nextval('rooms_id_seq'::regclass),
    "name" varchar NOT NULL,
    "room_number" varchar,
    "capacity" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."events";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS events_id_seq;

-- Table Definition
CREATE TABLE "public"."events" (
    "id" int4 NOT NULL DEFAULT nextval('events_id_seq'::regclass),
    "title" varchar NOT NULL,
    "description" text,
    "starts_at" timestamp,
    "status" varchar,
    "created_by" int4,
    "deleted_at" timestamp,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "ends_at" timestamp,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."event_participations";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS event_participations_id_seq;

-- Table Definition
CREATE TABLE "public"."event_participations" (
    "id" int4 NOT NULL DEFAULT nextval('event_participations_id_seq'::regclass),
    "event_id" int4,
    "user_id" int4,
    "status" varchar,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."companies";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS companies_id_seq;

-- Table Definition
CREATE TABLE "public"."companies" (
    "id" int4 NOT NULL DEFAULT nextval('companies_id_seq'::regclass),
    "name" varchar NOT NULL,
    "address" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."workplaces";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS workplaces_id_seq;

-- Table Definition
CREATE TABLE "public"."workplaces" (
    "id" int4 NOT NULL DEFAULT nextval('workplaces_id_seq'::regclass),
    "code" varchar NOT NULL,
    "room_id" int4,
    "note" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."attendances";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS attendances_id_seq;

-- Table Definition
CREATE TABLE "public"."attendances" (
    "id" int4 NOT NULL DEFAULT nextval('attendances_id_seq'::regclass),
    "user_id" int4,
    "day" date NOT NULL,
    "check_time" timestamp,
    "place" varchar,
    "note" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."work_status";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS work_status_id_seq;

-- Table Definition
CREATE TABLE "public"."work_status" (
    "id" int4 NOT NULL DEFAULT nextval('work_status_id_seq'::regclass),
    "user_id" int4 NOT NULL,
    "date" date NOT NULL,
    "status" varchar(50) NOT NULL CHECK ((status)::text = ANY (ARRAY[('office'::character varying)::text, ('home'::character varying)::text, ('vacation'::character varying)::text, ('sick'::character varying)::text, ('business_trip'::character varying)::text, ('other'::character varying)::text])),
    "note" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."tasks";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS tasks_id_seq;

-- Table Definition
CREATE TABLE "public"."tasks" (
    "id" int4 NOT NULL DEFAULT nextval('tasks_id_seq'::regclass),
    "user_id" int4 NOT NULL,
    "title" varchar(255) NOT NULL,
    "due_date" varchar(20),
    "completed" bool DEFAULT false,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."room_bookings" ("id", "room_id", "user_id", "starts_at", "ends_at", "created_at", "event_id") VALUES
(2, 2, 4, NULL, NULL, '2025-11-07 13:44:19.271849', 4),
(4, 1, 5, NULL, NULL, '2025-12-05 14:05:01.077025', 3);

INSERT INTO "public"."users" ("id", "company_id", "department_id", "workplace_id", "first_name", "last_name", "email", "password_hash", "phone_number", "job_title", "role", "created_at", "location", "updated_at") VALUES
(4, NULL, NULL, NULL, 'Jan', 'Voorbergen', 'jan.voorbergen@gmail.com', 'Test123456!', '0612345678', 'Marketeer', 'user', '2025-11-07 13:43:53.85739', NULL, '2025-11-23 20:44:06.579096'),
(5, NULL, NULL, NULL, 'Bryan', 'de Knikker', '1065913@hr.nl', '$2a$11$eXpePqsbW9qMN4yG7q/Wh./cBQwmMG61E3njMuYugMAiFwv.0m7om', '+31 6 82490183', 'Developer', 'admin', '2025-11-11 11:12:11.31617', 'Gouda', '2026-01-04 13:08:21.346929');

INSERT INTO "public"."rooms" ("id", "name", "room_number", "capacity", "created_at") VALUES
(1, 'Stroopwafel', '201', 20, '2025-11-07 13:38:33.363214'),
(2, 'Kaas', '202', 30, '2025-11-07 13:38:49.418733'),
(3, 'Waag', '203', 10, '2025-11-07 13:39:12.679844');

INSERT INTO "public"."events" ("id", "title", "description", "starts_at", "status", "created_by", "deleted_at", "created_at", "ends_at") VALUES
(3, 'Training', 'Training over Web Development', '2025-12-25 13:00:00', 'Future', 5, NULL, '2025-11-07 15:11:25.098312', '2025-12-25 14:00:00'),
(4, 'Lezing', 'Lezing over dingen', '2025-12-30 12:00:00', 'Future', 5, NULL, '2025-11-23 11:35:19.602096', '2025-12-30 14:00:00'),
(8, 'Vergadering', 'Vergadering over bedrijf', '2025-12-30 11:00:00', 'Future', 5, NULL, '2025-12-05 13:44:06.034892', '2025-12-30 13:00:00');

INSERT INTO "public"."work_status" ("id", "user_id", "date", "status", "note", "created_at", "updated_at") VALUES
(4, 5, '2025-11-11', 'office', NULL, '2025-11-11 11:49:27.584953', '2025-11-11 11:49:27.584953'),
(5, 5, '2025-11-12', 'home', NULL, '2025-11-11 14:02:49.41569', '2025-11-11 14:03:06.610789'),
(6, 5, '2025-11-13', 'sick', NULL, '2025-11-11 14:04:26.975055', '2025-11-11 14:04:26.975055'),
(14, 5, '2025-11-21', 'vacation', NULL, '2025-11-11 14:06:28.074767', '2025-11-21 15:45:09.927235'),
(15, 5, '2025-12-01', 'home', NULL, '2025-12-05 13:33:46.393225', '2025-12-05 13:33:46.393225'),
(16, 5, '2025-12-02', 'office', NULL, '2025-12-05 13:34:12.876388', '2025-12-05 13:34:12.876388'),
(17, 5, '2025-12-03', 'office', NULL, '2025-12-05 13:36:53.646695', '2025-12-05 13:36:53.646695'),
(18, 5, '2025-12-04', 'office', NULL, '2025-12-05 13:36:53.646695', '2025-12-05 13:36:53.646695'),
(19, 5, '2025-12-05', 'home', NULL, '2025-12-05 13:36:53.646695', '2025-12-05 13:36:53.646695'),
(20, 5, '2025-12-10', 'office', NULL, '2025-12-09 12:35:04.742239', '2025-12-09 12:47:22.458824'),
(21, 5, '2025-12-12', 'office', NULL, '2025-12-09 12:35:04.742237', '2025-12-09 12:47:22.459179'),
(22, 5, '2025-12-09', 'home', NULL, '2025-12-09 12:35:04.742237', '2025-12-09 12:47:22.457695'),
(23, 5, '2025-12-08', 'home', NULL, '2025-12-09 12:35:04.742241', '2025-12-09 12:47:22.457688'),
(24, 5, '2025-12-11', 'home', NULL, '2025-12-09 12:35:04.742242', '2025-12-09 12:47:22.458434'),
(30, 5, '2025-12-19', 'office', NULL, '2025-12-19 13:54:20.78927', '2025-12-19 14:03:22.054327'),
(31, 5, '2025-12-17', 'office', NULL, '2025-12-19 13:54:20.789266', '2025-12-19 14:03:22.062072'),
(32, 5, '2025-12-18', 'office', NULL, '2025-12-19 13:54:20.78925', '2025-12-19 14:03:22.063101'),
(33, 5, '2025-12-15', 'office', NULL, '2025-12-19 13:54:20.789268', '2025-12-19 14:03:22.062767'),
(34, 5, '2025-12-16', 'sick', NULL, '2025-12-19 13:54:20.789259', '2025-12-19 14:03:22.062789'),
(35, 5, '2025-12-30', 'home', NULL, '2026-01-04 13:07:37.175475', '2026-01-04 13:07:37.175496'),
(36, 5, '2026-01-02', 'home', NULL, '2026-01-04 13:07:37.175466', '2026-01-04 13:07:37.175484'),
(37, 5, '2026-01-01', 'vacation', NULL, '2026-01-04 13:07:37.175476', '2026-01-04 13:07:37.175506'),
(38, 5, '2025-12-31', 'vacation', NULL, '2026-01-04 13:07:37.175469', '2026-01-04 13:07:37.175486'),
(39, 5, '2025-12-29', 'office', NULL, '2026-01-04 13:07:37.175481', '2026-01-04 13:07:37.175506');

;
ALTER TABLE "public"."departments" ADD FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;
ALTER TABLE "public"."room_bookings" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."room_bookings" ADD FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE CASCADE;
ALTER TABLE "public"."room_bookings" ADD FOREIGN KEY ("event_id") REFERENCES "public"."events"("id");
ALTER TABLE "public"."users" ADD FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;
ALTER TABLE "public"."users" ADD FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE SET NULL;
ALTER TABLE "public"."users" ADD FOREIGN KEY ("workplace_id") REFERENCES "public"."workplaces"("id") ON DELETE SET NULL;


-- Indices
CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);
ALTER TABLE "public"."events" ADD FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;
ALTER TABLE "public"."event_participations" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."event_participations" ADD FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;
ALTER TABLE "public"."workplaces" ADD FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE SET NULL;
ALTER TABLE "public"."attendances" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."work_status" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX unique_user_date ON public.work_status USING btree (user_id, date);
CREATE INDEX idx_work_status_date ON public.work_status USING btree (date);
CREATE INDEX idx_work_status_status ON public.work_status USING btree (status);
CREATE INDEX idx_work_status_user_id ON public.work_status USING btree (user_id);
ALTER TABLE "public"."tasks" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


-- Indices
CREATE INDEX idx_tasks_user_id ON public.tasks USING btree (user_id);
CREATE INDEX idx_tasks_completed ON public.tasks USING btree (completed);
CREATE INDEX idx_tasks_due_date ON public.tasks USING btree (due_date);
INSERT INTO "public"."tasks" ("id", "user_id", "title", "due_date", "completed", "created_at", "updated_at") VALUES
(6, 5, 'Finish report', '2025-12-05', 't', '2025-12-06 16:38:57.434', '2025-12-06 16:38:57.464399'),
(7, 5, 'Create new component', '2025-12-12', 'f', '2025-12-06 17:01:30.305', '2025-12-06 17:01:30.41367'),
(8, 5, 'Call client', '2025-12-19', 'f', '2025-12-19 14:02:38.186', '2025-12-19 14:02:38.200854'),
(9, 5, 'Send mail to colleague', '2025-12-19', 't', '2025-12-19 14:02:41.053', '2025-12-19 14:02:41.069745'),
(10, 5, 'Previous completed task', '2025-11-15', 't', '2025-12-06 14:48:13.995495', '2025-12-06 14:48:13.995495'),
(11, 5, 'Previous completed task', '2025-12-10', 't', '2025-12-19 13:56:21.347', '2025-12-19 13:56:21.436119'),
(12, 5, 'Previous completed task', '2025-11-6', 't', '2025-12-06 16:39:13.901', '2025-12-06 16:39:13.908541');

;
ALTER TABLE "public"."departments" ADD FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;
ALTER TABLE "public"."room_bookings" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."room_bookings" ADD FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE CASCADE;
ALTER TABLE "public"."room_bookings" ADD FOREIGN KEY ("event_id") REFERENCES "public"."events"("id");
ALTER TABLE "public"."users" ADD FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;
ALTER TABLE "public"."users" ADD FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE SET NULL;
ALTER TABLE "public"."users" ADD FOREIGN KEY ("workplace_id") REFERENCES "public"."workplaces"("id") ON DELETE SET NULL;


-- Indices
CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);
ALTER TABLE "public"."events" ADD FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;
ALTER TABLE "public"."event_participations" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."event_participations" ADD FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;
ALTER TABLE "public"."workplaces" ADD FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE SET NULL;
ALTER TABLE "public"."attendances" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."work_status" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX unique_user_date ON public.work_status USING btree (user_id, date);
CREATE INDEX idx_work_status_date ON public.work_status USING btree (date);
CREATE INDEX idx_work_status_status ON public.work_status USING btree (status);
CREATE INDEX idx_work_status_user_id ON public.work_status USING btree (user_id);
ALTER TABLE "public"."tasks" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


-- Indices
CREATE INDEX idx_tasks_user_id ON public.tasks USING btree (user_id);
CREATE INDEX idx_tasks_completed ON public.tasks USING btree (completed);
CREATE INDEX idx_tasks_due_date ON public.tasks USING btree (due_date);
