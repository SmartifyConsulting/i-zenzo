INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email IN ('daniel@izenzo.co.za','james@izenzo.co.za','david@izenzo.co.za')
ON CONFLICT (user_id, role) DO NOTHING;