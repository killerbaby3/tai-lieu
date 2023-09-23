package main

import "fmt"

type contactInfo struct {
	email string
	zipCode int
}

type person struct {
	firstName string
	lastName  string
	contactInfo
}
 
func main() {
	jim := person{
		firstName:"Thanh",
		lastName:"Dat",
		contactInfo: contactInfo{
			email:"nhkkin76@gmail.com",
			zipCode:7000,
		},
	}
	// jimPointer := &jim
	jim.updateName("Jimmy")
	jim.print()
}

func (pointerToPerson *person) updateName(newFirstName string)  {
	(*pointerToPerson).firstName = newFirstName
}

func (p person) print()  {
	fmt.Printf("%+v", p)
}