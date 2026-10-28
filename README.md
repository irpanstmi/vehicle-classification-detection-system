# Vehicle Classification Detection System

## About the Project
A web-based vehicle detection and classification system developed using Python, Flask, and YOLOv8. The application allows users to upload vehicle images and detect vehicles automatically, displaying detection results with bounding boxes and confidence scores.

## Features
- Upload vehicle images for detection
- Automatic vehicle detection and classification
- Display bounding boxes around detected vehicles
- Show confidence scores for detection results
- Display original and processed images

## Technologies Used
- Python
- Flask
- YOLOv8
- HTML
- CSS
- JavaScript

## Project Structure
```text
vehicle-classification-detection-system/
├── app.py
├── best.pt
├── requirements.txt
├── index.html
├── style.css
├── script.js
├── frame02561_png.rf.4c2835961765c256fecc9ec95d38998c.jpg
└── result_frame02561_png.rf.4c2835961765c256fecc9ec95d38998c.jpg
```

## Installation and Setup
1. Clone this repository:
   ```bash
   git clone YOUR_REPOSITORY_URL
   ```
2. Navigate to the project directory:
   ```bash
   cd vehicle-classification-detection-system
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Make sure the trained YOLOv8 model file `best.pt` is available in the expected location.
5. Run the application:
   ```bash
   python app.py
   ```
6. Open the local URL displayed in the terminal in your web browser.

## Project Objective
This project demonstrates the implementation of computer vision and deep learning techniques for vehicle detection and classification through a web-based application.

## Author
Information Systems Student
