
PUT /goparties6
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
        }
      }
    }
  }
}





PUT /goparties6/_mapping/party
{
  "party": {
    "properties": {
      "title": {
        "type": "text",
        "include_in_all": true,
        "fields": {
          "autosuggesation": {
            "type": "text",
            "include_in_all": true,
            "analyzer": "autocomplete"
          }
        }
      },
      "geo": {
        "type": "geo_point"
      }
    }
  }
}



PUT /goparties6/_mapping/profile
{
  "profile": {
    "properties": {
      "name": {
        "type": "text",
        "include_in_all": true,
        "fields": {
          "autosuggesation": {
            "type": "text",
            "include_in_all": true,
            "analyzer": "autocomplete"
          }
        }
      },
      "geo":{
        "type":"geo_point"
      }
    }
  }
}








POST _aliases
{
  "actions": [
  {
    "remove": {
      "index": "goparties5",
      "alias": "goparties_index"
    }
  },
  {
    "add": {
      "index": "goparties6",
      "alias": "goparties_index"
    }
  },
  {
    "add": {
      "index": "goparties6",
      "alias": "goparties_search"
    }
  },
  {
    "remove": {
      "index": "goparties5",
      "alias": "goparties_search"
    }
  }
  ]
}
