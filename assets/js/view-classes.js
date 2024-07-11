document.addEventListener('DOMContentLoaded', function () {
    // Select all dropdown toggles for filter buttons
    const dropdownToggles = document.querySelectorAll('.filter-button.dropdown-toggle');

    // Add click event listener to each dropdown toggle
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            // Find the corresponding dropdown menu
            const dropdownMenu = toggle.nextElementSibling;
            // Toggle the 'show' class to display or hide the dropdown menu
            dropdownMenu.classList.toggle('show');
        });
    });

    // Select all dropdown items within filter dropdown menus
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Add click event listener to each dropdown item
    dropdownItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor tag behavior
            // Get the selected text content
            const selectedText = item.textContent.trim();
            // Find the parent dropdown menu toggle button
            const dropdownToggle = item.closest('.dropdown').querySelector('.filter-button');
            // Update the dropdown toggle button text with selected text
            dropdownToggle.textContent = selectedText;
            // Set focus back to the dropdown toggle button
            dropdownToggle.focus();
            // Remove 'show' class to hide the dropdown menu
            dropdownToggle.classList.remove('show');
            // Call function to fetch and update table based on selected text
            fetchAndUpdateTable(selectedText);
        });
    });

    // Function placeholder for fetching and updating table data
    function fetchAndUpdateTable(selectedText) {
        // Implement your logic here to fetch data based on selectedText
        // Example: fetch(`/api/classes?filter=${selectedText}`)
        //          .then(response => response.json())
        //          .then(data => {
        //              // Update table content dynamically
        //          })
        //          .catch(error => console.error('Error fetching classes:', error));
    }
});
