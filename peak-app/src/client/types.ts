
interface PaginationResponsePayload {
    cursor: string | undefined,
    cursorBefore: string | undefined,
    limit: number | undefined
}

export interface PaginationResponse {
    pagination_metadata: PaginationResponsePayload
}

