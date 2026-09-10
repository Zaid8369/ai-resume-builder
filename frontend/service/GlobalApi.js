import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

const CreateNewResume = (data) => axiosClient.post("/user-resumes", data);

const GetUserResumes = (userEmail) =>
  axiosClient.get("/user-resumes?userEmail=" + encodeURIComponent(userEmail));

const UpdateResumeDetail = (id, data) =>
  axiosClient.put("/user-resumes/" + id, data);

const GetResumeById = (id) => axiosClient.get("/user-resumes/" + id);

const DeleteResumeById = (id) => axiosClient.delete("/user-resumes/" + id);

export default {
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetail,
  GetResumeById,
  DeleteResumeById,
};