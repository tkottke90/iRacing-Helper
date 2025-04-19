# iRacing API Helper

I enjoy playing iRacing with my friends and would like to simplify the interface for my own purposes.  Most of the iRacing APIs require 2 steps:

1. Call the data API to generate a short-lived signed url
2. Call the signed url to get the data

## Project Requirements

- Application should interface with a Neo4J Database
- Application should interface with the iRacing API
- Application should be capable of maintaining a current list of Tracks on the Database
- Application should be capable of maintaining a current list of Cars on the Database
- Application should be capable of maintaining a list of Drivers in the database
  - Drivers should have a list of cars they own
  - Drivers should have a list of tracks they own

---
## Other Modules I Use with this One

- [HATOS URL Manager](https://github.com/tkottke90/hateos-url-manager) - Another module I wrote which abstracts some of the complexity of adding `_links` to your API responses.