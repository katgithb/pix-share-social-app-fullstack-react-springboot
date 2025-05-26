-- Update existing records to set role_id to 'USER' role
UPDATE user_identity
SET role_id = (SELECT id FROM roles WHERE role_name = 'USER')
WHERE role_id IS NULL;

-- Make role_id NOT NULL after setting values for existing users
ALTER TABLE user_identity
ALTER COLUMN role_id SET NOT NULL;