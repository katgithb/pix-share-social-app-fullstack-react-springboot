ALTER TABLE user_saved_posts
ADD CONSTRAINT fk_user_saved_posts_on_post FOREIGN KEY (post_id) REFERENCES post (id);