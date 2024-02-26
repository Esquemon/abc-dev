const sequelize = require('../connection.js');
//const {ProcesoEmma} = require('../models/proceso_emma');

async function deleteData(id_carga){
  try {
    await sequelize.query(
      `
      delete from ProcesoEmma where id_carga = ${id_carga}
      `
    );
    await sequelize.query(
      `
      delete from indice where id_carga = ${id_carga}
      `
    );
  } catch (error) {
    console.error('Error al realizar el delete:', error);
    throw error;
  }
}

async function insertData(id_carga) {
  try {
    await sequelize.query(
      `insert into ProcesoEmma
      select NULL,'${id_carga}',
      EANLH.instalacion as 'instalacion', corporativo.instalacion_padre as 'Cuenta fact.colect', 
      if(corporativo.instalacion = EANLH.instalacion,'SI','NO') as 'Es cuenta Colectiva', 
      EANLH.bis as 'Bis', EANLH.tariftyp as 'Tariftyp', EANLH.ableinh as 'ableinh', EANLH.porcion as 'Porcion',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.erdk  where erdk.instalacion = EANLH.instalacion and erdk.id_cargas = EANLH.id_cargas) as 'Esta en ERDK',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.EVER  where EVER.instalacion = EANLH.instalacion and EVER.id_cargas = EANLH.id_cargas) as 'Esta en EVER',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.TLI  where TLI.id_cargas and EANLH.id_cargas and TLI.instalacion = EANLH.instalacion ) as 'Esta en TLI',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.TLO  where TLO.id_cargas = EANLH.id_cargas and TLO.instalacion = EANLH.instalacion) as 'Esta en TLO',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.rechazo_TLO  where rechazo_TLO.id_cargas and EANLH.id_cargas and rechazo_TLO.instalacion = EANLH.instalacion) as 'Rechazo en TLO',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.emma_ea38  where emma_ea38.id_cargas and EANLH.id_cargas and emma_ea38.instalacion = EANLH.instalacion) as 'Error Calculo',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.ea05_calc  where ea05_calc.id_cargas = EANLH.id_cargas and ea05_calc.instalacion = EANLH.instalacion) as 'Apartado Calculo',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.emma_ea26  where emma_ea26.id_cargas = EANLH.id_cargas and emma_ea26.instalacion = EANLH.instalacion) as 'Error Facturacion',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.ea05_fact  where ea05_fact.id_cargas = EANLH.id_cargas and ea05_fact.instalacion = EANLH.instalacion) as 'Apartado Facturacion',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.dfkklocks  where dfkklocks.id_cargas = EANLH.id_cargas and dfkklocks.instalacion = EANLH.instalacion) as 'Tiene Bloqueo Comercial',
      null as Cluster, null as observacion,
      monomico_kwh.promedio as 'Monomico Kwh',monomico_precio.fis_promedio as 'Monomico ($)', 
      monomico_kwh.promedio * monomico_precio.fis_promedio as 'Facturación Promedio',
      (SELECT if(count(*) = 0, 'No', 'Si') FROM emma.erdk  where erdk.instalacion = EANLH.instalacion) as 'FACTURADO',
      null as asignar
      from EANLH 
      left join corporativo on corporativo.instalacion = EANLH.instalacion
      left join monomico_kwh on monomico_kwh.tar = (select tarifa.tarifaCalculo from tarifa where tarifa.tipo_tarifa = EANLH.tariftyp)
      left join monomico_precio on monomico_precio.tar = (select tarifa.tarifaCalculo from tarifa where tarifa.tipo_tarifa = EANLH.tariftyp)
      where EANLH.id_cargas = ${id_carga} and EANLH.instalacion is not null;`,
    );

// Proceso Cluster
    await sequelize.query(
      `
      update ProcesoEmma set ProcesoEmma.cluster = '1_CRUCE_EVER_NO_ACTIVO', ProcesoEmma.obsAdicional = 'Instalación sin contrato' 
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.esEver = 'No';
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma 
inner join dfkklocks on dfkklocks.id_cargas = ProcesoEmma.id_carga and ProcesoEmma.instalacion = dfkklocks.instalacion and dfkklocks.motivo_bloqueo_id in (4,7,2,8,3)
set ProcesoEmma.cluster = '1_CRUCE_EVER_NO_ACTIVO', ProcesoEmma.obsadicional = dfkklocks.bloqueo
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.cluster is null and ProcesoEmma.esEver = 'Si';
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma set ProcesoEmma.cluster = '10_FACT_COLECTIVA', ProcesoEmma.obsAdicional = 'Colectivo_Hija'
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.esColectiva = 'Si' and ProcesoEmma.cluster is null;
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma set ProcesoEmma.cluster = '4_CRUCE_NO_TLO', ProcesoEmma.obsAdicional = 'Sin Lectura (no venia TLO)'
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.esTlo = 'No' and ProcesoEmma.tariftyp not in ('BT1 EC', 'BT2 EC PP', 'BT2 EC PPP') and ProcesoEmma.cluster is null;
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma set ProcesoEmma.cluster = '5_RECHAZO_TLO', ProcesoEmma.obsAdicional = 'Rechazo TLO'
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.reTlo = 'Si' and ProcesoEmma.cluster is null;
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma 
inner join dfkklocks on dfkklocks.id_cargas = ProcesoEmma.id_carga and ProcesoEmma.instalacion = dfkklocks.instalacion 
and dfkklocks.motivo_bloqueo_id in (1,5,6,9)
set ProcesoEmma.cluster = '11_CRUCE_BLOQUEO_COMERCIAL', ProcesoEmma.obsadicional = dfkklocks.bloqueo
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.cluster is null;
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma set ProcesoEmma.cluster = '9_CRUCE_APARTADO_FACTURACION', ProcesoEmma.obsAdicional = 'EA_05_Facturación (Periodo Actual o anterior)'
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.apartFact = 'Si' and ProcesoEmma.cluster is null;
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma 
inner join emma_ea26 on emma_ea26.id_cargas = ProcesoEmma.id_carga and emma_ea26.instalacion = ProcesoEmma.instalacion and emma_ea26.id_clasificacion <> 40
inner join clasificacion on clasificacion.tipo_clasificacion_id = 1 and clasificacion.id = emma_ea26.id_clasificacion 
set ProcesoEmma.cluster = '8_LOG_EMMA_EA26_FACT', ProcesoEmma.obsadicional = clasificacion.clasificacion
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.cluster is null;
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma set ProcesoEmma.cluster = '7_CRUCE_APARTADO_CALCULO', ProcesoEmma.obsAdicional = 'EA_05_Calculo (Periodo Actual o anterior)'
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.apartCalculo = 'Si' and ProcesoEmma.cluster is null
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma 
inner join emma_ea38 on emma_ea38.id_cargas = ProcesoEmma.id_carga and emma_ea38.instalacion = ProcesoEmma.instalacion
inner join clasificacion on clasificacion.tipo_clasificacion_id = 2 and clasificacion.id = emma_ea38.id_clasificacion
set ProcesoEmma.cluster = '6_LOG_EMMA_EA38_CALCULO', ProcesoEmma.obsadicional = emma_ea38.mensaje
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.cluster is null; 
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma set ProcesoEmma.cluster = '00_FACTURADO', ProcesoEmma.obsAdicional = 'Facturado'
      where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.esErdk = 'Si' and ProcesoEmma.esEver = 'Si'
      and ProcesoEmma.cluster is null ; 
      `
    );

    await sequelize.query(
      `
      update ProcesoEmma set ProcesoEmma.cluster = '12_SIN_CLASIFICAR', ProcesoEmma.obsAdicional = 'Analizar', ProcesoEmma.asignar = 'Asignar'
where ProcesoEmma.id_carga = ${id_carga} and ProcesoEmma.esErdk = 'No' and ProcesoEmma.cluster is null;
      `
    );

// Proceso Indice

    await sequelize.query(
      `
      insert into indice (id, id_carga, fch_facturacion, porcion, clientes_tot, clientes_enlh, clientes_facturados, at_facturadas )
      select null,'${id_carga}', @fecha := (SELECT erdk.fecha_documento FROM emma.erdk
      where erdk.id_cargas = EANLH.id_cargas
      group by erdk.fecha_documento
      order by count(*) Desc
      limit 0,1) as 'FECHA FACTURACIÓN', 
      EANLH.porcion as 'PORCION', count(*) as 'CLIENTES TOTALES', count(*) as 'Clientes ENLH',
      (select count(distinct instalacion) from erdk where erdk.id_cargas = EANLH.id_cargas) as 'CLIENTES FACTURADOS',
      (SELECT count(*) FROM emma.erdk where erdk.id_cargas = EANLH.id_cargas and erdk.fecha_documento > @fecha) as 'AT Facturadas'
      from EANLH
      where EANLH.id_cargas = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set clientes_baja_ever =
      (select count(*) from ProcesoEmma where ProcesoEmma.id_carga = indice.id_carga and cluster = '1_CRUCE_EVER_NO_ACTIVO')
      where indice.id_carga = ${id_carga};
      `
    );    

    await sequelize.query(
      `
      update indice set clientes_colect =
      (select count(*) from ProcesoEmma where id_carga = indice.id_carga and cluster = '10_FACT_COLECTIVA')
      where indice.id_carga = ${id_carga};
      `
    );
    
    await sequelize.query(
      `
      update indice set bloqueo_comercial_lbs =
      (select count(*) from ProcesoEmma where id_carga = indice.id_carga and obsAdicional = 'Bloqueo_LSB4')
      where indice.id_carga = ${id_carga};
      `
    );    

    await sequelize.query(
      `
      update indice set clientes_facturables = (clientes_tot - clientes_baja_ever - clientes_colect - bloqueo_comercial_lbs)
      where indice.id_carga = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set porc_instala_fact = ((clientes_facturados / clientes_facturables) * 100)
      where indice.id_carga = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set at_no_facturadas = (clientes_facturables - clientes_facturados)
      where indice.id_carga = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set porc_facturadas = ((at_facturadas / (at_facturadas + at_no_facturadas)) * 100 )
      where indice.id_carga = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set porc_no_facturadas = ((at_no_facturadas / (at_facturadas + at_no_facturadas)) * 100 )
      where indice.id_carga = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set anomalias_calculo = 
      (select count(*) from ProcesoEmma where id_carga = indice.id_carga 
      and (cluster = '6_LOG_EMMA_EA38_CALCULO' or cluster = '7_CRUCE_APARTADO_CALCULO')
      and ProcesoEmma.esErdk ='No')
      where indice.id_carga = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set porc_anomalias_calculo = ((anomalias_calculo / (at_facturadas + at_no_facturadas)) * 100 )
      where indice.id_carga = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set anomalias_fact = 
      (select count(*) from ProcesoEmma where id_carga = indice.id_carga 
      and (cluster = '8_LOG_EMMA_EA26_FACT' or cluster = '9_CRUCE_APARTADO_FACTURACION')
      and ProcesoEmma.esErdk ='No')
      where indice.id_carga = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set porc_anomalias_fact = ((anomalias_fact / (at_facturadas + at_no_facturadas)) * 100 )
      where indice.id_carga = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set espera_lectura =
      (select count(*) from ProcesoEmma where id_carga = indice.id_carga 
      and (cluster = '4_CRUCE_NO_TLO' or cluster = '5_RECHAZO_TLO')
      and ProcesoEmma.esErdk ='No')
      where indice.id_carga = ${id_carga};
      `
    );

    await sequelize.query(
      `
      update indice set porc_espera_lectura = ((espera_lectura / (at_facturadas + at_no_facturadas)) * 100 )
      where indice.id_carga = ${id_carga};
      `
    );
    
    await sequelize.query(
      `
      update indice set otras_anomalias = ( at_no_facturadas - anomalias_calculo - anomalias_fact - espera_lectura )
      where indice.id_carga = ${id_carga};
      `
    );  
    
    await sequelize.query(
      `
      update indice set porc_otras_anomalias = ((espera_lectura / (at_facturadas + at_no_facturadas)) * 100 )
      where indice.id_carga = ${id_carga};
      `
    );   

    await sequelize.query(
      `
      insert into temp_totales
      select  null, 2, 
        sum((select promedio from monomico_kwh 
        where monomico_kwh.tar = (select tarifa.tarifaCalculo from tarifa where tarifa.tipo_tarifa = EANLH.tariftyp))) as kwh, 
        round(sum((select promedio from monomico_kwh 
        where monomico_kwh.tar = (select tarifa.tarifaCalculo from tarifa where tarifa.tipo_tarifa = EANLH.tariftyp))) * ((select monomico_precio.fis_promedio from monomico_precio 
        where monomico_precio.tar = (select tarifa.tarifaCalculo from tarifa where tarifa.tipo_tarifa = EANLH.tariftyp)))) as importe
          from EANLH 
        where EANLH.id_cargas = ${id_carga}
        and not exists (select * from ProcesoEmma where EANLH.id_cargas = ProcesoEmma.id_carga and EANLH.instalacion = ProcesoEmma.instalacion 
        and cluster = '1_CRUCE_EVER_NO_ACTIVO')
        and not exists (select * from ProcesoEmma where EANLH.id_cargas = ProcesoEmma.id_carga and EANLH.instalacion = ProcesoEmma.instalacion
        and cluster = '10_FACT_COLECTIVA')
        and not exists (select * from erdk where EANLH.id_cargas = erdk.id_cargas and EANLH.instalacion = erdk.instalacion group by erdk.instalacion)
        group by EANLH.tariftyp;

        update indice set kwh_pendiente = (select sum(kwh) from temp_totales )
        where indice.id_carga = ${id_carga};

        uupdate indice set importe_pendiente = (select sum(importe) from temp_totales )
        where indice.id_carga = ${id_carga};

        truncate table temp_totales;
      `
    ); 

    console.log('se realizo el insert')
    return true
   
  } catch (error) {
    console.error('Error al realizar el insert:', error);
    throw error;
  }
}

module.exports = {
  insertData,
  deleteData
};
