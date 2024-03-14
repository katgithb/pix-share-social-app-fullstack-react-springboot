ALTER TABLE user_identity
ADD CONSTRAINT user_username_unique UNIQUE (username);