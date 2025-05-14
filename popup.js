// Função para enviar ação para a página atual
function sendAction(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0] && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: action }).catch((error) => {
        console.error("Erro ao enviar mensagem:", error)
      })
    } else {
      console.error("Não foi possível encontrar a aba ativa")
    }
  })
}

// Função para alternar a visibilidade das opções
function toggle(id) {
  const sections = ["font-options", "contrast-options", "read-options", "translate-options"]
  const buttons = ["btn-font", "btn-contrast", "btn-read", "btn-translate"]

  // Fecha todas as seções
  sections.forEach((section) => {
    if (section !== id) {
      document.getElementById(section).style.display = "none"
    }
  })

  // Remove a classe active de todos os botões
  buttons.forEach((button) => {
    if ("btn-" + id.split("-")[0] !== button) {
      document.getElementById(button).classList.remove("active")
    }
  })

  // Alterna a seção atual
  const el = document.getElementById(id)
  const isVisible = el.style.display === "block"
  el.style.display = isVisible ? "none" : "block"

  // Alterna a classe active do botão
  const btn = document.getElementById("btn-" + id.split("-")[0])
  if (isVisible) {
    btn.classList.remove("active")
  } else {
    btn.classList.add("active")
  }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Botões de seção
  document.getElementById("btn-font").addEventListener("click", () => toggle("font-options"))
  document.getElementById("btn-contrast").addEventListener("click", () => toggle("contrast-options"))
  document.getElementById("btn-read").addEventListener("click", () => toggle("read-options"))
  document.getElementById("btn-translate").addEventListener("click", () => toggle("translate-options"))

  // Botões de fonte
  document.getElementById("increase-font").addEventListener("click", () => sendAction("increaseFont"))
  document.getElementById("decrease-font").addEventListener("click", () => sendAction("decreaseFont"))
  document.getElementById("reset-font").addEventListener("click", () => sendAction("resetFont"))

  // Botões de contraste
  document.getElementById("contrast-high").addEventListener("click", () => sendAction("contrasteAlto"))
  document.getElementById("contrast-yellow").addEventListener("click", () => sendAction("contrasteAmarelo"))
  document.getElementById("contrast-blue").addEventListener("click", () => sendAction("contrasteAzul"))
  document.getElementById("contrast-beige").addEventListener("click", () => sendAction("contrasteBege"))
  document.getElementById("contrast-green").addEventListener("click", () => sendAction("contrasteVerde"))
  document.getElementById("contrast-reading").addEventListener("click", () => sendAction("contrasteLeitura"))
  document.getElementById("contrast-reset").addEventListener("click", () => sendAction("contrasteReset"))

  // Botões de leitura
  document.getElementById("read-full").addEventListener("click", () => sendAction("readText"))
  document.getElementById("read-selection").addEventListener("click", () => sendAction("readSelected"))
  document.getElementById("stop-speech").addEventListener("click", () => sendAction("stopSpeech"))

  // Botão de tradução
  document.getElementById("translate-page").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url
      const translatedUrl = `https://translate.google.com/translate?sl=auto&tl=pt&u=${encodeURIComponent(url)}`
      chrome.tabs.create({ url: translatedUrl })
    })
  })

  // Verifica se há um modo de contraste ativo
  chrome.storage.local.get(["contrasteAtivo"], (result) => {
    if (result.contrasteAtivo) {
      // Abre automaticamente a seção de contraste
      toggle("contrast-options")

      // Destaca o botão do modo ativo
      let buttonId
      switch (result.contrasteAtivo) {
        case "contrasteAlto":
          buttonId = "contrast-high"
          break
        case "contrasteAmarelo":
          buttonId = "contrast-yellow"
          break
        case "contrasteAzul":
          buttonId = "contrast-blue"
          break
        case "contrasteBege":
          buttonId = "contrast-beige"
          break
        case "contrasteVerde":
          buttonId = "contrast-green"
          break
        case "contrasteLeitura":
          buttonId = "contrast-reading"
          break
      }

      if (buttonId) {
        document.getElementById(buttonId).style.backgroundColor = "#e0e0e0"
        document.getElementById(buttonId).style.borderLeft = "3px solid #4285f4"
      }
    }
  })
})
