CREATE TABLE reactivation_request (
    id BIGSERIAL NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    user_id BIGINT,
    CONSTRAINT pk_reactivation_request PRIMARY KEY (id),
    CONSTRAINT chk_reactivation_request_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);