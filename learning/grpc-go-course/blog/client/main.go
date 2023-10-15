package main

import (
	"context"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "grpc-go-course/blog/proto"
)

var addr string = "127.0.0.1:50053"

func main() {
	conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Fail to connect: %v\n", err)
	}

	defer conn.Close()

	c := pb.NewBlogServiceClient(conn)

	createBlog(c)
}

func createBlog(c pb.BlogServiceClient) string {
	log.Println("createBlog was invoked")

	blog := &pb.Blog{
		AuthorId: "VTD",
		Title:    "Test Create blog VTD",
		Content:  "AA BB CC DD",
	}

	res, err := c.CreateBlog(context.Background(), blog)

	if err != nil {
		log.Fatalf("Error 1111111: %v\n", err)
	}

	log.Printf("Blog create, id : %v\n", res.Id)
	return res.Id
}
