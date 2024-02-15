// functions/my-function/handler.js
console.log("test")
const myLayerFunctions = require('./operations/uploads');
console.log(myLayerFunctions)
async function get(){
    const result = await myLayerFunctions.getUploadsByFields();

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