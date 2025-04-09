import { ApiResponse, del, get, post, put } from "./client";
import {
  CreateFolderRequest,
  Folder,
  FolderDetail,
  UpdateFolderRequest,
} from "./dto/folder";

// 폴더 API 모듈
export const folderApi = {
  // 폴더 목록 조회
  async getFolders(): Promise<ApiResponse<Folder[]>> {
    try {
      const response = await get<Folder[]>("/folders");
      console.log("폴더 API 응답:", response); // 디버깅용 로그
      return response;
    } catch (error) {
      console.error("폴더 목록 조회 오류:", error);
      return {
        status: "error",
        code: "GET_FOLDERS_ERROR",
        message: "폴더 목록을 불러오는데 실패했습니다.",
        data: [],
      };
    }
  },

  // 특정 폴더 조회 (폴더 내 대화 포함)
  async getFolder(id: string): Promise<ApiResponse<FolderDetail>> {
    try {
      return await get<FolderDetail>(`/folders/${id}`);
    } catch (error) {
      console.error("폴더 조회 오류:", error);
      throw error;
    }
  },

  // 폴더 생성
  async createFolder(
    name: string,
    is_default: boolean = false
  ): Promise<ApiResponse<Folder>> {
    try {
      const request: CreateFolderRequest = { name, is_default };
      const response = await post<Folder, CreateFolderRequest>(
        "/folders",
        request
      );
      console.log("폴더 생성 응답:", response); // 디버깅용 로그
      return response;
    } catch (error) {
      console.error("폴더 생성 오류:", error);
      throw error;
    }
  },

  // 폴더 정보 업데이트
  async updateFolder(
    id: string,
    name: string,
    is_default?: boolean
  ): Promise<ApiResponse<Folder>> {
    try {
      const updateData: UpdateFolderRequest = { name };
      if (is_default !== undefined) {
        updateData.is_default = is_default;
      }

      return await put<Folder, UpdateFolderRequest>(
        `/folders/${id}`,
        updateData
      );
    } catch (error) {
      console.error("폴더 업데이트 오류:", error);
      throw error;
    }
  },

  // 폴더 삭제
  async deleteFolder(id: string): Promise<ApiResponse<void>> {
    try {
      return await del(`/folders/${id}`);
    } catch (error) {
      console.error("폴더 삭제 오류:", error);
      throw error;
    }
  },
};
