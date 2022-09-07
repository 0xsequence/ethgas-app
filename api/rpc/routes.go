package rpc

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func routesV1(rpc *RPC) chi.Router {
	r := chi.NewRouter()

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		respondJSON(w, rpc.networkList)
	})

	r.Get("/{network}/gas/suggested", func(w http.ResponseWriter, r *http.Request) {
		suggestedGasPrice, err := rpc.SuggestedGasPrice(r.Context(), chi.URLParam(r, "network"))
		if err != nil {
			respondJSON(w, err)
			return
		}
		respondJSON(w, suggestedGasPrice)
	})

	r.Get("/{network}/gas/history/suggested", func(w http.ResponseWriter, r *http.Request) {
		c := uint(20)
		data, err := rpc.AllSuggestedGasPrices(r.Context(), chi.URLParam(r, "network"), &c)
		if err != nil {
			respondJSON(w, err)
			return
		}
		respondJSON(w, data)
	})

	r.Get("/{network}/gas/history/actual", func(w http.ResponseWriter, r *http.Request) {
		c := uint(20)
		data, err := rpc.AllGasStats(r.Context(), chi.URLParam(r, "network"), &c)
		if err != nil {
			respondJSON(w, err)
			return
		}
		respondJSON(w, data)
	})

	r.Get("/{network}/gas/history/blocks", func(w http.ResponseWriter, r *http.Request) {
		data, err := rpc.GasPriceHistory(r.Context(), chi.URLParam(r, "network"))
		if err != nil {
			respondJSON(w, err)
			return
		}
		respondJSON(w, data)
	})

	return r
}

func respondJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("content-type", "application/json")

	if err, ok := data.(error); ok {
		w.WriteHeader(422)
		w.Write([]byte(fmt.Sprintf(`{err:"%s"}`, err.Error())))
		return

	} else {
		payload, err := json.Marshal(data)
		if err != nil {
			w.WriteHeader(422)
			w.Write([]byte(fmt.Sprintf(`{err:"%s"}`, err.Error())))
			return
		}

		w.WriteHeader(200)
		w.Write([]byte(payload))
	}
}
