-- Your SQL goes here
CREATE TABLE audit(
   id serial PRIMARY KEY,
   event_type VARCHAR (50),
   created_on TIMESTAMP,
   user_id VARCHAR(50),
   description VARCHAR(512)
);