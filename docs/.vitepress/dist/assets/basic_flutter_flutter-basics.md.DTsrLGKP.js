import{_ as i,c as a,o as n,ah as t}from"./chunks/framework.DwHsq7Fg.js";const g=JSON.parse('{"title":"Основи Flutter","description":"","frontmatter":{},"headers":[],"relativePath":"basic_flutter/flutter-basics.md","filePath":"basic_flutter/flutter-basics.md"}'),e={name:"basic_flutter/flutter-basics.md"};function l(h,s,r,p,d,k){return n(),a("div",null,s[0]||(s[0]=[t(`<h1 id="основи-flutter" tabindex="-1">Основи Flutter <a class="header-anchor" href="#основи-flutter" aria-label="Permalink to “Основи Flutter”">​</a></h1><p>Flutter — це UI-фреймворк з відкритим вихідним кодом, розроблений Google для створення красивих, нативно скомпільованих застосунків для мобільних пристроїв (iOS та Android), вебу та десктопу з однієї кодової бази.</p><h2 id="основні-концепціі" tabindex="-1">Основні концепції <a class="header-anchor" href="#основні-концепціі" aria-label="Permalink to “Основні концепції”">​</a></h2><h3 id="віджети-widgets" tabindex="-1">Віджети (Widgets) <a class="header-anchor" href="#віджети-widgets" aria-label="Permalink to “Віджети (Widgets)”">​</a></h3><p>У Flutter все є віджетом. Віджети описують, як має виглядати та поводитися ваш UI. Вони є будівельними блоками інтерфейсу. Існує два основних типи віджетів:</p><ul><li><p><strong>StatelessWidget:</strong> Віджети, стан яких не може змінюватися після їх створення. Вони корисні для відображення статичної інформації або UI-елементів, які не потребують динамічного оновлення.</p><div class="language-dart"><button title="Copy Code" class="copy"></button><span class="lang">dart</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> MyStatelessWidget</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> StatelessWidget</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  final</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> message;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  MyStatelessWidget</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">required</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.message});</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  @override</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  Widget</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> build</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">BuildContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> context) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(message);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li><li><p><strong>StatefulWidget:</strong> Віджети, стан яких може змінюватися протягом їх життєвого циклу. Вони використовуються для динамічного UI, який реагує на події або зміни даних. Stateful віджети складаються з двох класів: самого віджета та класу <code>State</code>, який містить стан віджета та логіку його оновлення.</p><div class="language-dart"><button title="Copy Code" class="copy"></button><span class="lang">dart</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> MyStatefulWidget</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> StatefulWidget</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  @override</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  _MyStatefulWidgetState</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> createState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> _MyStatefulWidgetState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> _MyStatefulWidgetState</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> State</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">MyStatefulWidget</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _counter </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> _incrementCounter</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    setState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      _counter</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  @override</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  Widget</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> build</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">BuildContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> context) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      children</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Widget</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        Text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Лічильник: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">$</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">_counter</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        ElevatedButton</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          onPressed</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _incrementCounter,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          child</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Збільшити&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>Метод <code>setState()</code> використовується для повідомлення Flutter про те, що стан віджета змінився, і UI потрібно перемалювати.</p></li></ul><h3 id="дерево-віджетів-widget-tree" tabindex="-1">Дерево віджетів (Widget Tree) <a class="header-anchor" href="#дерево-віджетів-widget-tree" aria-label="Permalink to “Дерево віджетів (Widget Tree)”">​</a></h3><p>UI у Flutter будується як ієрархія вкладених віджетів, утворюючи дерево віджетів. Кожен віджет є вузлом цього дерева. Flutter ефективно керує цим деревом для оновлення UI при зміні стану.</p><h3 id="макетування-layout" tabindex="-1">Макетування (Layout) <a class="header-anchor" href="#макетування-layout" aria-label="Permalink to “Макетування (Layout)”">​</a></h3><p>Flutter надає різноманітні віджети для макетування UI:</p><ul><li><strong>Row:</strong> Розташовує дочірні віджети горизонтально.</li><li><strong>Column:</strong> Розташовує дочірні віджети вертикально.</li><li><strong>Stack:</strong> Розташовує дочірні віджети один над одним.</li><li><strong>Expanded:</strong> Змушує дочірній віджет займати доступний простір у <code>Row</code> або <code>Column</code>.</li><li><strong>Flexible:</strong> Схожий на <code>Expanded</code>, але дозволяє вказувати коефіцієнт гнучкості.</li><li><strong>Center:</strong> Центрує дочірній віджет.</li><li><strong>Padding:</strong> Додає відступи навколо дочірнього віджета.</li><li><strong>Margin:</strong> Додає відступи зовні від дочірнього віджета.</li><li><strong>SizedBox:</strong> Віджет фіксованого розміру.</li></ul><h3 id="маршрутизація-routing" tabindex="-1">Маршрутизація (Routing) <a class="header-anchor" href="#маршрутизація-routing" aria-label="Permalink to “Маршрутизація (Routing)”">​</a></h3><p>Для навігації між різними екранами (сторінками) у Flutter використовуються маршрути.</p><ul><li><p><strong>Navigator:</strong> Клас, який керує стеком маршрутів застосунку.</p></li><li><p><strong>MaterialPageRoute:</strong> Стандартний спосіб переходу між екранами з анімацією, характерною для Material Design.</p></li><li><p><strong>Navigator.push():</strong> Додає новий маршрут на вершину стеку навігації.</p></li><li><p><strong>Navigator.pop():</strong> Видаляє поточний маршрут з вершини стеку та повертається до попереднього екрану.</p><div class="language-dart"><button title="Copy Code" class="copy"></button><span class="lang">dart</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Перехід на новий екран</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Navigator</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">push</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  context,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  MaterialPageRoute</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(builder</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (context) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> NewScreen</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Повернення з поточного екрана</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Navigator</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pop</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(context);</span></span></code></pre></div></li></ul><h3 id="стан-state-management" tabindex="-1">Стан (State Management) <a class="header-anchor" href="#стан-state-management" aria-label="Permalink to “Стан (State Management)”">​</a></h3><p>Керування станом є однією з найважливіших тем у розробці Flutter-застосунків. Існує кілька підходів до керування станом, від простих <code>setState()</code> до більш складних рішень, таких як:</p><ul><li><strong>Provider:</strong> Простий у використанні спосіб керування станом, заснований на патерні &quot;наслідування віджета&quot;.</li><li><strong>Riverpod:</strong> Покращена версія Provider з більшою безпекою типів та гнучкістю.</li><li><strong>Bloc/Cubit:</strong> Архітектурний патерн для керування складним станом, заснований на подіях та станах.</li><li><strong>GetX:</strong> Потужний фреймворк, який включає керування станом, маршрутизацію, залежності та багато іншого.</li></ul><p>Вибір підходу залежить від складності вашого застосунку. Для простих UI <code>setState()</code> або <code>Provider</code> можуть бути достатніми.</p><h3 id="теми-themes" tabindex="-1">Теми (Themes) <a class="header-anchor" href="#теми-themes" aria-label="Permalink to “Теми (Themes)”">​</a></h3><p>Flutter дозволяє налаштовувати візуальний стиль вашого застосунку за допомогою тем. Ви можете визначити кольори, типографіку, іконки та інші візуальні параметри, які будуть застосовуватися до всіх віджетів, що використовують тему.</p><pre><code>\`\`\`dart
MaterialApp(
  theme: ThemeData(
    primarySwatch: Colors.blue,
    accentColor: Colors.amber,
    textTheme: TextTheme(
      headline1: TextStyle(fontSize: 72.0, fontWeight: FontWeight.bold),
      bodyText2: TextStyle(fontSize: 14.0, fontFamily: &#39;Roboto&#39;),
    ),
  ),
  home: MyHomePage(),
);
\`\`\`
</code></pre><h3 id="обробка-подіи-event-handling" tabindex="-1">Обробка подій (Event Handling) <a class="header-anchor" href="#обробка-подіи-event-handling" aria-label="Permalink to “Обробка подій (Event Handling)”">​</a></h3><p>Flutter надає механізми для обробки різних подій, таких як натискання кнопок, введення тексту, жести та інше. Багато віджетів мають колбеки <code>onPressed</code>, <code>onChanged</code>, <code>onTap</code> тощо, які дозволяють реагувати на ці події.</p><pre><code>\`\`\`dart
ElevatedButton(
  onPressed: () {
    print(&#39;Кнопку натиснуто!&#39;);
  },
  child: Text(&#39;Натисни мене&#39;),
);

GestureDetector(
  onTap: () {
    print(&#39;Віджет натиснуто!&#39;);
  },
  child: Container(
    width: 100,
    height: 100,
    color: Colors.red,
  ),
);
\`\`\`
</code></pre><h3 id="асинхронність-asynchronous-operations" tabindex="-1">Асинхронність (Asynchronous Operations) <a class="header-anchor" href="#асинхронність-asynchronous-operations" aria-label="Permalink to “Асинхронність (Asynchronous Operations)”">​</a></h3><p>Для виконання операцій, які можуть зайняти деякий час (наприклад, мережеві запити, читання файлів), у Flutter використовуються асинхронні функції (<code>async</code>) та ключові слова <code>await</code>. <code>Future</code> представляє результат асинхронної операції.</p><pre><code>\`\`\`dart
Future&lt;String&gt; fetchData() async {
  await Future.delayed(Duration(seconds: 2));
  return &#39;Дані отримано!&#39;;
}

void main() async {
  print(&#39;Початок отримання даних...&#39;);
  String data = await fetchData();
  print(data); // Виведе &quot;Дані отримано!&quot; через 2 секунди
}
\`\`\`
</code></pre><h3 id="робота-з-мережею-networking" tabindex="-1">Робота з мережею (Networking) <a class="header-anchor" href="#робота-з-мережею-networking" aria-label="Permalink to “Робота з мережею (Networking)”">​</a></h3><p>Flutter має вбудовані бібліотеки для виконання HTTP-запитів та роботи з веб-сервісами. Зазвичай використовується пакет <code>http</code>.</p><pre><code>\`\`\`dart
import &#39;package:http/http.dart&#39; as http;
import &#39;dart:convert&#39;;

Future&lt;Map&lt;String, dynamic&gt;&gt; fetchAlbum() async {
  final response = await http.get(Uri.parse(&#39;[https://jsonplaceholder.typicode.com/albums/1](https://jsonplaceholder.typicode.com/albums/1)&#39;));

  if (response.statusCode == 200) {
    return jsonDecode(response.body) as Map&lt;String, dynamic&gt;;
  } else {
    throw Exception(&#39;Не вдалося завантажити альбом&#39;);
  }
}

void main() async {
  try {
    Map&lt;String, dynamic&gt; album = await fetchAlbum();
    print(album[&#39;title&#39;]);
  } catch (e) {
    print(&#39;Помилка: $e&#39;);
  }
}
\`\`\`
</code></pre><h3 id="робота-з-json-json-handling" tabindex="-1">Робота з JSON (JSON Handling) <a class="header-anchor" href="#робота-з-json-json-handling" aria-label="Permalink to “Робота з JSON (JSON Handling)”">​</a></h3><p>Flutter надає вбудовану підтримку для кодування та декодування JSON-даних за допомогою бібліотеки <code>dart:convert</code>.</p><pre><code>\`\`\`dart
import &#39;dart:convert&#39;;

void main() {
  String jsonString = &#39;{&quot;name&quot;: &quot;Іван&quot;, &quot;age&quot;: 30}&#39;;
  Map&lt;String, dynamic&gt; userData = jsonDecode(jsonString) as Map&lt;String, dynamic&gt;;
  print(&#39;Ім\\&#39;я: \${userData[&#39;name&#39;]}, Вік: \${userData[&#39;age&#39;]}&#39;);

  Map&lt;String, dynamic&gt; user = {&#39;name&#39;: &#39;Петро&#39;, &#39;age&#39;: 25};
  String encodedJson = jsonEncode(user);
  print(encodedJson);
}
\`\`\`
</code></pre><h2 id="першии-застосунок-flutter" tabindex="-1">Перший застосунок Flutter <a class="header-anchor" href="#першии-застосунок-flutter" aria-label="Permalink to “Перший застосунок Flutter”">​</a></h2><p>Основний файл вашого Flutter-застосунку зазвичай називається <code>main.dart</code>. Точка входу в застосунок — це функція <code>main()</code>, яка викликає функцію <code>runApp()</code> з кореневим віджетом вашого застосунку.</p><pre><code>\`\`\`dart
import &#39;package:flutter/material.dart&#39;;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: &#39;Мій перший застосунок&#39;,
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: &#39;Головна сторінка&#39;),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({required this.title});

  final String title;

  @override
  _MyHomePageState createState() =&gt; _MyHomePageState();
}

class _MyHomePageState extends State&lt;MyHomePage&gt; {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: &lt;Widget&gt;[
            Text(
              &#39;Ви натиснули кнопку:&#39;,
            ),
            Text(
              &#39;$_counter&#39;,
              style: Theme.of(context).textTheme.headline4,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: &#39;Збільшити&#39;,
        child: Icon(Icons.add),
      ),
    );
  }
}
\`\`\`

* **MaterialApp:** Кореневий віджет для застосунків, що використовують Material Design.
* **Scaffold:** Забезпечує базову структуру екрану (AppBar, Body, FloatingActionButton тощо).
* **AppBar:** Панель у верхній частині екрану.
* **Center:** Центрує дочірній віджет.
* **Column:** Розташовує дочірні віджети вертикально.
* **Text:** Віджет для відображення тексту.
* **ElevatedButton:** Кнопка з підняттям.
* **FloatingActionButton:** Плаваюча кнопка дії.
* **Icon:** Віджет для відображення іконок.
</code></pre><h2 id="висновок" tabindex="-1">Висновок <a class="header-anchor" href="#висновок" aria-label="Permalink to “Висновок”">​</a></h2><p>Це лише базовий огляд основних концепцій Flutter. Для глибшого розуміння та вивчення фреймворку рекомендується ознайомитися з офіційною документацією Flutter (<a href="https://flutter.dev/docs" target="_blank" rel="noreferrer">https://flutter.dev/docs</a>) та практично застосовувати отримані знання у власних проєктах. Flutter пропонує багатий набір інструментів та віджетів для створення красивих та продуктивних застосунків для різних платформ.</p>`,38)]))}const c=i(e,[["render",l]]);export{g as __pageData,c as default};
