const AWS = require('aws-sdk');
const adlrocessFunctions = require('/opt/operations/proceso_adl');

module.exports.createAdlProcess = async (event, context) => {
  console.log('Init', event)
  const uploadsFunctions = require('/opt/operations/adl_uploads');
  try {
    
    // Se pone la carga como procesando 
    await uploadsFunctions.changeAdlProcessStatus(event.id_carga, 'processing')
    const result = await adlrocessFunctions.processData(event.id_carga);
    await uploadsFunctions.changeAdlProcessStatus(event.id_carga, 'completed')
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: "se realizo el proceso" }),
    };
  } catch (error) {
        console.error('Error en la función Lambda:', error);
        await uploadsFunctions.changeAdlProcessStatus(event.id_carga, 'error')
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
          },
          body: JSON.stringify({ error: 'Error interno del servidor' }),
        };
    }
};

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
      const lambda = new AWS.Lambda();
      // Configura los parámetros para la invocación
      const params = {
          FunctionName: 'abc-back-prod-createAdlProcessFunction',
          InvocationType: 'Event', // Configura la invocación asíncrona
          Payload: JSON.stringify({ 
              id_carga: body.id_carga,
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
          body: JSON.stringify({ message: 'Operación exitosa, se envio a crear adl' }),
      };
  } catch (error) {
      console.error('Error en la función Lambda:', error);

      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error interno del servidor' }),
      };
  }
  
};

module.exports.deleteAdlProcess = async (event, context) => {
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
  
  const uploadsFunctions = require('/opt/operations/adl_uploads');
  try {
    
    // Se pone la carga como procesando 
    await uploadsFunctions.changeAdlProcessStatus(body.id_carga, 'deleting')
    const result = await adlProcessFunctions.deleteData(body.id_carga);
    await uploadsFunctions.changeAdlProcessStatus(body.id_carga, 'pending')
    console.log(result)
    console.log('fin1')
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: "se realizo el delete" }),
    };
  } catch (error) {
        console.error('Error en la función Lambda:', error);
        await uploadsFunctions.changeAdlProcessStatus(event.id_carga, 'error')
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error interno del servidor' }),
        };
    }
};