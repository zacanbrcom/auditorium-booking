extern crate rocket;
extern crate backend;
extern crate serde_json;
use rocket::local::Client;
use rocket::http::ContentType;

#[test]
pub fn test_booking() {
	let cli = Client::new(backend::init()).expect("wtf? the virtual client failed");
	assert_eq!(cli.get("/rgi/events/").dispatch().body_string().unwrap(), "[]");

	let mut req = cli.post("/rgi/events/").header(ContentType::JSON);
	req.set_body(r#"{ "name": "test", "description": "test stuff", "author": "hozdic", "begin_time": "2019-12-12T12:30", "end_time": "2019-12-13T13:25", "rooms": 3, "layout": 0, "people": 30}"#);
	assert_eq!(req.dispatch().body_string().unwrap(), r#"{"result": 0, "id": 1}"#);

	let v: backend::db::Reservation =
		serde_json::from_str(&cli.get("/rgi/events/1").dispatch().body_string().unwrap()).unwrap();
	assert_eq!(v.approved, 0);

	cli.post("/rgi/events/1/approve/").header(ContentType::JSON).dispatch();

	let v: backend::db::Reservation =
		serde_json::from_str(&cli.get("/rgi/events/1").dispatch().body_string().unwrap()).unwrap();
	assert_eq!(v.approved, 1);

	let mut req = cli.post("/rgi/events/").header(ContentType::JSON);
	req.set_body(r#"{ "name": "test2", "description": "test stuff2", "author": "hozdic2", "begin_time": "2019-12-12T11:30", "end_time": "2019-12-13T13:25", "rooms": 3, "layout": 0, "people": 100}"#);
	assert_eq!(req.dispatch().body_string().unwrap(), r#"{"result": 2}"#);

	cli.delete("/rgi/events/1").header(ContentType::JSON).dispatch();
	assert_eq!(cli.get("/rgi/events/").dispatch().body_string().unwrap(), "[]");
}
