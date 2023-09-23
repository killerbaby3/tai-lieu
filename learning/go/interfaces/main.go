package main
import (
	"fmt"
	"os"
	"io"
)
type bot interface {
	getGreeting() string
}
type englishBot struct {
	
}

type spanishBot struct {
	
}

func main() {
	eb := englishBot{}
	sb := spanishBot{}

	printGreeting(eb)
	printGreeting(sb)

	f,err := os.Open(os.Args[1])

	if err != nil {
		fmt.Println("Error: ",err)
		os.Exit(1);
	}
	io.Copy(os.Stdout, f)
}

func printGreeting(b bot)  {
	fmt.Println(b.getGreeting())
}

func (englishBot) getGreeting() string  {
	return "aaaaaaaaaaa"
}

func (spanishBot) getGreeting() string  {
	return "bbbbbbbbbbb"
}