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
Vrací JSON s následující strukturou
- id
- name
- description
- author
- rooms
- begin_time
- end_time
- layout
- approved
  
 V případě chyby vrátí JSON s atributem result, který bude označovat chybu
 
 ## Ostatní endpointy
 Vrací JSON s atributem result, který označuje výsledek nebo chybu
 
 ## Tabulka result
 - result: 0    - všechno fungovalo
 - result: 1    - nenašlo to rezervaci podle ID
 - result: 2    - Už existuje rezervace ve stejném čase a ve stejné místnosti


Rustí endpointy
## FILTER
# Popis:
 - Podle zadáných časů vrátí reservace, které v zadaných místnostech v té době probíhají/budou probíhat
# Parametry:
 - Místnosti (rooms): místnosti jaké chceme filtrovat
 - 0 - žádná místnost
 - 1 - levá místnost
 - 2 - pravá místnost
 - 3 - obě místnosti
 - Začátek (begin_time): od kdy
 - Konec (end_time) : do kdy
# Vrací:
 - JSON soubor s parametrem výseldky ("results"), kde je pole výsledků (rezervací v zadaných místnostech v zadaných časech)(booking dictionary)
## LIST
# Popis:
 - Vrátí všechny rezervace z databáze
# Parametry:
 - Nebere parametry
# Vrací:
 - JSON soubor s paramterem výsledky ("results"), kde jsou data (booking dictionary) všech rezervací
