import Mailgun from 'mailgun-js'

// send Mail function
export const sendToMail = async ( domain:string, key:string, messageData: any ) => {
    const mailgun = new Mailgun({ 
          apiKey: key, 
          domain: domain 
        });

    await mailgun.messages().send( messageData, (error, body) => {
      if(error) {
        console.error(error)
      }
      console.log(body);
  });

    console.log("Mail sent", messageData);
}