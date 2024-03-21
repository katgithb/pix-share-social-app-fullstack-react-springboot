ALTER TABLE post_user_likes
ADD CONSTRAINT fk_post_user_likes_on_user FOREIGN KEY (user_id) REFERENCES user_identity (id);