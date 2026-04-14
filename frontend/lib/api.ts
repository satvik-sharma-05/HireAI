import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    signup: (data: { email: string; password: string; role: string }) =>
        api.post('/auth/signup', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
};

export const resumeAPI = {
    upload: (file: File, customTitle?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        if (customTitle) {
            formData.append('custom_title', customTitle);
        }
        return api.post('/resume/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    list: () => api.get('/resume/list'),
    get: (id: string) => api.get(`/resume/${id}`),
    updateTitle: (id: string, customTitle: string) =>
        api.put(`/resume/${id}/title`, null, { params: { custom_title: customTitle } }),
    delete: (id: string) => api.delete(`/resume/${id}`),
};

export const jobAPI = {
    create: (data: { title: string; description: string; required_skills?: string[] }) =>
        api.post('/job/create', data),
    list: () => api.get('/job/list'),
    get: (id: string) => api.get(`/job/${id}`),
};

export const analysisAPI = {
    analyze: (data: { resume_id: string; job_id: string }) =>
        api.post('/analysis/analyze', data),
    history: () => api.get('/analysis/history'),
    get: (id: string) => api.get(`/analysis/${id}`),
};

export const chatAPI = {
    sendMessage: (data: { message: string; context_type?: string; context_id?: string }) =>
        api.post('/chat/message', data),
    history: (limit?: number) => api.get(`/chat/history${limit ? `?limit=${limit}` : ''}`),
};

export const advancedAPI = {
    realityCheck: (resumeId: string, jobId: string) =>
        api.post('/advanced/reality-check', null, { params: { resume_id: resumeId, job_id: jobId } }),
    skillImpact: (resumeId: string, jobId: string, skill: string) =>
        api.post('/advanced/skill-impact', null, { params: { resume_id: resumeId, job_id: jobId, skill } }),
    rejectionSimulator: (resumeId: string, jobId: string) =>
        api.post('/advanced/rejection-simulator', null, { params: { resume_id: resumeId, job_id: jobId } }),
    firstImpression: (resumeId: string, jobId: string) =>
        api.post('/advanced/first-impression', null, { params: { resume_id: resumeId, job_id: jobId } }),
    fakeDetector: (resumeId: string) =>
        api.post('/advanced/fake-detector', null, { params: { resume_id: resumeId } }),
    projectGenerator: (resumeId: string, jobId: string) =>
        api.post('/advanced/project-generator', null, { params: { resume_id: resumeId, job_id: jobId } }),
    careerPath: (resumeId: string, targetRole: string) =>
        api.post('/advanced/career-path', null, { params: { resume_id: resumeId, target_role: targetRole } }),
    competitionAnalysis: (resumeId: string, jobId: string) =>
        api.post('/advanced/competition-analysis', null, { params: { resume_id: resumeId, job_id: jobId } }),
    resumeHeatmap: (resumeId: string, jobId: string) =>
        api.post('/advanced/resume-heatmap', null, { params: { resume_id: resumeId, job_id: jobId } }),
    coverLetter: (resumeId: string, jobId: string, companyName?: string) =>
        api.post('/advanced/cover-letter', null, { params: { resume_id: resumeId, job_id: jobId, company_name: companyName || 'the company' } }),
    simplifyJD: (jobId: string) =>
        api.post('/advanced/simplify-jd', null, { params: { job_id: jobId } }),
    applyReadiness: (resumeId: string, jobId: string) =>
        api.post('/advanced/apply-readiness', null, { params: { resume_id: resumeId, job_id: jobId } }),
    rankCandidates: (jobId: string) =>
        api.post('/advanced/rank-candidates', null, { params: { job_id: jobId } }),
};

export default api;
