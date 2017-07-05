
PUT /goparties4
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


DELETE goparties4


PUT /goparties4/_mapping/party
{
  "party": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "autocomplete"
      }
    }
  }
}


PUT /goparties4/_mapping/profile
{
  "profile": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "autocomplete"
      }
    }
  }
}

