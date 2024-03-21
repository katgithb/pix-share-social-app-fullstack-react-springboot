ALTER TABLE comment_user_likes
ADD CONSTRAINT fk_comment_user_likes_on_comment FOREIGN KEY (comment_id) REFERENCES comment (id);