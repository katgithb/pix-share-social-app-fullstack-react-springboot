ALTER TABLE reactivation_request
ADD CONSTRAINT reactivation_request_email_unique UNIQUE (email);