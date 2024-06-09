ALTER TABLE password_reset_attempt
ADD CONSTRAINT email_timestamp_unique UNIQUE (email, "timestamp");