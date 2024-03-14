ALTER TABLE user_follower
ADD CONSTRAINT fk_user_follower_on_follower FOREIGN KEY (follower_id) REFERENCES user_identity (id);