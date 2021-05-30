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
var jwtKey []byte
var cosrsOrigins string

func corsHeader(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Add("Access-Control-Allow-Origin", cosrsOrigins)
        next.ServeHTTP(w, r)
    })
}

func jsonHeader(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Add("Content-Type", "application/json")
        next.ServeHTTP(w, r)
    })
}

func main() {
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

	jwtKey = []byte(os.Getenv("JWTKEY"))

	// Database connection string
	dbURI := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s port=%s", host, user, dbname, dbpassword, dbPort)

	db, err = gorm.Open(dialect, dbURI)

	if err != nil {
		panic(err)
	} else {
		fmt.Println("Connected to database successfully")
	}

	defer db.Close()

	db.AutoMigrate(&Tool{})
	db.AutoMigrate(&Post{})
	db.AutoMigrate(&Credentials{})

	router := mux.NewRouter()

	if (os.Getenv("CORS") != ""){
		cosrsOrigins = os.Getenv("CORS")
		router.Use(corsHeader)
		fmt.Println("[Warning] CORS is enabled!")
	}
	router.Use(jsonHeader)

	authenticatedRouter := router.PathPrefix("/operations").Subrouter()
	authenticatedRouter.Use(isAuthenticatedMiddleware)

	authenticatedRouter.HandleFunc("/create/post", CreatePost).Methods("POST")
	authenticatedRouter.HandleFunc("/create/tool", CreateTool).Methods("POST")
	
	authenticatedRouter.HandleFunc("/delete/post/{id}", DeletePost).Methods("DELETE")
	authenticatedRouter.HandleFunc("/delete/tool/{id}", DeleteTool).Methods("DELETE")

	authenticatedRouter.HandleFunc("/update/post/{id}", UpdatePost).Methods("PUT")

	router.HandleFunc("/posts", GetPosts).Methods("GET")
	router.HandleFunc("/post/{title}", GetPost).Methods("GET")

	router.HandleFunc("/search", Search).Methods("GET")

	router.HandleFunc("/tools", GetTools).Methods("GET")

	router.HandleFunc("/auth/refresh", Refresh).Methods("GET")


	router.HandleFunc("/create/credentials", SetCredentials).Methods("POST")

	router.HandleFunc("/auth/login", Signin).Methods("POST")
	

	log.Fatal(http.ListenAndServe(":"+os.Getenv("APIPORT"), router))
}