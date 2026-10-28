"""
app.py — Sistem Deteksi Golongan Kendaraan Gerbang Tol
Backend Flask + YOLOv8 (TIDAK DIUBAH — hanya referensi struktur variabel)
Developed by Irfan Sentosa
"""

import os
import time
from flask import Flask, render_template, request, url_for
from ultralytics import YOLO
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER']  = os.path.join('static', 'uploads')
app.config['RESULTS_FOLDER'] = os.path.join('static', 'results')
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}

# ── Load model sekali saat startup ──────────────────────────
model = YOLO(os.path.join('best.pt'))


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def index():
    """
    Variabel yang dikirim ke template index.html:
      - result_image    : str  — nama file hasil deteksi di static/results/
      - original_image  : str  — nama file asli di static/uploads/
      - detections      : list — setiap item adalah dict:
                            { 'class_name': str, 'confidence': float (0–1) }
      - inference_time  : int  — waktu inferensi dalam milidetik
    """
    # Nilai default (halaman GET)
    result_image   = None
    original_image = None
    detections     = []
    inference_time = 0

    if request.method == 'POST':
        file = request.files.get('file')

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(upload_path)

            # ── Inferensi YOLO ──────────────────────────────
            t_start  = time.time()
            results  = model(upload_path)
            t_end    = time.time()
            inference_time = int((t_end - t_start) * 1000)

            # ── Simpan gambar hasil ─────────────────────────
            result_filename = 'result_' + filename
            result_path = os.path.join(app.config['RESULTS_FOLDER'], result_filename)
            for r in results:
                r.save(filename=result_path)

            # ── Kumpulkan deteksi ───────────────────────────
            for r in results:
                for box in r.boxes:
                    cls_id     = int(box.cls[0])
                    class_name = model.names[cls_id]
                    confidence = float(box.conf[0])
                    detections.append({
                        'class_name': class_name,
                        'confidence': confidence,
                    })

            result_image   = result_filename
            original_image = filename

    return render_template(
        'index.html',
        result_image   = result_image,
        original_image = original_image,
        detections     = detections,
        inference_time = inference_time,
    )


if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['RESULTS_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5001)