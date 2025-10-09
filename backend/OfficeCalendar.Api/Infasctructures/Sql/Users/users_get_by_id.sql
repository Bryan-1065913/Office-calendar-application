SELECT 
    id,
    company_id,
    department_id,
    workplace_id,
    first_name,
    last_name,
    email,
    password_hash,
    phone_number,
    job_title,
    role,
    created_at
FROM users
WHERE id = @Id;
-- LIMIT 1;