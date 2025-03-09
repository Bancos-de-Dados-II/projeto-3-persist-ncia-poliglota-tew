let map;

// Inicializa o mapa quando a página é carregada
function inicializarMapa() {
    map = L.map('map').setView([-15.7942, -47.8822], 4); // Coordenadas iniciais (Brasil)

    // Adiciona o tile layer ao mapa (camada visual)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);
}

// Adiciona os marcadores dos eventos no mapa
async function adicionarMarcadores() {
    try {
        const response = await fetch(API_URL);
        const eventos = await response.json();

        eventos.forEach(evento => {
            const [lat, lng] = evento.localizacao.coordinates;

            // Adiciona um marcador ao mapa
            L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`
                    <strong>${evento.titulo}</strong><br>
                    ${evento.descricao}<br>
                    Data: ${new Date(evento.data).toLocaleDateString()}<br>
                    Hora: ${evento.hora}
                `);
        });
    } catch (err) {
        console.error('Erro ao adicionar marcadores:', err);
    }
}

// Função para centralizar o mapa na localização do usuário
let userCoords = null;
function localizacaoAtual() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userCoords = [position.coords.latitude, position.coords.longitude];

                map.setView([userCoords[0], userCoords[1]], 13);

                L.marker([userCoords[0], userCoords[1]])
                    .addTo(map)
                    .bindPopup('Você está aqui!')
                    .openPopup();
            },
            (error) => {
                console.error('Erro ao acessar geolocalização:', error.message);
                alert('Não foi possível acessar sua localização. Certifique-se de que a permissão foi concedida.');
            }
        );
    } else {
        alert('Seu navegador não suporta geolocalização.');
    }
}

// Função para calcular a distância entre dois pontos (Fórmula de Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; 

    return distancia.toFixed(2); 
}


// Função chamada ao clicar em "Ver Distância"
function verDistancia(lat, lng) {
    if (!userCoords) {
        alert("Localização do usuário não encontrada. Ative a geolocalização.");
        return;
    }

    const distancia = calcularDistancia(userCoords[0], userCoords[1], lat, lng);
    alert(`A distância até o evento é de ${distancia} km.`);
}


// Chama as funções ao carregar a página
window.onload = function () {
    inicializarMapa();
    localizacaoAtual();
    adicionarMarcadores();
};