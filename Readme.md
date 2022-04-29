# Schulshop

## Setup AWS
- AWS Instance starten
- Öffentliche IPv4-DNS kopieren
- SSH in Instance
`ssh -i "{PATH/TO/KEYPAR.pem}" {AWS Nutzer}@{Öffentliche IPv4-DNS}`

---

## Installieren
```sh
sudo yum install git -y
git clone https://github.com/polycloud-dev/schulshop.git
cd schulshop
sh install.sh
```
Wenn etwas ähnliches wie `Docker Compose version v*.*.*` in der Konsole zu sehen ist, war die Installation erfolgreich.

---

## Starten
```sh
sh start.sh
```

---

## Stoppen
```sh
sh stop.sh
```

---

## Aktualisieren
```sh
sh update.sh
```

---

## Attach
```sh
sh attach.sh
```

--- 

## Database bearbeiten
Nachdem die Datenbank neugestartet wurde, kann es bis zu 10min dauern, bis die Änderungen zu sehen sind.
Wenn Datenbankfehler aufkommen, kann es sein, dass die Daten fehlerhaft sind.
```sh
cd database
nano data.json
# (wenn das JSON fehlerhaft ist oder Einträge fehlen, kann es sein, dass ein Datenbankfehler kommt)
# zum Speichern (Strg + s) und dann (Strg + x) drücken
cd ../
```