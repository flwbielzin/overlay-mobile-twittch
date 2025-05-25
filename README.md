# 📱 Overlay Mobile - Deploy Independente

## 🎯 **Para PRISM Live Studio**

Este é o **overlay mobile** otimizado para lives IRL usando PRISM Live Studio.

---

## 🚀 **Deploy na Vercel**

### **📋 Opção 1: Deploy desta pasta apenas**
```bash
# Na pasta mobile/
npx vercel --prod
```

### **📋 Opção 2: Via GitHub**
1. Crie um repositório só com esta pasta
2. Conecte na Vercel
3. Deploy automático

---

## 🌐 **URLs após Deploy**

Após o deploy, você terá:
- **URL principal:** `https://seu-overlay-mobile.vercel.app/`
- **URL alternativa:** `https://seu-overlay-mobile.vercel.app/overlay`
- **URL mobile:** `https://seu-overlay-mobile.vercel.app/mobile`

**🎯 Use qualquer uma dessas URLs no PRISM Live Studio!**

---

## 📱 **Configuração no PRISM Live Studio**

### **1️⃣ Adicionar Browser Source:**
1. Abra o PRISM Live Studio
2. Clique em **"+"** para adicionar fonte
3. Selecione **"Browser Source"** ou **"Web Source"**
4. Cole a URL: `https://seu-overlay-mobile.vercel.app/`

### **2️⃣ Configurações recomendadas:**
```
📐 Resolução: 1920x1080 (ou sua resolução de stream)
🔄 Refresh Rate: 30 FPS
🎯 Posição: Overlay (camada superior)
👁️ Transparência: Ativada
🔊 Audio: Desativado (só visual)
```

### **3️⃣ Ajustes no PRISM:**
- **Tamanho:** Ajuste conforme necessário
- **Posição:** Canto da tela ou onde preferir
- **Opacidade:** 100% (o overlay já tem transparência)

---

## ⚙️ **Configuração da API**

Edite o arquivo `config.js`:
```javascript
const CONFIG = {
    TWITCH_CLIENT_ID: 'seu_client_id_aqui',
    TWITCH_CLIENT_SECRET: 'seu_client_secret_aqui',
    CHANNEL_NAME: 'seu_canal_twitch',
    API_BASE_URL: 'https://api.twitch.tv/helix/'
};
```

---

## 🎯 **Funcionalidades**

✅ **Contadores em tempo real** (viewers, followers)  
✅ **Chat colorido** com nomes únicos  
✅ **Localização GPS** para IRL  
✅ **Timer de uptime** da stream  
✅ **Interface otimizada** para mobile  
✅ **Transparência automática** para overlay  

---

## 🔧 **Otimizações para PRISM**

### **📱 Headers especiais:**
- `X-Frame-Options: ALLOWALL` - Permite embedding
- `Access-Control-Allow-Origin: *` - CORS liberado
- Cache otimizado para performance

### **🚀 Performance:**
- Arquivos estáticos otimizados
- CDN global da Vercel
- Carregamento rápido
- Baixo uso de recursos

---

## 🛠️ **Troubleshooting**

### **❌ Overlay não aparece no PRISM:**
- Verifique se a URL está correta
- Teste a URL no navegador primeiro
- Certifique-se que o PRISM permite HTTPS

### **❌ Dados da Twitch não carregam:**
- Verifique as credenciais da API no `config.js`
- Confirme o nome do canal
- Veja o console do navegador para erros

### **❌ Localização não funciona:**
- HTTPS é obrigatório para geolocalização
- Permita acesso à localização no navegador
- Vercel fornece HTTPS automaticamente

---

## 🎉 **Pronto para Usar!**

Agora você tem um overlay profissional para PRISM Live Studio:

✅ **Deploy independente** - Só o que precisa  
✅ **URL dedicada** - Exclusiva para o overlay  
✅ **Otimizado para PRISM** - Headers e configurações específicas  
✅ **Performance máxima** - Sem arquivos desnecessários  

**🚀 Sua live IRL está pronta para o próximo nível!** 