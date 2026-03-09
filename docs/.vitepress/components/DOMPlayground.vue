<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useLog } from '../composables/useLog'
import './shared-demo-styles.css'

const activeTab = ref<'editor' | 'presets'>('editor')

const htmlCode = ref(`<div id="container">
  <h2>Привет, DOM!</h2>
  <p class="text">Это параграф.</p>
  <ul id="list">
    <li>Элемент 1</li>
    <li>Элемент 2</li>
    <li>Элемент 3</li>
  </ul>
  <button id="btn">Нажми меня</button>
</div>`)

const jsCode = ref(`// Работа с DOM
const container = document.getElementById('container');
const btn = document.getElementById('btn');
const list = document.getElementById('list');

// Изменяем текст
container.querySelector('h2').textContent = 'DOM изменён!';
container.querySelector('h2').style.color = '#3498db';

// Добавляем элемент
const li = document.createElement('li');
li.textContent = 'Новый элемент (добавлен через JS)';
li.style.color = '#27ae60';
li.style.fontWeight = 'bold';
list.appendChild(li);

// Обработчик события
btn.addEventListener('click', () => {
  btn.textContent = 'Нажато!';
  btn.style.background = '#27ae60';
  btn.style.color = 'white';
  console.log('Кнопка нажата!');
});

console.log('Элементов li:', list.children.length);
console.log('Текст параграфа:', container.querySelector('.text').textContent);`)

const { logEntries, addLog, clearLogs } = useLog(50)

const previewRef = ref<HTMLIFrameElement | null>(null)

const presets = [
  {
    label: 'Создание элементов',
    html: `<div id="app">
  <h3>Список задач</h3>
  <div id="tasks"></div>
</div>`,
    js: `const tasks = document.getElementById('tasks');
const items = ['Изучить DOM', 'Практика JS', 'Написать код'];

items.forEach((text, i) => {
  const div = document.createElement('div');
  div.style.padding = '8px';
  div.style.margin = '4px 0';
  div.style.background = i % 2 ? '#f0f0f0' : '#e8f5e9';
  div.style.borderRadius = '4px';
  div.textContent = '✓ ' + text;
  tasks.appendChild(div);
  console.log('Добавлено:', text);
});`
  },
  {
    label: 'События и обработчики',
    html: `<div id="app">
  <h3>Счётчик кликов</h3>
  <p id="count">Кликов: 0</p>
  <button id="plus">+1</button>
  <button id="minus">-1</button>
  <button id="reset">Сброс</button>
</div>`,
    js: `let count = 0;
const display = document.getElementById('count');
const update = () => {
  display.textContent = 'Кликов: ' + count;
  display.style.color = count > 0 ? '#27ae60' : count < 0 ? '#e74c3c' : '#333';
  console.log('Счётчик:', count);
};

document.getElementById('plus').addEventListener('click', () => { count++; update(); });
document.getElementById('minus').addEventListener('click', () => { count--; update(); });
document.getElementById('reset').addEventListener('click', () => { count = 0; update(); });
console.log('Обработчики событий установлены');`
  },
  {
    label: 'Изменение стилей',
    html: `<div id="app">
  <div id="box" style="width:100px;height:100px;background:#3498db;transition:all 0.3s;border-radius:8px;margin:10px auto;"></div>
  <button id="color">Цвет</button>
  <button id="size">Размер</button>
  <button id="shape">Форма</button>
</div>`,
    js: `const box = document.getElementById('box');
const colors = ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6'];
let colorIdx = 0;
let big = false;
let round = false;

document.getElementById('color').addEventListener('click', () => {
  colorIdx = (colorIdx + 1) % colors.length;
  box.style.background = colors[colorIdx];
  console.log('Цвет:', colors[colorIdx]);
});

document.getElementById('size').addEventListener('click', () => {
  big = !big;
  box.style.width = big ? '150px' : '100px';
  box.style.height = big ? '150px' : '100px';
  console.log('Размер:', big ? 'большой' : 'обычный');
});

document.getElementById('shape').addEventListener('click', () => {
  round = !round;
  box.style.borderRadius = round ? '50%' : '8px';
  console.log('Форма:', round ? 'круг' : 'квадрат');
});
console.log('Интерактивные стили готовы');`
  },
  {
    label: 'Навигация по DOM',
    html: `<div id="tree">
  <div id="parent">
    <span class="child">Первый</span>
    <span class="child">Второй</span>
    <span class="child">Третий</span>
  </div>
</div>
<div id="output"></div>`,
    js: `const parent = document.getElementById('parent');
const output = document.getElementById('output');
const log = (text) => {
  output.innerHTML += '<div style="padding:2px 0;font-size:0.9em">' + text + '</div>';
  console.log(text);
};

log('parentElement: ' + parent.parentElement.id);
log('children.length: ' + parent.children.length);
log('firstElementChild: ' + parent.firstElementChild.textContent);
log('lastElementChild: ' + parent.lastElementChild.textContent);

const second = parent.children[1];
log('previousSibling: ' + second.previousElementSibling.textContent);
log('nextSibling: ' + second.nextElementSibling.textContent);

// querySelectorAll
const all = parent.querySelectorAll('.child');
log('querySelectorAll .child: ' + all.length + ' элементов');
all.forEach((el, i) => el.style.color = ['#e74c3c','#3498db','#27ae60'][i]);`
  },
  {
    label: 'classList и атрибуты',
    html: `<style>
  .highlight { background: #fff3cd; padding: 4px 8px; border-radius: 4px; }
  .active { border: 2px solid #3498db; }
  .done { text-decoration: line-through; color: #999; }
</style>
<div id="app">
  <p id="item1">Задача 1</p>
  <p id="item2">Задача 2</p>
  <p id="item3">Задача 3</p>
  <button id="toggle">Toggle класс</button>
</div>`,
    js: `const items = [
  document.getElementById('item1'),
  document.getElementById('item2'),
  document.getElementById('item3'),
];

// Добавляем классы
items[0].classList.add('highlight');
items[1].classList.add('active');
items[2].classList.add('done');

console.log('item1 classList:', [...items[0].classList]);
console.log('item2 classList:', [...items[1].classList]);

// data-атрибуты
items.forEach((el, i) => {
  el.setAttribute('data-priority', ['high','medium','low'][i]);
});
console.log('data-priority:', items[0].dataset.priority);

// Toggle
let idx = 0;
document.getElementById('toggle').addEventListener('click', () => {
  items[idx].classList.toggle('highlight');
  console.log('Toggled highlight на:', items[idx].textContent);
  idx = (idx + 1) % items.length;
});`
  },
]

function applyPreset(preset: typeof presets[number]) {
  htmlCode.value = preset.html
  jsCode.value = preset.js
  activeTab.value = 'editor'
  addLog(`Preset: ${preset.label}`, 'info')
}

function runCode() {
  clearLogs()
  addLog('--- Выполнение кода ---', 'info')

  const iframe = previewRef.value
  if (!iframe) return

  const consoleOverride = `
    <script>
      const _logs = [];
      const _origConsole = console.log;
      console.log = function(...args) {
        _origConsole.apply(console, args);
        window.parent.postMessage({
          type: 'console-log',
          args: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a))
        }, '*');
      };
      console.error = function(...args) {
        window.parent.postMessage({
          type: 'console-error',
          args: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a))
        }, '*');
      };
      window.onerror = function(msg) {
        window.parent.postMessage({ type: 'console-error', args: [msg] }, '*');
      };
    <\/script>
  `

  const doc = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: system-ui, sans-serif; padding: 12px; margin: 0; font-size: 14px; color: #333; }
        button { padding: 6px 14px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; margin: 2px; background: #f8f8f8; }
        button:hover { background: #e8e8e8; }
      </style>
      ${consoleOverride}
    </head>
    <body>
      ${htmlCode.value}
      <script>
        try {
          ${jsCode.value}
        } catch(e) {
          console.error('Ошибка: ' + e.message);
        }
      <\/script>
    </body>
    </html>
  `

  iframe.srcdoc = doc
  addLog('Код выполнен', 'success')
}

function handleMessage(event: MessageEvent) {
  if (event.data?.type === 'console-log') {
    addLog(event.data.args.join(' '), 'value')
  } else if (event.data?.type === 'console-error') {
    addLog(event.data.args.join(' '), 'error')
  }
}

function resetDemo() {
  htmlCode.value = ''
  jsCode.value = ''
  clearLogs()
  if (previewRef.value) {
    previewRef.value.srcdoc = '<html><body><p style="color:#999;font-style:italic;padding:12px;">Нажмите «Выполнить» для запуска</p></body></html>'
  }
  addLog('Демо сброшено', 'info')
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
  nextTick(() => runCode())
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="demo-wrapper">
    <div class="demo-header">
      <h3>DOM Playground — Интерактивная песочница</h3>
    </div>

    <p class="demo-description">
      Редактируйте HTML и JavaScript код, затем нажмите «Выполнить» для запуска. Console.log выводится в логи.
    </p>

    <div class="demo-tabs">
      <button
        class="demo-tab-btn"
        :class="{ active: activeTab === 'editor' }"
        @click="activeTab = 'editor'"
      >
        Редактор
      </button>
      <button
        class="demo-tab-btn"
        :class="{ active: activeTab === 'presets' }"
        @click="activeTab = 'presets'"
      >
        Примеры
      </button>
    </div>

    <div v-if="activeTab === 'presets'" class="presets-list">
      <button
        v-for="preset in presets"
        :key="preset.label"
        class="preset-card"
        @click="applyPreset(preset)"
      >
        {{ preset.label }}
      </button>
    </div>

    <div v-if="activeTab === 'editor'" class="playground-layout">
      <div class="editors-row">
        <div class="editor-panel">
          <strong class="editor-label">HTML</strong>
          <textarea
            v-model="htmlCode"
            class="code-editor"
            rows="10"
            spellcheck="false"
          ></textarea>
        </div>

        <div class="editor-panel">
          <strong class="editor-label">JavaScript</strong>
          <textarea
            v-model="jsCode"
            class="code-editor"
            rows="10"
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="demo-btn-row">
        <button class="demo-btn demo-btn-create" @click="runCode">
          Выполнить
        </button>
        <button class="demo-btn demo-btn-reset" @click="resetDemo">
          Сброс
        </button>
      </div>

      <div class="preview-section">
        <strong>Результат:</strong>
        <iframe
          ref="previewRef"
          class="preview-frame"
          sandbox="allow-scripts"
        ></iframe>
      </div>

      <div class="demo-logs">
        <div class="demo-logs-header">
          <strong>Консоль:</strong>
          <button class="demo-btn demo-btn-small" @click="clearLogs">Очистить</button>
        </div>
        <div class="demo-logs-container">
          <div
            v-for="(entry, index) in logEntries"
            :key="index"
            class="demo-log-entry"
            :class="`demo-log-${entry.type}`"
          >
            [{{ entry.time }}] {{ entry.message }}
          </div>
          <div v-if="logEntries.length === 0" class="demo-log-empty">
            Console.log появится здесь.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editors-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.editor-panel {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.editor-label {
  font-size: 0.85em;
  color: var(--vp-c-text-2, #666);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.code-editor {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.82em;
  line-height: 1.5;
  resize: vertical;
  background: #1e1e1e;
  color: #d4d4d4;
  tab-size: 2;
}

.preview-frame {
  width: 100%;
  height: 200px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  background: white;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.presets-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.preset-card {
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  background: var(--vp-c-bg, white);
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
  font-size: 0.9em;
  text-align: left;
  font-weight: 500;
}

.preset-card:hover {
  border-color: var(--vp-c-brand-1, #3eaf7c);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .editors-row {
    grid-template-columns: 1fr;
  }

  .presets-list {
    grid-template-columns: 1fr;
  }

  .preview-frame {
    height: 150px;
  }
}
</style>
