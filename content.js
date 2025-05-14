let currentFontSize = 1
const speech = window.speechSynthesis
let currentContrast = null
let contrastIndicator = null
let indicatorTimeout = null

// Inicialização
function init() {
  console.log("NavegaFácil content script inicializado")

  // Adiciona estilos de contraste
  const style = document.createElement("style")
  style.textContent = `
    /* Estilos base para todos os modos de contraste */
    .contraste-modo * {
      transition: all 0.3s ease !important;
    }

    /* Alto Contraste (Preto/Branco) */
    .contraste-alto {
      background-color: #000 !important;
      color: #fff !important;
    }

    .contraste-alto a, 
    .contraste-alto button:not(.contraste-botao),
    .contraste-alto input, 
    .contraste-alto select, 
    .contraste-alto textarea,
    .contraste-alto h1, 
    .contraste-alto h2, 
    .contraste-alto h3, 
    .contraste-alto h4, 
    .contraste-alto h5, 
    .contraste-alto h6 {
      background-color: #000 !important;
      color: #fff !important;
      border: 1px solid #fff !important;
    }

    .contraste-alto a:hover, 
    .contraste-alto button:not(.contraste-botao):hover {
      background-color: #fff !important;
      color: #000 !important;
      text-decoration: underline !important;
    }

    .contraste-alto img, 
    .contraste-alto video, 
    .contraste-alto iframe {
      filter: grayscale(100%) !important;
    }

    /* Amarelo sobre Preto (para dislexia) */
    .contraste-amarelo {
      background-color: #000 !important;
      color: #ffff00 !important;
    }

    .contraste-amarelo a, 
    .contraste-amarelo button:not(.contraste-botao),
    .contraste-amarelo input, 
    .contraste-amarelo select, 
    .contraste-amarelo textarea,
    .contraste-amarelo h1, 
    .contraste-amarelo h2, 
    .contraste-amarelo h3, 
    .contraste-amarelo h4, 
    .contraste-amarelo h5, 
    .contraste-amarelo h6 {
      background-color: #000 !important;
      color: #ffff00 !important;
      border: 1px solid #ffff00 !important;
    }

    .contraste-amarelo a:hover, 
    .contraste-amarelo button:not(.contraste-botao):hover {
      background-color: #ffff00 !important;
      color: #000 !important;
      text-decoration: underline !important;
    }

    /* Azul claro sobre Azul escuro (para sensibilidade à luz) */
    .contraste-azul {
      background-color: #0a2a5c !important;
      color: #a4ddff !important;
    }

    .contraste-azul a, 
    .contraste-azul button:not(.contraste-botao),
    .contraste-azul input, 
    .contraste-azul select, 
    .contraste-azul textarea,
    .contraste-azul h1, 
    .contraste-azul h2, 
    .contraste-azul h3, 
    .contraste-azul h4, 
    .contraste-azul h5, 
    .contraste-azul h6 {
      background-color: #0a2a5c !important;
      color: #a4ddff !important;
      border: 1px solid #a4ddff !important;
    }

    .contraste-azul a:hover, 
    .contraste-azul button:not(.contraste-botao):hover {
      background-color: #a4ddff !important;
      color: #0a2a5c !important;
      text-decoration: underline !important;
    }

    /* Bege sobre Marrom (para astigmatismo e sensibilidade à luz) */
    .contraste-bege {
      background-color: #7c4b00 !important;
      color: #ffecb3 !important;
    }

    .contraste-bege a, 
    .contraste-bege button:not(.contraste-botao),
    .contraste-bege input, 
    .contraste-bege select, 
    .contraste-bege textarea,
    .contraste-bege h1, 
    .contraste-bege h2, 
    .contraste-bege h3, 
    .contraste-bege h4, 
    .contraste-bege h5, 
    .contraste-bege h6 {
      background-color: #7c4b00 !important;
      color: #ffecb3 !important;
      border: 1px solid #ffecb3 !important;
    }

    .contraste-bege a:hover, 
    .contraste-bege button:not(.contraste-botao):hover {
      background-color: #ffecb3 !important;
      color: #7c4b00 !important;
      text-decoration: underline !important;
    }

    /* Verde sobre Preto (para daltonismo) */
    .contraste-verde {
      background-color: #000 !important;
      color: #00ff00 !important;
    }

    .contraste-verde a, 
    .contraste-verde button:not(.contraste-botao),
    .contraste-verde input, 
    .contraste-verde select, 
    .contraste-verde textarea,
    .contraste-verde h1, 
    .contraste-verde h2, 
    .contraste-verde h3, 
    .contraste-verde h4, 
    .contraste-verde h5, 
    .contraste-verde h6 {
      background-color: #000 !important;
      color: #00ff00 !important;
      border: 1px solid #00ff00 !important;
    }

    .contraste-verde a:hover, 
    .contraste-verde button:not(.contraste-botao):hover {
      background-color: #00ff00 !important;
      color: #000 !important;
      text-decoration: underline !important;
    }

    /* Modo de leitura (para TDAH e dislexia) */
    .contraste-leitura {
      background-color: #f8f5e4 !important;
      color: #333 !important;
      line-height: 1.8 !important;
      letter-spacing: 0.05em !important;
      word-spacing: 0.1em !important;
    }

    .contraste-leitura p, 
    .contraste-leitura li, 
    .contraste-leitura div {
      max-width: 700px !important;
      margin-left: auto !important;
      margin-right: auto !important;
      font-family: 'Open Sans', Arial, sans-serif !important;
      font-size: 1.1em !important;
    }

    .contraste-leitura a, 
    .contraste-leitura button:not(.contraste-botao) {
      color: #0000EE !important;
      text-decoration: underline !important;
      background-color: transparent !important;
    }

    .contraste-leitura a:hover, 
    .contraste-leitura button:not(.contraste-botao):hover {
      color: #551A8B !important;
    }

    /* Estilos para o indicador de modo ativo */
    .contraste-indicador {
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      z-index: 9999;
      font-size: 14px;
      font-family: Arial, sans-serif;
      pointer-events: none;
      opacity: 1;
      transition: opacity 0.5s ease;
    }

    .contraste-indicador.fadeout {
      opacity: 0;
    }
  `
  document.head.appendChild(style)

  // Verifica se há um modo de contraste salvo
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["contrasteAtivo"], (result) => {
        if (result.contrasteAtivo) {
          applyContrast(result.contrasteAtivo)
        }
      })
    }
  } catch (e) {
    console.error("Erro ao acessar storage:", e)
  }
}

// Função para ajustar o tamanho da fonte
function adjustFont(increase) {
  currentFontSize += increase ? 0.1 : -0.1
  document.body.style.transform = `scale(${currentFontSize})`
  document.body.style.transformOrigin = "top left"
  showIndicator(increase ? "Fonte aumentada" : "Fonte diminuída")
}

// Função para resetar o tamanho da fonte
function resetFont() {
  currentFontSize = 1
  document.body.style.transform = "scale(1)"
  showIndicator("Fonte resetada")
}

// Função para aplicar contraste
function applyContrast(mode) {
  // Remove todas as classes de contraste
  document.body.classList.remove(
    "contraste-modo",
    "contraste-alto",
    "contraste-amarelo",
    "contraste-azul",
    "contraste-bege",
    "contraste-verde",
    "contraste-leitura",
  )

  // Salva o modo atual
  currentContrast = mode

  // Adiciona a classe base para todos os modos
  if (mode !== "contrasteReset") {
    document.body.classList.add("contraste-modo")
  }

  // Aplica o modo específico
  let modoTexto = ""
  switch (mode) {
    case "contrasteAlto":
      document.body.classList.add("contraste-alto")
      modoTexto = "Alto Contraste ativado"
      break
    case "contrasteAmarelo":
      document.body.classList.add("contraste-amarelo")
      modoTexto = "Modo Amarelo sobre Preto ativado"
      break
    case "contrasteAzul":
      document.body.classList.add("contraste-azul")
      modoTexto = "Modo Azul Claro sobre Azul Escuro ativado"
      break
    case "contrasteBege":
      document.body.classList.add("contraste-bege")
      modoTexto = "Modo Bege sobre Marrom ativado"
      break
    case "contrasteVerde":
      document.body.classList.add("contraste-verde")
      modoTexto = "Modo Verde sobre Preto ativado"
      break
    case "contrasteLeitura":
      document.body.classList.add("contraste-leitura")
      modoTexto = "Modo Leitura ativado"
      break
    case "contrasteReset":
      modoTexto = "Contraste resetado"
      currentContrast = null
      break
  }

  // Salva a preferência
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      if (mode !== "contrasteReset") {
        chrome.storage.local.set({ contrasteAtivo: mode })
      } else {
        chrome.storage.local.remove("contrasteAtivo")
      }
    }
  } catch (e) {
    console.error("Erro ao salvar preferência:", e)
  }

  // Mostra o indicador
  showIndicator(modoTexto)
}

// Função para mostrar o indicador de modo ativo
function showIndicator(text) {
  // Remove o indicador existente se houver
  if (contrastIndicator) {
    contrastIndicator.remove()
    clearTimeout(indicatorTimeout)
  }

  // Cria um novo indicador
  contrastIndicator = document.createElement("div")
  contrastIndicator.className = "contraste-indicador"
  contrastIndicator.textContent = text
  document.body.appendChild(contrastIndicator)

  // Configura o timeout para remover o indicador
  indicatorTimeout = setTimeout(() => {
    contrastIndicator.classList.add("fadeout")
    setTimeout(() => {
      if (contrastIndicator) {
        contrastIndicator.remove()
        contrastIndicator = null
      }
    }, 500)
  }, 3000)
}

// Função para ler texto
function readText(text) {
  speech.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "pt-BR"
  speech.speak(utterance)
  showIndicator("Leitura iniciada")
}

// Função para traduzir a página
function translatePageToPortuguese() {
  // Tratamos google como uma variável global potencialmente indefinida
  if (typeof google === "undefined") {
    window.google = {}
  }

  const googleTranslateScript = document.createElement("script")
  googleTranslateScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
  document.body.appendChild(googleTranslateScript)

  const googleTranslateDiv = document.createElement("div")
  googleTranslateDiv.id = "google_translate_element"
  document.body.insertBefore(googleTranslateDiv, document.body.firstChild)

  window.googleTranslateElementInit = () => {
    if (google && google.translate && google.translate.TranslateElement) {
      new google.translate.TranslateElement(
        {
          pageLanguage: "auto",
          includedLanguages: "pt",
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element",
      )
    }
  }

  showIndicator("Tradução iniciada")
}

// Listener para mensagens da extensão
try {
  if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // Ações de fonte
      if (request.action === "increaseFont") adjustFont(true)
      if (request.action === "decreaseFont") adjustFont(false)
      if (request.action === "resetFont") resetFont()

      // Ações de contraste
      if (request.action === "contrasteAlto") applyContrast(request.action)
      if (request.action === "contrasteAmarelo") applyContrast(request.action)
      if (request.action === "contrasteAzul") applyContrast(request.action)
      if (request.action === "contrasteBege") applyContrast(request.action)
      if (request.action === "contrasteVerde") applyContrast(request.action)
      if (request.action === "contrasteLeitura") applyContrast(request.action)
      if (request.action === "contrasteReset") applyContrast(request.action)

      // Ações de leitura
      if (request.action === "readText") readText(document.body.innerText)
      if (request.action === "readSelected") {
        const selection = window.getSelection().toString()
        if (selection) readText(selection)
        else showIndicator("Nenhum texto selecionado")
      }
      if (request.action === "stopSpeech") {
        speech.cancel()
        showIndicator("Leitura interrompida")
      }

      // Ação de tradução
      if (request.action === "translatePage") translatePageToPortuguese()

      // Sempre envie uma resposta para evitar erros de conexão fechada
      sendResponse({ success: true })
      return true // Indica que a resposta pode ser assíncrona
    })
  }
} catch (e) {
  console.error("Erro ao registrar listener de mensagens:", e)
}

// Inicializa a extensão
document.addEventListener("DOMContentLoaded", init)
// Executamos init imediatamente também, para o caso de o evento já ter acontecido
if (document.readyState === "complete" || document.readyState === "interactive") {
  init()
}
