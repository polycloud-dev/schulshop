package tools

import (
	"fmt"
	"net/smtp"
)

func SendEmail() {

	// Sender data.
	from := "tom@bexar.de"
	password := "Dl5co$d4Pl"

	// Receiver email address.
	to := []string{
		"heidenreichdd@gmial.com",
	}

	// smtp server configuration.
	smtpHost := "smtp.strato.de"
	smtpPort := "465"

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)

	body := "From:tom@bexar.de\n" +
			"To:heidenreichdd@gmail.com\n" +
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
