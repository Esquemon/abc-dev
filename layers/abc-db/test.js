// functions/my-function/handler.js
console.log("test")
const myLayerFunctions = require('./operations/proceso_adl');
console.log('no ha cagado')
async function get(){
    const result = await myLayerFunctions.processData(33);

    console.log(result)
}


get()
/*module.exports.handler = async (event, context) => {
  // Lógica de tu función Lambda
  const result = await myLayerFunctions.getPortions();
  console.log(result)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: result }),
  };
};*/