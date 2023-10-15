package main

import (
	pb "grpc-go-course/blog/proto"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type BlogItem struct {
	ID primitive.ObjectID `bson:"_id,omitempty"`

	AuthorId string `bson:"author_id"`

	Title string `bson:"title"`

	Content string `bson:"content"`
}

func documentToBlog(data *BlogItem) *pb.Blog {
	return &pb.Blog{
		Id:       data.ID.Hex(),
		Title:    data.Title,
		AuthorId: data.AuthorId,
		Content:  data.Content,
	}
}
