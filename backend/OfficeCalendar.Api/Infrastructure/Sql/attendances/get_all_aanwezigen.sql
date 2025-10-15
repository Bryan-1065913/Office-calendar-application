SELECT * 
FROM users as u, events_participation as ep,events as e
WHERE u.id = ep.user_id AND ep.event_id = e.id