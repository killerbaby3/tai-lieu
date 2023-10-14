package main

import (
	"context"
	"log"
	"net"

	pb "grpc-go-course/calculator/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var addr string = "127.0.0.1:50052"

type Server struct {
	pb.CalculatorServiceServer
}

func main() {
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatalf("Failed------------------%v\n", err)
	}
	log.Printf("Listen on %s\n", addr)

	s := grpc.NewServer()

	pb.RegisterCalculatorServiceServer(s, &Server{})
	reflection.Register(s)
	if err = s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v\n", err)
	}
}

func (s *Server) Sum(ctx context.Context, in *pb.SumRequest) (*pb.SumResponse, error) {
	log.Printf("Sum with : %v\n", in)
	return &pb.SumResponse{
		Result: in.FirstNumber * in.SecondNumber,
	}, nil
}

func (s *Server) Primes(in *pb.PrimeRequest, stream pb.CalculatorService_PrimesServer) error {
	log.Printf("Prime function was called with %v\n", in)

	number := in.Number

	divisor := int64(2)

	for number > 1 {
		if number%divisor == 0 {
			stream.Send(&pb.PrimeResponse{
				Result: divisor,
			})
			number /= divisor
		} else {
			divisor++
		}
	}
	return nil
}
