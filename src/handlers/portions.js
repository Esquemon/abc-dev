const portionFunctions = require('/opt/operations/portions');

module.exports.handler = async (event, context) => {
  const result = await portionFunctions.getPortions();
  console.log(result)
  console.log('fin1')
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
    body: JSON.stringify({ portions: result }),
  };
};