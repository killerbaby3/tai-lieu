package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	tgbotapi "gopkg.in/telegram-bot-api.v4"
)

func main() {

	bot, err := tgbotapi.NewBotAPI("6388957502:AAGgYPAZzxMG5hxL2INz4aWBK_wb9XZm240")
	if err != nil {
		panic(err)
	}

	bot.Debug = true

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := bot.GetUpdatesChan(u)

	if err != nil {
		log.Fatalf("Error get updates chan: %v\n", err)
	}

	for update := range updates {
		if update.Message == nil {
			continue
		}

		if update.Message != nil {

			if update.Message.Text != "" { // Text
				// log.Printf("[%s] %s", update.Message.From.UserName, update.Message.Text)
				pushJob(bot, &update, update.Message.Text, "text")
			}

			if update.Message.Voice != nil {
				fileConfig := tgbotapi.FileConfig{
					FileID: update.Message.Voice.FileID,
				}
				file, err := bot.GetFile(fileConfig)
				if err != nil {
					log.Println("Lỗi khi tải message:", err)
					continue
				}
				// Tải tệp âm thanh

				resp, err := bot.GetFileDirectURL(file.FileID)

				if err != nil {
					log.Fatalf("Error get file url: %v\n", err)
				}

				executablePath, _ := os.Getwd()
				audioFileName := filepath.Dir(executablePath) + "/voice/" + filepath.Base(file.FilePath)

				// download file audio
				err = downloadFile(audioFileName, resp)
				if err != nil {
					log.Fatalf("Error save file: %v\n", err)
				}

				fileInfo, err := os.Stat(audioFileName)

				if err != nil {
					// Lỗi xảy ra, có thể là do tệp không tồn tại hoặc lỗi trong quá trình truy cập
					log.Printf("Error check file "+audioFileName+": %v\n", err)
					return
				}

				// check file downloaded
				if fileInfo.Size() > 0 {
					wavFileToConvert := strings.Replace(audioFileName, ".oga", ".wav", 1)
					cmd := exec.Command("ffmpeg", "-i", audioFileName, wavFileToConvert)

					err := cmd.Run()

					if err != nil {
						log.Fatalf("Error convert file .oga to .wav: %v\n", err)
					}

					fmt.Printf("Convert ogg to wav success, file: %v\n", fileInfo.Name())

					fileConverted, err := os.Stat(wavFileToConvert)

					if err != nil {
						log.Printf("Error check file "+wavFileToConvert+": %v\n", err)
						return
					}

					if fileConverted.Size() > 0 {
						cmdPy := exec.Command("python3", "speech_to_text.py", wavFileToConvert)
						// Tạo một buffer để lưu kết quả đầu ra
						var out bytes.Buffer
						cmdPy.Stdout = &out

						// Chạy lệnh
						err = cmdPy.Run()

						if err != nil {
							fmt.Printf("Lỗi khi chạy tệp Python: %v\n", err)
							return
						}
						os.Remove(audioFileName)

						pushJob(bot, &update, out.String(), "voice")

					}
				} else {
					fmt.Println("File not be downloaded !")
				}
			}
		}
	}

}

// Hàm tải tệp
func downloadFile(filePath string, fileURL string) error {
	response, err := http.Get(fileURL)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = io.Copy(file, response.Body)
	return err
}

func pushJob(bot *tgbotapi.BotAPI, u *tgbotapi.Update, str_message string, push_type string) {
	var msg tgbotapi.MessageConfig
	switch push_type {
	case "text":
		msg = tgbotapi.NewMessage(u.Message.Chat.ID, "You has been input text: "+str_message)
	case "voice":
		msg = tgbotapi.NewMessage(u.Message.Chat.ID, "You has been spoken: "+str_message)
	}

	apiKey := "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"
	apiURL := "https://api.openai.com/v1/chat/completions"
	requestData := map[string]interface{}{
		"model": "gpt-3.5-turbo-16k",
		"messages": []map[string]string{
			{"role": "user", "content": "Messi la ai"},
		},
	}

	// Chuyển đổi dữ liệu request thành JSON
	jsonData, err := json.Marshal(requestData)
	if err != nil {
		fmt.Println("Lỗi khi chuyển đổi dữ liệu JSON:", err)
		return
	}

	// Tạo một HTTP POST request
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Lỗi khi tạo request:", err)
		return
	}

	// Thêm tiêu đề cần thiết cho request
	req.Header.Add("Authorization", "Bearer "+apiKey)
	req.Header.Add("Content-Type", "application/json")

	// Thực hiện request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Lỗi khi thực hiện request:", err)
		return
	}
	defer resp.Body.Close()

	// Đọc và hiển thị kết quả
	responseData, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		fmt.Println("Lỗi khi đọc kết quả:", err)
		return
	}

	fmt.Println("Kết quả từ API:")
	fmt.Println(string(responseData))

	msg.ReplyToMessageID = u.Message.MessageID
	bot.Send(msg)
}
