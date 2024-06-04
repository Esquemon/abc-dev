CREATE DEFINER=`adminEmma`@`%` PROCEDURE `actualizarRegularizados`()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE id_instalacion INT;
    DECLARE id_porcion VARCHAR(3);
    DECLARE cluster_value VARCHAR(80);
    DECLARE carga_id INT;
    DECLARE ano_value varchar(4);
    DECLARE mes_value varchar(2);
    DECLARE tariftyp_value varchar(10);
    DECLARE fis_promedio_value DECIMAL(10,2);
    DECLARE promedio_value int;
    
    -- Cursor para recorrer la tabla "regularizados"
    DECLARE cur CURSOR FOR
        SELECT instalacion, porcion, ano, mes
        FROM regularizados
        WHERE procesado IS NULL;
    
    -- Handler para controlar cuando el cursor termina
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
        -- Manejo de excepciones
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error durante la ejecución del procedimiento';
    END;
    
    START TRANSACTION;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO id_instalacion, id_porcion, ano_value, mes_value;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Obtener "id" de la tabla "cargas" utilizando "mes" y "dia"
        SELECT max(id) INTO carga_id
        FROM cargas
        WHERE ano = ano_value AND mes = mes_value AND porcion = id_porcion;
        
        -- Actualizar campo "regularizado" en tabla "ProcesoEmma"
        UPDATE ProcesoEmma
        SET regularizado = 'Si'
        WHERE instalacion = id_instalacion AND id_carga = carga_id;
        
        -- Actualizar campo "nofacturadas" en tabla "indice"
        UPDATE indice
        SET at_no_facturadas = at_no_facturadas - 1
        WHERE id_carga = carga_id;
        
        -- Obtener el valor del campo "cluster" de la tabla "procesoemma"
        SELECT cluster INTO cluster_value
        FROM ProcesoEmma
        WHERE instalacion = id_instalacion AND id_carga = carga_id;
        
        -- Actualizar campo "anomalias_calculo" en tabla "indice" si el "cluster" cumple con ciertas condiciones
        IF cluster_value = '6_LOG_EMMA_EA38_CALCULO' OR cluster_value = '7_CRUCE_APARTADO_CALCULO' THEN
            UPDATE indice
            SET anomalias_calculo = anomalias_calculo - 1
            WHERE id_carga = carga_id;
        
        -- Actualizar campo "anomalias_fact" en tabla "indice" si el "cluster" cumple con ciertas condiciones
        ELSEIF cluster_value = '8_LOG_EMMA_EA26_FACT' OR cluster_value = '9_CRUCE_APARTADO_FACTURACION' THEN
            UPDATE indice
            SET anomalias_fact = anomalias_fact - 1
            WHERE id_carga = carga_id;
        
        -- Actualizar campo "espera_lectura" en tabla "indice" si el "cluster" cumple con ciertas condiciones
        ELSEIF cluster_value = '4_CRUCE_NO_TLO' OR cluster_value = '5_RECHAZO_TLO' THEN
            UPDATE indice
            SET espera_lectura = espera_lectura - 1
            WHERE id_carga = carga_id;
        
        -- Actualizar campo "otras_anomalias" en tabla "indice" si no se cumple ninguna de las condiciones anteriores
        ELSE
            UPDATE indice
            SET otras_anomalias = otras_anomalias - 1
            WHERE id_carga = carga_id;

        END IF;
        -- Actualiza %
		update indice set porc_anomalias_calculo = ((anomalias_calculo / (at_facturadas + at_no_facturadas)) * 100 )
		where indice.id_carga = carga_id;
		update indice set porc_anomalias_fact = ((anomalias_fact / (at_facturadas + at_no_facturadas)) * 100 )
		where indice.id_carga = carga_id;
		update indice set porc_espera_lectura = ((espera_lectura / (at_facturadas + at_no_facturadas)) * 100 )
		where indice.id_carga = carga_id;
		update indice set porc_otras_anomalias = ((otras_anomalias / (at_facturadas + at_no_facturadas)) * 100 )
		where indice.id_carga = carga_id;

        -- Actualizar campo "procesado" en tabla "regularizados"
        UPDATE regularizados
        SET procesado = 'Si'
        WHERE instalacion = id_instalacion AND porcion = id_porcion AND ano = ano_value AND mes = mes_value;
 
		-- actualiza totales
        SELECT tariftyp INTO tariftyp_value
        FROM ProcesoEmma
        WHERE instalacion = id_instalacion AND id_carga = carga_id;
        
		select monomico_kwh.promedio into promedio_value
        from monomico_kwh 
		where monomico_kwh.tar = (select tarifa.tarifaCalculo from tarifa where tarifa.tipo_tarifa = tariftyp_value); 
        
        select monomico_precio.fis_promedio into fis_promedio_value
        from monomico_precio 
		where monomico_precio.tar = (select tarifa.tarifaCalculo from tarifa where tarifa.tipo_tarifa = tariftyp_value);
        
        UPDATE indice SET kwh_pendiente = kwh_pendiente - promedio_value
            WHERE id_carga = carga_id;
            
		UPDATE indice SET importe_pendiente = importe_pendiente - (promedio_value * fis_promedio_value)
            WHERE id_carga = carga_id;
        
        UPDATE indice SET kwh_recuperado =  promedio_value + kwh_recuperado
            WHERE id_carga = carga_id;
            
		UPDATE indice SET importe_recuperado = importe_recuperado + (promedio_value * fis_promedio_value)
            WHERE id_carga = carga_id;
            
		UPDATE indice SET por_avance_kwh = (kwh_recuperado / (kwh_recuperado + kwh_pendiente)) * 100
            WHERE id_carga = carga_id;
            
		UPDATE indice SET por_avance_importe = (importe_recuperado / (importe_recuperado + importe_pendiente)) * 100
            WHERE id_carga = carga_id;
            
    END LOOP;
    
    CLOSE cur;
    
    COMMIT;
    
END
