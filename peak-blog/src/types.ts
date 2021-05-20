import exp from "constants";

export enum Visibility {
    private,
    protected,
    public
}

export enum ReactionType {
    upvote
}

export enum Published {
    draft,
    published
}

export interface BlogPost {
    id: string
    title: string
    subtitle: string
    cover_image_url: string
    description: string
    author_id: string
    body: Node[]
    tag_ids: string[]
    inserted_at: Date
    updated_at: Date
    visibility: Visibility
    publish_state: Published
}

export interface Reaction {
    user_id: string
    post_id: string
    reaction_type: ReactionType
    inserted_at: Date
}

interface SubDomain {
    user_id: string[]
    peak_user_id: string
    subdomain: string
}

interface SubDomainConfiguration {
    subdomain: string
    name: string
    cover_photo_url: string
    about: string
    icon_url: string
}

export interface HydratedSubdomain extends SubDomain, SubDomainConfiguration {}

