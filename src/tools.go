package main

import (
	"encoding/json"
	"net/http"
	"fmt"
	"github.com/gorilla/mux"
)

func GetTools(w http.ResponseWriter, r *http.Request) {
	var tools []Tool

	db.Find(&tools)
	if (tools == nil) {
		json.NewEncoder(w).Encode(make([]string, 0))
	} else {
		json.NewEncoder(w).Encode(&tools)
	}
}

func CreateTool(w http.ResponseWriter, r *http.Request) {
	var tool Tool
	json.NewDecoder(r.Body).Decode(&tool)

	createdTool := db.Create(&tool)
	err = createdTool.Error
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(&createdTool.Value)
}

func DeleteTool(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	var tool Tool

	db.First(&tool, params["id"])
	db.Delete(&tool)

	json.NewEncoder(w).Encode(&tool)
}