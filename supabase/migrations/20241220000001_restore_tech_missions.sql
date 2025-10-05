-- Restore Tech Researcher and Tech Innovator missions and badges
INSERT INTO badges (name, description, icon, reward_points, mission_key) VALUES
  ('Tech Innovator', 'Research NASA projects', '🚀', 100, 'techport'),
  ('Inventor', 'Explore NASA patents', '💡', 50, 'techtransfer')
ON CONFLICT (mission_key) DO NOTHING;

INSERT INTO missions (name, api_name, description, reward_points, mission_key, category) VALUES
  ('Tech Researcher', 'Techport', 'Learn about NASA technology projects', 100, 'techport', 'technology'),
  ('Innovation Access', 'TechTransfer', 'Explore NASA patents and innovations', 50, 'techtransfer', 'technology')
ON CONFLICT (mission_key) DO NOTHING;