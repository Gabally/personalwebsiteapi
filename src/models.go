package main

import (
	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model

	Username  string `gorm:"type:varchar(20);unique;not null;default:null"`
	Password string `gorm:"type:varchar(50);not null;default:null"`
}

type Tool struct {
	gorm.Model

	Name  string `gorm:"type:varchar(30);not null;default:null"`
	Image string `gorm:"type:varchar(200);not null;default:null"`
	Link string `gorm:"type:varchar(2048);not null;default:null"`
}

type Post struct {
	gorm.Model

	Title  string `gorm:"type:varchar(100);not null;unique;default:null"`
	Image string `gorm:"type:varchar(200);not null;default:null"`
	Description string `gorm:"type:varchar(100);not null;default:null"`
	Content string `gorm:"type:varchar(100000);not null;default:null"`
	Published bool
}