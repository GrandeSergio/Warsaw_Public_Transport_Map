// Initialize tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Add event listener to document body to hide tooltips with a delay on click
document.body.addEventListener('click', function (event) {
    // Check if the click event did not originate from a tooltip or its trigger element
    if (!event.target.matches('[data-bs-toggle="tooltip"], .tooltip')) {
        // Hide all visible tooltips with a delay of 300 milliseconds (adjust the delay as needed)
        tooltipList.forEach(function (tooltip) {
            setTimeout(function () {
                tooltip.hide();
            }, 400); // Delay in milliseconds (300ms in this example)
        });
    }
});

document.getElementById('aboutButton').addEventListener('click', function () {
    const aboutContainer = document.getElementById('aboutContainer');
    aboutContainer.classList.toggle('show');
});
document.getElementById('closeAboutButton').addEventListener('click', function () {
    const aboutContainer = document.getElementById('aboutContainer');
    aboutContainer.classList.remove('show');
});