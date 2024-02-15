const AWS = require('aws-sdk');

module.exports.handler = async (event, context) => {
  const sts = new AWS.STS();

  try {
    const params = {
      RoleArn: 'arn:aws:iam::891377185682:role/UploadToS3',
      RoleSessionName: 'AssumeRoleSession',
    };

    const data = await sts.assumeRole(params).promise();
    console.log('Listo7')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({
        credentials: {
          accessKeyId: data.Credentials.AccessKeyId,
          secretAccessKey: data.Credentials.SecretAccessKey,
          sessionToken: data.Credentials.SessionToken,
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
