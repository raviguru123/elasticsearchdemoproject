PUT /goparties3
{
  "settings": {
    "analysis": {
      "filter": {
        "nGram_filter": {
          "type": "nGram",
          "min_gram": 2,
          "max_gram": 20,
          "token_chars": [
          "letter",
          "digit",
          "punctuation",
          "symbol"
          ]
        }
      },
      "analyzer": {
        "nGram_analyzer": {
          "type": "custom",
          "tokenizer": "whitespace",
          "filter": [
          "lowercase",
          "asciifolding",
          "nGram_filter"
          ]
        },
        "whitespace_analyzer": {
          "type": "custom",
          "tokenizer": "whitespace",
          "filter": [
          "lowercase",
          "asciifolding"
          ]
        }
      }
    }
  },
  "mappings": {
    "profile": {
      "include_in_all": false,
      "_all": {
        "analyzer": "nGram_analyzer",
        "search_analyzer": "whitespace_analyzer"
      },
      "properties": {
        "name": {
          "include_in_all": true,
          "type": "text"
        }
      }
    },
    "party": {
      "include_in_all": false,
      "_all": {
        "analyzer": "nGram_analyzer",
        "search_analyzer": "whitespace_analyzer"
      },
      "properties": {
        "title": {
          "include_in_all": true,
          "type": "text"
        }
      }
    }
  }
}
