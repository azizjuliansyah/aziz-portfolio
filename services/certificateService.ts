import { Certificate } from "@/types/certificate";
import { BaseService } from "./baseService";

class CertificateService extends BaseService<Certificate> {
  protected endpoint = "/api/certificates";
  protected entityName = "certificate";
  protected contentType = "multipart/form-data" as const;
}

export const certificateService = new CertificateService();
