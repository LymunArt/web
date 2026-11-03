-- App de finanzas: cada fila pertenece a un usuario y la base impide que otro la vea.

-- Cuentas de cualquier banco o billetera, cada una en su moneda
create table cuentas (
  id uuid primary key,
  usuario_id uuid not null default auth.uid() references auth.users on delete cascade,
  nombre text not null,
  entidad text not null,
  tipo text not null check (tipo in ('ahorros', 'corriente', 'billetera', 'tarjeta', 'efectivo', 'inversion')),
  moneda char(3) not null default 'COP',
  saldo_inicial numeric(16, 2) not null default 0,
  archivada boolean not null default false
);

create table movimientos (
  id uuid primary key,
  usuario_id uuid not null default auth.uid() references auth.users on delete cascade,
  fecha date not null,
  tipo text not null check (tipo in ('ingreso', 'gasto', 'pago_deuda')),
  categoria text not null,
  descripcion text not null default '',
  monto numeric(16, 2) not null check (monto > 0),
  moneda char(3) not null default 'COP',
  -- Pesos por unidad de la moneda el día que se registró
  tasa numeric(18, 6) not null default 1 check (tasa > 0),
  cuenta_id uuid references cuentas on delete set null,
  medio_pago text not null,
  deuda_id uuid,
  proyecto_id uuid,
  origen text not null default 'manual' check (origen in ('manual', 'extracto', 'nequi', 'nu')),
  id_externo text,
  creado_en timestamptz not null default now()
);
-- Un movimiento traído de afuera no puede entrar dos veces
create unique index movimientos_externos_unicos on movimientos (usuario_id, id_externo) where id_externo is not null;
create index movimientos_por_fecha on movimientos (usuario_id, fecha desc);

create table deudas (
  id uuid primary key,
  usuario_id uuid not null default auth.uid() references auth.users on delete cascade,
  nombre text not null,
  entidad text,
  saldo_inicial numeric(14, 2) not null check (saldo_inicial >= 0),
  tasa_mensual numeric(8, 6) not null check (tasa_mensual >= 0),
  cuota numeric(14, 2) not null check (cuota > 0),
  cuotas_totales int not null check (cuotas_totales > 0),
  cuotas_pagadas int not null default 0,
  dia_pago int check (dia_pago between 1 and 31),
  fecha_inicio date not null
);

create table pagos_deuda (
  id uuid primary key,
  usuario_id uuid not null default auth.uid() references auth.users on delete cascade,
  deuda_id uuid not null references deudas on delete cascade,
  movimiento_id uuid not null references movimientos on delete cascade,
  numero_cuota int not null,
  fecha date not null,
  monto_pagado numeric(14, 2) not null,
  interes numeric(14, 2) not null,
  capital numeric(14, 2) not null,
  otros_cobros numeric(14, 2) not null default 0,
  saldo_despues numeric(14, 2) not null,
  abono_extra numeric(14, 2) not null default 0
);

create table proyectos (
  id uuid primary key,
  usuario_id uuid not null default auth.uid() references auth.users on delete cascade,
  nombre text not null,
  descripcion text not null default '',
  meta_monto numeric(14, 2),
  estado text not null default 'idea' check (estado in ('idea', 'en_curso', 'pausado', 'terminado')),
  ideas text[] not null default '{}'
);

create table presupuesto (
  id uuid primary key,
  usuario_id uuid not null default auth.uid() references auth.users on delete cascade,
  mes text not null,
  categoria text not null,
  limite numeric(14, 2) not null check (limite >= 0),
  unique (usuario_id, mes, categoria)
);

create table por_cobrar (
  id uuid primary key,
  usuario_id uuid not null default auth.uid() references auth.users on delete cascade,
  persona text not null,
  concepto text not null default '',
  monto numeric(14, 2) not null check (monto > 0),
  fecha date not null,
  cobrado boolean not null default false
);

-- Permisos dados a Nequi o Nu. Aquí nunca va una clave del banco: solo la referencia del consentimiento.
create table conexiones (
  id uuid primary key,
  usuario_id uuid not null default auth.uid() references auth.users on delete cascade,
  proveedor text not null check (proveedor in ('nequi', 'nu')),
  estado text not null default 'activa' check (estado in ('activa', 'vencida', 'revocada')),
  referencia_externa text not null,
  consentimiento_hasta timestamptz,
  ultima_sincronizacion timestamptz,
  unique (usuario_id, proveedor)
);

-- Reglas por fila: cada persona solo lee y cambia lo suyo
do $$
declare tabla text;
begin
  foreach tabla in array array['cuentas', 'movimientos', 'deudas', 'pagos_deuda', 'proyectos', 'presupuesto', 'por_cobrar', 'conexiones'] loop
    execute format('alter table %I enable row level security', tabla);
    -- Solo las personas con sesión pueden usar las tablas, y siempre bajo la regla de abajo
    execute format('revoke all on %I from anon', tabla);
    execute format('grant select, insert, update, delete on %I to authenticated', tabla);
    execute format(
      'create policy "solo lo propio" on %I for all to authenticated using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()))',
      tabla
    );
  end loop;
end $$;

-- Índices para las llaves que se consultan o se borran en cascada
create index cuentas_por_usuario on cuentas (usuario_id);
create index movimientos_por_cuenta on movimientos (cuenta_id);
create index deudas_por_usuario on deudas (usuario_id);
create index pagos_por_deuda on pagos_deuda (deuda_id);
create index pagos_por_movimiento on pagos_deuda (movimiento_id);
create index pagos_por_usuario on pagos_deuda (usuario_id);
create index proyectos_por_usuario on proyectos (usuario_id);
create index por_cobrar_por_usuario on por_cobrar (usuario_id);
