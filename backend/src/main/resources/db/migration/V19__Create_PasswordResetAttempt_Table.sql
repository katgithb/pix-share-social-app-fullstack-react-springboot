CREATE TABLE password_reset_attempt (
   id BIGSERIAL NOT NULL,
   email VARCHAR(255) NOT NULL,
   "timestamp" BIGINT NOT NULL,
   succeeded BOOLEAN NOT NULL,
   CONSTRAINT pk_password_reset_attempt PRIMARY KEY (id)
);