-- Compras de turista con derecho a devolución de IVA (tax free)
create table compras_tax_free (
  id uuid primary key,
  usuario_id uuid not null default auth.uid() references auth.users on delete cascade,
  fecha date not null,
  tienda text not null,
  pais char(2) not null,
  moneda char(3) not null,
  total numeric(16, 2) not null check (total > 0),
  iva numeric(16, 2) not null check (iva >= 0),
  operador text not null default '',
  estado text not null default 'pendiente' check (estado in ('pendiente', 'validada', 'enviada', 'recibida', 'rechazada')),
  recibido numeric(16, 2),
  movimiento_id uuid references movimientos on delete set null
);

create index compras_tax_free_por_usuario on compras_tax_free (usuario_id);

-- Igual que las demás tablas: solo con sesión, y cada persona solo ve lo suyo
alter table compras_tax_free enable row level security;
revoke all on compras_tax_free from anon;
grant select, insert, update, delete on compras_tax_free to authenticated;
create policy "solo lo propio" on compras_tax_free for all to authenticated
  using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()));
