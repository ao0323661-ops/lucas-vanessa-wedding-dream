-- Restrict public wedding details and RSVP to active invited guests.

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;

CREATE TABLE public.invited_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  group_name TEXT,
  allowed_companions INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT invited_guests_display_name_required_check
    CHECK (char_length(btrim(display_name)) BETWEEN 1 AND 120),
  CONSTRAINT invited_guests_normalized_name_required_check
    CHECK (char_length(btrim(normalized_name)) BETWEEN 1 AND 120),
  CONSTRAINT invited_guests_group_name_length_check
    CHECK (group_name IS NULL OR char_length(btrim(group_name)) <= 120),
  CONSTRAINT invited_guests_allowed_companions_range_check
    CHECK (allowed_companions BETWEEN 0 AND 10)
);

CREATE INDEX invited_guests_active_normalized_name_idx
  ON public.invited_guests (is_active, normalized_name);

CREATE OR REPLACE FUNCTION public.normalize_invited_guest_name(value text)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT nullif(
    btrim(
      regexp_replace(
        lower(extensions.unaccent(coalesce(value, ''))),
        '[[:space:]]+',
        ' ',
        'g'
      )
    ),
    ''
  )
$$;

REVOKE EXECUTE ON FUNCTION public.normalize_invited_guest_name(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.normalize_invited_guest_name(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.set_invited_guest_normalized_name()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.normalized_name := public.normalize_invited_guest_name(NEW.display_name);
  RETURN NEW;
END;
$$;

CREATE TRIGGER invited_guests_set_normalized_name
BEFORE INSERT OR UPDATE OF display_name
ON public.invited_guests
FOR EACH ROW
EXECUTE FUNCTION public.set_invited_guest_normalized_name();

GRANT SELECT, INSERT, UPDATE ON public.invited_guests TO authenticated;
GRANT ALL ON public.invited_guests TO service_role;
ALTER TABLE public.invited_guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view invited guests" ON public.invited_guests
FOR SELECT TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

CREATE POLICY "Admins create invited guests" ON public.invited_guests
FOR INSERT TO authenticated
WITH CHECK (public.has_role((select auth.uid()), 'admin'));

CREATE POLICY "Admins update invited guests" ON public.invited_guests
FOR UPDATE TO authenticated
USING (public.has_role((select auth.uid()), 'admin'))
WITH CHECK (public.has_role((select auth.uid()), 'admin'));

CREATE OR REPLACE FUNCTION public.search_invited_guest(name_input text)
RETURNS TABLE (
  id uuid,
  display_name text,
  group_name text,
  allowed_companions integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH normalized AS (
    SELECT public.normalize_invited_guest_name(name_input) AS query
  )
  SELECT
    guest.id,
    guest.display_name,
    guest.group_name,
    guest.allowed_companions
  FROM public.invited_guests AS guest
  CROSS JOIN normalized
  WHERE normalized.query IS NOT NULL
    AND char_length(normalized.query) >= 3
    AND guest.is_active = true
    AND guest.normalized_name LIKE '%' || normalized.query || '%'
  ORDER BY
    CASE
      WHEN guest.normalized_name = normalized.query THEN 0
      WHEN guest.normalized_name LIKE normalized.query || '%' THEN 1
      ELSE 2
    END,
    char_length(guest.normalized_name),
    guest.display_name
  LIMIT 5
$$;

REVOKE EXECUTE ON FUNCTION public.search_invited_guest(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_invited_guest(text) TO anon, authenticated, service_role;

ALTER TABLE public.rsvps
  ADD COLUMN IF NOT EXISTS invited_guest_id uuid REFERENCES public.invited_guests(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS rsvps_unique_invited_guest_id_idx
  ON public.rsvps (invited_guest_id)
  WHERE invited_guest_id IS NOT NULL;

DROP INDEX IF EXISTS public.rsvps_unique_no_phone_normalized_name_idx;

CREATE UNIQUE INDEX rsvps_unique_no_phone_normalized_name_idx
  ON public.rsvps (public.normalize_name(full_name))
  WHERE public.normalize_phone(phone) IS NULL
    AND invited_guest_id IS NULL;

CREATE TABLE IF NOT EXISTS public.wedding_private_locations (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  time_label TEXT NOT NULL,
  maps_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT wedding_private_locations_label_length_check
    CHECK (char_length(btrim(label)) BETWEEN 1 AND 80),
  CONSTRAINT wedding_private_locations_name_length_check
    CHECK (char_length(btrim(name)) BETWEEN 1 AND 140),
  CONSTRAINT wedding_private_locations_address_length_check
    CHECK (char_length(btrim(address)) BETWEEN 1 AND 300),
  CONSTRAINT wedding_private_locations_time_label_length_check
    CHECK (char_length(btrim(time_label)) BETWEEN 1 AND 40),
  CONSTRAINT wedding_private_locations_maps_url_length_check
    CHECK (char_length(btrim(maps_url)) BETWEEN 1 AND 500)
);

INSERT INTO public.wedding_private_locations (
  id,
  label,
  name,
  address,
  time_label,
  maps_url,
  sort_order
)
VALUES
  (
    'ceremony',
    'Cerimônia',
    'Cerimônia de Lucas & Vanessa',
    'Endereço da cerimônia será compartilhado pelos noivos',
    '16h00',
    'https://www.google.com/maps',
    1
  ),
  (
    'reception',
    'Festa',
    'Celebração de Lucas & Vanessa',
    'Endereço da festa será compartilhado pelos noivos',
    '19h00',
    'https://www.google.com/maps',
    2
  )
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  time_label = EXCLUDED.time_label,
  maps_url = EXCLUDED.maps_url,
  sort_order = EXCLUDED.sort_order;

GRANT SELECT ON public.wedding_private_locations TO authenticated;
GRANT ALL ON public.wedding_private_locations TO service_role;
ALTER TABLE public.wedding_private_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view wedding private locations" ON public.wedding_private_locations
FOR SELECT TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

CREATE OR REPLACE FUNCTION public.is_valid_invited_guest_rsvp(
  guest_id uuid,
  guest_name text,
  guest_companions integer
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.invited_guests AS guest
    WHERE guest.id = guest_id
      AND guest.is_active = true
      AND public.normalize_invited_guest_name(guest_name) = guest.normalized_name
      AND guest_companions BETWEEN 0 AND guest.allowed_companions
  )
$$;

REVOKE EXECUTE ON FUNCTION public.is_valid_invited_guest_rsvp(uuid, text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_valid_invited_guest_rsvp(uuid, text, integer)
  TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_wedding_private_details(
  guest_id uuid,
  guest_name text
)
RETURNS TABLE (
  id text,
  label text,
  name text,
  address text,
  time_label text,
  maps_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    location.id,
    location.label,
    location.name,
    location.address,
    location.time_label,
    location.maps_url
  FROM public.wedding_private_locations AS location
  WHERE public.is_valid_invited_guest_rsvp(guest_id, guest_name, 0)
  ORDER BY location.sort_order, location.id
$$;

REVOKE EXECUTE ON FUNCTION public.get_wedding_private_details(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_wedding_private_details(uuid, text)
  TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Anyone can RSVP" ON public.rsvps;
CREATE POLICY "Anyone can RSVP" ON public.rsvps
FOR INSERT TO anon, authenticated
WITH CHECK (
  invited_guest_id IS NOT NULL
  AND public.normalize_name(full_name) IS NOT NULL
  AND char_length(btrim(full_name)) <= 120
  AND companions BETWEEN 0 AND 10
  AND (attending = true OR companions = 0)
  AND public.is_valid_invited_guest_rsvp(invited_guest_id, full_name, companions)
  AND (phone IS NULL OR char_length(btrim(phone)) <= 40)
  AND (dietary_restrictions IS NULL OR char_length(dietary_restrictions) <= 300)
  AND (message IS NULL OR char_length(message) <= 600)
);
