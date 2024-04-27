--Modify data type to timestamp with time zone for timestamp column
ALTER TABLE story
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMP WITH TIME ZONE;

--Set default value for timestamp column to current timestamp with time zone in UTC
ALTER TABLE story
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';
