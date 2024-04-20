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

type PublicationInput record {
    string title;
    string description;
    string publicationType;
    string paperSubmissionDate;
    string conferenceDate;
    string location;
    string externalLink;
    string conferenceRank;
};

type Publication record {|
    string uuid;
    string title;
    string publicationType;
    string description;
    string paperSubmissionDate;
    string conferenceDate;
    string location;
    string externalLink;
    string conferenceRank;
|};

@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"],
        allowCredentials: false,
        maxAge: 84900
    }
}

service / on new http:Listener(8080) {
    private final mysql:Client db;

    function init() returns error? {
        self.db = check new (host, user, password, database, port);
    }

    resource function post publications(@http:Payload PublicationInput publicationInput) returns Publication|error {

        Publication publication = {
            uuid:  uuid:createType1AsString(),
            title: publicationInput.title,
            description: publicationInput.description,
            paperSubmissionDate: publicationInput.paperSubmissionDate,
            conferenceDate: publicationInput.conferenceDate,
            location: publicationInput.location,
            externalLink: publicationInput.externalLink,
            conferenceRank: publicationInput.conferenceRank,
            publicationType: publicationInput.publicationType
        };
        _ = check self.db->execute(`
            INSERT INTO Publications (uuid, title, publicationType, description, paperSubmissionDate, 
            conferenceDate, externalLink, conferenceRank, location)
            VALUES (${publication.uuid}, ${publication.title}, ${publication.publicationType}, ${publication.description}, 
            ${publication.paperSubmissionDate}, ${publication.conferenceDate}, ${publication.externalLink},
            ${publication.conferenceRank}, ${publication.location});`);
        return publication;
    }

    resource function get publications() returns Publication[]|error {
        stream<Publication, sql:Error?> publicationStream = self.db->query(`SELECT uuid, title, publicationType, description, paperSubmissionDate, 
            conferenceDate, externalLink, conferenceRank, location FROM Publications`);
        return from Publication publication in publicationStream select publication;
    }

    resource function get publication/[string uuid]() returns Publication|http:NotFound|error {
        Publication|sql:Error result = self.db->queryRow(`SELECT uuid, title, publicationType, description, paperSubmissionDate, 
            conferenceDate, externalLink, conferenceRank, location FROM Publications WHERE uuid = ${uuid}`);
        if result is sql:NoRowsError {
            return http:NOT_FOUND;
        } else {
            return result;
        }
    }

    resource function delete publication/[string uuid]() returns http:NoContent|http:NotFound|error {

        sql:ExecutionResult result = check self.db->execute(`DELETE FROM Publications WHERE uuid = ${uuid}`);
        // Check if any rows were affected
        if (result.affectedRowCount > 0) {
            return http:NO_CONTENT;
        } else {
            return http:NOT_FOUND;
        }
    }

    resource function put publication/[string uuid](@http:Payload PublicationInput publicationInput) returns Publication|http:NotFound|error {
        
        Publication publication = {
            uuid:  uuid,
            title: publicationInput.title,
            description: publicationInput.description,
            paperSubmissionDate: publicationInput.paperSubmissionDate,
            conferenceDate: publicationInput.conferenceDate,
            location: publicationInput.location,
            externalLink: publicationInput.externalLink,
            conferenceRank: publicationInput.conferenceRank,
            publicationType: publicationInput.publicationType
        };

        sql:ExecutionResult result = check self.db->execute(`UPDATE Publications SET title=${publication.title}, 
                description=${publication.description}, paperSubmissionDate=${publication.paperSubmissionDate}, conferenceDate=${publication.conferenceDate}, 
                externalLink=${publication.externalLink}, conferenceRank=${publication.conferenceRank}, publicationType=${publication.publicationType},
                location=${publication.location} WHERE uuid = ${uuid}`);
        // Check if any rows were affected
        if (result.affectedRowCount > 0) {
            return publication;
        } else {
            return http:NOT_FOUND;
        }
    }
}
