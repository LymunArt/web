-- Mover plata entre cuentas propias (por ejemplo, pagar la tarjeta de crédito desde el débito).
-- No es gasto ni ingreso: baja una cuenta y sube la otra.
alter table movimientos drop constraint movimientos_tipo_check;
alter table movimientos add constraint movimientos_tipo_check
  check (tipo in ('ingreso', 'gasto', 'pago_deuda', 'transferencia'));
alter table movimientos add column cuenta_destino_id uuid references cuentas on delete set null;
create index movimientos_por_cuenta_destino on movimientos (cuenta_destino_id);
