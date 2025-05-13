// Función para verificar el estado de los canales
async function checkChannelsStatus() {
    try {
        // Mostrar indicador de carga
        const refreshBtn = document.getElementById('refresh-channels') || 
                          document.getElementById('manual-check-btn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin fa-sm text-white-50"></i> Verificando...';
            refreshBtn.disabled = true;
        }

        const response = await fetch('/api/channels/check');
        if (response.ok) {
            const data = await response.json();
            updateChannelsStatus(data);
            
            // Mostrar notificación si hay canales caídos
            if (data.downChannels > 0) {
                showToastNotification(
                    'Canales Caídos',
                    `${data.downChannels} canal(es) están caídos`,
                    'error'
                );
                playNotificationSound();
            }
        } else {
            console.error('Error al verificar canales');
            showToastNotification(
                'Error',
                'No se pudo verificar el estado de los canales',
                'error'
            );
        }
    } catch (error) {
        console.error('Error al verificar canales:', error);
        showToastNotification(
            'Error',
            'Error de conexión al verificar canales',
            'error'
        );
    } finally {
        // Restaurar botón
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-sm text-white-50"></i> Actualizar';
            refreshBtn.disabled = false;
        }
    }
}

// Función para actualizar la UI con el estado de los canales
function updateChannelsStatus(data) {
    // Actualizar contadores
    if (document.getElementById('active-channels')) {
        document.getElementById('active-channels').textContent = data.activeChannels;
    }
    if (document.getElementById('latency-channels')) {
        document.getElementById('latency-channels').textContent = data.latencyChannels;
    }
    if (document.getElementById('down-channels')) {
        document.getElementById('down-channels').textContent = data.downChannels;
    }

    // Actualizar tabla de canales si existe
    if (document.getElementById('channelsTable')) {
        data.channels.forEach(channel => {
            const row = document.querySelector(`#channelsTable tr[data-id="${channel.id}"]`);
            if (row) {
                // Actualizar estado
                row.className = channel.status === 'down' ? 'table-danger' : 
                               channel.status === 'latency' ? 'table-warning' : 'table-success';
                
                // Actualizar celdas
                row.cells[3].innerHTML = `
                    <span class="badge badge-${channel.status === 'down' ? 'danger' : 
                                          channel.status === 'latency' ? 'warning' : 'success'}">
                        ${channel.status === 'down' ? 'Caído' : 
                          channel.status === 'latency' ? 'Latencia' : 'Activo'}
                    </span>
                `;
                row.cells[4].textContent = channel.lastCheck;
                row.cells[5].textContent = channel.latency ? `${channel.latency} ms` : 'N/A';
            }
        });
    }

    // Actualizar gráfico si existe
    if (window.channelChart) {
        updateChannelChart(data);
    }
}

// Función para actualizar el gráfico de estado de canales
function updateChannelChart(data) {
    window.channelChart.data.datasets[0].data = [
        data.activeChannels, 
        data.latencyChannels, 
        data.downChannels
    ];
    window.channelChart.update();
}

// Inicializar gráfico si existe el canvas
if (document.getElementById('channelStatusChart')) {
    const ctx = document.getElementById('channelStatusChart').getContext('2d');
    window.channelChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Activos', 'Con Latencia', 'Caídos'],
            datasets: [{
                data: [0, 0, 0], // Valores iniciales
                backgroundColor: [
                    'rgba(28, 200, 138, 0.8)',
                    'rgba(246, 194, 62, 0.8)',
                    'rgba(231, 74, 59, 0.8)'
                ],
                hoverBackgroundColor: [
                    'rgba(28, 200, 138, 1)',
                    'rgba(246, 194, 62, 1)',
                    'rgba(231, 74, 59, 1)'
                ],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
            },
            cutout: '70%',
        },
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Botón de verificación manual
    const manualCheckBtn = document.getElementById('manual-check-btn');
    if (manualCheckBtn) {
        manualCheckBtn.addEventListener('click', function(e) {
            e.preventDefault();
            checkChannelsStatus();
        });
    }

    // Botón de refrescar canales
    const refreshChannelsBtn = document.getElementById('refresh-channels');
    if (refreshChannelsBtn) {
        refreshChannelsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            checkChannelsStatus();
        });
    }

    // Botones de verificación individual
    document.querySelectorAll('.check-now').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const channelId = this.dataset.id;
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            try {
                const response = await fetch(`/api/channels/${channelId}/check`);
                if (response.ok) {
                    const data = await response.json();
                    showToastNotification(
                        `Canal ${data.channel.name}`,
                        `Estado: ${data.channel.status === 'down' ? 'Caído' : 
                                 data.channel.status === 'latency' ? 'Con Latencia' : 'Activo'}`,
                        data.channel.status === 'down' ? 'error' : 
                        data.channel.status === 'latency' ? 'warning' : 'success'
                    );
                    
                    // Actualizar fila en la tabla
                    const row = this.closest('tr');
                    row.className = data.channel.status === 'down' ? 'table-danger' : 
                                    data.channel.status === 'latency' ? 'table-warning' : 'table-success';
                    
                    row.cells[3].innerHTML = `
                        <span class="badge badge-${data.channel.status === 'down' ? 'danger' : 
                                                  data.channel.status === 'latency' ? 'warning' : 'success'}">
                            ${data.channel.status === 'down' ? 'Caído' : 
                              data.channel.status === 'latency' ? 'Latencia' : 'Activo'}
                        </span>
                    `;
                    row.cells[4].textContent = data.channel.lastCheck;
                    row.cells[5].textContent = data.channel.latency ? `${data.channel.latency} ms` : 'N/A';
                }
            } catch (error) {
                console.error('Error al verificar canal:', error);
                showToastNotification(
                    'Error',
                    'No se pudo verificar el canal',
                    'error'
                );
            } finally {
                this.innerHTML = '<i class="fas fa-sync-alt"></i>';
                this.disabled = false;
            }
        });
    });
});