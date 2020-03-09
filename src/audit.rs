use rocket::Route;
use rocket_contrib::json::Json;

use crate::models::*;
use crate::schema::*;
use diesel::*;
//extern crate backend;

//all the routes available for the audit controller
pub fn routes() -> Vec<Route> {
	routes![generate_audit]
}

/// get all users
#[get("/audit", format = "application/json")]
pub fn generate_audit() -> Json<String>{
    //TODO: Adjust later on as get audit from database
   Json("Hello from the audit!!".to_string())

	/*
	//try to write audit log on database...
	println!("Reached here!!");
	
	//establish the connection with db
	let conn:PgConnection = backend::establish_connection();

	//create a dummy audit log row to write in db
	let audit_log = new_audit("Thats a test description");


	//write in the db
	let added= diesel::insert_into(audit::table).values(&audit_log).execute(&conn);
    println!("New log added {:?}", added);
	*/
}