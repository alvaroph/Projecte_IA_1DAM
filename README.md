# 📌 Projecte IA 1DAM (amb Dockers)

Aquest projecte consisteix en una aplicació web que utilitza un **frontend amb Nginx** i un **backend en Node.js**, connectats mitjançant Docker. L'objectiu és proporcionar un sistema estructurat i escalable amb un proxy invers per gestionar les peticions al backend.

---

## 📁 Estructura del projecte

```
projecte_ia_1dam/
│── backend/            # Directori del backend en Node.js
│   ├── index.js        # Arxiu principal del servidor
│   ├── package.json    # Dependències i scripts
│   ├── Dockerfile      # Definició del contenidor Docker per al backend
│── frontend/           # Directori del frontend servit amb Nginx
│   ├── index.html      # Pàgina principal
│   ├── default.conf    # Configuració de Nginx
│   ├── Dockerfile      # Definició del contenidor Docker per al frontend
│── docker-compose.yml  # Configuració per aixecar els serveis amb Docker
```

---

## 🐳 Configuració Docker

El projecte es gestiona mitjançant Docker, amb dos contenidors:

- **Backend**: Aplicació en Node.js que escolta al port `3000`.
- **Frontend**: Servidor Nginx que actua com a proxy invers i serveix el frontend.

### **Dockerfile del Backend** (`backend/Dockerfile`)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```
Aquest contenidor executa un servidor Node.js amb `nodemon` per detectar canvis en el codi.

### **Dockerfile del Frontend** (`frontend/Dockerfile`)
```dockerfile
FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 80
```
Aquest contenidor serveix el frontend i fa de proxy invers per al backend.

### **Configuració de Nginx** (`frontend/default.conf`)
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
    }

    location /api/ {
        rewrite ^/api(/.*)$ $1 break;
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Aquest fitxer configura el proxy invers perquè redirigeixi `/api/` cap al backend.

---

## 🚀 Posada en marxa

### **1️⃣ Clonar el repositori**
```sh
git clone https://github.com/el_teu_usuari/projecte_ia_1dam.git
cd projecte_ia_1dam
```

### **2️⃣ Construir i aixecar els contenidors**
```sh
docker-compose up -d --build
```
Aquest comandament:
- Construeix les imatges del frontend i backend.
- Inicia els contenidors en mode **desatès (`-d`)**.

### **3️⃣ Accedir a l'aplicació**
- 🌍 **Frontend**: `http://localhost`
- 🚀 **Backend** (API): `http://localhost/api`
- 🔧 **Backend directe**: `http://localhost:3000`

---

## 🛠 Comandes útils

### 🔄 **Reiniciar els contenidors**
```sh
docker-compose restart
```

### 🛑 **Aturar i eliminar contenidors**
```sh
docker-compose down
```

### 🐳 **Veure els logs**
```sh
docker-compose logs -f
```

### 🏗 **Reconstruir imatges sense cache**
```sh
docker-compose build --no-cache
```

---

## 📌 Notes importants
✅ **Assegura't que Docker i Docker Compose estiguin instal·lats**. Si no els tens:
```sh
sudo apt update && sudo apt install docker docker-compose -y
```
✅ **Si tens problemes de permisos amb Docker**, afegeix el teu usuari al grup `docker`:
```sh
sudo usermod -aG docker $USER
newgrp docker
```

Amb això, ja pots treballar amb el projecte! 🚀🔥

