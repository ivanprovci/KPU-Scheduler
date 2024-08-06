document.addEventListener('DOMContentLoaded', function () {
    function filterTable() {
        const filterInputs = document.querySelectorAll('.filter-input');
        const rows = document.querySelectorAll('.schedule-table tbody tr');

        rows.forEach(row => {
            let showRow = true;

            // Skip the first cell which is the checkbox column
            filterInputs.forEach((input, index) => {
                const filterValue = input.value.toLowerCase();
                const cell = row.cells[index + 1]; // Adjust the index by +1 to skip checkbox column

                if (cell) {
                    const cellText = cell.textContent.toLowerCase();
                    if (!cellText.includes(filterValue)) {
                        showRow = false;
                    }
                }
            });

            row.style.display = showRow ? '' : 'none';
        });
    }

    const filterInputs = document.querySelectorAll('.filter-input');

    filterInputs.forEach(input => {
        input.addEventListener('input', filterTable);
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterTable();
            }
        });
    });

    filterTable();
});