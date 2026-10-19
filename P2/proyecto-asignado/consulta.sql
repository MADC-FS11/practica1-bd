-- Práctica 2: consultas de solo lectura sobre PostgreSQL.
-- Ejecutar después de levantar y poblar el fork de PublicMunicipalWorks_DWH.
-- No se incluye un resultado fabricado.

-- Q1. Verificación de datos operacionales y analíticos.
SELECT 'public.obra' AS origen, COUNT(*) AS registros FROM public.obra
UNION ALL SELECT 'public.informes', COUNT(*) FROM public.informes
UNION ALL SELECT 'warehouse.fact_obra_mensual', COUNT(*) FROM warehouse.fact_obra_mensual;

-- Q2. Presupuesto y gasto registrado por comunidad, sin duplicar
-- el presupuesto al unir una obra con múltiples costos.
WITH gastos AS (
  SELECT id_presupuesto, SUM(costo) AS gasto_registrado
  FROM public.costos GROUP BY id_presupuesto
)
SELECT r.comunidad, COUNT(*) AS obras,
       COALESCE(SUM(p.presupuesto_total),0) AS presupuesto_asignado,
       COALESCE(SUM(g.gasto_registrado),0) AS gasto_registrado
FROM public.obra o
JOIN public.region r ON r.id_region=o.id_region
LEFT JOIN public.presupuesto_obra p ON p.id_obra=o.id_obra
LEFT JOIN gastos g ON g.id_presupuesto=p.id_presupuesto
GROUP BY r.comunidad ORDER BY presupuesto_asignado DESC;

-- Q3. Obras con retraso en la vista publicada del almacén.
SELECT obra_id, nombre_obra, comunidad, constructora,
       presupuesto_total, costo_acumulado, dias_retraso
FROM warehouse.v_obras_retraso
ORDER BY dias_retraso DESC NULLS LAST, obra_id
LIMIT 20;
