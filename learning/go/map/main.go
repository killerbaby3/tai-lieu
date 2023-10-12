package main

import "fmt"

func main() {
	colors := map[string]string{
		"red":   "#aaaaa",
		"green": "#bbbbb",
	}

	printMap(colors)
}

func printMap(c map[string]string) {
	for color, hex := range c {
		fmt.Println(color, "->>>>", hex)
	}
}
