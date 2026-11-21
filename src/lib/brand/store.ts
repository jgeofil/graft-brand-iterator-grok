import { create } from "zustand";
import { persist } from "zustand/middleware";
import { descendantIds, type Brief, type Direction, type Project } from "@/lib/brand/model";
import { sampleDirections, sampleProject } from "@/lib/brand/sample";

type StudioData = {
  projects: Project[];
  directions: Direction[];
  activeProjectId: string;
  selectedId: string | null;
};

type Studio = StudioData & {
  selectProject: (id: string) => void;
  selectDirection: (id: string | null) => void;
  createProject: (brief: Brief) => string;
  updateBrief: (id: string, brief: Brief) => void;
  removeProject: (id: string) => void;
  addDirections: (items: Direction[]) => void;
  toggleFavorite: (id: string) => void;
  setCanon: (id: string) => void;
  removeDirection: (id: string) => void;
};

const initial: StudioData = {
  projects: [sampleProject],
  directions: sampleDirections,
  activeProjectId: sampleProject.id,
  selectedId: "dir_fog",
};

export const useStudio = create<Studio>()(
  persist(
    (set) => ({
      ...initial,
      selectProject: (id) =>
        set((state) => {
          const directions = state.directions.filter((direction) => direction.projectId === id);
          const canon = directions.find((direction) => direction.canon);
          return { activeProjectId: id, selectedId: canon?.id ?? directions[0]?.id ?? null };
        }),
      selectDirection: (id) => set({ selectedId: id }),
      createProject: (brief) => {
        const id = `proj_${crypto.randomUUID().slice(0, 8)}`;
        const now = Date.now();
        const project: Project = { id, brief, createdAt: now, updatedAt: now };
        set((state) => ({
          projects: [project, ...state.projects],
          activeProjectId: id,
          selectedId: null,
        }));
        return id;
      },
      updateBrief: (id, brief) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, brief, updatedAt: Date.now() } : project,
          ),
        })),
      removeProject: (id) =>
        set((state) => {
          const projects = state.projects.filter((project) => project.id !== id);
          const directions = state.directions.filter((direction) => direction.projectId !== id);
          const active = projects[0];
          const nextDirections = active
            ? directions.filter((direction) => direction.projectId === active.id)
            : [];
          return {
            projects,
            directions,
            activeProjectId: active?.id ?? "",
            selectedId: nextDirections.find((direction) => direction.canon)?.id ?? nextDirections[0]?.id ?? null,
          };
        }),
      addDirections: (items) =>
        set((state) => ({
          directions: [...state.directions, ...items],
          selectedId: items[0]?.id ?? state.selectedId,
          projects: state.projects.map((project) =>
            project.id === items[0]?.projectId ? { ...project, updatedAt: Date.now() } : project,
          ),
        })),
      toggleFavorite: (id) =>
        set((state) => ({
          directions: state.directions.map((direction) =>
            direction.id === id ? { ...direction, favorite: !direction.favorite } : direction,
          ),
        })),
      setCanon: (id) =>
        set((state) => {
          const target = state.directions.find((direction) => direction.id === id);
          if (!target) return state;
          const next = !target.canon;
          return {
            directions: state.directions.map((direction) =>
              direction.projectId === target.projectId
                ? { ...direction, canon: next && direction.id === id }
                : direction,
            ),
          };
        }),
      removeDirection: (id) =>
        set((state) => {
          const drop = new Set(descendantIds(state.directions, id));
          const directions = state.directions.filter((direction) => !drop.has(direction.id));
          const selectedId = state.selectedId && drop.has(state.selectedId) ? null : state.selectedId;
          return { directions, selectedId };
        }),
    }),
    {
      name: "graft-studio-v1",
      skipHydration: true,
      partialize: (state) => ({
        projects: state.projects,
        directions: state.directions,
        activeProjectId: state.activeProjectId,
        selectedId: state.selectedId,
      }),
    },
  ),
);
