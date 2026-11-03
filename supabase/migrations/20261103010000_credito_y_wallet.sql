-- Tarjetas de crédito y compras que llegan solas desde el Wallet del iPhone

-- Tarjeta de crédito: cupo, día de corte y día de pago
alter table cuentas drop constraint cuentas_tipo_check;
alter table cuentas add constraint cuentas_tipo_check
  check (tipo in ('ahorros', 'corriente', 'billetera', 'tarjeta', 'credito', 'efectivo', 'inversion'));
alter table cuentas
  add column cupo numeric(16, 2) check (cupo is null or cupo >= 0),
  add column dia_corte int check (dia_corte between 1 and 31),
  add column dia_pago int check (dia_pago between 1 and 31);

-- Los movimientos que manda el Wallet se marcan con su origen
alter table movimientos drop constraint movimientos_origen_check;
alter table movimientos add constraint movimientos_origen_check
  check (origen in ('manual', 'extracto', 'nequi', 'nu', 'wallet'));

-- Una llave por cuenta conectada. Solo se guarda su huella (sha256): la llave misma vive en el atajo del iPhone.
create table llaves_wallet (
  id uuid primary key,
  usuario_id uuid not null default auth.uid() references auth.users on delete cascade,
  cuenta_id uuid not null references cuentas on delete cascade,
  llave_hash text not null unique,
  creada_en timestamptz not null default now(),
  ultimo_uso timestamptz
);
create index llaves_wallet_por_usuario on llaves_wallet (usuario_id);
create index llaves_wallet_por_cuenta on llaves_wallet (cuenta_id);

alter table llaves_wallet enable row level security;
revoke all on llaves_wallet from anon;
grant select, insert, update, delete on llaves_wallet to authenticated;
create policy "solo lo propio" on llaves_wallet for all to authenticated
  using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()));

create extension if not exists pgcrypto with schema extensions;

-- La puerta por donde entra cada compra del Wallet. No necesita sesión: la llave dice de quién es y a qué cuenta va,
-- y solo puede crear un gasto en esa cuenta. Con p_prueba solo comprueba la llave, sin guardar nada.
create or replace function public.registrar_compra_wallet(p_llave text, p_comercio text default null, p_monto text default null, p_prueba boolean default false)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_llave public.llaves_wallet;
  v_cuenta public.cuentas;
  v_texto text;
  v_monto numeric;
begin
  if p_llave is null or length(p_llave) < 32 then
    raise exception 'llave invalida' using errcode = '28000';
  end if;

  select * into v_llave from public.llaves_wallet
  where llave_hash = encode(extensions.digest(p_llave, 'sha256'), 'hex');
  if not found then
    raise exception 'llave invalida' using errcode = '28000';
  end if;

  select * into v_cuenta from public.cuentas where id = v_llave.cuenta_id and usuario_id = v_llave.usuario_id;
  if not found then
    raise exception 'cuenta no encontrada' using errcode = '28000';
  end if;

  if p_prueba then
    update public.llaves_wallet set ultimo_uso = now() where id = v_llave.id;
    return 'ok';
  end if;

  -- El monto llega como texto del iPhone ("12,50 US$", "$45.000", "1.234,56"): el último separador
  -- con 1 o 2 dígitos detrás es el decimal; los demás son de miles
  v_texto := regexp_replace(coalesce(p_monto, ''), '[^0-9.,]', '', 'g');
  if v_texto ~ '[.,][0-9]{1,2}$' then
    v_monto := (regexp_replace(substring(v_texto from '^(.*)[.,][0-9]{1,2}$'), '[.,]', '', 'g')
      || '.' || substring(v_texto from '[.,]([0-9]{1,2})$'))::numeric;
  else
    v_monto := nullif(regexp_replace(v_texto, '[.,]', '', 'g'), '')::numeric;
  end if;
  if v_monto is null or v_monto <= 0 or v_monto > 100000000 then
    raise exception 'monto invalido' using errcode = '22023';
  end if;

  insert into public.movimientos
    (id, usuario_id, fecha, tipo, categoria, descripcion, monto, moneda, tasa, cuenta_id, medio_pago, origen)
  values
    (gen_random_uuid(), v_llave.usuario_id, (now() at time zone 'America/Bogota')::date, 'gasto', 'Por revisar',
     left(coalesce(nullif(trim(p_comercio), ''), 'Compra con Apple Pay'), 120), v_monto, v_cuenta.moneda, 1,
     v_cuenta.id, 'tarjeta', 'wallet');

  update public.llaves_wallet set ultimo_uso = now() where id = v_llave.id;
  return 'ok';
end;
$$;

revoke all on function public.registrar_compra_wallet(text, text, text, boolean) from public;
grant execute on function public.registrar_compra_wallet(text, text, text, boolean) to anon, authenticated;
