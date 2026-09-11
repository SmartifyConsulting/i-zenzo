-- Grant admin to daniel@izenzo.co.za, james@izenzo.co.za and
-- david@izenzo.co.za, once each has signed up on this app. Safe to run
-- before they exist: the SELECT simply matches zero rows for any email
-- that hasn't signed up yet, and it's safe to re-run after they do.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email IN ('daniel@izenzo.co.za', 'james@izenzo.co.za', 'david@izenzo.co.za')
ON CONFLICT (user_id, role) DO NOTHING;
