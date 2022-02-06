# Schulshop

## Setup AWS
- AWS Instance starten
- Öffentliche IPv4-DNS kopieren
- SSH in Instance
`ssh -i "{PATH/TO/KEYPAR.pem}" {Öffentliche IPv4-DNS}`

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
docker-compose up --build
```

---

## Stoppen
```sh
docker-compose down
```

---

## Aktualisieren
```sh
git pull
docker-compose down
docker-compose up --build
```