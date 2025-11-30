const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const xlsx = require('xlsx');

const uploadFunctions = require('/opt/operations/adl_uploads');


module.exports.handler = async (event, context) => {
  console.log('Init', event)
  let body = event.body
  try {
    if (event.isBase64Encoded) {
      const decodedString = Buffer.from(body, 'base64').toString('utf-8');
      body = JSON.parse(decodedString);
      console.log(body)
    } else {
      try {
        body = JSON.parse(body)
      } catch (e) {
        console.log('no era necesario parsear el event')
      }
    }

  } catch (error) {
    console.log("error intentando tener el body", error)

  }

  try {
    let upload_id = null
    const { upload_name, day, month, year, file_name, file_type } = body

    const uploads = await uploadFunctions.getUploadsByFields(upload_name, day, month, year)

    if (uploads.length == 0) {
      const upload = await uploadFunctions.createUpload(upload_name, day, month, year)
      upload_id = upload.id
    } else {
      upload_id = uploads[0].id
    }


    const lambda = new AWS.Lambda();

    // Configura los parámetros para la invocación
    const params = {
      FunctionName: 'abc-back-dev-processAdlFileFunction',
      InvocationType: 'Event', // Configura la invocación asíncrona
      Payload: JSON.stringify({
        upload_name,
        day,
        month,
        year,
        upload_id,
        file_name,
        file_type
      })
    };

    // Invoca a FuncionB desde FuncionA
    await lambda.invoke(params).promise();

    //llamo a la funcion que va a procesar el archivo por atras
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: 'Operación exitosa, se envio a procesar el archivo' }),
    };
  } catch (error) {
    console.error('Error en la función Lambda:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }

};

module.exports.processUpload = async (event, context) => {
  console.log('Init3', event)
  const { upload_name, day, month, year, upload_id, file_name, file_type } = event
  const excel_files = [
    'adl-eanlh', 'adl-bd-el31', 'adl-ea05-calc', 'adl-erdk',
    'adl-ettifn', 'adl-ea05-fact', 'adl-dfkklocks', 'adl-ever',
    'adl-etdz', 'adl-erch', 'adl-erchc'
  ]

  let fileData = []
  if (excel_files.indexOf(file_type) != -1) {
    fileData = await getExcelData(file_name, file_type)
    if (file_type == 'adl-eanlh') {
      await addEanlhData(fileData, upload_id, day, month, year)
    } else if (file_type == 'adl-bd-el31') {
      await addBdEl31Data(fileData, upload_id)
    } else if (file_type == 'adl-ettifn') {
      await addEttifnData(fileData, upload_id)
    } else if (file_type == 'adl-ea05-calc') {
      await addEa05CalcData(fileData, upload_id)
    } else if (file_type == 'adl-ea05-fact') {
      await addEa05FactData(fileData, upload_id)
    } else if (file_type == 'adl-ever') {
      await addEverData(fileData, upload_id)
    } else if (file_type == 'adl-dfkklocks') {
      await addDfkklocksData(fileData, upload_id)
    } else if (file_type == 'adl-erdk') {
      await addErdkData(fileData, upload_id)
    } else if (file_type == 'adl-etdz') {
      await addEtdzData(fileData, upload_id)
    } else if (file_type == 'adl-erch') {
      await addErchData(fileData, upload_id)
    } else if (file_type == 'adl-erchc') {
      await addErchcData(fileData, upload_id)
  } else {
    console.log('archivo desconocido', file_type)
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Tipo de archivo desconocido' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Operación exitosa' }),
  };

};


  module.exports.get = async (event, context) => {
    const result = await uploadFunctions.getUploads();
    console.log(result)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ uploads: result }),
    };

  };



  async function getExcelData(file_name, file_type) {
    try {
      // Nombre del bucket de S3 y la ruta del objeto
      const bucketName = 'abc-uploaded-files-dev';
      const objectKey = `uploads/adl/${file_type}/${file_name}`;

      // Configura los parámetros para obtener el objeto de S3
      const params = {
        Bucket: bucketName,
        Key: objectKey
      };

      // Obtiene el objeto de S3
      const data = await s3.getObject(params).promise();

      // Lee el contenido del objeto (archivo XLSX)
      const workbook = xlsx.read(data.Body, { type: 'buffer' });

      // Accede a la hoja de cálculo (supongamos que es la primera hoja)
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convierte la hoja de cálculo a un objeto JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      // Hacer algo con el contenido del archivo XLSX
      console.log('Contenido del archivo XLSX:', jsonData);

      return jsonData
    } catch (error) {
      console.error('Error al leer el archivo XLSX de S3:', error);
      return []
    }
  }


  async function addEanlhData(data, upload_id, day, month, year) {
    const eanlhFunctions = require('/opt/operations/adl_eanlh')

    const formatedData = data.map(obj => ({
      instalacion: obj['Instalación'],
      validoA: new Date(1899, 11, 30 + obj['Validez a']),
      validoDe: new Date(1899, 11, 30 + obj['Válido de']),
      tariftyp: obj['Tipo de tarifa'],
      claseCalculo: obj['Clase de cálculo'],
      unidadLectura: obj['Unidad de lectura'],
      id_cargas: upload_id,
    }));

    await eanlhFunctions.createMassive(formatedData)
    console.log(formatedData)
  }



  async function addBdEl31Data(data, upload_id) {
    const bdEl31Functions = require('/opt/operations/adl_bd_el31')

    const formatedData = data.map(obj => ({
      porcion: obj['Porción'],
      'unidad_ lectura': obj['Unidad de lectura'],
      instalacion: obj['Instalación'],
      id_interno_lect: obj['ID interno doc.lect.'],

      aparato: obj['Aparato'],
      equipo: obj['Equipo'],
      numerador: obj['Numerador'],
      unidad_medida_calc: obj['Unidad medida cálc.'],
      motiv_lectura: obj['Motiv.lectura'],

      asignacion_multiple: obj['Asignación múltiple'],
      clase_lectura: obj['Clase de lectura'],
      status_lectura: obj['Status de lectura'],
      valor_contador_leido: obj['Valor del contador leído'],
      fech_lectura: new Date(1899, 11, 30 + obj['Fe.lectura']),
      nota_lectura: obj['Nota de lectura'],
      enteros: obj['Enteros'],
      decimales: obj['Decimales'],
      id_carga: upload_id,

    }));

    await bdEl31Functions.createMassive(formatedData)
    console.log(formatedData)
  }

  async function addErdkData(data, upload_id) {
    const erdkFunctions = require('/opt/operations/adl_erdk')
    //new Date(1899, 11, 30 + obj['Fe.clave cálculo'])
    const formatedData = data.map(obj => ({
      nro_doc_impresion: obj['Nº doc.impresión'],
      importe: obj['Importe'],
      cuenta_contrato: obj['Cuenta contrato'],
      nro_documento_oficial: obj['Nº documento oficial'],
      fch_clave_calculo: obj['Fe.clave cálculo'],
      vencimiento_neto: new Date(1899, 11, 30 + obj['Vencimiento neto']),
      fch_documento: new Date(1899, 11, 30 + obj['Fecha de documento']),
      sin_liberacion: obj['Sin liberación'],
      documento_simulado: obj['Documento simulado'],
      doc_contabilizado: obj['Doc.contabilizado'],
      creado_por: obj['Creado por'],
      id_carga: upload_id
    }));

    await erdkFunctions.createMassive(formatedData)
    console.log(formatedData)
  }

  async function addDfkklocksData(data, upload_id) {
    const dfkklocksFunctions = require('/opt/operations/adl_dfkklocks')

    const formatedData = data.map(obj => ({
      cta_contrato: obj['Cuenta contrato'],
      de: new Date(1899, 11, 30 + obj['De']),
      a: new Date(1899, 11, 30 + obj['A']),
      proceso: obj['Proceso'],
      tpo_bloq: obj['Tp.bloq.'],
      motivo_bloqueo: obj['Motivo de bloqueo'],
      identificador: obj['Identificador'],
      objeto_bloqueo: obj['Objeto de bloqueo'],
      id_carga: upload_id,
    }));

    await dfkklocksFunctions.createMassive(formatedData)
    console.log(formatedData)
  }

  async function addEtdzData(data, upload_id) {
    const etdzFunctions = require('/opt/operations/adl_etdz')

    const formatedData = data.map(obj => ({
      equipo: obj['Equipo'],
      validez_a: new Date(1899, 11, 30 + obj['Validez a']),
      valido_de: new Date(1899, 11, 30 + obj['Válido de']),
      numerador: obj['Numerador'],
      nro_logico_numerador: obj['Nº lógico numerador'],
      tipo_de_sector: obj['Tipo de sector'],
      ident_numerador: obj['Ident.numerador'],
      factor_de_numerador: obj['Factor de numerador'],

      tipo_numerador: obj['Tipo de numerador'],
      num_ener_react_act: obj['Num.ener.react./act.'],
      um_lectura: obj['UM para lectura'],
      id_carga: upload_id,
    }));

    await etdzFunctions.createMassive(formatedData)
    console.log(formatedData)
  }

  async function addEverData(data, upload_id) {
    const everFunctions = require('/opt/operations/adl_ever')
    const formatedData = data.map(obj => ({
      cta_contrato: obj['Cuenta contrato'],
      modificado: new Date(1899, 11, 30 + obj['Modificado el']),
      motivo_bloqueo: obj['Motiv.bloq.cálculo'],
      fecha_alta: new Date(1899, 11, 30 + obj['Fecha de Alta']),
      fecha_baja: new Date(1899, 11, 30 + obj['Fecha de Baja']),
      id_carga: upload_id,
    }));

    await everFunctions.createMassive(formatedData)
    console.log(formatedData)
  }

  async function addEa05CalcData(data, upload_id) {
    const ea05CalcFunctions = require('/opt/operations/adl_ea05_calc')

    const formatedData = data.map(obj => ({
      cuenta_contrato: obj['Cuenta contrato'],
      verif_validez_calculo: obj['VerifValidezCálculo'],
      fch_calculo_planif: new Date(1899, 11, 30 + obj['Fe.cálculo planif.']),
      nro_doc_calc: obj['Nº documento cálculo'],
      id_carga: upload_id
    }));

    await ea05CalcFunctions.createMassive(formatedData)
    console.log(formatedData)
  }

  async function addEa05FactData(data, upload_id) {
    const ea05FactFunctions = require('/opt/operations/adl_ea05_fact')

    const formatedData = data.map(obj => ({
      cuenta_contrato: obj['Cuenta contrato'],
      verif_validez_factur: obj['VerifValidezFactur'],
      fch_documento: new Date(1899, 11, 30 + obj['Fecha de documento']),
      nro_documento: obj['Número de documento'],
      importe: obj['Importe'],
      porcion: obj['Porción'],
      id_carga: upload_id
    }));

    await ea05FactFunctions.createMassive(formatedData)
    console.log(formatedData)
  }

  async function addEttifnData(data, upload_id) {
    const ettifnFunctions = require('/opt/operations/adl_ettifn')
    const formatedData = data.map(obj => ({
      valido_de: new Date(1899, 11, 30 + obj['Válido de']),
      validez_a: new Date(1899, 11, 30 + obj['Validez a']),
      operando: obj['Operando'],
      valor_de_registro: obj['Valor de registro'],
      valor_a_calcular: obj['Valor a calcular'],
      importe: obj['Importe'],
      instalacion: obj['Instalación'],
      id_carga: upload_id
    }));

    await ettifnFunctions.createMassive(formatedData)
    console.log(formatedData)

  }

  async function addErchData(data, upload_id) {
    const erchFunctions = require('/opt/operations/adl_erch')
    const formatedData = data.map(obj => ({
      nro_doc_calc: obj['Nº documento cálculo'],
      cuenta_contrato: obj['Cuenta contrato'],
      inicio_per_calc: new Date(1899, 11, 30 + obj['Inicio per.cálculo']),
      fin_per_calc: new Date(1899, 11, 30 + obj['Fin período cálculo']),
      fecha_calc_planif: new Date(1899, 11, 30 + obj['Fe.cálculo planif.']),
      fecha_lect_planif: new Date(1899, 11, 30 + obj['Fe.lectura plan.']),
      porcion: obj['Porción'],
      unidad_lectura: obj['Unidad de lectura'],
      creado_el: new Date(1899, 11, 30 + obj['Creado el']),
      nro_doc_anual_ajus: obj['Nº doc.anul.ajuste'],
      fecha_clave_calc: obj['Fe.clave cálculo'],
      motivo_anulacion: obj['Motivo de anulación'],
      id_carga: upload_id
    }));
    await erchFunctions.createMassive(formatedData)
    console.log(formatedData)
  }

  async function addErchcData(data, upload_id) {
    const erchcFunctions = require('/opt/operations/adl_erchc')
    const formatedData = data.map(obj => ({
      nro_doc_impresion: obj['Nº doc.impresión'],
      nro_doc_calc: obj['Nº documento cálculo'],
      anulacion_ajuste: obj['Anulación de ajuste'],
      id_carga: upload_id
    }));

    await erchcFunctions.createMassive(formatedData)
    console.log(formatedData)
  }
}