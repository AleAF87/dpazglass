import { auth, database, firebaseConfigured, get, onAuthStateChanged, ref, signInWithEmailAndPassword, signOut } from './firebase-config.js';
import { deleteProject, getProjects, saveProject, uploadProjectImage } from './project-store.js';

const loginCard = document.getElementById('loginCard');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const projectForm = document.getElementById('projectForm');
const projectList = document.getElementById('projectList');
const projectCount = document.getElementById('projectCount');
const configStatus = document.getElementById('configStatus');
const adminStatus = document.getElementById('adminStatus');
const demoModeBtn = document.getElementById('demoModeBtn');
const logoutBtn = document.getElementById('logoutBtn');
const newProjectBtn = document.getElementById('newProjectBtn');
const deleteProjectBtn = document.getElementById('deleteProjectBtn');
const imageFileInput = document.getElementById('imageFileInput');
const cropperImage = document.getElementById('cropperImage');
const previewImage = document.getElementById('previewImage');
const ratioLandscapeBtn = document.getElementById('ratioLandscapeBtn');
const ratioSquareBtn = document.getElementById('ratioSquareBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');

let cropper = null;
let currentProjects = [];
let localMode = false;

async function hasAdminAccess(user) {
    if (!database || !user?.uid) return false;

    try {
        const snapshot = await get(ref(database, `admins/${user.uid}`));
        return snapshot.exists();
    } catch (error) {
        console.error('Falha ao validar acesso administrativo:', error);
        return false;
    }
}

function setStatus(element, text, tone = 'info') {
    element.textContent = text;
    element.dataset.tone = tone;
}

function slugify(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function toggleAdmin(isLoggedIn) {
    loginCard.classList.toggle('is-hidden', isLoggedIn);
    adminPanel.classList.toggle('is-hidden', !isLoggedIn);
}

function resetForm(project = null) {
    projectForm.reset();

    const nextProject = project || {
        id: '',
        title: '',
        location: '',
        category: 'box',
        description: '',
        imageUrl: '',
        featured: false,
        order: currentProjects.length + 1
    };

    projectForm.elements.id.value = nextProject.id || '';
    projectForm.elements.title.value = nextProject.title || '';
    projectForm.elements.location.value = nextProject.location || '';
    projectForm.elements.category.value = nextProject.category || 'box';
    projectForm.elements.description.value = nextProject.description || '';
    projectForm.elements.imageUrl.value = nextProject.imageUrl || '';
    projectForm.elements.order.value = nextProject.order || currentProjects.length + 1;
    projectForm.elements.featured.checked = Boolean(nextProject.featured);
    deleteProjectBtn.disabled = !nextProject.id;

    if (nextProject.imageUrl) {
        previewImage.src = nextProject.imageUrl;
    } else {
        previewImage.removeAttribute('src');
    }
}

function renderProjectList() {
    projectCount.textContent = `${currentProjects.length} itens`;
    projectList.innerHTML = currentProjects.map((project) => `
        <button class="admin-project-item" type="button" data-id="${project.id}">
            <img src="${project.imageUrl}" alt="${project.title}">
            <span><strong>${project.title}</strong><small>${project.location}</small></span>
        </button>
    `).join('');

    document.querySelectorAll('.admin-project-item').forEach((button) => {
        button.addEventListener('click', () => {
            const selected = currentProjects.find((project) => project.id === button.dataset.id);
            resetForm(selected);
            document.querySelectorAll('.admin-project-item').forEach((item) => item.classList.remove('is-active'));
            button.classList.add('is-active');
        });
    });
}

async function refreshProjects() {
    currentProjects = await getProjects();
    renderProjectList();
    resetForm();
}

function buildCropper(file) {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    cropperImage.src = objectUrl;
    previewImage.src = objectUrl;

    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(cropperImage, {
        aspectRatio: 4 / 3,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        responsive: true,
        crop() {
            const instance = cropperImage.cropper;
            if (!instance) return;
            const canvas = instance.getCroppedCanvas({ width: 960, height: 720 });
            previewImage.src = canvas.toDataURL('image/jpeg', 0.9);
        }
    });
}

async function getFinalImageUrl() {
    const manualUrl = projectForm.elements.imageUrl.value.trim();
    const file = imageFileInput.files?.[0];

    if (!file && manualUrl) {
        return manualUrl;
    }

    if (!file && !manualUrl) {
        throw new Error('Informe uma URL de imagem ou selecione um arquivo.');
    }

    if (!cropper) {
        throw new Error('Selecione e enquadre a imagem antes de salvar.');
    }

    const canvas = cropper.getCroppedCanvas({ width: 960, height: 720, imageSmoothingQuality: 'high' });
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    const uploadResult = await uploadProjectImage(blob, file?.name || 'projeto.jpg');
    return uploadResult.secure_url;
}

async function handleSave(event) {
    event.preventDefault();

    try {
        setStatus(adminStatus, 'Salvando projeto...', 'info');
        const title = projectForm.elements.title.value.trim();
        const payload = {
            id: projectForm.elements.id.value || slugify(title) || `projeto-${Date.now()}`,
            title,
            location: projectForm.elements.location.value.trim(),
            category: projectForm.elements.category.value,
            description: projectForm.elements.description.value.trim(),
            imageUrl: await getFinalImageUrl(),
            order: Number(projectForm.elements.order.value || currentProjects.length + 1),
            featured: projectForm.elements.featured.checked
        };

        await saveProject(payload);
        imageFileInput.value = '';
        setStatus(adminStatus, 'Projeto salvo com sucesso.', 'success');
        await refreshProjects();
    } catch (error) {
        console.error(error);
        setStatus(adminStatus, error.message || 'Falha ao salvar o projeto.', 'danger');
    }
}

async function handleDelete() {
    const projectId = projectForm.elements.id.value;
    if (!projectId) return;

    try {
        await deleteProject(projectId);
        setStatus(adminStatus, 'Projeto removido.', 'success');
        await refreshProjects();
    } catch (error) {
        console.error(error);
        setStatus(adminStatus, 'Não foi possível excluir o projeto.', 'danger');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(loginForm);

    if (!firebaseConfigured || !auth) {
        setStatus(configStatus, 'Firebase ainda não foi configurado. Use o modo local para testar.', 'warning');
        return;
    }

    try {
        const credential = await signInWithEmailAndPassword(auth, String(formData.get('email')), String(formData.get('password')));
        const allowed = await hasAdminAccess(credential.user);

        if (!allowed) {
            await signOut(auth);
            setStatus(configStatus, 'Usuario autenticado, mas sem permissao em admins/{uid} no Realtime Database.', 'danger');
            return;
        }

        setStatus(configStatus, 'Login realizado com sucesso.', 'success');
    } catch (error) {
        console.error(error);
        setStatus(configStatus, 'Não foi possível fazer login. Verifique e-mail e senha.', 'danger');
    }
}

function setupCropperControls() {
    ratioLandscapeBtn.addEventListener('click', () => cropper?.setAspectRatio(4 / 3));
    ratioSquareBtn.addEventListener('click', () => cropper?.setAspectRatio(1));
    zoomInBtn.addEventListener('click', () => cropper?.zoom(0.1));
    zoomOutBtn.addEventListener('click', () => cropper?.zoom(-0.1));
    imageFileInput.addEventListener('change', () => buildCropper(imageFileInput.files?.[0]));
}

function setupEvents() {
    loginForm.addEventListener('submit', handleLogin);
    projectForm.addEventListener('submit', handleSave);
    deleteProjectBtn.addEventListener('click', handleDelete);
    newProjectBtn.addEventListener('click', () => resetForm());
    demoModeBtn.addEventListener('click', async () => {
        localMode = true;
        toggleAdmin(true);
        await refreshProjects();
        setStatus(adminStatus, 'Modo local ativo. Os dados serão salvos no navegador.', 'warning');
    });
    logoutBtn.addEventListener('click', async () => {
        if (auth && !localMode) {
            await signOut(auth);
        }

        localMode = false;
        toggleAdmin(false);
    });
    setupCropperControls();
}

function describeConfiguration() {
    if (firebaseConfigured) {
        setStatus(configStatus, 'Firebase configurado. Libere cada admin em admins/{uid} no Realtime Database.', 'success');
    } else {
        setStatus(configStatus, 'Edite js/firebase-config.js para ativar Firebase e Cloudinary.', 'warning');
    }
}

function setupAuthObserver() {
    if (!firebaseConfigured || !auth) return;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const allowed = await hasAdminAccess(user);
            if (!allowed) {
                await signOut(auth);
                setStatus(configStatus, 'Cadastre o usuario em admins/{uid} no Realtime Database para liberar o painel.', 'warning');
                return;
            }

            toggleAdmin(true);
            await refreshProjects();
            setStatus(adminStatus, `Sessão ativa para ${user.email}.`, 'success');
            return;
        }

        if (!localMode) {
            toggleAdmin(false);
        }
    });
}

function init() {
    describeConfiguration();
    setupEvents();
    setupAuthObserver();
    resetForm();
}

init();
