from flask import Flask, request, jsonify,render_template,send_file
from rembg import remove
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return render_template('index.html')

@app.route('/remove-background', methods=['POST'])
def remove_background():
    if request.method == 'POST':
        try:
            # Access uploaded image file
            image_file = request.files['imageFile']

            # Load image using PIL
            input_image = Image.open(image_file)

            # Convert image to binary data
            with io.BytesIO() as output:
                input_image.save(output, format="PNG")
                image_data = output.getvalue()

            # Remove background using rembg library
            output_image_data = remove(image_data)

            # Convert output image data back to PIL Image
            output_image = Image.open(io.BytesIO(output_image_data))

            # Save processed image temporarily
            output_filename = 'output.png'
            output_image.save(output_filename)

            # Return the image URL (relative to the server)
            return send_file(output_filename, mimetype='image/png'), 200
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({'error': 'Background removal failed'}), 500


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
