// Сохранение данных в localStorage
function saveToLocalStorage() {
  const editableElements = document.querySelectorAll('[contenteditable="true"]')
  const data = {}
  editableElements.forEach((el) => {
    const id = el.getAttribute('data-id')
    if (id) {
      data[id] = el.innerHTML
    }
  })
  localStorage.setItem('resumeData', JSON.stringify(data))
}

// Загрузка данных из localStorage
function loadFromLocalStorage() {
  const saved = localStorage.getItem('resumeData')
  if (saved) {
    const data = JSON.parse(saved)
    const editableElements = document.querySelectorAll('[contenteditable="true"]')
    editableElements.forEach((el) => {
      const id = el.getAttribute('data-id')
      if (id && data[id]) {
        el.innerHTML = data[id]
      }
    })
  }
}

// Анимация при редактировании
function addEditAnimations() {
  const editableElements = document.querySelectorAll('[contenteditable="true"]')
  editableElements.forEach(el => {
    el.addEventListener('focus', () => {
      el.style.transition = 'all 0.3s ease'
      el.style.transform = 'scale(1.02)'
    })
    el.addEventListener('blur', () => {
      el.style.transform = 'scale(1)'
      saveToLocalStorage()
    })
  })
}

// Material Wave (Ripple) эффект
function createRipple(event, element) {
  const ripple = document.createElement('span')
  ripple.classList.add('wave')

  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`

  element.appendChild(ripple)

  ripple.addEventListener('animationend', () => {
    ripple.remove()
  })
}

function addRippleEffect() {
  const elements = document.querySelectorAll('.ripple')
  
  elements.forEach(el => {
    el.addEventListener('click', (e) => {
      createRipple(e, el)
    })
  })
}

// Инициализация
function init() {
  loadFromLocalStorage()
  addEditAnimations()
  addRippleEffect()

  // Обработчик кнопки скачивания
  const downloadBtn = document.getElementById('download-btn')
  console.log('Кнопка найдена:', downloadBtn) // Проверка
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      console.log('Клик по кнопке скачивания') // Проверка
      e.stopPropagation() // Останавливаем всплытие
      window.print()
    })
  } else {
    console.log('Кнопка НЕ найдена!')
  }
}

// Запуск после загрузки DOM
document.addEventListener('DOMContentLoaded', init)