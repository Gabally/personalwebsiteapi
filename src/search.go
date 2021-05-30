package main

import (
	"net/http"
	"encoding/json"
)

func Search(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query != "" {
		w.WriteHeader(http.StatusOK)
		var posts []Post
		var finalPosts []Post
		var tools []Tool
		type QueryResult struct {
			Posts []Post
			Tools []Tool
		}
		db.Where("title LIKE ?", "%"+query+"%").Select([]string{"title", "published"}).Find(&posts)
	
		db.Where("name LIKE ?", "%"+query+"%").Select([]string{"name"}).Find(&tools)

		var queryResult QueryResult 

		if(len(posts) != 0) {
			for _, element := range posts {
				if(element.Published) {
					finalPosts = append(finalPosts, element)
				}
			}
		} else {
			finalPosts = make([]Post, 0)
		}
		queryResult.Posts = finalPosts
		queryResult.Tools = tools
		json.NewEncoder(w).Encode(&queryResult)
	} else {
		w.WriteHeader(http.StatusBadRequest)
	}
}