// Overlay Mobile - Versão Corrigida para PRISM
class MobileOverlay {
    constructor() {
        this.isInitialized = false;
        this.updateInterval = null;
        this.followersInterval = null;
        this.uptimeInterval = null;
        
        // Dados atuais (sempre terão valores)
        this.currentData = {
            streamerName: CONFIG.CHANNEL_NAME || 'Streamer',
            displayName: CONFIG.CHANNEL_NAME || 'Streamer',
            title: 'Live IRL - Explorando a cidade! 🎮',
            viewers: 45,
            followers: 1247,
            isLive: true,
            avatar: this.getDefaultAvatar(), // Usar função para avatar padrão
            startTime: new Date()
        };
        
        // Seguidores recentes
        this.recentFollowers = ['João123', 'MariGamer', 'PedroLive', 'AnaStream'];
        
        console.log('📱 MobileOverlay inicializado');
    }

    // Função para obter avatar padrão baseado no nome do canal
    getDefaultAvatar() {
        const channelName = CONFIG.CHANNEL_NAME || 'flwbielzinn';
        // Tentar usar avatar específico do canal primeiro
        return `https://static-cdn.jtvnw.net/jtv_user_pictures/${channelName}-profile_image-300x300.png`;
    }

    // Função específica para buscar avatar real da Twitch
    async loadRealAvatar() {
        try {
            console.log('🖼️ Buscando avatar real da Twitch...');
            
            if (typeof twitchAPI !== 'undefined') {
                const userInfo = await twitchAPI.getUserInfo();
                
                if (userInfo && userInfo.profile_image_url) {
                    console.log('✅ Avatar real encontrado:', userInfo.profile_image_url);
                    this.currentData.avatar = userInfo.profile_image_url;
                    
                    // Atualizar imediatamente na interface
                    const streamerAvatar = document.getElementById('streamer-avatar-mobile');
                    if (streamerAvatar) {
                        streamerAvatar.src = this.currentData.avatar;
                        console.log('🖼️ Avatar atualizado na interface');
                    }
                    
                    return userInfo.profile_image_url;
                } else {
                    console.log('⚠️ Avatar não encontrado na API, usando fallback');
                }
            }
            
            // Fallback: tentar URL direta do Twitch
            const channelName = CONFIG.CHANNEL_NAME || 'flwbielzinn';
            const fallbackAvatars = [
                `https://static-cdn.jtvnw.net/jtv_user_pictures/${channelName}-profile_image-300x300.png`,
                `https://static-cdn.jtvnw.net/jtv_user_pictures/${channelName}-profile_image-150x150.png`,
                `https://static-cdn.jtvnw.net/jtv_user_pictures/${channelName}-profile_image-70x70.png`
            ];
            
            // Testar cada URL de fallback
            for (const avatarUrl of fallbackAvatars) {
                if (await this.testImageUrl(avatarUrl)) {
                    console.log('✅ Avatar encontrado via fallback:', avatarUrl);
                    this.currentData.avatar = avatarUrl;
                    
                    const streamerAvatar = document.getElementById('streamer-avatar-mobile');
                    if (streamerAvatar) {
                        streamerAvatar.src = this.currentData.avatar;
                    }
                    
                    return avatarUrl;
                }
            }
            
            console.log('⚠️ Nenhum avatar específico encontrado, usando padrão');
            return this.getDefaultAvatar();
            
        } catch (error) {
            console.error('❌ Erro ao buscar avatar:', error);
            return this.getDefaultAvatar();
        }
    }

    // Função para testar se uma URL de imagem existe
    async testImageUrl(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
            
            // Timeout de 3 segundos
            setTimeout(() => resolve(false), 3000);
        });
    }

    async initialize() {
        try {
            console.log('🚀 Inicializando overlay mobile...');
            
            // Sempre inicializar com dados (API ou simulados)
            await this.loadInitialData();
            
            // Buscar avatar real em paralelo
            this.loadRealAvatar().catch(error => {
                console.log('⚠️ Erro ao carregar avatar real, mantendo padrão');
            });
            
            // Atualizar interface imediatamente
            this.updateInterface();
            
            // Iniciar sistemas essenciais
            this.startFollowersUpdate();
            this.startUptimeCounter();
            this.startDataUpdates();
            
            this.isInitialized = true;
            console.log('✅ Overlay mobile inicializado com sucesso!');
            
            return true;
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            
            // Mesmo com erro, garantir que funcione
            this.updateInterface();
            this.startUptimeCounter();
            
            return false;
        }
    }

    async loadInitialData() {
        try {
            console.log('📊 Carregando dados iniciais...');
            
            // Tentar obter dados da API
            if (typeof twitchAPI !== 'undefined') {
                console.log('🔄 Tentando conectar com API da Twitch...');
                
                const channelInfo = await twitchAPI.getChannelInfo();
                
                if (channelInfo && channelInfo.display_name) {
                    console.log('✅ Dados da API obtidos:', channelInfo.display_name);
                    
                    // Usar dados reais da API
                    this.currentData = {
                        streamerName: channelInfo.login || CONFIG.CHANNEL_NAME,
                        displayName: channelInfo.display_name,
                        title: channelInfo.title || 'Live IRL - Explorando a cidade! 🎮',
                        viewers: channelInfo.viewer_count || Math.floor(Math.random() * 100) + 20,
                        followers: channelInfo.follower_count || Math.floor(Math.random() * 2000) + 500,
                        isLive: channelInfo.is_live || true,
                        avatar: channelInfo.profile_image_url || this.getDefaultAvatar(),
                        startTime: channelInfo.started_at ? new Date(channelInfo.started_at) : new Date()
                    };
                    
                    console.log('📊 Usando dados reais da API');
                    console.log('🖼️ Avatar da API:', this.currentData.avatar);
                } else {
                    console.log('⚠️ API não retornou dados válidos, usando simulados');
                    this.useSimulatedData();
                }
            } else {
                console.log('⚠️ API não disponível, usando dados simulados');
                this.useSimulatedData();
            }
            
            // Atualizar título da página
            this.updatePageTitle();
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            console.log('🎭 Fallback para dados simulados');
            this.useSimulatedData();
        }
    }

    useSimulatedData() {
        // Gerar dados simulados realistas
        const channelName = CONFIG.CHANNEL_NAME || 'flwbielzinn';
        const displayName = channelName.charAt(0).toUpperCase() + channelName.slice(1);
        
        this.currentData = {
            streamerName: channelName,
            displayName: displayName,
            title: this.getRandomTitle(),
            viewers: Math.floor(Math.random() * 80) + 25, // 25-105 viewers
            followers: Math.floor(Math.random() * 1500) + 800, // 800-2300 followers
            isLive: true, // Sempre mostrar como ao vivo para demonstração
            avatar: this.getDefaultAvatar(), // Usar função para avatar específico
            startTime: new Date(Date.now() - Math.random() * 7200000) // Até 2h atrás
        };
        
        console.log('🎭 Dados simulados criados:', this.currentData);
        console.log('🖼️ Avatar simulado:', this.currentData.avatar);
    }

    getRandomTitle() {
        const titles = [
            'Live IRL - Explorando a cidade! 🎮',
            'Conversando com o chat ao vivo 💬',
            'Stream chill - Vem conversar! ✨',
            'Interagindo com vocês! 🎉',
            'Live descontraída 😄',
            'Passeando pela cidade 🚶‍♂️',
            'Chat e diversão! 🎯'
        ];
        return titles[Math.floor(Math.random() * titles.length)];
    }

    updatePageTitle() {
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            const status = this.currentData.isLive ? 'AO VIVO' : 'OFFLINE';
            pageTitle.textContent = `${this.currentData.displayName} - ${status}`;
        }
    }

    updateInterface() {
        try {
            console.log('🔄 Atualizando interface...');
            
            // Atualizar informações do streamer
            const streamerName = document.getElementById('streamer-name-mobile');
            const streamTitle = document.getElementById('stream-title-mobile');
            const streamerAvatar = document.getElementById('streamer-avatar-mobile');
            
            if (streamerName) {
                streamerName.textContent = this.currentData.displayName;
            }
            
            if (streamTitle) {
                streamTitle.textContent = this.currentData.title;
            }
            
            if (streamerAvatar) {
                console.log('🖼️ Atualizando avatar para:', this.currentData.avatar);
                
                // Configurar avatar com fallback
                streamerAvatar.src = this.currentData.avatar;
                streamerAvatar.alt = this.currentData.displayName;
                
                // Adicionar tratamento de erro para o avatar
                streamerAvatar.onerror = () => {
                    console.log('❌ Erro ao carregar avatar, usando padrão');
                    const defaultAvatar = `https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
                    if (streamerAvatar.src !== defaultAvatar) {
                        streamerAvatar.src = defaultAvatar;
                    }
                };
                
                // Adicionar evento de sucesso
                streamerAvatar.onload = () => {
                    console.log('✅ Avatar carregado com sucesso');
                };
            }
            
            // Atualizar contadores
            this.updateCounters();
            
            console.log('✅ Interface atualizada');
            
        } catch (error) {
            console.error('❌ Erro ao atualizar interface:', error);
        }
    }

    updateCounters() {
        const viewersElement = document.getElementById('viewers-count-mobile');
        const followersElement = document.getElementById('followers-count-mobile');
        const chattersElement = document.getElementById('chatters-count-mobile');
        
        if (viewersElement) {
            viewersElement.textContent = this.formatNumber(this.currentData.viewers);
        }
        
        if (followersElement) {
            followersElement.textContent = this.formatNumber(this.currentData.followers);
        }
        
        if (chattersElement) {
            // Chatters geralmente são 10-30% dos viewers
            const chatters = Math.floor(this.currentData.viewers * (0.1 + Math.random() * 0.2));
            chattersElement.textContent = this.formatNumber(chatters);
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    startDataUpdates() {
        // Atualizar dados a cada 30 segundos
        this.updateInterval = setInterval(async () => {
            try {
                // Tentar atualizar com dados reais
                if (typeof twitchAPI !== 'undefined') {
                    const channelInfo = await twitchAPI.getChannelInfo();
                    
                    if (channelInfo && channelInfo.display_name) {
                        this.currentData.viewers = channelInfo.viewer_count || this.currentData.viewers;
                        this.currentData.followers = channelInfo.follower_count || this.currentData.followers;
                        this.currentData.isLive = channelInfo.is_live !== undefined ? channelInfo.is_live : true;
                        this.currentData.title = channelInfo.title || this.currentData.title;
                    }
                }
                
                // Simular pequenas variações nos dados
                this.simulateDataVariations();
                
                // Atualizar interface
                this.updateCounters();
                
            } catch (error) {
                console.log('⚠️ Erro na atualização, mantendo dados atuais');
                this.simulateDataVariations();
                this.updateCounters();
            }
        }, 30000); // 30 segundos
    }

    simulateDataVariations() {
        // Simular pequenas variações realistas
        const viewerChange = Math.floor(Math.random() * 10) - 5; // -5 a +5
        const followerChange = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0; // Chance de ganhar seguidores
        
        this.currentData.viewers = Math.max(10, this.currentData.viewers + viewerChange);
        this.currentData.followers += followerChange;
        
        if (followerChange > 0) {
            console.log(`🎉 +${followerChange} novo(s) seguidor(es)!`);
        }
    }

    startFollowersUpdate() {
        const followersContainer = document.getElementById('followers-list-mobile');
        if (!followersContainer) return;
        
        // Atualizar lista de seguidores a cada 45 segundos
        this.followersInterval = setInterval(() => {
            this.updateRecentFollowers();
        }, 45000);
        
        // Atualizar imediatamente
        this.updateRecentFollowers();
    }

    updateRecentFollowers() {
        const followersContainer = document.getElementById('followers-list-mobile');
        if (!followersContainer) return;
        
        // Simular novo seguidor ocasionalmente
        if (Math.random() > 0.7) {
            const newFollower = `User${Math.floor(Math.random() * 9999)}`;
            this.recentFollowers.unshift(newFollower);
            this.recentFollowers = this.recentFollowers.slice(0, 4); // Manter apenas 4
        }
        
        followersContainer.innerHTML = '';
        this.recentFollowers.forEach(follower => {
            const followerElement = document.createElement('div');
            followerElement.className = 'follower-item-mobile';
            followerElement.textContent = follower;
            followersContainer.appendChild(followerElement);
        });
    }

    startUptimeCounter() {
        const uptimeElement = document.getElementById('stream-uptime-mobile');
        if (!uptimeElement) return;
        
        this.uptimeInterval = setInterval(() => {
            if (this.currentData.isLive && this.currentData.startTime) {
                const now = new Date();
                const diff = Math.floor((now - this.currentData.startTime) / 1000);
                
                const hours = Math.floor(diff / 3600);
                const minutes = Math.floor((diff % 3600) / 60);
                const seconds = diff % 60;
                
                const uptime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                uptimeElement.textContent = uptime;
            } else {
                uptimeElement.textContent = '00:00:00';
            }
        }, 1000);
    }

    stop() {
        console.log('🛑 Parando overlay mobile...');
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        if (this.followersInterval) {
            clearInterval(this.followersInterval);
            this.followersInterval = null;
        }
        
        if (this.uptimeInterval) {
            clearInterval(this.uptimeInterval);
            this.uptimeInterval = null;
        }
        
        this.isInitialized = false;
        console.log('✅ Overlay mobile parado');
    }
}

// Funções globais para controle do chat
function toggleMobileChat() {
    const chatContainer = document.querySelector('.chat-container-mobile');
    const toggleButton = document.getElementById('toggle-chat-mobile');
    
    if (chatContainer && toggleButton) {
        if (chatContainer.style.display === 'none') {
            chatContainer.style.display = 'block';
            toggleButton.textContent = '−';
        } else {
            chatContainer.style.display = 'none';
            toggleButton.textContent = '+';
        }
    }
}

// Exportar classe para uso global
window.MobileOverlay = MobileOverlay;

console.log('📱 overlay-mobile.js carregado com sucesso!'); 