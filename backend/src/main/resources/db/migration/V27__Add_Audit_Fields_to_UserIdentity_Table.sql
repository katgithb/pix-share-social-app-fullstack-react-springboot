-- Add status column to user_identity table and set default value to ACTIVE
ALTER TABLE user_identity
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- Add created_at column to user_identity table
ALTER TABLE user_identity
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NULL;

-- Update existing rows with current timestamp for created_at
UPDATE user_identity
SET created_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
WHERE created_at IS NULL;

-- Set default value for created_at column to current timestamp with time zone in UTC
ALTER TABLE user_identity
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';

-- Make created_at column not nullable
ALTER TABLE user_identity
ALTER COLUMN created_at SET NOT NULL;

-- Add last_login_at column to user_identity table
ALTER TABLE user_identity
ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE NULL;

-- Add status_changed_at column to user_identity table
ALTER TABLE user_identity
ADD COLUMN status_changed_at TIMESTAMP WITH TIME ZONE NULL;