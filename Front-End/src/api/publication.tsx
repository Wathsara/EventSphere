export interface Publication {
    id: number;
    uuid: string;
    title: string;
    description: string;
    publicationType: string; // Could be more specific, e.g., 'Conference' | 'Journal'
    paperSubmissionDate: string;
    conferenceDate: string;
    location: string;
    externalLink: string;
    conferenceRank: string;
}

export interface PublicationInput {
    title: string;
    description: string;
    publicationType: string;
    paperSubmissionDate: string;
    conferenceDate: string;
    location: string;
    externalLink: string;
    conferenceRank: string;
}
