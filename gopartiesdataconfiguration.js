PUT /goparties
{
  "settings": {
    "analysis": {
      "filter": {
        "autocomplete_filter": { 
          "type":     "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        }
      },
      "analyzer": {
        "autocomplete": {
          "type":      "custom",
          "tokenizer": "standard",
          "filter": [
          "lowercase",
          "autocomplete_filter" 
          ]
        }
      }
    }
  }
}


PUT /goparties/_mapping/profile
{
  "profile": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "autocomplete",
        "copy_to":"full_text"
      },
      "profile_type": {
        "type": "text",
        "analyzer": "autocomplete",
        "copy_to":"full_text"
      },
      "full_text":{
        "type":"text"
      }
    }
  }
}

PUT /goparties/_mapping/party
{
  "party": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "autocomplete"
      },
      "startdate": {
        "type": "date",
        "format": "strict_date_optional_time||epoch_millis"
      },
      "enddate": {
        "type": "date",
        "format": "strict_date_optional_time||epoch_millis"
      }
    }
  }
}




GET goparties/party/_search
{
  "query": {
    "range": {
      "startdate": {
        "gte":"1499085334000"
      }
    }
  }
}


GET /goparties/_search
{
  "_source": [
  "title",
  "name",
  "about",
  "profile_type",
  "_id"
  ],
  "query": {
    "bool": {
      "must": [
      {
        "multi_match": {
          "query": "friday",
          "type": "best_fields",
          "fields": [
          "title^5",
          "profile_type",
          "name^5",
          "address"
          ]
        }
      }
      ],
      "filter": {
        "range": {
          "startdate": {
            "gte":"now"
          }
        }
      }
    }
  },
  "highlight": {
    "fields": {
      "title": {},
      "name": {},
      "about": {},
      "profile_type": {}
    }
  }
}

