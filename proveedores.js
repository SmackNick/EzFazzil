const apiUrl = 'https://proveedoresdup-worker.npalston.workers.dev'

// Pagination Variables
let currentPage = 1;
const rowsPerPage = 10;
let totalPages = 1;
let suppliersData = [];
let filteredData = [];
let showAllSuppliers = false; // Flag for showing all suppliers

// Fetch the supplier data from Google Sheets
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const rows = data.values;
        if (rows && rows.length > 1) {
            suppliersData = rows.slice(1); // Exclude header row
            filteredData = suppliersData; // Initially set filteredData to full data
            totalPages = Math.ceil(filteredData.length / rowsPerPage);
            populateFilters(suppliersData); // Populate filters based on all suppliers
            updatePagination();
        }
    })
    .catch(error => {
        console.error('Error fetching supplier data:', error);
    });

// Display the supplier data in the table (pagination)
function displaySuppliers(data, page) {
    const tableBody = document.querySelector('#proveedores-table tbody');
    tableBody.innerHTML = ''; // Clear existing data

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((row) => {
        if (row.length >= 9) {
            // Create clickable Instagram hashtag link
            const hashtagLink = row[8] ? `<a href="https://www.instagram.com/explore/tags/${row[8].replace('#', '')}" target="_blank">${row[8]}</a>` : ''; 

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row[0]}</td>   <!-- Number -->
                <td>${row[1]}</td>   <!-- Supplier Name -->
                <td>${row[2]}</td>   <!-- Contact Name -->
                <td>${row[3]}</td>   <!-- City -->
                <td>${row[4]}</td>   <!-- Region -->
                <td>${row[5]}</td>   <!-- Service Category -->
                <td>${row[6]}</td>   <!-- Sub-Category -->
                <td>${row[7]}</td>   <!-- Contact Info -->
                <td>${hashtagLink}</td>   <!-- Instagram Hashtag as link -->
                <td>${row[9]}</td>   <!-- Rating -->
            `;
            tableBody.appendChild(tr);
        }
    });
}

// Populate the filters with unique options
function populateFilters(data) {
    const cityFilter = document.querySelector('#filter-city');
    const regionFilter = document.querySelector('#filter-region');
    const categoryFilter = document.querySelector('#filter-category');

    const cities = new Set();
    const regions = new Set();
    const categories = new Set();

    data.forEach((row) => {
        if (row.length >= 9) {
            cities.add(row[3]);
            regions.add(row[4]);
            categories.add(row[5]);
        }
    });

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });

    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
    });

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Add event listeners to filter on change
    cityFilter.addEventListener('change', filterSuppliers);
    regionFilter.addEventListener('change', filterSuppliers);
    categoryFilter.addEventListener('change', filterSuppliers);
}

// Filter the suppliers automatically when a filter changes
function filterSuppliers() {
    const cityFilter = document.querySelector('#filter-city').value.toLowerCase();
    const regionFilter = document.querySelector('#filter-region').value.toLowerCase();
    const categoryFilter = document.querySelector('#filter-category').value.toLowerCase();

    filteredData = suppliersData.filter(row => {
        const city = row[3].toLowerCase();
        const region = row[4].toLowerCase();
        const category = row[5].toLowerCase();

        const matchesCity = city.includes(cityFilter) || cityFilter === '';
        const matchesRegion = region.includes(regionFilter) || regionFilter === '';
        const matchesCategory = category.includes(categoryFilter) || categoryFilter === '';

        return matchesCity && matchesRegion && matchesCategory;
    });

    currentPage = 1;
    totalPages = Math.ceil(filteredData.length / rowsPerPage);
    showAllSuppliers = false; // Reset show all
    displaySuppliers(filteredData, currentPage);
    updatePagination();
}

// Clear filters and reset the table
document.querySelector('.clear-filters').addEventListener('click', () => {
    document.querySelector('#filter-city').value = '';
    document.querySelector('#filter-region').value = '';
    document.querySelector('#filter-category').value = '';

    filteredData = suppliersData;
    currentPage = 1;
    totalPages = Math.ceil(filteredData.length / rowsPerPage);
    displaySuppliers(filteredData, currentPage);
    updatePagination();
});

// Show all suppliers when clicking "Mostrar Todos"
document.querySelector('.show-all').addEventListener('click', () => {
    showAllSuppliers = true;
    displaySuppliers(suppliersData, currentPage);
    totalPages = Math.ceil(suppliersData.length / rowsPerPage);
    updatePagination();
});

// Pagination Controls
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displaySuppliers(filteredData, currentPage);
        updatePagination();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        displaySuppliers(filteredData, currentPage);
        updatePagination();
    }
});

// Update the pagination controls
function updatePagination() {
    document.getElementById('page-info').textContent = `Página ${currentPage} de ${totalPages}`;

    // Disable/Enable the Previous button
    document.getElementById('prev-page').disabled = currentPage === 1;

    // Disable/Enable the Next button
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Toggle for hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
console.log(hamburger, navLinks);  // Check if these elements exist in the page


if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
}

// Add event listener for search input
document.getElementById('search-bar').addEventListener('input', filterSuppliers);

function filterSuppliers() {
    const searchQuery = document.querySelector('#search-bar').value.toLowerCase();
    const cityFilter = document.querySelector('#filter-city').value.toLowerCase();
    const regionFilter = document.querySelector('#filter-region').value.toLowerCase();
    const categoryFilter = document.querySelector('#filter-category').value.toLowerCase();

    filteredData = suppliersData.filter(row => {
        const supplierName = row[1].toLowerCase();
        const contactName = row[2].toLowerCase();
        const category = row[5].toLowerCase();
        const subcategory = row[6].toLowerCase();
        const city = row[3].toLowerCase();
        const region = row[4].toLowerCase();

        const matchesSearch = supplierName.includes(searchQuery) || contactName.includes(searchQuery) || category.includes(searchQuery) || subcategory.includes(searchQuery);
        const matchesCity = city.includes(cityFilter) || cityFilter === '';
        const matchesRegion = region.includes(regionFilter) || regionFilter === '';
        const matchesCategory = category.includes(categoryFilter) || categoryFilter === '';

        return matchesSearch && matchesCity && matchesRegion && matchesCategory;
    });

    currentPage = 1;
    totalPages = Math.ceil(filteredData.length / rowsPerPage);
    displaySuppliers(filteredData, currentPage);
    updatePagination();
}
