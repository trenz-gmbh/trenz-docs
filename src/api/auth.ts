import ApiClient from "@/api/ApiClient";
import {AuthState} from "@/models/AuthState";

export default {
  async state(): Promise<AuthState> {
    return await ApiClient.getJson("auth/state");
  }
}