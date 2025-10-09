INSERT INTO users (
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
) VALUES (
    @CompanyId,
    @DepartmentId,
    @WorkplaceId,
    @FirstName,
    @LastName,
    @Email,
    @PasswordHash,
    @PhoneNumber,
    @JobTitle,
    @Role,
    @CreatedAt
);
SELECT LAST_INSERT_ID();