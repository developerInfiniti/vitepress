import{_ as n,c as a,o as i,ah as p}from"./chunks/framework.DwHsq7Fg.js";const k=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"basics_api/response-codes.md","filePath":"basics_api/response-codes.md"}'),t={name:"basics_api/response-codes.md"};function e(l,s,o,h,d,r){return i(),a("div",null,s[0]||(s[0]=[p(`<div class="language-markdown"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;"># Пояснення до розділу &quot;Коди відповідей&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Коди відповідей:**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 🚦 200, 201, 400, 401, 404, 500 тощо. — це </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**короткі повідомлення**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> від веб-сервера до вас (браузера) про результат вашого запиту. Це як </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**статус замовлення**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> в інтернеті.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Уявіть:**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Ви запитуєте веб-сторінку 🌐.</span></span></code></pre></div><p>Ви (браузер) --&gt; Запит (&quot;Покажи сторінку&quot;) --&gt; Веб-сервер 🏢</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span></span></span>
<span class="line"><span>Сервер відповідає **кодом**, щоб ви зрозуміли, що сталося:</span></span></code></pre></div><p>Веб-сервер 🏢 --&gt; Код відповіді --&gt; Ви (браузер)</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span></span></span>
<span class="line"><span>**Основні &quot;емодзі-статуси&quot;:**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| Код     | Група             | Коротко                                  | Приклад (Ресторан)                                                    |</span></span>
<span class="line"><span>| :------ | :---------------- | :--------------------------------------- | :-------------------------------------------------------------------- |</span></span>
<span class="line"><span>| **1xx** | ℹ️ Інформація     | &quot;Зачекайте...&quot;                            | &quot;Ваше замовлення готується...&quot;                                       |</span></span>
<span class="line"><span>| **2xx** | ✅ Успіх           | &quot;Все Ок!&quot;                               | &quot;Ось ваша страва!&quot;                                                   |</span></span>
<span class="line"><span>| **3xx** | ➡️ Перенаправлення | &quot;Перейдіть туди...&quot;                       | &quot;Ця страва тепер в іншому меню.&quot;                                     |</span></span>
<span class="line"><span>| **4xx** | ❌ Ваша помилка   | &quot;Щось не так у вашому запиті.&quot;           | &quot;Ви замовили неіснуючу страву.&quot;                                      |</span></span>
<span class="line"><span>| **5xx** | ⚠️ Помилка сервера | &quot;Проблема у нас...&quot;                       | &quot;На кухні сталася поломка.&quot;                                           |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Детальніше про деякі коди:**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>* **✅ [200 OK](#200-ok):** &quot;Є! Сторінка завантажилася.&quot;</span></span>
<span class="line"><span>* **✨ [201 Created](#201-created):** &quot;Готово! Ваш запис створено.&quot;</span></span>
<span class="line"><span>* **🚫 [400 Bad Request](#400-bad-request):** &quot;Упс! Ви щось неправильно ввели.&quot;</span></span>
<span class="line"><span>* **🔒 [401 Unauthorized](#401-unauthorized):** &quot;Вхід заборонено! Спочатку авторизуйтесь.&quot;</span></span>
<span class="line"><span>* **🔍 [404 Not Found](#404-not-found):** &quot;Вибачте, такої сторінки тут немає.&quot;</span></span>
<span class="line"><span>* **💥 [500 Internal Server Error](#500-internal-server-error):** &quot;Ой! На сервері щось пішло не так.&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Чому це важливо?**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>* **Для вас (користувача):** Допомагає зрозуміти, чому сайт не працює.</span></span>
<span class="line"><span>* **Для розробників:** Підказки, де шукати помилки.</span></span>
<span class="line"><span>* **Для пошукових систем:** Впливає на те, як сайт індексується.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Підсумок:** Коди відповідей - це **мовчазні повідомлення** від сервера, які допомагають зрозуміти, що відбувається з вашими інтернет-запитами.</span></span></code></pre></div>`,5)]))}const u=n(t,[["render",e]]);export{k as __pageData,u as default};
