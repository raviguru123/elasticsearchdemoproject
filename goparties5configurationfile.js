


PUT /goparties5
{
  "settings": {
    "analysis": {
      "filter": {
        "autocomplete_filter": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        },
        "whitespace_remove": {
          "type": "pattern_replace",
          "pattern": " ",
          "replacement": ""
        },
        "french_stemmer": {
          "type": "stemmer",
          "name": "light_french"
        }
      },
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "keyword",
          "filter": [
          "standard",
          "lowercase",
          "asciifolding",
          "french_stemmer",
          "autocomplete_filter",
          "whitespace_remove"
          ]
        },
        "fulltextsearch": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
          "standard",
          "lowercase"
          ]
        }
      }
    }
  }
}



PUT /goparties5/_mapping/party
{
  "party": {
    "include_in_all": false,
    "_all": {
      "analyzer": "fulltextsearch",
      "search_analyzer": "fulltextsearch"
    },
    "properties": {
      "title": {
        "type": "text",
        "include_in_all": true,
        "fields": {
          "autocomplete": {
            "type": "text",
            "include_in_all": false,
            "analyzer": "autocomplete"
          }
        }
      },
      "genre": {
        "type": "text",
        "include_in_all": true
      },
      "description": {
        "type": "text",
        "include_in_all": true
      },
      "contactname": {
        "type": "text",
        "include_in_all": true
      },
      "location": {
        "type": "text",
        "include_in_all": true
      },
      "address": {
        "type": "text",
        "include_in_all": true
      }
    }
  }
}







PUT /goparties5/_mapping/profile
{
  "profile": {
    "include_in_all": false,
    "_all": {
      "analyzer": "fulltextsearch",
      "search_analyzer": "fulltextsearch"
    },
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "fulltextsearch",
        "include_in_all": true,
        "fields": {
          "autocomplete": {
            "type": "text",
            "include_in_all": false,
            "analyzer": "autocomplete"
          }
        }
      },
      "about": {
        "type": "text",
        "include_in_all": true
      },
      "address": {
        "type": "text",
        "include_in_all": true
      },
      "profile_type": {
        "type": "text",
        "include_in_all": true
      },
      "description": {
        "type": "text",
        "include_in_all": true
      },
      "genre": {
        "type": "text",
        "include_in_all": true
      }
    }
  }
}
