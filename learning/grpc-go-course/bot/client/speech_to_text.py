import speech_recognition as sr
import sys
# Tạo một recognizer
recognizer = sr.Recognizer()

# Đọc tệp âm thanh .wav
audio_file = sys.argv[1]

with sr.AudioFile(audio_file) as source:
    # Sử dụng recognizer để chuyển đổi âm thanh thành văn bản
    audio_data = recognizer.record(source)
    try:
        # Sử dụng Google Web Speech API để chuyển đổi âm thanh thành văn bản
        text = recognizer.recognize_google(audio_data, language="vi-VN")
        print(text)
    except sr.UnknownValueError:
        print("Không thể xác định văn bản.")
    except sr.RequestError as e:
        print(f"Lỗi truy cập API: {e}")