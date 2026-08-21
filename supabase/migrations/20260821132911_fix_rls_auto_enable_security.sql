-- The rls_auto_enable() function is an internal event trigger that auto-enables
-- RLS on new tables. It must not be callable by anon or authenticated roles via
-- the Data API (/rest/v1/rpc/rls_auto_enable). Revoke EXECUTE from public and
-- re-grant only to the roles that need it (none in this app).

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
