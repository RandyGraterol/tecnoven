// Función para reproducir sonido de notificación
function playNotificationSound() {
    const sound = document.getElementById('notification-sound');
    sound.currentTime = 0; // Reiniciar el sonido si ya se está reproduciendo
    sound.play().catch(e => console.log("Error al reproducir sonido:", e));
}

// Función para mostrar notificación toast
function showToastNotification(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastId = 'toast-' + Date.now();
    const icon = type === 'error' ? 'exclamation-triangle' : 
                type === 'success' ? 'check-circle' : 'info-circle';
    
    const toastHTML = `
        <div id="${toastId}" class="toast show align-items-center text-white bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${icon} me-2"></i>
                    <strong>${title}</strong> - ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Eliminar el toast después de 5 segundos
    setTimeout(() => {
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            toastElement.classList.remove('show');
            setTimeout(() => toastElement.remove(), 300);
        }
    }, 5000);
}

// Función para actualizar el contador de notificaciones
function updateNotificationCounter(count) {
    const counters = document.querySelectorAll('.badge-counter, .sidebar-alert-counter');
    counters.forEach(counter => {
        counter.textContent = count > 9 ? '9+' : count;
        counter.style.display = count > 0 ? 'inline-block' : 'none';
    });
}

// Función para marcar notificación como leída
async function markNotificationAsRead(notificationId) {
    try {
        const response = await fetch(`/api/notifications/${notificationId}/read`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        return false;
    }
}

// Escuchar clics en notificaciones
document.addEventListener('click', async (e) => {
    if (e.target.closest('.mark-read')) {
        e.preventDefault();
        const notificationId = e.target.closest('.mark-read').dataset.id;
        const success = await markNotificationAsRead(notificationId);
        
        if (success) {
            e.target.closest('tr').classList.remove('font-weight-bold');
            e.target.closest('.mark-read').remove();
        }
    }
});

// Función para verificar nuevas alertas
async function checkForNewAlerts() {
    try {
        const response = await fetch('/api/alerts/unread-count');
        if (response.ok) {
            const data = await response.json();
            if (data.count > 0) {
                updateNotificationCounter(data.count);
                
                // Solo reproducir sonido y mostrar toast si hay nuevas alertas
                if (data.newAlerts > 0) {
                    playNotificationSound();
                    
                    // Mostrar toast para cada nueva alerta
                    data.latestAlerts.forEach(alert => {
                        showToastNotification(
                            `Canal ${alert.channelName || 'Sistema'}`,
                            alert.message,
                            alert.type
                        );
                    });
                }
            } else {
                updateNotificationCounter(0);
            }
        }
    } catch (error) {
        console.error('Error al verificar alertas:', error);
    }
}

// Verificar alertas cada 30 segundos
setInterval(checkForNewAlerts, 30000);

// Verificar al cargar la página
document.addEventListener('DOMContentLoaded', checkForNewAlerts);