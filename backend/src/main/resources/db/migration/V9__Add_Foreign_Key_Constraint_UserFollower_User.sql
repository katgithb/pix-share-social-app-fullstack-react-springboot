ALTER TABLE user_follower
ADD CONSTRAINT fk_user_follower_on_user FOREIGN KEY (user_id) REFERENCES user_identity (id);