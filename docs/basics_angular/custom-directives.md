---
title: Custom Directives в Angular
description: Создание пользовательских директив — атрибутные, структурные, директивы с хостом
---

# Custom Directives

Директивы — классы, которые добавляют поведение или изменяют внешний вид DOM-элементов.

## 1. Атрибутные директивы

### Простая директива

```typescript
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }
}
```

```html
<p appHighlight>Этот текст выделен</p>
```

### Директива с параметрами

```typescript
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input('appHighlight') color = 'yellow';
  @Input() defaultColor = 'transparent';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.color || this.defaultColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

```html
<!-- Цвет через основной Input -->
<p [appHighlight]="'lightblue'">Голубой при наведении</p>

<!-- Цвет по умолчанию -->
<p appHighlight defaultColor="lightgreen">Зелёный при наведении</p>
```

### Директива с Renderer2 (безопасный подход)

`Renderer2` безопаснее прямого доступа к DOM через `ElementRef`, особенно при серверном рендеринге (SSR):

```typescript
import { Directive, Renderer2, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input('appTooltip') text = '';
  private tooltipEl: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter') show() {
    this.tooltipEl = this.renderer.createElement('span');
    const text = this.renderer.createText(this.text);
    this.renderer.appendChild(this.tooltipEl, text);
    this.renderer.appendChild(this.el.nativeElement, this.tooltipEl);
    this.renderer.addClass(this.tooltipEl, 'tooltip');
    this.renderer.setStyle(this.tooltipEl, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipEl, 'background', '#333');
    this.renderer.setStyle(this.tooltipEl, 'color', '#fff');
    this.renderer.setStyle(this.tooltipEl, 'padding', '4px 8px');
    this.renderer.setStyle(this.tooltipEl, 'borderRadius', '4px');
    this.renderer.setStyle(this.tooltipEl, 'fontSize', '12px');
  }

  @HostListener('mouseleave') hide() {
    if (this.tooltipEl) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipEl);
      this.tooltipEl = null;
    }
  }
}
```

```html
<button [appTooltip]="'Нажмите для сохранения'">Сохранить</button>
```

## 2. @HostListener и @HostBinding

### @HostListener — слушает события на хост-элементе

```typescript
@Directive({
  selector: '[appClickTracker]'
})
export class ClickTrackerDirective {
  clickCount = 0;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.clickCount++;
    console.log(`Клик #${this.clickCount} по координатам (${event.clientX}, ${event.clientY})`);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    console.log('Нажат Escape');
  }
}
```

### @HostBinding — привязывает свойство хост-элемента

```typescript
@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;
  @HostBinding('style.border') border = '';

  @HostListener('click') toggle() {
    this.isOpen = !this.isOpen;
    this.border = this.isOpen ? '2px solid blue' : '';
  }
}
```

```html
<div appDropdown>
  <button>Меню</button>
  <ul *ngIf="...">
    <li>Пункт 1</li>
    <li>Пункт 2</li>
  </ul>
</div>
<!-- При клике добавляется/убирается класс 'open' -->
```

## 3. Структурные директивы

Структурные директивы изменяют структуру DOM (добавляют/удаляют элементы).

### Простая структурная директива

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      // Условие false — показываем элемент
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      // Условие true — убираем элемент
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

```html
<!-- Показывается когда isLoggedIn === false -->
<p *appUnless="isLoggedIn">Пожалуйста, войдите в систему</p>
```

### Директива повторения (аналог ngFor)

```typescript
@Directive({
  selector: '[appRepeat]'
})
export class RepeatDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appRepeat(times: number) {
    this.viewContainer.clear();
    for (let i = 0; i < times; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef, {
        $implicit: i,
        index: i,
        total: times
      });
    }
  }
}
```

```html
<p *appRepeat="5; let i; let total = total">
  Элемент {{ i + 1 }} из {{ total }}
</p>
```

### Директива с ролевым доступом

```typescript
@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') requiredRole = '';
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userRole = this.authService.getUserRole();
    if (userRole === this.requiredRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (userRole !== this.requiredRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

```html
<button *appHasRole="'admin'">Удалить пользователя</button>
<div *appHasRole="'editor'">Редактирование контента</div>
```

## 4. Директива с экспортом

Директиву можно экспортировать для использования через template variable:

```typescript
@Directive({
  selector: '[appToggle]',
  exportAs: 'appToggle'
})
export class ToggleDirective {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
```

```html
<div appToggle #menu="appToggle">
  <button (click)="menu.toggle()">
    {{ menu.isOpen ? 'Закрыть' : 'Открыть' }}
  </button>
  <ul *ngIf="menu.isOpen">
    <li>Пункт 1</li>
    <li>Пункт 2</li>
  </ul>
</div>
```

## 5. Standalone Directive

```typescript
@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}
```

```typescript
@Component({
  standalone: true,
  imports: [AutoFocusDirective],
  template: `<input appAutoFocus placeholder="Автофокус">`
})
export class SearchComponent {}
```

## 6. Composition API для директив (Angular 15+)

Директивы можно компоновать через `hostDirectives`:

```typescript
@Directive({ standalone: true, selector: '[appDraggable]' })
export class DraggableDirective { /* ... */ }

@Directive({ standalone: true, selector: '[appResizable]' })
export class ResizableDirective { /* ... */ }

@Component({
  selector: 'app-widget',
  hostDirectives: [DraggableDirective, ResizableDirective],
  template: `<div>Виджет с drag & resize</div>`
})
export class WidgetComponent {}
```

## Сводная таблица

| Тип директивы | Назначение | Пример |
|---------------|-----------|--------|
| Атрибутная | Изменяет вид/поведение | `[appHighlight]`, `[appTooltip]` |
| Структурная | Добавляет/удаляет DOM | `*appUnless`, `*appHasRole` |
| С экспортом | Доступ через #ref | `#menu="appToggle"` |
| Standalone | Без NgModule | `standalone: true` |
| Host Directive | Композиция | `hostDirectives: [...]` |
