package main

import (
	"encoding/json"
	"net/http"
	"github.com/gorilla/mux"
	"fmt"
)

func GetPosts(w http.ResponseWriter, r *http.Request) {
	var posts []Post
	var finalPosts []Post

	db.Select([]string{"id", "title", "image", "description", "published"}).Find(&posts)

	for _, element := range posts {
		if(element.Published) {
			finalPosts = append(finalPosts, element)
		}
	}
	if (finalPosts == nil) {
		json.NewEncoder(w).Encode(make([]string, 0))
	} else {
		json.NewEncoder(w).Encode(&finalPosts)
	}
}

func GetPost(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var post Post

	db.Where("title = ?", params["title"]).First(&post)

	json.NewEncoder(w).Encode(&post)
}

func CreatePost(w http.ResponseWriter, r *http.Request) {
	var post Post
	json.NewDecoder(r.Body).Decode(&post)

	createdPost := db.Create(&post)
	err = createdPost.Error
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(&createdPost.Value)
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	var post Post

	db.First(&post, params["id"])
	db.Delete(&post)

	json.NewEncoder(w).Encode(&post)
}

func UpdatePost(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var updatedPost Post
	json.NewDecoder(r.Body).Decode(&updatedPost)

	var post Post
	db.First(&post, params["id"])
	post.Title = updatedPost.Title
	post.Image = updatedPost.Image
	post.Description = updatedPost.Description
	post.Content = updatedPost.Content
	post.Published = updatedPost.Published

	db.Save(&post)

	json.NewEncoder(w).Encode(&post)
}