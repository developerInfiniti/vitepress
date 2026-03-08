---
description: "Слоты Vue.js: default, named, scoped slots — передача шаблонов в дочерние компоненты с примерами"
---

# Слоты {#slots}

## Содержимое слота и точка выхода {#slot-content-and-outlet}

Мы узнали, что компоненты могут принимать входные параметры, которые могут быть значениями JavaScript любого типа. Но как насчёт содержимого шаблона? В некоторых случаях мы можем захотеть передать фрагмент шаблона в дочерний компонент и позволить дочернему компоненту отображать этот фрагмент в своём собственном шаблоне.

Например, у нас может быть компонент `<FancyButton>`, который поддерживает такое использование:

```vue-html
<FancyButton>
  Нажми меня! <!-- содержимое слота -->
</FancyButton>
```

Шаблон `<FancyButton>` выглядит так:

```vue-html{2}
<button class="fancy-btn">
  <slot></slot> <!-- точка выхода слота -->
</button>
```

Элемент `<slot>` — это **точка выхода слота**, которая указывает, где должно быть отображено **содержимое слота**, предоставленное родителем.

И итоговый отрендеренный DOM:

```html
<button class="fancy-btn">Нажми меня!</button>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpdUdtOwzAM/RUThAbSurIbl1ImARJf0ZesSapoqROlKdo07d9x0jF1SHmIT+xzcY7sw7nZTy9Zwcqu9tqFTYW6ddYH+OZYHz77ECyC8raFySwfYXFsUiFAhXKfBoRUvDcBjhGtLbGgxNAVcLziOlVIp8wvelQE2TrDg6QKoBx1JwDgy+h6B62E8ibLoDM2kAAGoocsiz1VKMfmCCrzCymbsn/GY95rze1grja8694rpmJ/tg1YsfRO/FE134wc2D4YeTYQ9QeKa+mUrgsHE6+zC+vfjoz1Bdwqpd5iveX1rvG2R1GA0Si5zxrPhaaY98v5WshmCrerhVi+LmCxvqPiafUslXoYpq0XkuiQ1p4Ax4XQ2BSwdnuYP7p9QlvuG40JHI1lUaenv3o5w3Xvu2jOWU179oQNn5aisNMvLBvDOg==)

</div>

Со слотами `<FancyButton>` отвечает за отрисовку внешнего `<button>` (и его стилизацию), а внутреннее содержимое предоставляется родительским компонентом.

Ещё один способ понять слоты — сравнить их с функциями JavaScript:

```js
// родительский компонент передаёт содержимое слота
FancyButton('Нажми меня!')

// FancyButton отображает содержимое слота в своём шаблоне
function FancyButton(slotContent) {
  return `<button class="fancy-btn">
      ${slotContent}
    </button>`
}
```

Содержимое слота не ограничивается только текстом. Это может быть любое допустимое содержимое шаблона. Например, мы можем передать несколько элементов или даже другие компоненты:

```vue-html
<FancyButton>
  <span style="color:red">Нажми меня!</span>
  <AwesomeIcon name="plus" />
</FancyButton>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp1UmtOwkAQvspQYtCEgrx81EqCJibeoX+W7bRZaHc3+1AI4QyewH8ewvN4Aa/gbgtNIfFf5+vMfI/ZXbCQcvBmMYiCWFPFpAGNxsp5wlkphTLwQjjdPlljBIdMiRJ6g2EL88O9pnnxjlqU+EpbzS3s0BwPaypH4gqDpSyIQVcBxK3VFQDwXDC6hhJdlZi4zf3fRKwl4aDNtsDHJKCiECqiW8KTYH5c1gEnwnUdJ9rCh/XeM6Z42AgN+sFZAj6+Ux/LOjFaEK2diMz3h0vjNfj/zokuhPFU3lTdfcpShVOZcJ+DZgHs/HxtCrpZlj34eknoOlfC8jSCgnEkKswVSRlyczkZzVLM+9CdjtPJ/RjGswtX3ExvMcuu6mmhUnTruOBYAZKkKeN5BDO5gdG13FRoSVTOeAW2xkLPY3UEdweYWqW9OCkYN6gctq9uXllx2Z09CJ9dJwzBascI7nBYihWDldUGMqEgdTVIq6TQqCEMfUpNSD+fX7/fH+3b7P8AdGP6wA==)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNptUltu2zAQvMpGQZEWsOzGiftQ1QBpgQK9g35oaikwkUiCj9aGkTPkBPnLIXKeXCBXyJKKBdoIoA/tYGd3doa74tqY+b+ARVXUjltp/FWj5GC09fCHKb79FbzXCoTVA5zNFxkWaWdT8/V/dHrAvzxrzrC3ZoBG4SYRWhQs9B52EeWapihU3lWwyxfPDgbfNYq+ejEppcLjYHrmkSqAOqMmAOB3L/ktDEhV4+v8gMR/l1M7wxQ4v+3xZ1Nw3Wtb8S1TTXG1H3cCJIO69oxc5mLUcrSrXkxSi1lxZGT0//CS9Wg875lzJELE/nLto4bko69dr31cFc8auw+3JHvSEfQ7nwbsHY9HwakQ4kes14zfdlYH1VbQS4XMlp1lraRMPl6cr1rsZnB6uWwvvi9hufpAxZfLryjEp5GtbYs0TlGICTCsbaXqKliZDZx/NpuEDsx2UiUwo5VxT6Dkv73BPFgXxRktlUdL2Jh6OoW8O3pX0buTsoTgaCNQcDjoGwk3wXkQ2tJLGzSYYI126KAso0uTSc8Pjy9P93k2d6+NyRKa)

</div>

Благодаря слотам наш `<FancyButton>` более гибкий и многоразовый. Теперь мы можем использовать его в разных местах с разным внутренним содержимым, но с одинаковым стилем.

Механизм слотов компонентов Vue вдохновлён [нативным элементом `<slot>` Web Components](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot), но с дополнительными возможностями, которые мы увидим позже.

## Область видимости рендеринга {#render-scope}

Содержимое слота имеет доступ к области видимости данных родительского компонента, поскольку оно определяется в родительском компоненте. Например:

```vue-html
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```

Здесь оба интерполяции <span v-pre>`{{ message }}`</span> будут отображать одно и то же содержимое.

Содержимое слота **не** имеет доступа к данным дочернего компонента. Выражения в шаблонах Vue могут обращаться только к области видимости, в которой они определены, в соответствии с лексической областью видимости JavaScript. Другими словами:

> Выражения в шаблоне родителя имеют доступ только к области видимости родителя; выражения в шаблоне дочернего элемента имеют доступ только к области видимости дочернего элемента.

## Резервное содержимое {#fallback-content}

Бывают случаи, когда полезно указать резервное (т.е. по умолчанию) содержимое для слота, которое будет отображаться только в том случае, если содержимое не предоставлено. Например, в компоненте `<SubmitButton>`:

```vue-html
<button type="submit">
  <slot></slot>
</button>
```

Мы можем захотеть, чтобы текст «Отправить» отображался внутри `<button>`, если родитель не предоставил никакого содержимого для слота. Чтобы сделать «Отправить» резервным содержимым, мы можем поместить его между тегами `<slot>`:

```vue-html{3}
<button type="submit">
  <slot>
    Отправить <!-- резервное содержимое -->
  </slot>
</button>
```

Теперь, когда мы используем `<SubmitButton>` в родительском компоненте, не предоставляя содержимого для слота:

```vue-html
<SubmitButton />
```

Будет отображено резервное содержимое, «Отправить»:

```html
<button type="submit">Отправить</button>
```

Но если мы предоставим содержимое:

```vue-html
<SubmitButton>Сохранить</SubmitButton>
```

Тогда вместо него будет отображено предоставленное содержимое:

```html
<button type="submit">Сохранить</button>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp1kMsKwjAQRH9lzMaNbfcSC/oL3WbT1ikU8yKZFEX8d5MGgi2YVeZxZ86dN7taWy8B2ZlxP7rZEnikYFuhZ2WNI+jCoGa6BSKjYXJGwbFufpNJfhSaN1kflTEgVFb2hDEC4IeqguARpl7KoR8fQPgkqKpc3Wxo1lxRWWeW+Y4wBk9x9V9d2/UL8g1XbOJN4WAntodOnrecQ2agl8WLYH7tFyw5olj10iR3EJ+gPCxDFluj0YS6EAqKR8mi9M3Td1ifLxWShcU=)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp1UEEOwiAQ/MrKxYu1d4Mm+gWvXChuk0YKpCyNxvh3lxIb28SEA8zuDDPzEucQ9mNCcRAymqELdFKu64MfCK6p6Tu6JCLvoB18D9t9/Qtm4lY5AOXwMVFu2OpkCV4ZNZ51HDqKhwLAQjIjb+X4yHr+mh+EfbCakF8AclNVkCJCq61ttLkD4YOgqsp0YbGesJkVBj92NwSTIrH3v7zTVY8oF8F4SdazD7ET69S5rqXPpnigZ8CjEnHaVyInIp5G63O6XIGiIlZMzrGMd8RVfR0q4lIKKV+L+srW+wNTTZq3)

</div>

## Именованные слоты {#named-slots}

Бывают случаи, когда полезно иметь несколько точек выхода слотов в одном компоненте. Например, в компоненте `<BaseLayout>` с таким шаблоном:

```vue-html
<div class="container">
  <header>
    <!-- Мы хотим разместить здесь содержимое заголовка -->
  </header>
  <main>
    <!-- Мы хотим разместить здесь основное содержимое -->
  </main>
  <footer>
    <!-- Мы хотим разместить здесь содержимое подвала -->
  </footer>
</div>
```

Для таких случаев элемент `<slot>` имеет специальный атрибут `name`, который можно использовать для присвоения уникального идентификатора разным слотам, чтобы определить, где должно отображаться содержимое:

```vue-html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Точка выхода `<slot>` без `name` неявно имеет имя «default».

В родительском компоненте, использующем `<BaseLayout>`, нам нужен способ передать несколько фрагментов содержимого слота, каждый нацеленный на свою точку выхода. Для этого используются **именованные слоты**.

Чтобы передать именованный слот, нам нужно использовать элемент `<template>` с директивой `v-slot`, а затем передать имя слота в качестве аргумента `v-slot`:

```vue-html
<BaseLayout>
  <template v-slot:header>
    <!-- содержимое для слота header -->
  </template>
</BaseLayout>
```

`v-slot` имеет специальное сокращение `#`, поэтому `<template v-slot:header>` можно сократить до `<template #header>`. Думайте об этом как о «отрендерить этот фрагмент шаблона в слоте 'header' дочернего компонента».

Вот код, передающий содержимое для всех трёх слотов в `<BaseLayout>` с использованием сокращённого синтаксиса:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Здесь может быть заголовок страницы</h1>
  </template>

  <template #default>
    <p>Абзац для основного содержимого.</p>
    <p>И ещё один.</p>
  </template>

  <template #footer>
    <p>Здесь контактная информация</p>
  </template>
</BaseLayout>
```

Когда компонент принимает как слот по умолчанию, так и именованные слоты, все узлы верхнего уровня, не входящие в `<template>`, неявно рассматриваются как содержимое для слота по умолчанию. Поэтому приведённый выше код можно также записать так:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Здесь может быть заголовок страницы</h1>
  </template>

  <!-- неявный слот по умолчанию -->
  <p>Абзац для основного содержимого.</p>
  <p>И ещё один.</p>

  <template #footer>
    <p>Здесь контактная информация</p>
  </template>
</BaseLayout>
```

Теперь всё внутри элементов `<template>` будет передаваться в соответствующие слоты. Итоговый отрендеренный HTML будет выглядеть так:

```html
<div class="container">
  <header>
    <h1>Здесь может быть заголовок страницы</h1>
  </header>
  <main>
    <p>Абзац для основного содержимого.</p>
    <p>И ещё один.</p>
  </main>
  <footer>
    <p>Здесь контактная информация</p>
  </footer>
</div>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp9UsFuwjAM/RWrHLgMOi5o6jIkdtphn9BLSF0aKU2ixEVjiH+fm8JoQdvRfu/5xS8+ZVvvl4cOsyITUQXtCSJS5zel1a13geBdRvyUR9cR1MG1MF/mt1YvnZdW5IOWVVwQtt5IQq4AxI2cau5ccZg1KCsMlz4jzWrzgQGh1fuGYIcgwcs9AmkyKHKGLyPykcfD1Apr2ZmrHUN+s+U5Qe6D9A3ULgA1bCK1BeUsoaWlyPuVb3xbgbSOaQGcxRH8v3XtHI0X8mmfeYToWkxmUhFoW7s/JvblJLERmj1l0+T7T5tqK30AZWSMb2WW3LTFUGZXp/u8o3EEVrbI9AFjLn8mt38fN9GIPrSp/p4/Yoj7OMZ+A/boN9KInPeZZpAOLNLRDAsPZDgN4p0L/NQFOV/Ayn9x6EZXMFNKvQ4E5YwLBczW6/WlU3NIi6i/sYDn5Qu2qX1OF51MsvMPkrIEHg==)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp9UkFuwjAQ/MoqHLiUpFxQlaZI9NRDn5CLSTbEkmNb9oKgiL934wRwQK3ky87O7njGPicba9PDHpM8KXzlpKV1qWVnjSP4FB6/xcnsCRpnOpin2R3qh+alBig1HgO9xkbsFcG5RyvDOzRq8vkAQLSury+l5lNkN1EuCDurBCFXAMWdH2pGrn2YtShqdCPOnXa5/kKH0MldS7BFEGDFDoEkKSwybo8rskjjaevo4L7Wrje8x4mdE7aFxjiglkWE1GxQE9tLi8xO+LoGoQ3THLD/qP2/dGMMxYZs8DP34E2HQUxUBFI35o+NfTlJLOomL8n04frXns7W8gCVEt5/lElQkxpdmVyVHvP2yhBo0SHThx5z+TEZvl1uMlP0oU3nH/kRo3iMI9Ybes960UyRsZ9pBuGDeTqpwfBAvn7NrXF81QUZm8PSHjl0JWuYVVX1PhAqo4zLYbZarUak4ZAWXv5gDq/pG3YBHn50EEkuv5irGBk=)

</div>

Опять же, вам может помочь аналогия с функциями JavaScript для лучшего понимания именованных слотов:

```js
// передача нескольких фрагментов слотов с разными именами
BaseLayout({
  header: `...`,
  default: `...`,
  footer: `...`
})

// <BaseLayout> отображает их в разных местах
function BaseLayout(slots) {
  return `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`
}
```

## Условные слоты {#conditional-slots}

Иногда нужно отображать что-то в зависимости от того, было ли передано содержимое в слот.

В примере ниже мы определяем компонент Card с тремя условными слотами: `header`, `footer` и `default`. Когда содержимое для header / footer / default присутствует, мы хотим обернуть его для дополнительной стилизации:

```vue-html
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

[Попробовать в песочнице](https://play.vuejs.org/#eNqVVMtu2zAQ/BWCLZBLIjVoTq4aoA1yaA9t0eaoCy2tJcYUSZCUKyPwv2dJioplOw4C+EDuzM4+ONYT/aZ1tumBLmhhK8O1IxZcr29LyTutjCN3zNRkZVRHLrLcXzz9opRFHvnIxIuDTgvmAG+EFJ4WTnhOCPnQAqvBjHFE2uvbh5Zbgj/XAolwkWN4TM33VI/UalixXvjyo5yeqVVKOpCuyP0ob6utlHL7vUE3U4twkWP4hJq/jiPP4vSSOouNrHiTPVolcclPnl3SSnWaCzC/teNK2pIuSEA8xoRQ/3+GmDM9XKZ41UK1PhF/tIOPlfSPAQtmAyWdMMdMAy7C9/9+wYDnCexU3QtknwH/glWi9z1G2vde1tj2Hi90+yNYhcvmwd4PuHabhvKNeuYu8EuK1rk7M/pLu5+zm5BXyh1uMdnOu3S+95pvSCWYtV9xQcgqaXogj2yu+AqBj1YoZ7NosJLOEq5S9OXtPZtI1gFSppx8engUHs+vVhq9eVhq9ORRrXdpRyseSqfo6SmmnONK6XTw9yis24q448wXSG+0VAb3sSDXeiBoDV6TpWDV+ktENatrdMGCfAoBfL1JYNzzpINJjVFoJ9yKUKho19ul6OFQ6UYPx1rjIpPYeXIc/vXCgjetawzbni0dPnhhJ3T3DMVSruI=)

## Динамические имена слотов {#dynamic-slot-names}

```vue-html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- сокращённая запись -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

## Слоты с ограниченной областью видимости {#scoped-slots}

Как обсуждалось в [Область видимости рендеринга](#render-scope), содержимое слота не имеет доступа к состоянию в дочернем компоненте.

Однако в некоторых случаях может быть полезно, если содержимое слота может использовать данные как из области видимости родителя, так и из области видимости дочернего элемента. Для этого нам нужен способ, позволяющий дочернему элементу передавать данные в слот при его отображении.

Фактически, мы можем сделать именно это — мы можем передавать атрибуты в точку выхода слота, как передаём входные параметры в компонент:

```vue-html
<!-- <MyComponent> шаблон -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

Получение входных параметров слота немного отличается, когда используется один слот по умолчанию, а не именованный слот. Сначала мы покажем, как получать входные параметры, используя один слот по умолчанию, с помощью `v-slot` непосредственно на дочернем компоненте:

```vue-html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNp9kMEKgzAMhl8l9OJlU3aVOhg7C3uAXsRlTtC2tFE2pO++dA5xMnZqk+b/8/2dxMnadBxQ5EL62rWWwCMN9qh021vjCMrn2fBNoya4OdNDkmarXhQnSstsVrOOC8LedhVhrEiuHca97wwVSsTj4oz1SvAUgKJpgqWZEj4IQoCvZm0Gtgghzss1BDvIbFkqdmID+CNdbbQnaBwitbop0fuqQSgguWPXmX+JePe1HT/QMtJBHnE51MZOCcjfzPx04JxsydPzp2Szxxo7vABY1I/p)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNqFkNFqxCAQRX9l8CUttAl9DbZQ+rzQD/AlJLNpwKjoJGwJ/nvHpAnusrAg6FzHO567iE/nynlCUQsZWj84+lBmGJ31BKffL8sng4bg7O0IRVllWnpWKAOgDF7WBx2em0kTLElt975QbwLkhkmIyvCS1TGXC8LR6YYwVSTzH8yvQVt6VyJt3966oAR38XhaFjjEkvBCECNcia2d2CLyOACZQ7CDrI6h4kXcAF7lcg+za6h5et4JPdLkzV4B9B6RBtOfMISmxxqKH9TarrGtATxMgf/bDfM/qExEUCdEDuLGXAmoV06+euNs2JK7tyCrzSNHjX9aurQf)

</div>

Входные параметры, передаваемые в слот дочерним элементом, доступны как значение соответствующей директивы `v-slot`, к которой можно получить доступ с помощью выражений внутри слота.

Можно думать о слоте с ограниченной областью видимости как о функции, передаваемой в дочерний компонент. Затем дочерний компонент вызывает её, передавая входные параметры в качестве аргументов:

```js
MyComponent({
  // передаём слот по умолчанию, но как функцию
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'привет'
  return `<div>${
    // вызываем функцию слота с входными параметрами!
    slots.default({ text: greetingMessage, count: 1 })
  }</div>`
}
```

Обратите внимание, как `v-slot="slotProps"` соответствует сигнатуре функции слота. Точно так же, как и с аргументами функции, мы можем использовать деструктуризацию в `v-slot`:

```vue-html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### Именованные слоты с ограниченной областью видимости {#named-scoped-slots}

Именованные слоты с ограниченной областью видимости работают аналогично — входные параметры слота доступны как значение директивы `v-slot`: `v-slot:name="slotProps"`. При использовании сокращения это выглядит так:

```vue-html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

Передача входных параметров в именованный слот:

```vue-html
<slot name="header" message="привет"></slot>
```

Обратите внимание, что `name` слота не будет включён во входные параметры, потому что он зарезервирован — поэтому результирующий `headerProps` будет иметь вид `{ message: 'привет' }`.

Если вы смешиваете именованные слоты с обычными слотами с ограниченной областью видимости, вам нужно использовать явный тег `<template>` для слота по умолчанию. Попытка поместить директиву `v-slot` непосредственно на компонент приведёт к ошибке компиляции. Это делается для того, чтобы избежать любой двусмысленности в отношении области видимости входных параметров слота по умолчанию. Например:

```vue-html
<!-- Этот шаблон не скомпилируется -->
<MyComponent v-slot="{ message }">
  <p>{{ message }}</p>
  <template #footer>
    <!-- message принадлежит слою по умолчанию и здесь недоступен -->
    <p>{{ message }}</p>
  </template>
</MyComponent>
```

Использование явного тега `<template>` для слота по умолчанию помогает прояснить, что входной параметр `message` недоступен внутри других слотов:

```vue-html
<MyComponent>
  <!-- Используем явный слот по умолчанию -->
  <template #default="{ message }">
    <p>{{ message }}</p>
  </template>

  <template #footer>
    <p>Здесь контактная информация</p>
  </template>
</MyComponent>
```

### Пример красивого списка {#fancy-list-example}

Возможно, вам интересно, каким может быть хороший вариант использования для слотов с ограниченной областью видимости. Вот пример: представьте компонент `<FancyList>`, который отображает список элементов — он может инкапсулировать логику для загрузки удалённых данных, использования данных для отображения списка или даже расширенных функций, таких как разбиение на страницы или бесконечная прокрутка. Однако мы хотим, чтобы он был гибким в отношении внешнего вида каждого элемента и оставлял стилизацию каждого элемента на усмотрение родительского компонента, потребляющего его. Таким образом, желаемое использование может выглядеть следующим образом:

```vue-html
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>от {{ username }} | {{ likes }} лайков</p>
    </div>
  </template>
</FancyList>
```

Внутри `<FancyList>` мы можем многократно отображать один и тот же `<slot>` с разными данными элемента (обратите внимание, что мы используем `v-bind` для передачи объекта в качестве входных параметров слота):

```vue-html
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```