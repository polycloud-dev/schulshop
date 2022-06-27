package tools

import (
	"fmt"
	"net/smtp"
)

func SendEmail() {

	// TODO: use .env file

	// Sender data.
	from := ""
	password := ""

	// Receiver email address.
	to := []string{
		"",
	}

	// smtp server configuration.
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)

	body := "From:\n" +
		"To:\n" +
		"Subject:Hello!\n\n" +
		"This is a test email.\n"

	// Sending email.
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, []byte(body))
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Email Sent!")
}
