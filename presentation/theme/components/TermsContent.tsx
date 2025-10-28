import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

type Props = {
  appName?: string;
  lastUpdated?: string; // si no lo pasas, se usa la fecha local del dispositivo
};

const TermsContent: React.FC<Props> = ({
  appName = 'LexyVoz',
  lastUpdated,
}) => {
  const updated = lastUpdated ?? new Date().toLocaleDateString();

  return (
    <View>
      <Text style={styles.h1}>Términos y Condiciones</Text>
      <Text style={styles.meta}>Última actualización: {updated}</Text>

      <Text style={styles.h2}>1. Aceptación</Text>
      <Text style={styles.p}>
        Al crear una cuenta o usar {appName} aceptas estos Términos y Condiciones.
        Podemos actualizarlos en cualquier momento; el uso continuo implica aceptación
        de la versión vigente.
      </Text>

      <Text style={styles.h2}>2. Uso permitido</Text>
      <Text style={styles.p}>
        Te comprometes a no usar el servicio de forma ilegal, abusiva, difamatoria,
        para spam, scraping o ingeniería inversa, ni a vulnerar derechos de terceros.
        No debes dañar, interferir ni intentar acceder sin autorización a sistemas o datos.
      </Text>

      <Text style={styles.h2}>3. Datos personales y privacidad</Text>
      <Text style={styles.p}>
        Tratamos tus datos conforme a nuestra Política de Privacidad. {appName} puede
        integrar servicios de terceros (por ejemplo, autocompletado de direcciones);
        su uso está sujeto también a las políticas de dichos terceros.
      </Text>

      <Text style={styles.h2}>4. Uso de tu voz y datos de audio</Text>
      <Text style={styles.p}>
        {appName} puede capturar, procesar y transcribir tu voz con el objetivo de
        prestar funcionalidades del servicio (p. ej., reconocimiento de voz, resolución
        de ejercicios, generación de respuestas o instrucciones).
      </Text>
      <Text style={styles.p}>
        Con tu consentimiento adicional (separado y revocable), {appName} puede utilizar
        tus datos de audio y transcripciones para <Text style={styles.bold}>entrenar y mejorar
        sus modelos de IA</Text>, incluidos procesos de etiquetado humano bajo acuerdos de
        confidencialidad.
      </Text>
      <Text style={styles.p}>
        Puedes retirar ese consentimiento de entrenamiento en cualquier momento desde
        la configuración o contactándonos, sin que ello afecte la licitud del tratamiento
        realizado con anterioridad.
      </Text>

      <Text style={styles.h2}>5. Conservación y seguridad</Text>
      <Text style={styles.p}>
        Conservamos tus datos el tiempo necesario para fines operativos, legales y de seguridad.
        Implementamos medidas técnicas y organizativas razonables para proteger tu información.
      </Text>

      <Text style={styles.h2}>6. Derechos del usuario</Text>
      <Text style={styles.p}>
        Según tu jurisdicción, puedes ejercer derechos de acceso, rectificación, eliminación,
        portabilidad y limitación del tratamiento. También puedes oponerte al uso con fines de
        entrenamiento. Para ejercerlos, utiliza los canales de contacto indicados más abajo.
      </Text>

      <Text style={styles.h2}>7. Propiedad intelectual</Text>
      <Text style={styles.p}>
        {appName} y su contenido nos pertenecen o se usan bajo licencia. Nos concedes una
        licencia limitada para procesar el contenido que subas según sea necesario
        para prestarte el servicio.
      </Text>

      <Text style={styles.h2}>8. Responsabilidad</Text>
      <Text style={styles.p}>
        El servicio se ofrece “tal cual” y “según disponibilidad”. No garantizamos ausencia
        de errores. {appName} y sus proveedores no se responsabilizan de daños indirectos,
        incidentales o consecuentes.
      </Text>

      <Text style={styles.h2}>9. Edad mínima</Text>
      <Text style={styles.p}>
        Debes tener la edad mínima legal aplicable en tu jurisdicción o contar con autorización
        de tus representantes legales.
      </Text>

      <Text style={styles.h2}>10. Terminación</Text>
      <Text style={styles.p}>
        Podemos suspender o cerrar cuentas que incumplan estos Términos. Puedes cancelar en cualquier
        momento. Algunas obligaciones pueden subsistir tras la terminación (p. ej., aspectos legales o de seguridad).
      </Text>

      <Text style={styles.h2}>11. Ley aplicable y jurisdicción</Text>
      <Text style={styles.p}>
        Estos Términos se rigen por las leyes de tu jurisdicción. Las disputas se resolverán en los
        tribunales competentes conforme a derecho.
      </Text>

      <Text style={styles.h2}>12. Contacto</Text>
      <Text style={styles.p}>
        Para consultas, solicitudes de derechos o quejas, contáctanos mediante los medios habilitados
        en la app o en nuestro sitio web.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  h1: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 6 },
  meta: { fontSize: 12, color: '#666', marginBottom: 10 },
  h2: { fontSize: 15, fontWeight: '700', color: '#333', marginTop: 10, marginBottom: 6 },
  p: { fontSize: 14, color: '#444', marginBottom: 8, lineHeight: 20 },
  bold: { fontWeight: '700' },
});

export default TermsContent;
