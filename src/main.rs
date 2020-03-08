extern crate backend;
use backend::models::*;
use backend::schema::*;
use diesel::*;

fn main() {
	//backend::init().launch();

	//try to write audit log on database...
	println!("Reached here!!");
	
	//establish the connection with db
	let conn:PgConnection = backend::establish_connection();

	//create a dummy audit log row to write in db
	let audit_log = new_audit("Thats a test description");


	//write in the db
	let added= diesel::insert_into(audit::table).values(&audit_log).execute(&conn);
    println!("New log added {:?}", added);

}
