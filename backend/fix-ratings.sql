-- Fix stale average ratings in database
-- This script recalculates all game average ratings based on existing reviews

UPDATE game g
SET average_rating = ROUND(
    (SELECT AVG(CAST(r.rating AS DECIMAL(10,2)))
     FROM review r
     WHERE r.game_id = g.id), 
    1
)
WHERE EXISTS (
    SELECT 1 FROM review WHERE game_id = g.id
);

-- Set average_rating to 0 for games with no reviews
UPDATE game g
SET average_rating = 0
WHERE NOT EXISTS (
    SELECT 1 FROM review WHERE game_id = g.id
);

-- Verify results
SELECT 
    g.id,
    g.name,
    g.average_rating as current_avg,
    ROUND(AVG(CAST(r.rating AS DECIMAL(10,2))), 1) as calculated_avg,
    COUNT(r.id) as review_count
FROM game g
LEFT JOIN review r ON r.game_id = g.id
GROUP BY g.id, g.name, g.average_rating
HAVING COUNT(r.id) > 0
ORDER BY g.id;
