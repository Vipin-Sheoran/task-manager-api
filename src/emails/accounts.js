
const sgMail=require('@sendgrid/mail')
// const sendgridAPIkey='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'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'eche19061@rgipt.ac.in',
        subject:'thanks for joining in!',
        text:`Welcome to the app, ${name}.Let me know how you get along the app`
    })
}
const sendCancellationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'eche19061@rgipt.ac.in',
        subject:'Sorry to see you go!',
        text:`Goodbye, ${name}.Hope to see you soon.`
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}
