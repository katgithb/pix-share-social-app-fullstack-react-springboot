CREATE TABLE user_identity (
   id BIGSERIAL NOT NULL,
   username VARCHAR(50) NOT NULL,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(128) NOT NULL,
   name VARCHAR(128) NOT NULL,
   mobile VARCHAR(15),
   website VARCHAR(250),
   bio TEXT,
   gender VARCHAR(255) NOT NULL,
   user_image_upload_id VARCHAR(255),
   user_image VARCHAR(255),
   CONSTRAINT pk_user_identity PRIMARY KEY (id),
   CONSTRAINT user_identity_gender_check CHECK (((gender)::text = ANY ((ARRAY['MALE'::character varying, 'FEMALE'::character varying, 'OTHER'::character varying, 'UNSPECIFIED'::character varying])::text[])))
);

CREATE TABLE post (
   id BIGSERIAL NOT NULL,
   caption TEXT,
   image_upload_id VARCHAR(255) NOT NULL,
   image VARCHAR(255) NOT NULL,
   location VARCHAR(255),
   created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   user_id BIGINT NOT NULL,
   CONSTRAINT pk_post PRIMARY KEY (id)
);

CREATE TABLE comment (
   id BIGSERIAL NOT NULL,
   content TEXT NOT NULL,
   created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   user_id BIGINT NOT NULL,
   post_id BIGINT NOT NULL,
   CONSTRAINT pk_comment PRIMARY KEY (id)
);

CREATE TABLE story (
   id BIGSERIAL NOT NULL,
   image_upload_id VARCHAR(255) NOT NULL,
   image VARCHAR(255) NOT NULL,
   caption TEXT,
   "timestamp" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   user_id BIGINT NOT NULL,
   CONSTRAINT pk_story PRIMARY KEY (id)
);

CREATE TABLE user_follower (
   follower_id BIGINT NOT NULL,
   user_id BIGINT NOT NULL,
   CONSTRAINT pk_user_follower PRIMARY KEY (follower_id, user_id)
);

CREATE TABLE user_saved_posts (
   post_id BIGINT NOT NULL,
   user_id BIGINT NOT NULL,
   CONSTRAINT pk_user_saved_posts PRIMARY KEY (post_id, user_id)
);

CREATE TABLE post_user_likes (
   post_id BIGINT NOT NULL,
   user_id BIGINT NOT NULL,
   CONSTRAINT pk_post_user_likes PRIMARY KEY (post_id, user_id)
);

CREATE TABLE comment_user_likes (
   comment_id BIGINT NOT NULL,
   user_id BIGINT NOT NULL,
   CONSTRAINT pk_comment_user_likes PRIMARY KEY (comment_id, user_id)
);