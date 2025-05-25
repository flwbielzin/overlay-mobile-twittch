// Overlay Mobile - JavaScript
class MobileOverlay {
    constructor() {
        this.isInitialized = false;
        this.updateInterval = null;
        this.uptimeInterval = null; // Separar o intervalo do uptime
        this.startTime = null; // Só iniciar quando stream estiver ao vivo
        this.isLive = false; // Status da stream
        this.followers = [];
        this.chatMessages = [];
        this.currentData = {
            viewers: 0,
            followers: 0,
            title: 'Carregando...',
            game: 'Carregando...',
            avatar: '',
            streamerName: 'Carregando...'
        };
    }

    // Inicializar overlay
    async initialize() {
        try {
            console.log('📱 Inicializando overlay mobile...');
            
            // Conectar à API da Twitch
            await this.connectToTwitch();
            
            // Configurar chat simulado
            this.setupChat();
            
            // Iniciar atualizações automáticas
            this.startUpdates();
            
            // Configurar eventos
            this.setupEvents();
            
            // Configurar localização
            this.setupLocation();
            
            this.isInitialized = true;
            console.log('✅ Overlay mobile inicializado!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar overlay mobile:', error);
        }
    }

    // Conectar à API da Twitch
    async connectToTwitch() {
        try {
            // Verificar se twitchAPI está disponível
            if (typeof twitchAPI === 'undefined') {
                console.warn('⚠️ API da Twitch não encontrada, usando dados simulados');
                this.useSimulatedData();
                return;
            }

            console.log('🔄 Tentando conectar à API da Twitch...');
            
            // Obter informações do canal
            const channelInfo = await twitchAPI.getChannelInfo();
            
            if (channelInfo) {
                console.log('✅ Dados da API obtidos:', channelInfo);
                this.updateChannelInfo(channelInfo);
                console.log('✅ Conectado à API da Twitch');
            } else {
                console.warn('⚠️ Sem dados da API, usando simulação');
                this.useSimulatedData();
            }
            
        } catch (error) {
            console.error('❌ Erro na API da Twitch:', error);
            this.useSimulatedData();
        }
    }

    // Usar dados simulados quando API não funciona
    useSimulatedData() {
        console.log('🎭 Usando dados simulados para demonstração');
        
        // Obter nome do canal da configuração
        const channelName = (typeof CONFIG !== 'undefined' && CONFIG.CHANNEL_NAME) ? 
                           CONFIG.CHANNEL_NAME : 'streamer';
        
        // Simular dados realistas baseados na configuração
        this.currentData = {
            viewers: Math.floor(Math.random() * 50) + 10,
            followers: Math.floor(Math.random() * 1000) + 500, // REMOVIDO valor fixo
            title: 'Live IRL - Explorando a cidade!',
            game: 'IRL',
            avatar: `https://static-cdn.jtvnw.net/jtv_user_pictures/${channelName}-profile_image-300x300.png`,
            streamerName: channelName.charAt(0).toUpperCase() + channelName.slice(1) // Capitalizar primeira letra
        };
        
        // Simular que está ao vivo
        this.isLive = true;
        this.startTime = new Date();
        
        this.updateDisplay();
        
        // Simular mudanças nos dados
        setInterval(() => {
            this.simulateDataChanges();
        }, 10000);
    }

    // Simular mudanças nos dados
    simulateDataChanges() {
        // Variar viewers
        const viewerChange = Math.floor(Math.random() * 6) - 3; // -3 a +3
        this.currentData.viewers = Math.max(1, this.currentData.viewers + viewerChange);
        
        // Ocasionalmente adicionar seguidor
        if (Math.random() < 0.1) { // 10% de chance
            this.currentData.followers++;
            this.addNewFollower(`Viewer${Math.floor(Math.random() * 1000)}`);
        }
        
        this.updateDisplay();
    }

    // Atualizar informações do canal
    updateChannelInfo(channelInfo) {
        console.log('📊 Atualizando informações do canal:', channelInfo);
        
        this.currentData = {
            viewers: channelInfo.viewer_count || 0,
            followers: channelInfo.follower_count || 0,
            title: channelInfo.title || 'Live',
            game: channelInfo.game_name || 'IRL',
            avatar: channelInfo.profile_image_url || '',
            streamerName: channelInfo.display_name || channelInfo.login || 'Streamer'
        };
        
        // Verificar se está ao vivo
        const wasLive = this.isLive;
        this.isLive = channelInfo.is_live || false;
        
        // Se começou a fazer live agora, iniciar o timer
        if (this.isLive && !wasLive) {
            this.startTime = channelInfo.started_at ? new Date(channelInfo.started_at) : new Date();
            console.log('🔴 Stream iniciada!', this.startTime);
        }
        
        // Se parou de fazer live, parar o timer
        if (!this.isLive && wasLive) {
            this.startTime = null;
            console.log('⚫ Stream finalizada!');
        }
        
        console.log('📊 Dados atualizados:', this.currentData);
        this.updateDisplay();
    }

    // Atualizar display
    updateDisplay() {
        console.log('🖥️ Atualizando display com:', this.currentData);
        
        // Atualizar contadores
        this.updateElement('viewers-count-mobile', this.formatNumber(this.currentData.viewers));
        this.updateElement('followers-count-mobile', this.formatNumber(this.currentData.followers));
        
        // Atualizar informações do canal
        this.updateElement('streamer-name-mobile', this.currentData.streamerName);
        this.updateElement('stream-title-mobile', this.currentData.title);
        
        // Atualizar título da página dinamicamente
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            const status = this.isLive ? 'AO VIVO' : 'OFFLINE';
            pageTitle.textContent = `${this.currentData.streamerName} - ${status} | Overlay Mobile`;
        }
        
        // Atualizar avatar
        const avatar = document.getElementById('streamer-avatar-mobile');
        if (avatar && this.currentData.avatar) {
            avatar.src = this.currentData.avatar;
            console.log('🖼️ Avatar atualizado:', this.currentData.avatar);
        }
        
        // Atualizar uptime (só se estiver ao vivo)
        this.updateUptime();
    }

    // Atualizar elemento se existir
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            const oldValue = element.textContent;
            element.textContent = value;
            console.log(`📝 ${id}: "${oldValue}" → "${value}"`);
        } else {
            console.warn(`⚠️ Elemento não encontrado: ${id}`);
        }
    }

    // Formatar números
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Atualizar uptime - CORRIGIDO para só contar quando ao vivo
    updateUptime() {
        const uptimeElement = document.getElementById('stream-uptime-mobile');
        if (!uptimeElement) return;
        
        // Se não está ao vivo ou não tem startTime, mostrar 00:00:00
        if (!this.isLive || !this.startTime) {
            uptimeElement.textContent = '00:00:00';
            return;
        }
        
        const now = new Date();
        const diff = Math.floor((now - this.startTime) / 1000);
        
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        const uptime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        uptimeElement.textContent = uptime;
    }

    // Configurar chat simulado
    setupChat() {
        // Simular mensagens do chat - MAIS SIMPLES E COLORIDO
        const chatMessages = [
            { user: 'João', message: 'Oi! 👋', color: '#ff6b6b' },
            { user: 'Maria', message: 'Show!', color: '#4ecdc4' },
            { user: 'Pedro', message: 'Top!', color: '#45b7d1' },
            { user: 'Ana', message: 'Legal', color: '#96ceb4' },
            { user: 'Carlos', message: 'Massa!', color: '#feca57' },
            { user: 'Luana', message: 'Demais', color: '#ff9ff3' },
            { user: 'Bruno', message: 'Show', color: '#54a0ff' },
            { user: 'Julia', message: 'Top!', color: '#5f27cd' }
        ];
        
        // Adicionar mensagens iniciais - MAIS ESPAÇADO
        chatMessages.forEach((msg, index) => {
            setTimeout(() => {
                this.addChatMessage(msg.user, msg.message, msg.color);
            }, index * 4000); // 4 segundos entre cada
        });
        
        // Continuar adicionando mensagens - MENOS FREQUENTE
        setInterval(() => {
            const randomMsg = chatMessages[Math.floor(Math.random() * chatMessages.length)];
            this.addChatMessage(randomMsg.user, randomMsg.message, randomMsg.color);
        }, 25000 + Math.random() * 20000); // Entre 25-45 segundos
    }

    // Adicionar mensagem ao chat - COM CORES
    addChatMessage(username, message, color = '#9146ff') {
        const chatContainer = document.getElementById('chat-messages-mobile');
        if (!chatContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message-mobile';
        messageElement.innerHTML = `
            <span class="chat-username-mobile" style="color: ${color}">${username}:</span>
            <span class="chat-text-mobile">${message}</span>
        `;
        
        chatContainer.appendChild(messageElement);
        
        // Manter apenas últimas 10 mensagens (menos poluído)
        while (chatContainer.children.length > 10) {
            chatContainer.removeChild(chatContainer.firstChild);
        }
        
        // Auto-scroll
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Obter horário atual
    getCurrentTime() {
        return new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // Adicionar novo seguidor
    addNewFollower(username) {
        // Mostrar alerta
        this.showFollowAlert(username);
        
        // Adicionar à lista
        const followersList = document.getElementById('followers-list-mobile');
        if (!followersList) return;
        
        const followerElement = document.createElement('div');
        followerElement.className = 'follower-item-mobile';
        followerElement.innerHTML = `
            <img class="follower-avatar-mobile" src="https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png" alt="Avatar">
            <span class="follower-name-mobile">${username}</span>
        `;
        
        followersList.insertBefore(followerElement, followersList.firstChild);
        
        // Manter apenas últimos 5 seguidores
        while (followersList.children.length > 5) {
            followersList.removeChild(followersList.lastChild);
        }
    }

    // Mostrar alerta de follow
    showFollowAlert(username) {
        const alertsContainer = document.getElementById('alerts-container-mobile');
        if (!alertsContainer) return;
        
        const alert = document.createElement('div');
        alert.className = 'alert-mobile';
        alert.innerHTML = `
            <h3>Novo Seguidor! 🎉</h3>
            <p>${username} agora está seguindo!</p>
        `;
        
        alertsContainer.appendChild(alert);
        
        // Remover após 4 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 4000);
    }

    // Iniciar atualizações automáticas
    startUpdates() {
        // Atualizar dados a cada 30 segundos
        this.updateInterval = setInterval(async () => {
            try {
                console.log('🔄 Atualizando dados automaticamente...');
                if (typeof twitchAPI !== 'undefined') {
                    const channelInfo = await twitchAPI.getChannelInfo();
                    if (channelInfo) {
                        this.updateChannelInfo(channelInfo);
                    }
                }
                
            } catch (error) {
                console.error('❌ Erro ao atualizar dados:', error);
            }
        }, 30000);
        
        // Atualizar uptime a cada segundo (só se estiver ao vivo)
        this.uptimeInterval = setInterval(() => {
            this.updateUptime();
        }, 1000);
    }

    // Configurar eventos
    setupEvents() {
        // Configurar localização será feita em setupLocation()
    }

    // Configurar localização - MELHORADO
    setupLocation() {
        const locationText = document.getElementById('location-text-mobile');
        if (!locationText) return;
        
        // Tentar obter localização real
        if (navigator.geolocation) {
            console.log('🌍 Tentando obter localização...');
            
            navigator.geolocation.getCurrentPosition(
                // Sucesso
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    console.log('📍 Localização obtida:', lat, lon);
                    
                    // Usar API de geocoding reverso (gratuita)
                    this.getLocationName(lat, lon);
                },
                // Erro
                (error) => {
                    console.warn('⚠️ Erro ao obter localização:', error.message);
                    this.setDefaultLocation();
                },
                // Opções
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutos de cache
                }
            );
        } else {
            console.warn('⚠️ Geolocalização não suportada');
            this.setDefaultLocation();
        }
    }

    // Obter nome da localização usando coordenadas
    async getLocationName(lat, lon) {
        try {
            // Usar API gratuita do OpenStreetMap
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
            
            if (response.ok) {
                const data = await response.json();
                
                let locationName = 'Localização Desconhecida';
                
                if (data.address) {
                    const city = data.address.city || data.address.town || data.address.village;
                    const state = data.address.state;
                    
                    if (city && state) {
                        locationName = `${city}, ${state}`;
                    } else if (city) {
                        locationName = city;
                    } else if (data.display_name) {
                        // Pegar as primeiras duas partes do nome
                        const parts = data.display_name.split(',');
                        locationName = parts.slice(0, 2).join(',').trim();
                    }
                }
                
                console.log('📍 Localização identificada:', locationName);
                this.updateLocation(locationName);
                
            } else {
                throw new Error('Erro na API de geocoding');
            }
            
        } catch (error) {
            console.error('❌ Erro ao obter nome da localização:', error);
            this.setDefaultLocation();
        }
    }

    // Definir localização padrão
    setDefaultLocation() {
        this.updateLocation('São Paulo, SP');
    }

    // Atualizar localização no display
    updateLocation(locationName) {
        const locationText = document.getElementById('location-text-mobile');
        if (locationText) {
            locationText.textContent = locationName;
            console.log('📍 Localização atualizada:', locationName);
        }
    }

    // Parar overlay
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.uptimeInterval) {
            clearInterval(this.uptimeInterval);
        }
        console.log('📱 Overlay mobile parado');
    }
}

// Função para alternar chat
function toggleMobileChat() {
    const chatMessages = document.querySelector('.chat-messages-mobile');
    const toggleButton = document.getElementById('toggle-chat-mobile');
    
    if (chatMessages.style.display === 'none') {
        chatMessages.style.display = 'block';
        toggleButton.textContent = '−';
    } else {
        chatMessages.style.display = 'none';
        toggleButton.textContent = '+';
    }
} 