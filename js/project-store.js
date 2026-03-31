import { cloudinaryConfigured, cloudinarySettings, database, firebaseConfigured, get, ref, remove, set } from './firebase-config.js';
import { FALLBACK_PROJECTS } from './fallback-data.js';

const STORAGE_KEY = 'dpazglass.projects';
const DB_PATH = 'siteContent/projects';

function normalizeProject(project, index = 0) {
    return {
        id: project.id || `projeto-${Date.now()}-${index}`,
        title: project.title || 'Projeto sem título',
        location: project.location || 'Local não informado',
        category: project.category || 'box',
        description: project.description || '',
        imageUrl: project.imageUrl || FALLBACK_PROJECTS[index % FALLBACK_PROJECTS.length].imageUrl,
        featured: Boolean(project.featured),
        order: Number(project.order || index + 1)
    };
}

function sortProjects(projects) {
    return [...projects].sort((a, b) => a.order - b.order);
}

function getLocalProjects() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(FALLBACK_PROJECTS));
        return FALLBACK_PROJECTS;
    }

    try {
        return sortProjects(JSON.parse(raw).map(normalizeProject));
    } catch (error) {
        console.error('Falha ao ler projetos locais:', error);
        return FALLBACK_PROJECTS;
    }
}

function setLocalProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortProjects(projects.map(normalizeProject))));
}

export async function getProjects() {
    if (firebaseConfigured && database) {
        try {
            const snapshot = await get(ref(database, DB_PATH));
            if (snapshot.exists()) {
                return sortProjects(Object.values(snapshot.val()).map(normalizeProject));
            }
        } catch (error) {
            console.error('Falha ao ler projetos do Firebase:', error);
        }
    }

    return getLocalProjects();
}

export async function saveProject(project) {
    const normalized = normalizeProject(project);
    if (firebaseConfigured && database) {
        await set(ref(database, `${DB_PATH}/${normalized.id}`), normalized);
        return normalized;
    }

    const next = getLocalProjects().filter((item) => item.id !== normalized.id).concat(normalized);
    setLocalProjects(next);
    return normalized;
}

export async function deleteProject(projectId) {
    if (firebaseConfigured && database) {
        await remove(ref(database, `${DB_PATH}/${projectId}`));
        return;
    }

    setLocalProjects(getLocalProjects().filter((item) => item.id !== projectId));
}

export async function uploadProjectImage(blob, fileName = 'projeto.jpg') {
    if (!cloudinaryConfigured) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ secure_url: reader.result, public_id: `local-${Date.now()}` });
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    const formData = new FormData();
    formData.append('file', blob, fileName);
    formData.append('upload_preset', cloudinarySettings.uploadPreset);
    formData.append('folder', cloudinarySettings.folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinarySettings.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Não foi possível enviar a imagem ao Cloudinary.');
    }

    return response.json();
}
