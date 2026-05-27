-- Harden public wedding tables before publication.

CREATE OR REPLACE FUNCTION public.normalize_phone(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog
AS $$
  SELECT nullif(regexp_replace(coalesce(value, ''), '[^0-9]+', '', 'g'), '')
$$;

CREATE OR REPLACE FUNCTION public.normalize_name(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog
AS $$
  SELECT nullif(lower(regexp_replace(btrim(coalesce(value, '')), '[[:space:]]+', ' ', 'g')), '')
$$;

REVOKE EXECUTE ON FUNCTION public.normalize_phone(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.normalize_name(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.normalize_phone(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.normalize_name(text) TO anon, authenticated, service_role;

-- Keep the role helper usable in RLS while avoiding public execution and arbitrary
-- role lookups for other user IDs.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (select auth.uid()) = _user_id
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id
        AND role = _role
    )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- RSVP duplicate protection and validation.
ALTER TABLE public.rsvps
  ADD CONSTRAINT rsvps_full_name_required_check
    CHECK (public.normalize_name(full_name) IS NOT NULL AND char_length(btrim(full_name)) <= 120) NOT VALID,
  ADD CONSTRAINT rsvps_companions_range_check
    CHECK (companions BETWEEN 0 AND 10) NOT VALID,
  ADD CONSTRAINT rsvps_phone_length_check
    CHECK (phone IS NULL OR char_length(btrim(phone)) <= 40) NOT VALID,
  ADD CONSTRAINT rsvps_dietary_restrictions_length_check
    CHECK (dietary_restrictions IS NULL OR char_length(dietary_restrictions) <= 300) NOT VALID,
  ADD CONSTRAINT rsvps_message_length_check
    CHECK (message IS NULL OR char_length(message) <= 600) NOT VALID;

CREATE UNIQUE INDEX IF NOT EXISTS rsvps_unique_normalized_phone_idx
  ON public.rsvps (public.normalize_phone(phone))
  WHERE public.normalize_phone(phone) IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS rsvps_unique_no_phone_normalized_name_idx
  ON public.rsvps (public.normalize_name(full_name))
  WHERE public.normalize_phone(phone) IS NULL;

DROP POLICY IF EXISTS "Anyone can RSVP" ON public.rsvps;
CREATE POLICY "Anyone can RSVP" ON public.rsvps
FOR INSERT TO anon, authenticated
WITH CHECK (
  public.normalize_name(full_name) IS NOT NULL
  AND char_length(btrim(full_name)) <= 120
  AND companions BETWEEN 0 AND 10
  AND (phone IS NULL OR char_length(btrim(phone)) <= 40)
  AND (dietary_restrictions IS NULL OR char_length(dietary_restrictions) <= 300)
  AND (message IS NULL OR char_length(message) <= 600)
);

-- Public mural messages are moderated by default.
ALTER TABLE public.messages
  ALTER COLUMN approved SET DEFAULT false,
  ADD CONSTRAINT messages_name_required_check
    CHECK (public.normalize_name(name) IS NOT NULL AND char_length(btrim(name)) <= 80) NOT VALID,
  ADD CONSTRAINT messages_message_required_check
    CHECK (char_length(btrim(message)) BETWEEN 1 AND 500) NOT VALID;

GRANT UPDATE (approved) ON public.messages TO authenticated;

DROP POLICY IF EXISTS "Anyone can post message" ON public.messages;
DROP POLICY IF EXISTS "Admins view all messages" ON public.messages;
DROP POLICY IF EXISTS "Admins moderate messages" ON public.messages;

CREATE POLICY "Anyone can post message" ON public.messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  approved = false
  AND public.normalize_name(name) IS NOT NULL
  AND char_length(btrim(name)) <= 80
  AND char_length(btrim(message)) BETWEEN 1 AND 500
);

CREATE POLICY "Admins view all messages" ON public.messages
FOR SELECT TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

CREATE POLICY "Admins moderate messages" ON public.messages
FOR UPDATE TO authenticated
USING (public.has_role((select auth.uid()), 'admin'))
WITH CHECK (public.has_role((select auth.uid()), 'admin'));

-- Gift contributions are manual Pix reports, not payment confirmations.
ALTER TABLE public.gift_contributions
  ADD COLUMN IF NOT EXISTS gift_id text;

UPDATE public.gift_contributions
SET gift_id = coalesce(gift_id, public.normalize_name(gift_name), 'manual-gift')
WHERE gift_id IS NULL;

ALTER TABLE public.gift_contributions
  ALTER COLUMN gift_id SET NOT NULL,
  ADD CONSTRAINT gift_contributions_guest_name_required_check
    CHECK (public.normalize_name(guest_name) IS NOT NULL AND char_length(btrim(guest_name)) <= 120) NOT VALID,
  ADD CONSTRAINT gift_contributions_gift_id_required_check
    CHECK (public.normalize_name(gift_id) IS NOT NULL AND char_length(btrim(gift_id)) <= 80) NOT VALID,
  ADD CONSTRAINT gift_contributions_gift_name_required_check
    CHECK (public.normalize_name(gift_name) IS NOT NULL AND char_length(btrim(gift_name)) <= 160) NOT VALID,
  ADD CONSTRAINT gift_contributions_amount_positive_check
    CHECK (amount > 0) NOT VALID,
  ADD CONSTRAINT gift_contributions_message_length_check
    CHECK (message IS NULL OR char_length(message) <= 600) NOT VALID;

DROP POLICY IF EXISTS "Anyone records gift" ON public.gift_contributions;
CREATE POLICY "Anyone records gift" ON public.gift_contributions
FOR INSERT TO anon, authenticated
WITH CHECK (
  public.normalize_name(guest_name) IS NOT NULL
  AND char_length(btrim(guest_name)) <= 120
  AND public.normalize_name(gift_id) IS NOT NULL
  AND char_length(btrim(gift_id)) <= 80
  AND public.normalize_name(gift_name) IS NOT NULL
  AND char_length(btrim(gift_name)) <= 160
  AND amount > 0
  AND (message IS NULL OR char_length(message) <= 600)
);
