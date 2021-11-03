# Introducción a la página web
## ¿De que va la web?.
La web consiste en un gestor de reservas de clases, la funcionalidad principal es que los usuarios, previa identificación del gimnasio en el que están inscritos, puedan reservar sus clases para entrenar, teniendo en cuenta su cuota (cuantas clases mensuales pagan). 
El usuario tendrá sus datos identificativos: id, nombre, apellidos, tlfn, email, contraseña y cuota.
Las clases tendrán aforo máximo y únicamente el usuario no podrá efectuar la reserva si las clases están completas. 
Los gimnasios también tendrán acceso a quien ha reservado sus clases, y podrán ver en todo momento todos los usuarios que están inscritos actualmente en el gimnasio. Cada gimnasio tendrá unas clases específicas. Cada gimnasio tendrá su id, nombre, dirección, logo, bonos disponibles, entrenadores y clases.

## Descripción funcional de la aplicación
¿qué se puede hacer?
-	A nivel de usuario
    1. Crear nuevo usuario (que estará vinculado con un gimnasio)introduciendo sus datos personales y asociarle la cuota pagada (dará lugar al número de clases). Dentro de las clases tendrá derecho a cualquiera de sus modalidades. ❌
    2. Ver sus clases. ❌
    3.	Reservar una nueva clase. ❌
    4.	Modificar reservas. ❌
    5.	Cancelar reservas. ❌
-	Clases
    1.	Contendrán el id, el tipo de la clase (tacfit, entrenamiento personal, entrenamiento en grupo) la fecha y hora, los alumnos inscritos (llevara el id de cada alumno), y el máximo de alumnos. También podría hacer que cada entrenador estuviera asociado a una clase. (No es del todo realista). 
    2.	Se podrá reservar clases a una semana vista. ❌
    3.	Tendremos un listado al que podrán acceder usuarios y gimnasios, de todas las reservas que hay para el día / semana. ❌
-	A nivel de gimnasio.
    1. Creación gimnasio. Cada gimnasio tendrá su id, el nombre del centro, la dirección, el logo, un array con los entrenadores [nombre0, nombre1] un array u objeto con las distintas cuotas que ofrece el gimnasio (ej, cuota1 { precio : 55, clases : 8};) y el tipo de las clases que va a ofrecer: (tacfit, entrenamiento en grupo, entrenamiento personal). ❌
    2.	Los gimnasios podrán ver todos los usuarios activos en su centro. ❌
    3.	Los gimnasios podrán ver los usuarios listados por cuota (cuanto pagan y cuantas clases tienen) ❌
    4.	Los gimnasios podrán ver las reservas totales, además de las reservas por cada uno de sus TIPOS de clase. ❌

![ScreenShot](../GestorReservas.png)
 
