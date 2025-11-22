const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const xlsx = require('xlsx');

const uploadFunctions = require('/opt/operations/uploads');


module.exports.handler = async (event, context) => {
    console.log('Init', event)
    let body = event.body
    try {
        if(event.isBase64Encoded){
            const decodedString = Buffer.from(body, 'base64').toString('utf-8');
            body = JSON.parse(decodedString);
            console.log(body)
        }else{
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
        const {portion, day, month, year, file_name, file_type} = body

        if(file_type != 'regularizados'){
            const uploads = await uploadFunctions.getUploadsByFields(portion, day, month, year)

            if(uploads.length == 0){
                const upload = await uploadFunctions.createUpload(portion, day, month, year)
                upload_id = upload.id
            }else{
                upload_id = uploads[0].id
            }
        }
        

        const lambda = new AWS.Lambda();

        // Configura los parámetros para la invocación
        const params = {
            FunctionName: 'abc-back-dev-processFileFunction',
            InvocationType: 'Event', // Configura la invocación asíncrona
            Payload: JSON.stringify({ 
                portion,
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
    const { portion, day, month, year, upload_id, file_name, file_type } = event
    const excel_files = ['eanlh', 'emma-ea38', 'emma-ea26', 'ever', 'ea05-calc', 'ea05-fact', 'dfkklocks', 'erdk', 'regularizados']
    const txt_files = ['tli', 'tlo', 'rechazo-tlo']

    let fileData = []
    if (excel_files.indexOf(file_type) != -1 ){
        fileData = await getExcelData(file_name, file_type)
        if (file_type == 'eanlh'){
            await addEanlhData(fileData, portion, upload_id, day, month, year)
        }else if (file_type == 'emma-ea38'){
            await addEmmaEa38Data(fileData, portion, upload_id)
        }else if (file_type == 'emma-ea26'){
            await addEmmaEa26Data(fileData, portion, upload_id)
        }else if (file_type == 'ea05-calc'){
            await addEa05CalcData(fileData, portion, upload_id)
        }else if (file_type == 'ea05-fact'){
            await addEa05FactData(fileData, portion, upload_id)
        }else if (file_type == 'ever'){
            await addEverData(fileData, portion, upload_id)
        }else if (file_type == 'dfkklocks'){
            await addDfkklocksData(fileData, portion, upload_id)
        }else if (file_type == 'erdk'){
            await addErdkData(fileData, portion, upload_id)
        }else if (file_type == 'regularizados'){
            await addRegularizadosData(fileData)
        }
    }else if (txt_files.indexOf(file_type) != -1 ){
        fileData = await getTxtData(portion, day, month, upload_id, file_name, file_type)
        if (file_type == 'tli'){
            await addTliData(fileData, portion, upload_id)
        }else if (file_type == 'tlo'){
            await addTloData(fileData, portion, upload_id)
        }else if (file_type == 'rechazo-tlo'){
            await addRechazoTloData(fileData, portion, upload_id)
        }
    }else{
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

function getMonthNumber(month){
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return months.indexOf(month) + 1
}

async function getExcelData(file_name, file_type ){
    try {
        // Nombre del bucket de S3 y la ruta del objeto
        const bucketName = 'abc-uploaded-files-dev';
        const objectKey = `uploads/${file_type}/${file_name}`;
    
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
    
        return  jsonData
      } catch (error) {
        console.error('Error al leer el archivo XLSX de S3:', error);
        return []
      }
}

async function getTxtData(portion, day, month, upload_id, file_name, file_type ){
    try {
        // Nombre del bucket de S3 y la ruta del objeto
        const bucketName = 'abc-uploaded-files-dev';
        const objectKey = `uploads/${file_type}/${file_name}`;
    
        // Configura los parámetros para obtener el objeto de S3
        const params = {
          Bucket: bucketName,
          Key: objectKey
        };
    
        // Obtiene el objeto de S3
        const data = await s3.getObject(params).promise();
    
        // Lee el contenido del objeto (archivo XLSX)
        // Convertir los datos de Buffer a cadena de texto
        const contenidoTexto = data.Body.toString('utf-8');

        // Transformar el texto a objeto JSON (puedes ajustar este paso según la estructura de tus datos)
        const jsonData = transformarATextoJSON(contenidoTexto);

        //console.log('Datos transformados:', jsonData);
    
        return  jsonData
      } catch (error) {
        console.error('Error al leer el archivo txt de S3:', error);
        return []
      }
}

function transformarATextoJSON(texto) {
    // Ejemplo: supongamos que tus datos son líneas de texto, uno por uno
    const lineas = texto.split('\n');
    const datosJSON = lineas.map(linea => {
      return { dato: linea.trim() };
    });
  
    return datosJSON;
}

async function addEanlhData(data, portion, upload_id, day, month, year){
    const eanlhFunctions = require('/opt/operations/eanlh')

    // TODO: ver fecha de creacion y de ejecucion
    const formatedData = data.map(obj => ({
        instalacion: obj.ANLAGE,
        bis: new Date(1899, 11, 30 + obj.BIS),
        tariftyp: obj.TARIFTYP,
        ableinh: obj.ABLEINH,
        porcion: portion ,
        id_cargas: upload_id,
        fecha_creacion: `${year}-${month}-${day}`
      }));

      await eanlhFunctions.createMassiveEanlh(formatedData)
      console.log(formatedData)
}



async function addRegularizadosData(data){
    const regularizadosFunctions = require('/opt/operations/regularizados')

    const formatedData = data.map(obj => ({
        instalacion: obj['instalacion'],
        porcion: obj['porcion'],
        ano: obj['ano'],
        mes: obj['mes'],
      }));

      await regularizadosFunctions.createMassiveRegularizados(formatedData)
      console.log(formatedData)
}

async function addErdkData(data, portion, upload_id){
    const erdkFunctions = require('/opt/operations/erdk')

    const formatedData = data.map(obj => ({
        instalacion: obj['Cuenta contrato'],
        fecha_clave: new Date(1899, 11, 30 + obj['Fe.clave cálculo']),
        importe: obj['Importe'],
        nro_doc_oficial: obj['Nº documento oficial'],
        vencimiento_neto: new Date(1899, 11, 30 + obj['Vencimiento neto']),
        fecha_documento: new Date(1899, 11, 30 + obj['Fecha de documento']),
        creado_por: obj['Creado por'],
        cuenta_fact_col: obj['Cuenta fact.colect.'],
        porcion: portion ,
        fecha_clave: obj['Fe.clave cálculo'],
        id_cargas: upload_id
      }));

      await erdkFunctions.createMassiveErdk(formatedData)
      console.log(formatedData)
}

async function addDfkklocksData(data, portion, upload_id){
    const dfkklocksFunctions = require('/opt/operations/dfkklocks')
    const blockMotiveFunctions = require('/opt/operations/blockMotives')
    const blockDatesFunctions = require('/opt/operations/blockDates')

    const motives = await blockMotiveFunctions.getBlockMotives()
    const block_dates = await blockDatesFunctions.getBlockDates()
    
    console.log('block dates', block_dates)
    const formatedData = data.map(obj => {
        const fecha = new Date(1899, 11, 30 + obj['A'])
        const motive = motives.find(motive => motive.code ===  obj['Motivo de bloqueo']);
        const año = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');

        // Formatea la fecha según tus necesidades
        const fechaFormateada = `${año}-${mes}-${dia}`;

        const block_date = block_dates.find(block_date => block_date.fecha === fechaFormateada );
        let block = null
        let sub_category = null
        if(block_date){
            block = `Bloqueo_${block_date.codigo}` 
            sub_category = block_date.codigo
        }else{
            block = motive ?  motive.description : ''
        }
        const motive_id = motive ? motive.id :  null
        const motive_description = motive ? motive.description :  null
        
      
        return {
            instalacion: obj['Cuenta contrato'],
            motivo_bloqueo_id: motive_id,
            bloqueo: obj['Tp.bloq.'],
            identificador: obj['Caract.determin.cta.'],
            id_cargas: upload_id,
            bloqueo: block,
            sub_clasificacion: sub_category,
            identificador: motive_description
        }
        
      });

      await dfkklocksFunctions.createMassiveDfkklocks(formatedData)
      console.log(formatedData)
}

async function addEverData(data, portion, upload_id){
    const everFunctions = require('/opt/operations/ever')
    const societyFunctions = require('/opt/operations/society')
    const societies = await societyFunctions.getSocieties();
    const formatedData = data.map( obj => {
        const society = societies.find(society => society.codigo ===  obj['Sociedad']);
        return {
            instalacion: obj['Instalación'],
            fecha_alta: new Date(1899, 11, 30 + obj['Fecha de alta']),
            contrato: obj['Contrato'],
            caract_determ_cta: obj['Caract.determin.cta.'],
            grupo_verificacion: obj['Gr.verif.apart.cálc.'] ,
            imputacion_co: obj['Imputación CO'] ,
            cuenta_contrato: obj['Cuenta contrato'] ,
            fecha_baja: new Date(1899, 11, 30 + obj['Fecha de baja']),
            id_cargas: upload_id,
            id_sociedad: society.id
        }
      });

      await everFunctions.createMassiveEver(formatedData)
      console.log(formatedData)
}

async function addEa05CalcData(data, portion, upload_id){
    const ea05CalcFunctions = require('/opt/operations/ea05_calc')

    const formatedData = data.map(obj => ({
        instalacion: obj['Cuenta contrato'],
        validador_facturacion: obj['VerifValidezCálculo'],
        fecha_calculo:  new Date(1899, 11, 30 +  obj['Fe.cálculo planif.']),
        nro_documento: obj['Nº documento cálculo'],
        id_cargas: upload_id
      }));

      await ea05CalcFunctions.createMassiveEa05Calc(formatedData)
      console.log(formatedData)
}

async function addEa05FactData(data, portion, upload_id){
    const ea05FactFunctions = require('/opt/operations/ea05_fact')

    const formatedData = data.map(obj => ({
        instalacion: obj['Cuenta contrato'],
        validador_facturacion: obj['VerifValidezFactur'],
        fecha_calculo: new Date(1899, 11, 30 + obj['Fecha de documento']) ,
        nro_documento: obj['Número de documento'],
        importe: obj['Importe'],
        id_cargas: upload_id
      }));

      await ea05FactFunctions.createMassiveEa05Fact(formatedData)
      console.log(formatedData)
}

async function addEmmaEa38Data(data, portion, upload_id){
    const emmaEa38Functions = require('/opt/operations/emmaEa38')
    const clasificationFunctions = require('/opt/operations/clasification')

    const clasifications = await clasificationFunctions.getClasifications()
    //TODO: ver el id de la clasificacion
    const formatedData = data.map(obj => {
        const clasification_code = `${obj['Clase mensaje']}${obj['Nº mensaje']}`
        //console.log(`clasification_code: ${clasification_code}`)
        const clasification = clasifications.find(clasification => clasification.codigo === clasification_code );
        //console.log('clasification', clasification)
        const id_clasificacion = clasification ? clasification.id : ""
        return{
            instalacion: obj['Clave del objeto'],
            tipo_mensaje: obj['Tipo mensaje'],
            clase_mensaje: obj['Clase mensaje'],
            nro_mensaje: obj['Nº mensaje'],
            mensaje: obj['Texto de mensaje'] ,
            id_cargas: upload_id,
            id_clasificacion
        }
      });

      const nuevoArreglo = formatedData.filter(objeto => objeto.id_clasificacion && objeto.id_clasificacion !== '');


      await emmaEa38Functions.createMassiveEmmaEa38(nuevoArreglo)
      console.log(nuevoArreglo)
}

async function addEmmaEa26Data(data, portion, upload_id){
    const emmaEa26Functions = require('/opt/operations/emmaEa26')
    const clasificationFunctions = require('/opt/operations/clasification')

    const clasifications = await clasificationFunctions.getClasifications()
    //TODO: ver el id de la clasificacion
    const formatedData = data.map(obj => {
        const clasification_code = `${obj['Clase mensaje']}${obj['Nº mensaje']}`
        //console.log(`clasification_code: ${clasification_code}`)
        const clasification = clasifications.find(clasification => clasification.codigo === clasification_code );
        //console.log('clasification', clasification)
        const id_clasificacion = clasification ? clasification.id : ""
        return{
            instalacion: obj['Clave del objeto'],
            tipo_mensaje: obj['Tipo mensaje'],
            clase_mensaje: obj['Clase mensaje'],
            nro_mensaje: obj['Nº mensaje'],
            mensaje: obj['Texto de mensaje'] ,
            id_cargas: upload_id,
            id_clasificacion
        }
      });

      const nuevoArreglo = formatedData.filter(objeto => objeto.id_clasificacion && objeto.id_clasificacion !== '');


      await emmaEa26Functions.createMassiveEmmaEa26(nuevoArreglo)
      console.log('datos a insertar', nuevoArreglo)
}

async function addTliData(data, portion, upload_id){
    const tliFunctions = require('/opt/operations/tli')
    const formatedData = data.map(cadena => {
        const coincidencias = cadena.dato.match(/([A-Z]+\d+E\d)(\d+)/);
      
        if (coincidencias) {
          const codigo = coincidencias[1]; 
          const instalacion = coincidencias[2]; 
      
          return { 
            codigo,
            instalacion,
            id_cargas: upload_id
           };
        } 
    });
    //console.log('formatedData', formatedData)
    await tliFunctions.createMassiveTli(formatedData)

  
}

async function addTloData(data, portion, upload_id){
    const tloFunctions = require('/opt/operations/tlo')
    let count = 0
    const formatedData = data.map(cadena => {
        if (count == 0){
            count++
        }else{
            const coincidencias = cadena.dato.match(/([A-Z]+\d+E\d)(\d+)/);
        
            if (coincidencias) {
            const pod = coincidencias[1]; 
            const instalacion = coincidencias[2]; 
        
            return { 
                pod,
                instalacion,
                id_cargas: upload_id
            };
            } 
        }
        
    });
    //console.log('formatedData', formatedData)
    await tloFunctions.createMassiveTlo(formatedData)
}

async function addRechazoTloData(data, portion, upload_id){
    const rechazoTloFunctions = require('/opt/operations/rechazoTlo')
    let count = 0
    const formatedData = data.map(cadena => {
        if (count == 0){
            count++
        }else{
            const coincidencias = cadena.dato.match(/([A-Z]+\d+E\d)(\d+)/);
        
            if (coincidencias) {
            const pod = coincidencias[1]; 
            const instalacion = coincidencias[2]; 
        
            return { 
                pod,
                instalacion,
                id_cargas: upload_id
            };
            } 
        }
        
    });
    //console.log('formatedData', formatedData)
    await rechazoTloFunctions.createMassiveRechazoTlo(formatedData)
}

function formatDate(date){
    console.log(date)
    const [dia, mes, anio] = date.split('/');

    // Formatear la fecha en el nuevo formato YYYY-MM-DD
    return `${anio}-${mes}-${dia}`;
}