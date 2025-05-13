# tecnoven
 PROGRAMADOR BACKEND WEB FULL STACK JAVASCRIPTS.
/canal-monitor
│
├── /config               # Configuración general
│   └── database.js       # Configuración de Sequelize y SQLite
│   └── mailer.js         # Configuración de Nodemailer
│
├── /controllers          # Lógica del sistema
│   └── monitorController.js
│
├── /models               # Definición de modelos Sequelize
│   └── index.js
│   └── canal.js
│   └── alerta.js
│
├── /routes
│   └── monitorRoutes.js
│
├── /views                # Plantillas EJS
│   └── layout.ejs
│   └── index.ejs
│   └── alertas.ejs
│
├── /public               # Archivos estáticos
│   └── css/
│
├── /utils                # Funciones auxiliares
│   └── pingHelper.js
│
├── app.js                # Punto de entrada
├── package.json
└── .env
