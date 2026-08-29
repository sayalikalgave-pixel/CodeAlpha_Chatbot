from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()


# ==========================================
# GET GEMINI API KEY
# ==========================================

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY was not found. "
        "Please check your .env file."
    )


# ==========================================
# GEMINI CLIENT
# ==========================================

client = genai.Client(
    api_key=api_key
)


# ==========================================
# FLASK APP
# ==========================================

app = Flask(__name__)


# ==========================================
# HOME PAGE
# ==========================================

@app.route("/")
def home():

    return render_template("index.html")


# ==========================================
# CHAT API
# ==========================================

@app.route("/chat", methods=["POST"])
def chat():

    try:

        # --------------------------------------
        # GET USER MESSAGE
        # --------------------------------------

        user_message = request.form.get(
            "message",
            ""
        ).strip()


        # --------------------------------------
        # GET UPLOADED FILE
        # --------------------------------------

        uploaded_file = request.files.get("file")


        print("\n================================")
        print("NEW CHAT REQUEST")
        print("================================")

        print("Message:", user_message)


        if uploaded_file:

            print(
                "File:",
                uploaded_file.filename
            )

            print(
                "MIME:",
                uploaded_file.mimetype
            )

        else:

            print("File: None")


        # --------------------------------------
        # CHECK EMPTY REQUEST
        # --------------------------------------

        if not user_message and not uploaded_file:

            return jsonify({
                "reply": "Please enter a message or attach an image."
            }), 400


        # ======================================
        # TEXT ONLY
        # ======================================

        if not uploaded_file:

            response = client.models.generate_content(

                model="gemini-3.6-flash",

                contents=user_message

            )


        # ======================================
        # IMAGE + TEXT
        # ======================================

        else:

            # Read uploaded file
            file_bytes = uploaded_file.read()


            # Check that the file contains data
            if not file_bytes:

                return jsonify({
                    "reply": "The uploaded file is empty."
                }), 400


            # Check MIME type
            mime_type = uploaded_file.mimetype


            # Currently support images
            if not mime_type.startswith("image/"):

                return jsonify({
                    "reply": (
                        "Currently, CodeAlpha AI supports "
                        "image uploads. PDF and document "
                        "support will be added next."
                    )
                }), 400


            # Create Gemini image part
            image_part = types.Part.from_bytes(

                data=file_bytes,

                mime_type=mime_type

            )


            # Default question if user didn't type anything
            if not user_message:

                user_message = (
                    "Describe this image in detail "
                    "and explain what you can identify."
                )


            # Send image + question to Gemini
            response = client.models.generate_content(

                model="gemini-3.6-flash",

                contents=[
                    image_part,
                    user_message
                ]

            )


        # ======================================
        # GET GEMINI RESPONSE
        # ======================================

        reply = response.text


        if not reply:

            reply = "I couldn't generate a response."


        print("Gemini response received.")


        # ======================================
        # RETURN RESPONSE TO JAVASCRIPT
        # ======================================

        return jsonify({

            "reply": reply

        })


    # ==========================================
    # ERROR HANDLING
    # ==========================================

    except Exception as e:

        print("\n================================")
        print("GEMINI ERROR")
        print("================================")

        print(repr(e))

        print("================================\n")


        return jsonify({

            "reply": (
                "Sorry, something went wrong. "
                "Please check the Flask terminal."
            ),

            "error": str(e)

        }), 500


# ==========================================
# RUN FLASK
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )

