ALTER TABLE user_saved_posts
ADD CONSTRAINT fk_user_saved_posts_on_user FOREIGN KEY (user_id) REFERENCES user_identity (id);