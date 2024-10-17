# Puppeteer on Lambda

This repository demonstrates how to run Puppeteer on AWS Lambda. In 2024, I successfully managed to run Puppeteer on Lambda using the Node.js 18.x runtime with the following libraries and versions:

- **@sparticuz/chromium**: ^119.0.2
- **aws-sdk**: ^2.1691.0
- **puppeteer-core**: ^21.11.0

## Use Case: PDF Generation

This project provides an example of how to generate a PDF from a URL using AWS services. When an API request is made, an AWS Lambda function is triggered, which runs Puppeteer to render the specified URL into a PDF. The resulting PDF is stored in an **S3 bucket**, and the function returns a **signed URL** for temporary access to download the file.

### AWS Services Involved:
- **Lambda**: Executes the code for rendering and generating the PDF.
- **S3**: Used for storing the generated PDF file.
- **API Gateway**: Exposes the Lambda function as a RESTful API.
- **IAM Roles**: Manage permissions for Lambda to interact with S3 and other services.

### Example Workflow:
1. A POST request is sent to the API Gateway endpoint, containing the URL to be converted.
2. The Lambda function is invoked, Puppeteer launches a headless Chromium instance to render the page and generate the PDF.
3. The PDF is uploaded to a predefined S3 bucket, and a signed URL is returned for accessing the file. A lifecycle policy is set on the S3 bucket to automatically delete old files, preventing unnecessary storage costs.

### Advantages of a serverless approach:
- **Automatic scaling**: Lambda functions automatically scale based on the workload, handling thousands of requests without manual intervention.
- **Cost efficiency**: With a pay-per-use model, you only pay for the compute time you consume, which is ideal for unpredictable or low-volume traffic.
- **Reduced operational overhead**: No need to manage or provision servers, allowing you to focus on writing code instead of handling infrastructure.
- **Built-in fault tolerance**: AWS Lambda automatically handles the replication and availability of your functions across multiple availability zones.
- **Integration with other AWS services**: Lambda seamlessly integrates with services like S3, API Gateway, DynamoDB, SQS and others, making it easy to build fully managed, scalable applications.

---

## How to Run

To run the project locally and deploy it to AWS, follow these steps:

### Prerequisites:
- Install [Node.js](https://nodejs.org/) 18.x
- Install [Serverless Framework](https://www.serverless.com/)

### Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/puppeteer-on-lambda.git
   cd puppeteer-on-lambda

2. Set the AWS credentials:

```bash
aws configure
```

3. Install the dependencies:
```bash
npm install
```

4. Deploy the service to AWS using Serverless:

```bash
serverless deploy
```

5. Test the deployed service using curl:

```bash
curl -X POST https://your-api-id.execute-api.your-region.amazonaws.com/dev/pdf \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

The response will include a signed URL to download the generated PDF.
