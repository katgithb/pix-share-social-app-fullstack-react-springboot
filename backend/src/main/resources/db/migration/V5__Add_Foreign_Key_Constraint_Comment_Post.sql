ALTER TABLE comment
ADD CONSTRAINT fk_comment_on_post FOREIGN KEY (post_id) REFERENCES post (id);