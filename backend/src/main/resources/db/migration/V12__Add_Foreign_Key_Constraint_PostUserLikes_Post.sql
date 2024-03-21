ALTER TABLE post_user_likes
ADD CONSTRAINT fk_post_user_likes_on_post FOREIGN KEY (post_id) REFERENCES post (id);