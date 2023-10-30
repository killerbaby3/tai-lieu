package main

import (
	"fmt"
	"log"
	"os/exec"
)

func main() {
	// cmd := exec.Command("python3", "speech_to_text.py")
	cmd := exec.Command("ffmpeg", "-i", "file_21.oga", "file_21.wav")

	err := cmd.Run()

	if err != nil {
		log.Fatalf("Error: %v\n", err)
	}
	fmt.Printf("Convert ogg to wav success")
}
