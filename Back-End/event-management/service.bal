import ballerina/http;
import ballerina/sql;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;
import ballerina/uuid;

configurable string host = ?;
configurable int port = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

type EventInput record {
    string title;
    string description;
    string startTime;
    string endTime;
    string location;
};

type Event record {|
    string uuid;
    string title;
    string description;
    string startTime;
    string endTime;
    string location;
|};

service / on new http:Listener(8080) {
    private final mysql:Client db;

    function init() returns error? {
        self.db = check new (host, user, password, database, port);
    }

    resource function post events(@http:Payload EventInput eventInput) returns Event|error {

        Event event = {
            uuid:  uuid:createType1AsString(),
            title: eventInput.title,
            description: eventInput.description,
            startTime: eventInput.startTime,
            endTime: eventInput.endTime,
            location: eventInput.location
        };
        _ = check self.db->execute(`
            INSERT INTO Events (uuid, title, description, startTime, endTime, location)
            VALUES (${event.uuid}, ${event.title}, ${event.description}, ${event.startTime}, ${event.endTime}, ${event.location});`);
        return event;
    }

    resource function get events() returns Event[]|error {
        stream<Event, sql:Error?> eventStream = self.db->query(`SELECT uuid, title, description, startTime, endTime, location FROM Events`);
        return from Event event in eventStream select event;
    }

    resource function get event/[string uuid]() returns Event|http:NotFound|error {
        Event|sql:Error result = self.db->queryRow(`SELECT uuid, title, description, startTime, endTime, location FROM Events WHERE uuid = ${uuid}`);
        if result is sql:NoRowsError {
            return http:NOT_FOUND;
        } else {
            return result;
        }
    }

    resource function delete event/[string uuid]() returns http:NoContent|http:NotFound|error {

        sql:ExecutionResult result = check self.db->execute(`DELETE FROM Events WHERE uuid = ${uuid}`);
        // Check if any rows were affected
        if (result.affectedRowCount > 0) {
            return http:NO_CONTENT;
        } else {
            return http:NOT_FOUND;
        }
    }

    resource function put event/[string uuid](@http:Payload EventInput eventInput) returns Event|http:NotFound|error {
        
        Event event = {
            uuid:  uuid,
            title: eventInput.title,
            description: eventInput.description,
            startTime: eventInput.startTime,
            endTime: eventInput.endTime,
            location: eventInput.location
        };

        sql:ExecutionResult result = check self.db->execute(`UPDATE Events SET title=${event.title}, 
                description=${event.description}, startTime=${event.startTime}, endTime=${event.endTime}, 
                location=${event.location} WHERE uuid = ${uuid}`);
        // Check if any rows were affected
        if (result.affectedRowCount > 0) {
            return event;
        } else {
            return http:NOT_FOUND;
        }
    }
}
