DELETE FROM events
WHERE id = @id
RETURNING id, title, description, starts_at, status, deleted_at, created_at;