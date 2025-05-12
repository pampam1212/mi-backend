const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'comunicacioneshdclourdes@gmail.com',
    pass: 'xhpf wzkp xmqq mcwc'
  }
});

app.post('/send-email', (req, res) => {
  const { nombre, correo, areaCode, telefono, mensaje } = req.body;

  const telefonoInfo = telefono
    ? `Teléfono: (${areaCode}) ${telefono}\n`
    : 'Teléfono: (no ingresado)\n';

  // Mensaje para la organización
  const mailToOrg = {
    from: 'comunicacioneshdclourdes@gmail.com',
    to: 'comunicacioneshdclourdes@gmail.com',
    subject: '📥 Nuevo formulario recibido',
    text: `
📝 NUEVO FORMULARIO DE PARTICIPACIÓN:

Nombre: ${nombre}
Correo: ${correo}
${telefonoInfo}Mensaje:
${mensaje}

📌 Contactar a esta persona por Gmail o WhatsApp en cuanto sea posible.
    `.trim()
  };

  // Mensaje para el usuario (con HTML)
  const mailToUser = {
    from: 'comunicacioneshdclourdes@gmail.com',
    to: correo,
    subject: '🤝 ¡Gracias por contactarte con el Hogar de Cristo!',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #00cba9;">¡Gracias por escribirnos, ${nombre}!</h2>
        <p>Recibimos tu mensaje y pronto alguien de nuestro equipo se pondrá en contacto con vos.</p>
        <hr>
        <h4>📋 Datos que enviaste:</h4>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>${telefonoInfo.trim()}</strong></p>
        <p><strong>Mensaje:</strong><br>${mensaje}</p>
        <hr>
        <p>🙏 Gracias por querer ser parte del cambio. Estamos felices de que te sumes.</p>
        <p>Con cariño,<br><strong>Equipo del Hogar de Cristo</strong></p>
      </div>
    `
  };

  // Enviar los correos
  transporter.sendMail(mailToOrg, (errorOrg) => {
    if (errorOrg) {
      console.error('Error al enviar a la organización:', errorOrg);
      return res.status(500).send('Error al enviar el correo a la organización');
    }

    transporter.sendMail(mailToUser, (errorUser) => {
      if (errorUser) {
        console.error('Error al enviar al usuario:', errorUser);
        return res.status(500).send('Error al enviar el correo al usuario');
      }

      res.status(200).send('Correos enviados con éxito');
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
