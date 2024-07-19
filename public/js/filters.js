document.addEventListener('DOMContentLoaded', function () {
    function filterTable() {
        const filterInputs = document.querySelectorAll('.filter-input');
        const rows = document.querySelectorAll('.schedule-table tbody tr');

        rows.forEach(row => {
            let showRow = true;

            if (row.cells.length === 0 || row.cells[0].textContent.trim() === '') {
                row.style.display = '';
                return;
            }

            filterInputs.forEach((input, index) => {
                const filterValue = input.value.toLowerCase();
                const cell = row.cells[index];

                if (cell) {
                    const cellText = cell.textContent.toLowerCase();
                    if (!cellText.includes(filterValue)) {
                        showRow = false;
                    }
                }
            });

            console.log(`Row display status: ${showRow}`); // Debug line
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