package main

import (
	"fmt"
	"log"
	"os"
	"net/http"

	"github.com/jinzhu/gorm"

	"github.com/gorilla/mux"

	_ "github.com/jinzhu/gorm/dialects/postgres"

	"github.com/joho/godotenv"
)

//Globals
var db *gorm.DB
var err error

func corsHeader(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Add("Access-Control-Allow-Origin", "*")
        next.ServeHTTP(w, r)
    })
}

func jsonHeader(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Add("Content-Type", "application/json")
        next.ServeHTTP(w, r)
    })
}

func main(){
	err := godotenv.Load()
	if err != nil {
	  log.Fatal("Error loading .env file")
	}

	dialect := os.Getenv("DBDIALECT")
	host := os.Getenv("DBHOST")
	dbPort := os.Getenv("DBPORT")
	user := os.Getenv("DBUSER")
	dbname := os.Getenv("DBNAME")
	dbpassword := os.Getenv("DBPASSWORD")

	// Database connection string
	dbURI := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s port=%s", host, user, dbname, dbpassword, dbPort)

	db, err = gorm.Open(dialect, dbURI)

	if err != nil {
		panic(err)
	} else {
		fmt.Println("Connected to database successfully")
	}

	defer db.Close()

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Tool{})
	db.AutoMigrate(&Post{})

	router := mux.NewRouter()

	if (os.Getenv("USERCORS") == "true"){
		router.Use(corsHeader)
		fmt.Println("[Warning] CORS is enabled!")
	}
	router.Use(jsonHeader)

	router.HandleFunc("/posts", GetPosts).Methods("GET")
	router.HandleFunc("/post/{title}", GetPost).Methods("GET")

	router.HandleFunc("/search", Search).Methods("GET")

	router.HandleFunc("/tools", GetTools).Methods("GET")

	router.HandleFunc("/create/post", CreatePost).Methods("POST")
	router.HandleFunc("/create/tool", CreateTool).Methods("POST")
	
	router.HandleFunc("/delete/post/{id}", DeletePost).Methods("DELETE")
	router.HandleFunc("/delete/tool/{id}", DeleteTool).Methods("DELETE")

	router.HandleFunc("/update/post/{id}", UpdatePost).Methods("PUT")

	log.Fatal(http.ListenAndServe(":"+os.Getenv("APIPORT"), router))
}