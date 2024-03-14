ALTER TABLE user_identity
ADD CONSTRAINT user_email_unique UNIQUE (email);