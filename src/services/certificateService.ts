import { API_ENDPOINTS } from "@/constants/api";
import type { Certificate } from "@/types";
import { BaseService } from "./baseService";

class CertificateService extends BaseService<Certificate> {
  protected endpoint = API_ENDPOINTS.CERTIFICATES;
  protected entityName = "certificate";
  protected contentType = "multipart/form-data" as const;
}

export const certificateService = new CertificateService();
