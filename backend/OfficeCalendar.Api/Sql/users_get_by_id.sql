-- users_get_by_id.sql
SELECT
  id            AS "Id",
  email         AS "Email",
  first_name    AS "FirstName",
  last_name     AS "LastName",
  phone_number  AS "PhoneNumber",
  job_title     AS "JobTitle",
  role          AS "Role"
FROM users
WHERE id = @Id;