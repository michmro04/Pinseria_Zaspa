import os
from PIL import Image

# Ścieżka do Twojego folderu ze zdjęciami
input_folder = "."
max_size = (500, 500)

for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        img_path = os.path.join(input_folder, filename)
        with Image.open(img_path) as img:
            # Zachowuje proporcje i dopasowuje do maks 500x500
            img.thumbnail(max_size)
            output_name = os.path.splitext(filename)[0] + ".webp"
            img.save(os.path.join(input_folder, output_name), "WEBP", quality=80, optimize=True)
            print(f"✓ Utworzono: {output_name}")
            

print("Konwersja zakończona!")