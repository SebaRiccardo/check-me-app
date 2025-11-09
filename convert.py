from PIL import Image, ImageDraw, ImageFont

# Abrir la imagen
image = Image.open("escuela.png")

# Crear un objeto para dibujar
draw = ImageDraw.Draw(image)

# Definir la fuente (ajusta la ruta si usas otra)
font = ImageFont.truetype("arial.ttf", 45)

# Escribir encima del texto actual o sobre un rectángulo blanco
# (ajusta las coordenadas según donde esté el texto "emotional")
draw.rectangle([(950, 380), (1300, 430)], fill="white")
draw.text((950, 380), "divertido", fill="black", font=font)

# Guardar el resultado
image.save("escuela_editada.png")
print("Imagen modificada guardada como escuela_editada.png")
