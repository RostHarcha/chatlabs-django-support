function updateTicketAssignment(assignmentData) {
    const ticketElement = document.querySelector(`[data-ticket-id="${assignmentData.id}"]`);
    if (ticketElement) {
        ticketElement.querySelector(".support-manager").textContent = `Менеджер: ${assignmentData.support_manager}`;
    }
}