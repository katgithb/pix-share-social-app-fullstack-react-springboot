--Modify data type to timestamp with time zone for created_at column
ALTER TABLE comment
ALTER COLUMN created_at SET DATA TYPE TIMESTAMP WITH TIME ZONE;

--Set default value for created_at column to current timestamp with time zone in UTC
ALTER TABLE comment
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';
