import type {
  Course,
  CreateOrganizationDto,
  CreateSelectiveProcessDto,
  ListOrganizationsQuery,
  OrganizationDetail,
  OrganizationListItem,
  PatchUserDto,
} from "@extraufla/shared";
import type { QueryClient } from "@tanstack/react-query";
import { http } from "./http";

export const organizationsQuery = (params?: Partial<ListOrganizationsQuery>) => ({
  queryKey: ["organizations", params] as const,
  queryFn: () => {
    const search = new URLSearchParams();
    if (params?.type) search.set("type", params.type);
    if (params?.search) search.set("search", params.search);
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.offset) search.set("offset", String(params.offset));
    return http.get<OrganizationListItem[]>(`/organizations?${search}`);
  },
  staleTime: 1000 * 60 * 2,
});

export const organizationDetailQuery = (id: string) => ({
  queryKey: ["organizations", id] as const,
  queryFn: () => http.get<OrganizationDetail>(`/organizations/${id}`),
  staleTime: 1000 * 60 * 2,
});

export const coursesQuery = () => ({
  queryKey: ["courses"] as const,
  queryFn: () => http.get<Course[]>("/courses"),
  staleTime: Number.POSITIVE_INFINITY,
});

export const patchUserMutation = (queryClient: QueryClient) => ({
  mutationFn: (dto: PatchUserDto) => http.patch("/users/me", { body: JSON.stringify(dto) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "session"] }),
});

export const createOrganizationMutation = (queryClient: QueryClient) => ({
  mutationFn: (dto: CreateOrganizationDto) =>
    http.post<{ id: string }>("/organizations", { body: JSON.stringify(dto) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organizations"] }),
});

export const createProcessMutation = (queryClient: QueryClient, organizationId: string) => ({
  mutationFn: (dto: CreateSelectiveProcessDto) =>
    http.post(`/organizations/${organizationId}/processes`, { body: JSON.stringify(dto) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organizations", organizationId] }),
});
