# Crossfit Tilt Alexa skill

Responds to Alexa requests such as:
* "ask crossfit tilt for today's workout"
* "get today's workout from crossfit tilt"
* "ask crossfit tilt for yesterday's workout in Sudbury"

Thanks to this [blog post](https://medium.com/northcoders/make-a-web-scraper-with-aws-lambda-and-the-serverless-framework-807d0f536d5f) for ideas about
Serverless & AWS Lambda functions.

### Installation instructions
AWS Lamdba functions run in node 0.6.10

To install required packages:
`npm install`

To run the handler, we use [Serverless](https://serverless.com/framework/docs/providers/aws/guide/intro/)

To run a handler locally:
`serverless invoke local --function getWodIntent`

We use Serverless' AWS deploy function. Make sure you have the environment variables set:
```
export AWS_SECRET_ACCESS_KEY
export AWS_ACCESS_KEY_ID
```

To deploy to AWS:
`serverless deploy`
