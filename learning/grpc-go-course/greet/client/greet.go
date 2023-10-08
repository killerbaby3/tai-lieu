package main

import (
	"context"
	pb "grpc-go-course/greet/proto"
	"log"
)

func doGreet(c pb.GreetServiceClient) {
	log.Println("Do greet was invoked")

	res, err := c.Greet(context.Background(), &pb.GreetRequest{
		FirstName: "Dat-Dat-11111111",
	})

	if err != nil {
		log.Fatal("Could not greet: %v\n", err)
	}
	log.Printf("Greet: %v\n", res.Result)
}
