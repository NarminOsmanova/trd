// ==================== Types ====================
export interface PositionSet {
  name: string;
  language: string;
}

export interface CreatePositionRequest {
  positionSets: PositionSet[];
}

export interface UpdatePositionRequest {
  id: number;
  positionSets: PositionSet[];
}

export interface Position {
  id: number;
  name?: string;
  positionSets: PositionSet[];
}

export interface PaginatedPositionsResponse {
  statusCode: number;
  message: string;
  responseValue?: {
    items: Position[];
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface GetPositionByIdResponse {
  statusCode: number;
  message: string;
  responseValue?: Position;
}

export interface ApiResponse<T = void> {
  statusCode: number;
  message: string;
  data?: T;
}
