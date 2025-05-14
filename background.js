// Este é o arquivo de script de plano de fundo (background script)
// Executa quando a extensão é instalada ou atualizada
chrome.runtime.onInstalled.addListener(() => {
  console.log("NavegaFácil instalado com sucesso.")

  // Inicializa as configurações padrão se não existirem
  chrome.storage.local.get(["contrasteAtivo"], (result) => {
    if (Object.keys(result).length === 0) {
      console.log("Inicializando configurações padrão.")
      chrome.storage.local.set({
        contrasteAtivo: null,
      })
    }
  })
})

// Listener para mensagens que podem ser enviadas da página de popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getStatus") {
    chrome.storage.local.get(["contrasteAtivo"], (result) => {
      sendResponse(result)
    })
    return true // Informa que a resposta será assíncrona
  }
})
