/**
 * Overlay Mobile Minimalista para Twitch
 * Versão: 3.0 - Apenas Novo Seguidor + Último Seguidor + Tempo de Live
 * Canal: FlwBielzinn
 */

class MobileOverlay {
    constructor() {
        console.log('🎮 Inicializando MobileOverlay Minimalista v3.0...');
        
        // Configurações
        this.config = {
            channelName: CONFIG?.CHANNEL_NAME || 'flwbielzinn',
            simulationMode: true,
            checkInterval: 30000, // 30 segundos
            notificationDuration: 5000, // 5 segundos
            liveStartTime: null
        };
        
        // Estado
        this.isRunning = false;
        this.lastFollower = null;
        this.liveTimer = null;
        this.twitchAPI = null;
        this.lastFollowerCount = 0;
        this.apiConnected = false;
        
        // Elementos DOM
        this.elements = {
            lastFollowerName: null,
            liveTimeValue: null,
            followerNotification: null,
            newFollowerName: null
        };
        
        // Lista de nomes para simulação
        this.simulatedNames = [
            'GamerPro123', 'StreamFan456', 'TwitchLover789', 'GameMaster2024',
            'PixelWarrior', 'CodeNinja', 'RetroGamer', 'StreamHunter',
            'DigitalDreamer', 'CyberPunk2077', 'NeonGlow', 'StarPlayer',
            'MegaFan', 'UltraGamer', 'SuperStream', 'ElitePlayer',
            'ProGamer360', 'StreamKing', 'GameLegend', 'PixelMaster'
        ];
        
        console.log('✅ MobileOverlay configurado:', this.config);
    }
    
    /**
     * Inicializar o overlay
     */
    async initialize() {
        console.log('🚀 Inicializando overlay mobile minimalista...');
        
        try {
            // 1. Buscar elementos DOM
            this.findDOMElements();
            
            // 2. Tentar conectar com API da Twitch
            await this.connectToTwitchAPI();
            
            // 3. Configurar tempo de live
            this.setupLiveTimer();
            
            // 4. Inicializar último seguidor
            this.initializeLastFollower();
            
            // 5. Configurar verificação de novos seguidores
            this.setupFollowerCheck();
            
            // 6. Marcar como rodando
            this.isRunning = true;
            
            console.log('🎉 Overlay mobile minimalista inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
        }
    }
    
    /**
     * Buscar elementos DOM
     */
    findDOMElements() {
        console.log('🔍 Buscando elementos DOM...');
        
        this.elements = {
            lastFollowerName: document.getElementById('last-follower-name'),
            liveTimeValue: document.getElementById('live-time-value'),
            followerNotification: document.getElementById('follower-notification'),
            newFollowerName: document.getElementById('new-follower-name')
        };
        
        // Verificar se todos os elementos foram encontrados
        const missingElements = Object.entries(this.elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);
            
        if (missingElements.length > 0) {
            console.warn('⚠️ Elementos DOM não encontrados:', missingElements);
        } else {
            console.log('✅ Todos os elementos DOM encontrados');
        }
    }
    
    /**
     * Configurar timer do tempo de live
     */
    setupLiveTimer() {
        console.log('⏰ Configurando timer de live...');
        
        // Definir horário de início da live (agora)
        this.config.liveStartTime = new Date();
        
        // Atualizar a cada segundo
        this.liveTimer = setInterval(() => {
            this.updateLiveTime();
        }, 1000);
        
        // Primeira atualização
        this.updateLiveTime();
        
        console.log('✅ Timer de live configurado');
    }
    
    /**
     * Atualizar tempo de live
     */
    updateLiveTime() {
        if (!this.config.liveStartTime || !this.elements.liveTimeValue) return;
        
        const now = new Date();
        const diff = now - this.config.liveStartTime;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.elements.liveTimeValue.textContent = timeString;
    }
    
    /**
     * Inicializar último seguidor
     */
    initializeLastFollower() {
        console.log('👤 Inicializando último seguidor...');
        
        // Definir um seguidor inicial
        this.lastFollower = this.getRandomName();
        this.updateLastFollower(this.lastFollower);
        
        console.log('✅ Último seguidor inicializado:', this.lastFollower);
    }
    
    /**
     * Atualizar último seguidor
     */
    updateLastFollower(followerName) {
        if (!this.elements.lastFollowerName) return;
        
        this.lastFollower = followerName;
        this.elements.lastFollowerName.textContent = followerName;
        
        console.log('👤 Último seguidor atualizado:', followerName);
    }
    
    /**
     * Conectar com API da Twitch
     */
    async connectToTwitchAPI() {
        console.log('🔌 Tentando conectar com API da Twitch...');
        
        try {
            // Verificar se TwitchAPI está disponível
            if (typeof TwitchAPI === 'undefined') {
                console.warn('⚠️ TwitchAPI não encontrada, usando modo simulado');
                this.config.simulationMode = true;
                return;
            }
            
            // Criar instância da API
            this.twitchAPI = new TwitchAPI();
            
            // Testar conexão
            const connected = await this.twitchAPI.testConnection();
            
            if (connected) {
                console.log('✅ API da Twitch conectada com sucesso!');
                this.apiConnected = true;
                this.config.simulationMode = false;
                
                // Obter contagem inicial de seguidores
                await this.updateFollowerCount();
                
            } else {
                console.warn('⚠️ Não foi possível conectar com API, usando modo simulado');
                this.apiConnected = false;
                this.config.simulationMode = true;
            }
            
        } catch (error) {
            console.error('❌ Erro ao conectar com API:', error);
            this.apiConnected = false;
            this.config.simulationMode = true;
        }
    }
    
    /**
     * Atualizar contagem de seguidores
     */
    async updateFollowerCount() {
        if (!this.twitchAPI || !this.apiConnected) return;
        
        try {
            const userInfo = await this.twitchAPI.getUserInfo();
            if (userInfo && userInfo.follower_count !== undefined) {
                const newCount = userInfo.follower_count;
                
                // Verificar se houve novos seguidores
                if (this.lastFollowerCount > 0 && newCount > this.lastFollowerCount) {
                    const newFollowers = newCount - this.lastFollowerCount;
                    console.log(`🎉 ${newFollowers} novo(s) seguidor(es) detectado(s)!`);
                    
                    // Disparar notificação para cada novo seguidor
                    for (let i = 0; i < newFollowers; i++) {
                        setTimeout(() => {
                            this.triggerNewFollower();
                        }, i * 2000); // 2 segundos entre cada notificação
                    }
                }
                
                this.lastFollowerCount = newCount;
                console.log(`👥 Seguidores atuais: ${newCount}`);
            }
            
        } catch (error) {
            console.error('❌ Erro ao atualizar contagem de seguidores:', error);
        }
    }
    
    /**
     * Configurar verificação de novos seguidores
     */
    setupFollowerCheck() {
        console.log('🔄 Configurando verificação de seguidores...');
        
        if (this.apiConnected) {
            // Verificar API a cada 30 segundos
            setInterval(async () => {
                await this.updateFollowerCount();
            }, this.config.checkInterval);
            
            console.log('✅ Verificação de API configurada');
        } else {
            // Modo simulado - 30% de chance a cada 30-60 segundos
            setInterval(() => {
                if (Math.random() < 0.3) { // 30% de chance
                    const newFollower = this.getRandomName();
                    this.triggerNewFollower(newFollower);
                }
            }, this.config.checkInterval);
            
            console.log('✅ Simulação de seguidores configurada');
        }
    }
    
    /**
     * Disparar notificação de novo seguidor
     */
    triggerNewFollower(followerName = null) {
        if (!followerName) {
            followerName = this.getRandomName();
        }
        
        console.log('🎉 Novo seguidor:', followerName);
        
        // Atualizar último seguidor
        this.updateLastFollower(followerName);
        
        // Mostrar notificação
        this.showFollowerNotification(followerName);
    }
    
    /**
     * Mostrar notificação de novo seguidor
     */
    showFollowerNotification(followerName) {
        if (!this.elements.followerNotification || !this.elements.newFollowerName) {
            console.warn('⚠️ Elementos de notificação não encontrados');
            return;
        }
        
        // Definir nome do seguidor
        this.elements.newFollowerName.textContent = followerName;
        
        // Remover classe show se existir
        this.elements.followerNotification.classList.remove('show');
        
        // Forçar reflow
        this.elements.followerNotification.offsetHeight;
        
        // Adicionar classe show para iniciar animação
        this.elements.followerNotification.classList.add('show');
        
        // Remover após duração especificada
        setTimeout(() => {
            this.elements.followerNotification.classList.remove('show');
        }, this.config.notificationDuration);
        
        console.log('📢 Notificação de seguidor exibida:', followerName);
    }
    
    /**
     * Obter nome aleatório para simulação
     */
    getRandomName() {
        const randomIndex = Math.floor(Math.random() * this.simulatedNames.length);
        return this.simulatedNames[randomIndex];
    }
    
    /**
     * Parar o overlay
     */
    stop() {
        console.log('🛑 Parando overlay mobile...');
        
        this.isRunning = false;
        
        // Limpar timer de live
        if (this.liveTimer) {
            clearInterval(this.liveTimer);
            this.liveTimer = null;
        }
        
        console.log('✅ Overlay mobile parado');
    }
    
    /**
     * Obter status do overlay
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            lastFollower: this.lastFollower,
            liveStartTime: this.config.liveStartTime,
            apiConnected: this.apiConnected,
            simulationMode: this.config.simulationMode,
            lastFollowerCount: this.lastFollowerCount,
            config: this.config
        };
    }
}

// === FUNÇÕES GLOBAIS PARA CONTROLE EXTERNO ===

/**
 * Disparar novo seguidor manualmente
 */
function triggerNewFollower(followerName = null) {
    if (window.mobileOverlay) {
        window.mobileOverlay.triggerNewFollower(followerName);
        return true;
    }
    console.warn('⚠️ MobileOverlay não inicializado');
    return false;
}

/**
 * Resetar tempo de live
 */
function resetLiveTime() {
    if (window.mobileOverlay) {
        window.mobileOverlay.config.liveStartTime = new Date();
        console.log('⏰ Tempo de live resetado');
        return true;
    }
    console.warn('⚠️ MobileOverlay não inicializado');
    return false;
}

/**
 * Definir último seguidor manualmente
 */
function setLastFollower(followerName) {
    if (window.mobileOverlay && followerName) {
        window.mobileOverlay.updateLastFollower(followerName);
        console.log('👤 Último seguidor definido:', followerName);
        return true;
    }
    console.warn('⚠️ MobileOverlay não inicializado ou nome inválido');
    return false;
}

/**
 * Obter status do overlay
 */
function getOverlayStatus() {
    if (window.mobileOverlay) {
        return window.mobileOverlay.getStatus();
    }
    return null;
}

// === INICIALIZAÇÃO AUTOMÁTICA ===

// Aguardar carregamento da página
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📱 DOM carregado, aguardando inicialização...');
    
    // Aguardar um pouco para garantir que todos os scripts carregaram
    setTimeout(async () => {
        try {
            // Criar instância global
            window.mobileOverlay = new MobileOverlay();
            
            // Inicializar
            await window.mobileOverlay.initialize();
            
            console.log('🎉 Sistema mobile minimalista pronto!');
            
        } catch (error) {
            console.error('❌ Erro na inicialização automática:', error);
        }
    }, 1000);
});

// === LOGS DE DEBUG ===

console.log('📱 overlay-mobile.js carregado - Versão Minimalista 3.0');
console.log('🎯 Funcionalidades: Novo Seguidor + Último Seguidor + Tempo de Live');
console.log('🎨 Design: Verde para notificação, Azul para último seguidor, Laranja para tempo');

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileOverlay, triggerNewFollower, resetLiveTime, setLastFollower, getOverlayStatus };
} 