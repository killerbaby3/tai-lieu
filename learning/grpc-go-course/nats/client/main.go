// package main

// import (
// 	"fmt"
// 	"strconv"
// 	"time"
// )

// func f(n int) {
// 	for i := 0; i < 10; i++ {
// 		fmt.Println(n, ":", i)
// 		amt := time.Duration(1000)
// 		time.Sleep(time.Millisecond * amt)
// 	}
// }

// func pinger(c chan<- string) {
// 	for i := 0; ; i++ {
// 		c <- "ping-" + strconv.Itoa(i)
// 	}
// }

// func printer(c <-chan string) {
// 	for {
// 		fmt.Println(<-c)
// 		time.Sleep(time.Second * 1)
// 	}
// }

// func ponger(c chan string) {
// 	for i := 0; ; i++ {
// 		c <- "pong-" + strconv.Itoa(i)
// 	}
// }

// func main() {
// 	// for i := 0; i < 10; i++ {
// 	// 	go f(i)
// 	// }

// 	// var c chan string = make(chan string)

// 	// go pinger(c)
// 	// go ponger(c)
// 	// go printer(c)

// 	c1 := make(chan string, 20)
// 	c2 := make(chan string)

// 	go func() {
// 		for {
// 			c1 <- "from 1"
// 			time.Sleep(time.Second * 2)
// 		}
// 	}()

// 	go func() {
// 		for {
// 			c2 <- "from 2"
// 			time.Sleep(time.Second * 3)
// 		}
// 	}()

// 	go func() {
// 		for {
// 			select {
// 			case msg1 := <-c1:
// 				fmt.Println(msg1)
// 			case msg2 := <-c2:
// 				fmt.Println(msg2)
// 			case <-time.After(time.Second):
// 				fmt.Println("timeout")
// 			}

// 		}
// 	}()

// 	var input string
// 	fmt.Scanln(&input)
// }

package main

import (
	"fmt"
	"time"
)

func write(ch chan int) {
	for i := 0; i < 4; i++ {
		ch <- i
		fmt.Println("successfully wrote", i, "to ch")
	}
	close(ch)
}

func read(ch chan int) {
	for v := range ch {
		fmt.Println("read value", v, "from ch")
		time.Sleep(2 * time.Second)
	}
}

func main() {

	// creates capacity of 2
	ch := make(chan int, 2)
	go write(ch)
	time.Sleep(time.Second)
	go read(ch)
	// var input string
	// fmt.Scanln(&input)
}
