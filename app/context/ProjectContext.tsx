"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { folderApi } from "@/app/api";
import { Folder, FolderDetail } from "@/app/api/dto/folder";

interface ProjectContextType {
  folders: Folder[];
  currentProject: FolderDetail | null;
  isLoading: boolean;
  loadFolders: () => Promise<void>;
  getProjectDetail: (id: string) => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  updateFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentProject, setCurrentProject] = useState<FolderDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // 모든 폴더 목록 로드
  const loadFolders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await folderApi.getFolders();
      if (response.status === "success" && response.data) {
        setFolders(response.data);
      }
    } catch (error) {
      console.error("폴더 목록 로드 오류:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 특정 프로젝트 상세 정보 로드
  const getProjectDetail = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await folderApi.getFolder(id);
      if (response.status === "success" && response.data) {
        setCurrentProject(response.data);
      } else {
        setCurrentProject(null);
      }
    } catch (error) {
      console.error("프로젝트 상세 정보 로드 오류:", error);
      setCurrentProject(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 폴더 생성
  const createFolder = useCallback(
    async (name: string) => {
      try {
        setIsLoading(true);
        await folderApi.createFolder(name);
        await loadFolders();
      } catch (error) {
        console.error("폴더 생성 오류:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [loadFolders],
  );

  // 폴더 이름 수정
  const updateFolder = useCallback(
    async (id: string, name: string) => {
      try {
        setIsLoading(true);
        await folderApi.updateFolder(id, name);

        // 현재 보고 있는 프로젝트라면 상세 정보도 업데이트
        if (currentProject && currentProject.id === id) {
          await getProjectDetail(id);
        }

        await loadFolders();
      } catch (error) {
        console.error("폴더 업데이트 오류:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [loadFolders, getProjectDetail, currentProject],
  );

  // 폴더 삭제
  const deleteFolder = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        await folderApi.deleteFolder(id);

        // 현재 보고 있는 프로젝트라면 초기화
        if (currentProject && currentProject.id === id) {
          setCurrentProject(null);
        }

        await loadFolders();
      } catch (error) {
        console.error("폴더 삭제 오류:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [loadFolders, currentProject],
  );

  // 초기 폴더 목록 로드
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  return (
    <ProjectContext.Provider
      value={{
        folders,
        currentProject,
        isLoading,
        loadFolders,
        getProjectDetail,
        createFolder,
        updateFolder,
        deleteFolder,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
