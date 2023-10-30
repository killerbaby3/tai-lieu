# Import the required module for text 
# to speech conversion 
from gtts import gTTS 
import sys
# This module is imported so that we can 
# play the converted audio 
# import os 

# The text that you want to convert to audio 
# mytext = sys.argv[1]

with open('test.txt') as f:
    content = f.read()
# Language in which you want to convert 
language = 'vi'

# Passing the text and language to the engine, 
# here we have marked slow=False. Which tells 
# the module that the converted audio should 
# have a high speed 
obj = gTTS(text=content, lang=language, slow=False) 

# Saving the converted audio in a mp3 file named 
# welcome 
obj.save("welcome.wav") 

# Playing the converted file 
# os.system("mpg321 welcome.mp3") 
