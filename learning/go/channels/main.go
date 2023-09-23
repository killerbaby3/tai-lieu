package main

import (
	"fmt"
	"net/http"
	"time"
)

func main() {
	links := []string {
		"http://golang.org",
		"http://google.com",
		"http://stackoverflow.com",
		"http://amazon.com",
	}

	c:= make(chan string)

	for _, link := range links {
		go checkLink(link, c)
	}


	for l := range c {
		go func (link string)  {
			time.Sleep(5 * time.Second)
			checkLink(link, c)
		}(l)
	}

}

func checkLink(link string, c chan string)  {
	_, err := http.Get(link)
	if err != nil {
		fmt.Println(link,": error")
		c <- link
		return
	}

	fmt.Println(link,": Okkkkkk")
	c <- link

}