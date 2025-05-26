// Configurações da API da Twitch - Versão Segura
const CONFIG = {
    // Credenciais da Twitch
    TWITCH_CLIENT_ID: '0l2lo79eb0lyrx16oulgss85h11e3v',
    
    // ⚠️ AVISO DE SEGURANÇA: Em produção, NUNCA exponha o Client Secret no frontend!
    // Use um backend/servidor para gerenciar tokens de forma segura
    TWITCH_CLIENT_SECRET: 'wwkph643l9fjxsthmdwsj1a3rqj1r7', // Temporário para desenvolvimento
    
    CHANNEL_NAME: 'flwbielzinn',
    
    // URLs da API da Twitch
    API_BASE_URL: 'https://api.twitch.tv/helix',
    OAUTH_URL: 'https://id.twitch.tv/oauth2/token',
    
    // Configurações de atualização (em milissegundos)
    UPDATE_INTERVAL: 30000, // 30 segundos
    DEBUG_MODE: true,
    
    // Configurações de rate limiting
    RATE_LIMIT: {
        MAX_REQUESTS_PER_MINUTE: 800,
        RETRY_DELAY: 1000, // 1 segundo
        MAX_RETRIES: 3
    },
    
    // Configurações de fallback
    FALLBACK: {
        USE_SIMULATED_DATA: true,
        MIN_FOLLOWERS: 500,
        MAX_FOLLOWERS: 2500,
        MIN_VIEWERS: 10,
        MAX_VIEWERS: 150
    }
};

// Compatibilidade com código antigo
const TWITCH_CONFIG = CONFIG;

// Token de acesso (será preenchido automaticamente)
let ACCESS_TOKEN = null;

// Verificação de ambiente
const isProduction = window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1' && 
                    !window.location.hostname.includes('localhost');

// Log de inicialização com avisos de segurança
console.log(`
📱 OVERLAY MOBILE TWITCH CONFIGURADO! 📱

✅ Configuração:
CLIENT_ID: ${CONFIG.TWITCH_CLIENT_ID}
CLIENT_SECRET: ${isProduction ? '⚠️ EXPOSTO EM PRODUÇÃO!' : 'Configurado ✅'}
CHANNEL_NAME: ${CONFIG.CHANNEL_NAME}

${isProduction ? `
🚨 AVISO DE SEGURANÇA CRÍTICO! 🚨
O Client Secret está exposto no frontend em produção!
Isso é um risco de segurança grave.

📋 SOLUÇÕES RECOMENDADAS:
1. Use um backend para gerenciar tokens
2. Use apenas Client ID no frontend
3. Implemente OAuth flow adequado
4. Considere usar Twitch Extensions

` : ''}

🔄 Testando conexão com API da Twitch...
`); 

// Função para verificar configuração
function validateConfig() {
    const errors = [];
    
    if (!CONFIG.TWITCH_CLIENT_ID) {
        errors.push('❌ TWITCH_CLIENT_ID não configurado');
    }
    
    if (!CONFIG.CHANNEL_NAME) {
        errors.push('❌ CHANNEL_NAME não configurado');
    }
    
    if (isProduction && CONFIG.TWITCH_CLIENT_SECRET) {
        errors.push('🚨 Client Secret exposto em produção!');
    }
    
    if (errors.length > 0) {
        console.error('🚨 Erros de configuração encontrados:');
        errors.forEach(error => console.error(error));
        return false;
    }
    
    return true;
}

// Validar configuração na inicialização
validateConfig();

// Verificar se as configurações estão corretas
if (typeof window !== 'undefined') {
    console.log('⚙️ Configuração carregada para canal:', CONFIG.CHANNEL_NAME);
    console.log('🔑 Client ID configurado:', CONFIG.TWITCH_CLIENT_ID ? 'Sim ✅' : 'Não ❌');
} 