package main

import (
	"context"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "grpc-go-course/location/proto"
)

var addr string = "127.0.0.1:50065"

func main() {
	conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Fail to connect: %v\n", err)
	}

	defer conn.Close()

	c := pb.NewLocationServiceClient(conn)

	GetByParentId(c)
}

func GetByParentId(c pb.LocationServiceClient) (*pb.GetByParentIdResponse, error) {
	detail, err := c.GetByParentId(context.Background(), &pb.GetByParentIdRequest{
		ParentIDs: []int32{226, 6, 4},
	})
	log.Fatal(detail)
	return detail, err
}
