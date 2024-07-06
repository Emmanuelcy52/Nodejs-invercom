<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificar si el campo 'nombre_inversor' está presente y no está vacío
    if (!empty($_POST['nombre_inversor'])) {
        $nombreInversor = $_POST['nombre_inversor'];

        // Procesar archivos subidos
        if (!empty($_FILES['imagen']['name'][0])) {
            foreach ($_FILES['imagen']['name'] as $key => $name) {
                $tmp_name = $_FILES['imagen']['tmp_name'][$key];
                $upload_dir = 'uploads/'; // Directorio donde se guardarán las imágenes
                $upload_file = $upload_dir . basename($name);

                if (move_uploaded_file($tmp_name, $upload_file)) {
                    echo "El archivo " . htmlspecialchars($name) . " ha sido subido correctamente.<br>";
                } else {
                    echo "Hubo un error subiendo el archivo " . htmlspecialchars($name) . ".<br>";
                }
            }
        }

        // Aquí puedes añadir código adicional para procesar y guardar otros datos del formulario
        echo "Nombre del inversor: " . htmlspecialchars($nombreInversor);
    } else {
        echo "El nombre del inversor es obligatorio.";
    }
} else {
    echo "Método de solicitud no permitido.";
}
?>
