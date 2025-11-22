import { z } from "zod";
// import { propertySchema } from "../responseSchema/property";
import { Client } from './abstract';

export class PropertyClient extends Client {
  constructor(url: string) {
    super(url);
  }

  async getProperties() {
    try {
      const res = await this.request("GET", "/api/user/properties");
      // const body = z.array(propertySchema).safeParse(res?.data);

      // if (!body.success) {
      //   console.error("getProperties parse error:", body.error);
      //   throw new Error("Invalid data from backend");
      // }
      return res.data;
    } catch (error) {
      console.error("getProperties error:", error);
      throw error;
    }
  }

  async getFilteredProperties(params: { city?: string | null; status?: string | null; type?: string | null; }) {
    try {
      const queryParams = new URLSearchParams();
      if (params.city) {
        queryParams.append("city", params.city);
      }
      if (params.status) {
        queryParams.append("status", params.status);
      }
      if (params.type) {
        queryParams.append("type", params.type);
      }

      const queryString = queryParams.toString();
      const url = `/api/user/properties${queryString ? `?${queryString}` : ""}`;

      const res = await this.request("GET", url);
      return res.data;
    } catch (error) {
      console.error("getFilteredProperties error:", error);
      throw error;
    }
  }

  async getPropertyById(id: string) {
    try {
      const res = await this.request("GET", `/api/user/properties/${id}`);
      return res.data;
    }catch(error) {
      console.error("getProperty error:", error);
      throw error;
    }
  }

  async createProperty(data: FormData) {
    try {
      const res = await this.request("POST", "/api/admin/properties", {
        data,
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("createProperty error:", error);
      throw error;
    }
  }


  async getCount() {
    try {
      const res = await this.request("GET", "/api/admin/count");
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getallpic() {
    try {
      const res = await this.request("GET", "/api/user/pic");
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateProperty(id: string, data: { price: number; status: string }) {
    try {
      const res = await this.request("PUT", `/api/admin/properties/${id}`, {
        data
      }
      );

      if (!res || !res.data) throw new Error("No response data from server");

      return res.data;
    } catch (error) {
      console.error("updateProperty error:", error);
      throw error;
    }
  }

  async getusers() {
    try {
      const res = await this.request("GET", "/api/admin/users");
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deletepro(proId: string) {
    try {
      await this.request("DELETE", `/api/admin/properties/${proId}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("deletepro error:", error);
      throw error;
    }
  }
}
