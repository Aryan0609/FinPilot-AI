-- ============================================================
-- FinPilot AI
-- Migration: Assign ROLE_USER to users without a role
-- ============================================================

INSERT INTO user_roles (user_id, role_id)
SELECT
    u.id,
    r.role_id
FROM users u
CROSS JOIN roles r
WHERE r.role_name = 'ROLE_USER'
  AND NOT EXISTS (
      SELECT 1
      FROM user_roles ur
      WHERE ur.user_id = u.id
  );
