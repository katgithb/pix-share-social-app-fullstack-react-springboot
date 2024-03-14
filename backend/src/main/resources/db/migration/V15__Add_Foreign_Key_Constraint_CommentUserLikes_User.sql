ALTER TABLE comment_user_likes
ADD CONSTRAINT fk_comment_user_likes_on_user FOREIGN KEY (user_id) REFERENCES user_identity (id);