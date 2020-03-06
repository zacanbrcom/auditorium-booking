[![Gitpod Almost-Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/ishche/auditorium-booking) 

# Auditorium Booking

This application that was created as part of the Broadcom CodeWeek, initiative where students can practise their coding skill on  examplesfrom real life.

It allows booking of rooms used for bigger events (trainings, all hands, customer meetings).

## Architecture overview

## Technology used

## Usage

## Build and deployment instructions

### Backend

#### Building
```shell
docker build -t cw .
```
#### Running
```shell
docker run -p <yourport>:8000 -d cw
```
### Without docker

#### Dependencies
+ nightly rust (rustup and `rustup install nightly` and `rustup default nightly`)
+ make
+ gcc
+ pkgconf
+ sqlite
+ python
+ python-sqlalchemy
+ yarn
+ google-api-python-client
+ google_auth_oauthlib

#### Building
```shell
make
```
#### Running
```shell
cargo run --release
```

## /rgi/events/<id>
Resturns JSON with following structure:
- id
- name
- description
- author
- rooms
- begin_time
- end_time
- layout
- approved
  
 In case of error it returns JSON with attribut result, which indicates the error details
 
 ## The other endpoints
 Return JSON with attribut result, which indicates result or error
 
 ## Table result
 - result: 0    - everything fine
 - result: 1    - we did not find booking related to the ID
 - result: 2    - there is already boooking request in place for specified date/time

Rust endpoints
## FILTER
# Description:
 - Podle zadáných časů vrátí reservace, které v zadaných místnostech v té době probíhají/budou probíhat
# Params:
 - Místnosti (rooms): místnosti jaké chceme filtrovat
 - 0 - nothing
 - 1 - left room
 - 2 - right room
 - 3 - both rooms
 - Begin (begin_time): from
 - End (end_time) : till
# Returns:
 - JSON files with the parametter "results", this is an distionary of results (bookings in the selected room for specified time/date)(booking dictionary)
## LIST
# Description:
 - Vrátí všechny rezervace z databáze
# Params:
 - Nebere parametry
# Returns:
 - JSON file with parametter "results", kde jsou data (booking dictionary) všech rezervací
