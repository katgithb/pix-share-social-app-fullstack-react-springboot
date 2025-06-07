ALTER TABLE reactivation_request
ADD CONSTRAINT fk_reactivation_request_on_user FOREIGN KEY (user_id) REFERENCES user_identity (id);