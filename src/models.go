package main

import (
	"github.com/jinzhu/gorm"
	"github.com/dgrijalva/jwt-go"
)

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
	Content string `gorm:"type:varchar(1000000);not null;default:null"`
	Published bool  `gorm:"type:boolean;not null;default: false"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

type Credentials struct {
	Password string `gorm:"type:varchar(200);not null;default:null;json:"password"`
	Username string `gorm:"type:varchar(50);not null;default:null;json:"username"`
}
