using System.Diagnostics;
using System.Net;
using System.Net.Mail;
using System.Runtime.Serialization;
using System.Threading.Tasks;

using RazorEngine;

namespace GiftKnacksProject.Api.Dao.Emails.Mailers
{ 
    public class UserMailer :  IUserMailer 	
	{
		public UserMailer()
		{
			
		}
		
        public Task ConfirmEmail(string email,string code)
        {
             string template =
              @"<html>
                  <head>
                    <title>Hello @Model.Email</title>
                  </head>
                  <body>
                    Email: @Model.Url
                  </body>
                </html>";
           
          var result=Razor.Parse(template, new {Email = email, Url = code});
          return SendEmail("dima@mail.ru",email,"Valid Acc",result,true);
        }

       

        private  Task SendEmail(string from, string to, string subject, string body, bool isHtml)
        {
            SmtpClient mailClient = new SmtpClient("smtp.sendgrid.net");
            mailClient.Credentials = new NetworkCredential("Dr.Norton", "rianon1990");

            MailMessage message = new MailMessage();
         
                message.From = new MailAddress(from);
            

            message.To.Add(new MailAddress(to));

            

            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = isHtml;

            mailClient.EnableSsl = true;
            return mailClient.SendMailAsync(message);
        }
    }

  
}