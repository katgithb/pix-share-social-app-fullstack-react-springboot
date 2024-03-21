ALTER TABLE comment
ADD CONSTRAINT fk_comment_on_user FOREIGN KEY (user_id) REFERENCES user_identity (id);