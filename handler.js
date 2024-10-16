const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports.generatePDF = async (event) => {
  const { url } = JSON.parse(event.body);
  const bucketName = process.env.PDF_BUCKET;
  const ttlSeconds = 60 * 60; // 1 hour

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    const timestamp = Date.now();
    const pdfKey = `pdfs/${timestamp}.pdf`;

    await S3.putObject({
      Bucket: bucketName,
      Key: pdfKey,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      ACL: 'private',
      Expires: new Date(Date.now() + ttlSeconds * 1000),
    }).promise();

    const pdfUrl = S3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: pdfKey,
      Expires: ttlSeconds,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ pdfUrl }),
    };
  } catch (error) {
    console.error('Errore nella generazione del PDF:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Errore durante la generazione del PDF', error: error.message }),
    };
  }
};
