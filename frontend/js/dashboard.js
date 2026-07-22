const searchInput = document.getElementById("search");

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

const tableBody = document.getElementById("jobTableBody");
const addJobBtn = document.getElementById("addJobBtn");
const jobFormContainer = document.getElementById("jobFormContainer");
const jobForm = document.getElementById("jobForm");

let editMode = false;
let editingJobId = null;

// Toggle Add Job Form
addJobBtn.addEventListener("click", () => {

    if (jobFormContainer.style.display === "none" || jobFormContainer.style.display === "") {
        jobFormContainer.style.display = "block";
    } else {
        jobFormContainer.style.display = "none";
    }

});

// Save Job
jobForm.addEventListener("submit", saveJob);

searchInput.addEventListener("keyup", searchJobs);

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", logout);

// Load jobs when dashboard opens
loadJobs();

async function loadJobs() {

    try {

        const response = await fetch(`${API_BASE_URL}/jobs`, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        if (!response.ok) {
            throw new Error("Unable to load jobs");
        }

        const jobs = await response.json();

        displayJobs(jobs);

    } catch (error) {

        alert(error.message);

    }

}

function displayJobs(jobs) {

    tableBody.innerHTML = "";

    if(jobs.length===0){

    tableBody.innerHTML=`
        <tr>
            <td colspan="5" style="text-align:center">
                No Jobs Found
            </td>
        </tr>
    `;

    return;
    }

    jobs.forEach(job => {

        tableBody.innerHTML += `
            <tr>
                <td>${job.company}</td>
                <td>${job.role}</td>
                <td>${job.location}</td>
                <td>
                    <span class="status ${job.status.toLowerCase()}">
                    ${job.status}
                    </span>
                </td>
                <td>
                    <button class="edit-btn" onclick="editJob(${job.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteJob(${job.id})">Delete</button>
                </td>
            </tr>
        `;

    });

}

async function editJob(id) {

    try {

        const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        if (!response.ok) {
            throw new Error("Unable to load job");
        }

        const job = await response.json();

        document.getElementById("company").value = job.company;
        document.getElementById("role").value = job.role;
        document.getElementById("location").value = job.location;
        document.getElementById("status").value = job.status;

        jobFormContainer.style.display = "block";

        editMode = true;
        editingJobId = id;

        jobForm.querySelector("button").textContent = "Update Job";

    } catch (error) {

        alert(error.message);

    }

}

async function saveJob(event) {

    event.preventDefault();

    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value.trim();
    const location = document.getElementById("location").value.trim();
    const status = document.getElementById("status").value;

    try {

        const url = editMode
            ? `${API_BASE_URL}/jobs/${editingJobId}`
            : `${API_BASE_URL}/jobs`;

        const method = editMode ? "PUT" : "POST";

        const response = await fetch(url, {

    method: method,

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                company,
                role,
                location,
                status
            })

        });

        if (!response.ok) {
            throw new Error("Unable to save job");
        }

        jobForm.reset();

        jobFormContainer.style.display = "none";

        editMode = false;
        editingJobId = null;

        jobForm.querySelector("button").textContent = "Save Job";

        loadJobs();

    } catch (error) {

        alert(error.message);

    }

}

async function deleteJob(id) {

    const confirmDelete = confirm("Are you sure you want to delete this job?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {

            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        if (!response.ok) {
            throw new Error("Unable to delete job");
        }

        loadJobs();

    } catch (error) {

        alert(error.message);

    }

}

async function searchJobs() {

    const company = searchInput.value.trim();

    if (company === "") {
        loadJobs();
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/jobs/company/search?company=${encodeURIComponent(company)}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Unable to search jobs");
        }

        const jobs = await response.json();

        displayJobs(jobs);

    } catch (error) {

        alert(error.message);

    }

}

function logout() {

    localStorage.removeItem("token");

    window.location.href = "index.html";

}