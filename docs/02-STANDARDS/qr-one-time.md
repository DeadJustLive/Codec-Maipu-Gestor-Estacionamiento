// @kind(guide)
// @contract(in: tarjeta QR -> out: validación de un solo uso)
// @limit(cada QR usable una sola vez en DB)

# QR de Un Solo Uso

## Ciclo de Vida del QR

```
1. ADMIN crea tarjeta física
   → INSERT tarjetas (codigo = uuid_generate_v4(), activa = true)

2. DIGITADOR asigna espacio a conductor
   → Sistema genera QR en pantalla + localStorage del conductor
   → QR contiene: { codigo_tarjeta, espacio, timestamp }

3. CONDUCTOR presenta QR al llegar
   → Guardia escanea QR
   → Sistema verifica: ¿tarjeta.activa = true?
     │
     ├─ Sí → Marca ocupado, UPDATE tarjetas SET activa = false
     └─ No → Rechaza: "QR ya utilizado o inválido"

4. LIBERACIÓN
   → UPDATE tarjetas SET activa = true (vuelve al pool)
```

## Estructura del QR

```typescript
// Datos codificados en el QR
type QRContent = {
  codigo: string      // UUID de la tarjeta
  espacio: string     // "A-15"
  expira: string      // ISO timestamp
}

// El QR se genera solo cuando se asigna el espacio
// y se almacena en localStorage del conductor
```

## Validación en DB

```sql
-- Función de verificación con one-time check
CREATE OR REPLACE FUNCTION validar_qr(p_codigo text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_tarjeta tarjetas%ROWTYPE;
BEGIN
  SELECT * INTO v_tarjeta
  FROM tarjetas WHERE codigo = p_codigo;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valido', false, 'error', 'QR no existe');
  END IF;

  IF NOT v_tarjeta.activa THEN
    RETURN jsonb_build_object('valido', false, 'error', 'QR ya utilizado');
  END IF;

  -- Marcar como usado inmediatamente (one-time)
  UPDATE tarjetas SET activa = false WHERE id = v_tarjeta.id;

  RETURN jsonb_build_object(
    'valido', true,
    'espacio_id', v_tarjeta.espacio_id
  );
END;
$$;
```

## Seguridad
- El QR contiene un UUID, no datos sensibles
- Una vez usado en DB, el mismo código es rechazado aunque el QR esté en localStorage
- La función `validar_qr` es atómica (marca usado en el mismo UPDATE)
