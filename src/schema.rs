table! {
    audit (id) {
        id -> Int4,
        event_type -> Nullable<Varchar>,
        created_on -> Nullable<Timestamp>,
        user_id -> Nullable<Varchar>,
        description -> Nullable<Varchar>,
    }
}
