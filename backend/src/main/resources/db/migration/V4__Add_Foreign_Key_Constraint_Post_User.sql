ALTER TABLE post
ADD CONSTRAINT fk_post_on_user FOREIGN KEY (user_id) REFERENCES user_identity (id);