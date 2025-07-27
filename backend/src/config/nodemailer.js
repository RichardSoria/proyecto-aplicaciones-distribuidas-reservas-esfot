import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    }
});

// Plantilla HTML general
const getMailTemplate = (title, content) => `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #ccc; padding: 24px; border-radius: 10px; background-color: #ffffff;">
    
    <!-- Encabezado principal -->
    <h2 style="color: #e72f2b; text-align: center; margin-bottom: 10px;">Sistema de Reservas - ESFOT</h2>
    <h3 style="color: #222; text-align: center; margin-bottom: 30px;">${title}</h3>
    
    <!-- Contenido dinámico -->
    <div style="font-size: 16px; color: #333; line-height: 1.6;">
      ${content}
    </div>

    <!-- Separador visual -->
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

    <!-- Pie institucional -->
    <div style="font-size: 14px; color: #555;">
      <p style="margin: 0 0 5px;">Saludos cordiales,</p>
      <p style="margin: 0;"><strong>Sistema de Reservas Académicas</strong><br>
      Escuela de Formación de Tecnólogos - ESFOT<br>
      Escuela Politécnica Nacional</p>
      <p style="color: #888; font-size: 13px; margin-top: 20px;">
        Este mensaje fue enviado automáticamente. Por favor, no responder a este correo.
      </p>
    </div>
  </div>
`;

const sendMailNewUser = async (email, password, name, lastName) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p>Tu cuenta en el <strong style="color: #0e4c71;">Sistema de Reservas Académicas</strong> ha sido creada exitosamente.</p>
      <p><strong style="color: #f8ad25;">Credenciales de acceso:</strong></p>
      <ul>
        <li><strong>Correo institucional:</strong> ${email}</li>
        <li><strong>Contraseña inicial:</strong> Esfot@${password}-1990</li>
      </ul>
      <p style="color: #e72f2b;"><strong>Te recomendamos cambiar tu contraseña al iniciar sesión.</strong></p>
      <p>
        Accede al sistema desde el siguiente enlace:<br>
        <a href="${process.env.URL_FRONTEND}/iniciar-sesion" style="color: #0e4c71;">👉 Ir al inicio de sesión</a>
      </p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Bienvenido al Sistema de Reservas - ESFOT',
            html: getMailTemplate('Cuenta creada exitosamente', content)
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

const sendMailUpdateUser = async (email, name, lastName) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p>Tu cuenta ha sido <strong style="color: #0e4c71;">actualizada correctamente</strong> en el Sistema de Reservas Académicas.</p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Actualización de cuenta - Sistema de Reservas ESFOT',
            html: getMailTemplate('Tu cuenta ha sido actualizada', content)
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

const sendMailEnableUser = async (email, name, lastName) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p>Tu cuenta ha sido <span style="color: #0e4c71;"><strong>activada correctamente</strong></span>. Ya puedes acceder al sistema.</p>
      <p>
        Inicia sesión desde:<br>
        <a href="${process.env.URL_FRONTEND}/iniciar-sesion" style="color: #0e4c71;">👉 Ir al inicio de sesión</a>
      </p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Cuenta activada - Sistema de Reservas ESFOT',
            html: getMailTemplate('Tu cuenta ha sido activada', content)
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

const sendMailDisableUser = async (email, name, lastName) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p style="color: #e72f2b;"><strong>Tu cuenta ha sido desactivada temporalmente.</strong></p>
      <p>Si consideras que se trata de un error, contacta al equipo de soporte institucional.</p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Cuenta desactivada - Sistema de Reservas ESFOT',
            html: getMailTemplate('Tu cuenta ha sido desactivada', content)
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

const sendMailRecoverPassword = async (email, token, name, lastName, resetTokenDate) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p>Hemos recibido una solicitud para <span style="color: #0e4c71;"><strong>restablecer tu contraseña</strong></span>.</p>
      <p>Puedes hacerlo desde el siguiente enlace:</p>
      <p style="margin: 15px 0;">
        <a href="${process.env.URL_FRONTEND}/enviar-contrasena-recuperacion/${token}" style="color: #0e4c71; font-weight: bold;">🔐 Restablecer contraseña</a>
      </p>
      <p>Este enlace es válido hasta las <strong style="color: #f8ad25;">${resetTokenDate}</strong>.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Recuperación de contraseña - Sistema de Reservas ESFOT',
            html: getMailTemplate('Restablecer contraseña', content)
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

const sendMailNewPassword = async (email, password, name, lastName) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p>Tu contraseña ha sido restablecida correctamente en el <strong style="color: #0e4c71;">Sistema de Reservas Académicas</strong>.</p>
      <p><strong style="color: #f8ad25;">Nueva contraseña:</strong> Esfot@${password}-1990</p>
      <p style="color: #e72f2b;"><strong>Te recomendamos cambiarla luego de iniciar sesión.</strong></p>
      <p>
        Accede desde:<br>
        <a href="${process.env.URL_FRONTEND}/iniciar-sesion" style="color: #0e4c71;">👉 Ir al inicio de sesión</a>
      </p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Nueva contraseña asignada - Sistema de Reservas ESFOT',
            html: getMailTemplate('Tu nueva contraseña', content)
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

const sendMailReservaUsuario = async (email, name, lastName, reservaData) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p>Tu solicitud de reserva ha sido registrada exitosamente en el <strong style="color: #0e4c71;">Sistema de Reservas Académicas</strong>.</p>
      <p><strong style="color: #f8ad25;">Detalles de la reserva:</strong></p>
      <ul>
        <li><strong>Espacio:</strong> ${reservaData.placeName}</li>
        <li><strong>Fecha:</strong> ${reservaData.reservationDate}</li>
        <li><strong>Horario:</strong> ${reservaData.startTime} - ${reservaData.endTime}</li>
        <li><strong>Motivo:</strong> ${reservaData.purpose}</li>
        <li><strong>Descripción:</strong> ${reservaData.description}</li>
      </ul>
      <p>La reserva se encuentra en estado <strong>"Pendiente"</strong> y será revisada por un administrador.</p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Reserva registrada - Sistema de Reservas ESFOT',
            html: getMailTemplate('Tu solicitud de reserva', content)
        });
    } catch (error) {
        console.error('Error al enviar correo al usuario:', error);
    }
};

const sendMailReservaAdmin = async (adminEmails, reservaData, userName, userRol) => {
    try {
        const content = `
      <p>Hola equipo administrativo,</p>
      <p>El <strong style="color: #f8ad25;">${userRol}</strong> <strong>${userName}</strong> ha registrado una nueva <strong style="color: #0e4c71;">solicitud de reserva</strong> que requiere revisión.</p>
      <p><strong style="color: #f8ad25;">Detalles:</strong></p>
      <ul>
        <li><strong>Rol del solicitante:</strong> ${userRol}</li>
        <li><strong>Espacio:</strong> ${reservaData.placeName}</li>
        <li><strong>Fecha:</strong> ${reservaData.reservationDate}</li>
        <li><strong>Horario:</strong> ${reservaData.startTime} - ${reservaData.endTime}</li>
        <li><strong>Motivo:</strong> ${reservaData.purpose}</li>
        <li><strong>Descripción:</strong> ${reservaData.description}</li>
      </ul>
      <p>
        Puedes gestionar esta reserva desde:<br>
        <a href="${process.env.URL_FRONTEND}/admin/reservas" style="color: #0e4c71;">👉 Ir al módulo de reservas</a>
      </p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: adminEmails,
            subject: 'Nueva solicitud de reserva pendiente',
            html: getMailTemplate('Revisión de reserva pendiente', content)
        });
    } catch (error) {
        console.error('Error al enviar correo a administradores:', error);
    }
};

const sendMailReservaAsignadaUsuario = async (email, name, lastName, reservaData) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p>Se te ha asignado una <strong style="color: #0e4c71 !important;">reserva académica</strong> en el sistema.</p>
      <p><strong style="color: #f8ad25 !important;">Detalles de la reserva:</strong></p>
      <ul>
        <li><strong>Espacio:</strong> ${reservaData.placeName}</li>
        <li><strong>Fecha:</strong> ${reservaData.reservationDate}</li>
        <li><strong>Horario:</strong> ${reservaData.startTime} - ${reservaData.endTime}</li>
        <li><strong>Motivo:</strong> ${reservaData.purpose}</li>
        <li><strong>Descripción:</strong> ${reservaData.description}</li>
      </ul>
      <p>La reserva se encuentra en estado <strong>"Pendiente"</strong> y será revisada por un administrador.</p>
      <p>Recuerda ingresar al sistema si necesitas más detalles.</p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Reserva asignada - Sistema de Reservas ESFOT',
            html: getMailTemplate('Se te ha asignado una reserva', content)
        });
    } catch (error) {
        console.error('Error al enviar correo al usuario asignado:', error);
    }
};

const sendMailReservaAsignadaAdmin = async (email, adminName, reservaData, userName, userRol) => {
    try {
        const content = `
      <p>Hola <strong>${adminName}</strong>,</p>
      <p>Has asignado una reserva al <strong style="color: #f8ad25 !important;">${userRol}</strong> <strong>${userName}</strong>.</p>
      <p><strong style="color: #f8ad25 !important;">Detalles:</strong></p>
      <ul>
        <li><strong>Espacio:</strong> ${reservaData.placeName}</li>
        <li><strong>Fecha:</strong> ${reservaData.reservationDate}</li>
        <li><strong>Horario:</strong> ${reservaData.startTime} - ${reservaData.endTime}</li>
        <li><strong>Motivo:</strong> ${reservaData.purpose}</li>
        <li><strong>Descripción:</strong> ${reservaData.description}</li>
      </ul>
      <p>Esta acción ha sido registrada correctamente en el sistema.</p>
      <p>
        Puedes gestionar esta reserva desde:<br>
        <a href="${process.env.URL_FRONTEND}/admin/reservas" style="color: #0e4c71;">👉 Ir al módulo de reservas</a>
      </p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Confirmación de asignación de reserva',
            html: getMailTemplate('Reserva asignada correctamente', content)
        });
    } catch (error) {
        console.error('Error al enviar correo al administrador:', error);
    }
};

const sendMailReservaAprobada = async (email, name, lastName, reservaData, motivo) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p>Tu <strong style="color: #0e4c71 !important;">solicitud de reserva</strong> ha sido <strong style="color: #0e4c71 !important;">aprobada</strong>.</p>
      <p><strong style="color: #f8ad25 !important;">Detalles de la reserva:</strong></p>
      <ul>
        <li><strong>Espacio:</strong> ${reservaData.placeName}</li>
        <li><strong>Fecha:</strong> ${reservaData.reservationDate}</li>
        <li><strong>Horario:</strong> ${reservaData.startTime} - ${reservaData.endTime}</li>
        <li><strong>Motivo:</strong> ${reservaData.purpose}</li>
        <li><strong>Descripción:</strong> ${reservaData.description}</li>
        <li><strong>Observación del administrador:</strong> ${motivo}</li>
      </ul>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Reserva aprobada - Sistema de Reservas ESFOT',
            html: getMailTemplate('Tu reserva ha sido aprobada', content)
        });
    } catch (error) {
        console.error('Error al enviar correo de aprobación:', error);
    }
};

const sendMailReservaRechazada = async (email, name, lastName, reservaData, motivo) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p>Lamentamos informarte que tu <strong style="color: #e72f2b !important;">solicitud de reserva ha sido rechazada</strong>.</p>
      <p><strong style="color: #f8ad25 !important;">Detalles:</strong></p>
      <ul>
        <li><strong>Espacio:</strong> ${reservaData.placeName}</li>
        <li><strong>Fecha:</strong> ${reservaData.reservationDate}</li>
        <li><strong>Horario:</strong> ${reservaData.startTime} - ${reservaData.endTime}</li>
        <li><strong>Motivo:</strong> ${reservaData.purpose}</li>
        <li><strong>Descripción:</strong> ${reservaData.description}</li>
        <li><strong>Razón del rechazo:</strong> <span style="color: #e72f2b !important;">${motivo}</span></li>
      </ul>
      <p>Si tienes dudas, puedes comunicarte con el equipo de soporte institucional.</p>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Reserva rechazada - Sistema de Reservas ESFOT',
            html: getMailTemplate('Tu reserva ha sido rechazada', content)
        });
    } catch (error) {
        console.error('Error al enviar correo de rechazo:', error);
    }
};

const sendMailReservaCanceladaUsuario = async (email, name, lastName, reservaData, motivo) => {
    try {
        const content = `
      <p>Hola <strong>${name} ${lastName}</strong>,</p>
      <p>Tu reserva ha sido <strong style="color: #e72f2b !important;">cancelada</strong> por el siguiente motivo:</p>
      <blockquote style="color: #e72f2b !important; border-left: 4px solid #e72f2b; padding-left: 10px;">
        ${motivo}
      </blockquote>
      <p><strong style="color: #f8ad25 !important;">Detalles de la reserva cancelada:</strong></p>
      <ul>
        <li><strong>Espacio:</strong> ${reservaData.placeName}</li>
        <li><strong>Fecha:</strong> ${reservaData.reservationDate}</li>
        <li><strong>Horario:</strong> ${reservaData.startTime} - ${reservaData.endTime}</li>
        <li><strong>Motivo:</strong> ${reservaData.purpose}</li>
        <li><strong>Descripción:</strong> ${reservaData.description}</li>
      </ul>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Reserva cancelada - Sistema de Reservas ESFOT',
            html: getMailTemplate('Reserva cancelada', content)
        });
    } catch (error) {
        console.error('Error al enviar correo de cancelación al usuario:', error);
    }
};

const sendMailReservaCanceladaAdmins = async (adminEmails, reservaData, userName, motivo) => {
    try {
        const content = `
      <p>Hola equipo administrativo,</p>
      <p>La reserva registrada por <strong>${userName}</strong> ha sido <strong style="color: #e72f2b !important;">cancelada</strong>.</p>
      <p><strong>Motivo de cancelación:</strong></p>
      <blockquote style="color: #e72f2b !important; border-left: 4px solid #e72f2b; padding-left: 10px;">
        ${motivo}
      </blockquote>
      <p><strong style="color: #f8ad25 !important;">Detalles de la reserva:</strong></p>
      <ul>
        <li><strong>Espacio:</strong> ${reservaData.placeName}</li>
        <li><strong>Fecha:</strong> ${reservaData.reservationDate}</li>
        <li><strong>Horario:</strong> ${reservaData.startTime} - ${reservaData.endTime}</li>
        <li><strong>Motivo:</strong> ${reservaData.purpose}</li>
        <li><strong>Descripción:</strong> ${reservaData.description}</li>
      </ul>
    `;
        await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: adminEmails, // array con los correos de los admins
            subject: 'Reserva cancelada en el sistema',
            html: getMailTemplate('Notificación de reserva cancelada', content)
        });
    } catch (error) {
        console.error('Error al enviar correo de cancelación a administradores:', error);
    }
};


export {
    sendMailNewUser,
    sendMailRecoverPassword,
    sendMailNewPassword,
    sendMailUpdateUser,
    sendMailEnableUser,
    sendMailDisableUser,
    sendMailReservaUsuario,
    sendMailReservaAdmin,
    sendMailReservaAsignadaUsuario,
    sendMailReservaAsignadaAdmin,
    sendMailReservaAprobada,
    sendMailReservaRechazada,
    sendMailReservaCanceladaUsuario,
    sendMailReservaCanceladaAdmins
};
