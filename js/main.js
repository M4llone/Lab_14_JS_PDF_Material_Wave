import '../css/style.css'

// Сохранение данных в localStorage
function saveToLocalStorage() {
  const editableElements = document.querySelectorAll('[contenteditable="true"]')
  const data = {}
  editableElements.forEach((el, index) => {
    data[`editable-${index}`] = el.innerHTML
  })
  localStorage.setItem('resumeData', JSON.stringify(data))
}

// Загрузка данных из localStorage
function loadFromLocalStorage() {
  const saved = localStorage.getItem('resumeData')
  if (saved) {
    const data = JSON.parse(saved)
    const editableElements = document.querySelectorAll('[contenteditable="true"]')
    editableElements.forEach((el, index) => {
      if (data[`editable-${index}`]) {
        el.innerHTML = data[`editable-${index}`]
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
  ripple.classList.add('ripple-effect')

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
  // Добавляем ripple ко всем элементам с contenteditable и кнопкам
  const elements = document.querySelectorAll('[contenteditable="true"], .resume__download-btn')
  
  elements.forEach(el => {
    el.classList.add('ripple')
    el.addEventListener('click', (e) => {
      createRipple(e, el)
    })
  })
}

// Скачивание PDF
function downloadPDF() {
  // Создаём копию резюме для печати
  const resume = document.querySelector('.resume')
  const clone = resume.cloneNode(true)

  // Убираем contenteditable для печати
  const editables = clone.querySelectorAll('[contenteditable="true"]')
  editables.forEach(el => el.removeAttribute('contenteditable'))

  // Убираем кнопку скачивания
  const btn = clone.querySelector('.resume__download-btn')
  if (btn) btn.remove()

  // Создаём окно для печати
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Резюме</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 { font-size: 2.5em; color: #2c3e50; text-align: center; }
          h2 { color: #2c3e50; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; margin: 20px 0 10px; }
          h3 { color: #34495e; }
          .resume__title { text-align: center; color: #3498db; font-size: 1.3em; margin: 5px 0 15px; }
          .resume__contacts { text-align: center; color: #555; margin-bottom: 20px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
          .resume__item { margin-bottom: 15px; }
          .resume__date { color: #7f8c8d; font-size: 0.9em; margin: 3px 0; }
          .resume__skills { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; padding: 0; }
          .resume__skills li { background: #3498db; color: #fff; padding: 5px 12px; border-radius: 15px; font-size: 0.9em; }
          .resume__header { border-bottom: 2px solid #3498db; padding-bottom: 15px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        ${clone.outerHTML}
        <script>
          window.onload = () => { window.print(); }
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

// Инициализация
function init() {
  loadFromLocalStorage()
  addEditAnimations()
  addRippleEffect()

  // Обработчик кнопки скачивания
  const downloadBtn = document.getElementById('downloadBtn')
  downloadBtn.addEventListener('click', downloadPDF)
}

// Запуск после загрузки DOM
document.addEventListener('DOMContentLoaded', init)