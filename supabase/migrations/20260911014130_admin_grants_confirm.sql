-- Re-confirm georgia.adams@smartify.co.za has the admin role (idempotent —
-- this account was already granted admin earlier in this project's history,
-- this just guards against it having been revoked or the account recreated).
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'georgia.adams@smartify.co.za'
ON CONFLICT (user_id, role) DO NOTHING;
