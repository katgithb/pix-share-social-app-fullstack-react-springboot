#!/bin/bash

psql -U ${POSTGRES_USER} -d pixshare_db <<-END
CREATE DATABASE pixshare_test_db
    WITH
    OWNER = ${POSTGRES_USER}
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
END