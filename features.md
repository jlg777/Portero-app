⭐ Si estuviera construyendo esta app yo seguiría este orden:

1️⃣ manejo de errores
2️⃣ timeout de llamada
3️⃣ estado de departamentos
4️⃣ limpiar chats terminados
5️⃣ mejorar panel del portero

-----------------------------------------------------------------------------
-------------------------------------------------------------------------

📂Api
- save-subscription.ts: 
    Este archivo es una función serverless de Vercel cuyo objetivo es:
    guardar la suscripción Web Push de un residente en Firestore.
    Esa suscripción luego se usa para enviar notificaciones cuando portería llama.
Ahora mismo guardas solo 1 dispositivo por departamento. feature ->manejar múltiples celulares por departamento sin perder suscripciones