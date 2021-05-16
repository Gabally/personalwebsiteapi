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
		db.Where("title LIKE ?", "%"+query+"%").Select([]string{"title", "published"}).Find(&posts)
	
		for _, element := range posts {
			if(element.Published) {
				finalPosts = append(finalPosts, element)
			}
		}
		if (finalPosts == nil){
			json.NewEncoder(w).Encode(make([]string, 0))
		} else {
			json.NewEncoder(w).Encode(&finalPosts)
		}
	} else {
		w.WriteHeader(http.StatusBadRequest)
	}
}