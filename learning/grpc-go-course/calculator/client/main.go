package main

import (
	"context"
	"io"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "grpc-go-course/calculator/proto"
)

var addr string = "127.0.0.1:50052"

func main() {
	conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Fail to connect: %v\n", err)
	}

	defer conn.Close()

	c := pb.NewCalculatorServiceClient(conn)
	// doSum(c)
	doPrimes(c)
}

func doSum(c pb.CalculatorServiceClient) {
	log.Println("DoSum ---->>>>>>>>>>>>")
	res, err := c.Sum(context.Background(), &pb.SumRequest{
		FirstNumber:  3,
		SecondNumber: 4,
	})
	if err != nil {
		log.Fatalf("Error: %v\n", err)
	}

	log.Printf("Sum %d\n", res.Result)
}

func doPrimes(c pb.CalculatorServiceClient) {
	log.Println("Function doPrimes here-----------")

	stream, err := c.Primes(context.Background(), &pb.PrimeRequest{
		Number: 120,
	})

	if err != nil {
		log.Fatalf("Error: %v\n", err)
	}

	for {
		msg, err := stream.Recv()
		if err == io.EOF {
			break
		}

		if err != nil {
			log.Fatalf("Error while read the stream: %v\n", err)
		}

		log.Printf("doPrimes: %d\n", msg.Result)
	}
}
