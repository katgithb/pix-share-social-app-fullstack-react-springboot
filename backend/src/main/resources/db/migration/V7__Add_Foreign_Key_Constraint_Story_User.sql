ALTER TABLE story
ADD CONSTRAINT fk_story_on_user FOREIGN KEY (user_id) REFERENCES user_identity (id);