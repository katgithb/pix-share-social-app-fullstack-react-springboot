-- Repeatable migration to manage the admin user
-- This migration will create or update the admin user with the configured credentials

-- Update existing admin user if it exists
UPDATE user_identity
SET email = '${admin.email}',
    password = '${admin.password}',
    role_id = (SELECT id FROM roles WHERE role_name = 'ADMIN')
WHERE username = 'admin';

-- Insert admin user if it doesn't exist
-- The WHERE NOT EXISTS ensures we only insert if a matching row doesn't already exist
INSERT INTO user_identity (username, email, password, name, gender, role_id)
SELECT 'admin', '${admin.email}', '${admin.password}', 'Admin', 'UNSPECIFIED', (SELECT id FROM roles WHERE role_name = 'ADMIN')
WHERE NOT EXISTS (
    SELECT 1 FROM user_identity WHERE username = 'admin'
);