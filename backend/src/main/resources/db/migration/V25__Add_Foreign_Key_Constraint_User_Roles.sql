ALTER TABLE user_identity
ADD CONSTRAINT fk_user_identity_on_roles FOREIGN KEY (role_id) REFERENCES roles (id);