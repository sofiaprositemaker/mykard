/**
 * script.js — Интерактивная логика сайта-портфолио Софьи Бычковой
 * Разработано на чистом (нативном) JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация всех интерактивных компонентов
    initThemeSwitcher();
    initMobileMenu();
    initRiskCalculator();
    initContactForm();
    initScrollspyAndBackToTop();
});

/* ==========================================================================
   1. Переключатель Тем (Light / Dark Theme)
   ========================================================================== */
function initThemeSwitcher() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    // Проверяем сохраненную тему в localStorage или системные предпочтения
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
        updateThemeIcon(true);
    } else {
        document.body.classList.remove('dark-theme');
        updateThemeIcon(false);
    }

    // Слушатель клика
    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
        
        // Создаем легкий визуальный эффект (Toast) о смене режима
        showToast(
            isDark ? 'Активирован темный кибер-режим' : 'Активирован классический светлый режим',
            'info'
        );
    });

    function updateThemeIcon(isDark) {
        // Меняем иконку внутри кнопки (Солнце / Луна)
        themeBtn.innerHTML = isDark 
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        themeBtn.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить темную тему');
    }
}

/* ==========================================================================
   2. Адаптивное Мобильное Меню (Hamburger Menu)
   ========================================================================== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = nav.classList.toggle('nav-active');
        hamburger.classList.toggle('hamburger-open');
        
        // Предотвращаем скролл основного контента при открытом меню
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Закрываем меню при клике на любую ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                hamburger.classList.remove('hamburger-open');
                document.body.style.overflow = '';
            }
        });
    });

    // Закрываем меню при клике вне его области
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('nav-active') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
            nav.classList.remove('nav-active');
            hamburger.classList.remove('hamburger-open');
            document.body.style.overflow = '';
        }
    });
}

/* ==========================================================================
   3. Интерактивный калькулятор кибер-рисков (Risk Assessment Tool)
   ========================================================================== */
function initRiskCalculator() {
    const form = document.getElementById('risk-form');
    const calculateBtn = document.getElementById('calculate-risk-btn');
    const resultsContainer = document.getElementById('risk-results');
    
    if (!form || !calculateBtn || !resultsContainer) return;

    // Рекомендации в зависимости от неотмеченных (или отмеченных) чекбоксов
    const recommendationsData = {
        https: {
            title: "Поддержка HTTPS шифрования",
            text: "Критически важно! Без SSL-сертификата (HTTPS) данные пользователей передаются в открытом виде. Браузеры помечают сайт как небезопасный, что снижает доверие и повышает риск перехвата трафика (MITM-атаки).",
            severity: "high"
        },
        personalData: {
            title: "Защита персональных данных (ФЗ-152)",
            text: "Сбор имен, телефонов или email обязывает вас зарегистрироваться в Роскомнадзоре, разместить политику конфиденциальности и хранить данные граждан РФ строго на территории РФ. Штрафы достигают сотен тысяч рублей.",
            severity: "high"
        },
        agreement: {
            title: "Пользовательское соглашение и оферта",
            text: "Отсутствие оферты или правил использования сервиса лишает вас юридической защиты в случае споров с пользователями или необоснованного требования возврата средств.",
            severity: "medium"
        },
        passwords: {
            title: "Безопасное хранение учетных данных",
            text: "Пароли пользователей должны шифроваться с использованием современных алгоритмов хеширования (bcrypt/argon2) с солью. Хранение в открытом виде — грубейшее нарушение стандартов кибербезопасности.",
            severity: "high"
        },
        cookies: {
            title: "Уведомление о файлах Cookie (GDPR / ФЗ-152)",
            text: "Для соблюдения законодательства необходимо информировать пользователей об использовании cookie-файлов и аналитических скриптов через специальный баннер-дисклеймер.",
            severity: "low"
        },
        inputs: {
            title: "Защита от инъекций (SQLi / XSS)",
            text: "Все формы ввода на сайте должны проходить жесткую валидацию и санитарию на бэкенде. Отсутствие проверок открывает хакерам доступ к базе данных и позволяет внедрять вредоносный JS-код.",
            severity: "high"
        }
    };

    calculateBtn.addEventListener('click', () => {
        // Анимация кнопки
        calculateBtn.classList.add('btn-loading');
        calculateBtn.disabled = true;
        calculateBtn.textContent = 'Анализируем системы...';

        // Имитируем быстрый процесс сканирования систем за 1.2 секунды
        setTimeout(() => {
            calculateBtn.classList.remove('btn-loading');
            calculateBtn.disabled = false;
            calculateBtn.textContent = 'Запустить экспресс-аудит';

            // Собираем результаты
            const checkedStates = {
                https: document.getElementById('check-https').checked,
                personalData: document.getElementById('check-pdata').checked,
                agreement: document.getElementById('check-agreement').checked,
                passwords: document.getElementById('check-passwords').checked,
                cookies: document.getElementById('check-cookies').checked,
                inputs: document.getElementById('check-inputs').checked
            };

            // Рассчитываем количество УЯЗВИМОСТЕЙ (где галочка НЕ стоит)
            let totalChecks = 6;
            let vulnerabilitiesCount = 0;
            const failedItems = [];

            for (const key in checkedStates) {
                if (!checkedStates[key]) {
                    vulnerabilitiesCount++;
                    failedItems.push(key);
                }
            }

            // Процент риска: 0 уязвимостей = 5% риска (всегда есть базовый риск), 6 = 98%
            const riskPercent = Math.round((vulnerabilitiesCount / totalChecks) * 93 + 5);

            // Определяем вердикт и цвет
            let riskLevel = '';
            let riskClass = '';
            let verdictText = '';

            if (riskPercent <= 25) {
                riskLevel = 'Низкий риск';
                riskClass = 'risk-low';
                verdictText = 'Ваш проект демонстрирует отличную подготовку! Основные юридические и технические требования безопасности соблюдены. Поддерживайте стандарты на том же высоком уровне.';
            } else if (riskPercent <= 60) {
                riskLevel = 'Средний уровень риска';
                riskClass = 'risk-medium';
                verdictText = 'Обнаружены критические уязвимости или правовые пробелы. Ваш проект частично защищен, но уязвим перед проверками регулирующих органов (Роскомнадзор) и базовыми кибератаками.';
            } else {
                riskLevel = 'Критический уровень риска!';
                riskClass = 'risk-high';
                verdictText = 'Критическое состояние правовой и информационной безопасности! Отсутствие базовой защиты данных и обязательных юридических документов делает ваш проект легкой мишенью для хакеров и крупных штрафов.';
            }

            // Выводим результат в HTML с плавной анимацией появления
            resultsContainer.innerHTML = `
                <div class="risk-summary animate-fade-in">
                    <div class="risk-gauge-container">
                        <div class="risk-circle-progress ${riskClass}">
                            <span class="risk-value">${riskPercent}%</span>
                        </div>
                        <div class="risk-verdict-title ${riskClass}">${riskLevel}</div>
                    </div>
                    <p class="risk-verdict-desc">${verdictText}</p>
                </div>
                
                <div class="risk-details animate-fade-in">
                    <h4>Персональные рекомендации по устранению рисков:</h4>
                    <div class="rec-list">
                        ${failedItems.length === 0 
                            ? `<div class="rec-success-card">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="rec-success-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                <div>
                                    <h5>Идеальный аудит!</h5>
                                    <p>Все протестированные параметры соответствуют базовым стандартам Legal & Cyber Security. Вы отлично защитили свой цифровой продукт!</p>
                                </div>
                               </div>`
                            : failedItems.map(itemKey => {
                                const rec = recommendationsData[itemKey];
                                return `
                                    <div class="rec-card severity-${rec.severity}">
                                        <span class="rec-badge">${rec.severity === 'high' ? 'Критично' : rec.severity === 'medium' ? 'Важно' : 'Рекомендуется'}</span>
                                        <h5>${rec.title}</h5>
                                        <p>${rec.text}</p>
                                    </div>
                                `;
                            }).join('')
                        }
                    </div>
                    <div class="calculator-footer">
                        <p>Нужен профессиональный правовой аудит и разработка документов? Напишите Софье в Telegram для консультации!</p>
                        <a href="https://t.me/sova_172" target="_blank" class="btn btn-primary btn-sm">Обсудить проект</a>
                    </div>
                </div>
            `;

            // Прокручиваем плавно к результатам
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            showToast('Аудит успешно завершен!', 'success');
        }, 1200);
    });
}

/* ==========================================================================
   4. Валидация Формы Контактов & Всплывающие уведомления (Toasts)
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('form-name');
        const contactInput = document.getElementById('form-contact');
        const messageInput = document.getElementById('form-message');
        const submitBtn = form.querySelector('.btn-submit');

        if (!nameInput || !contactInput || !messageInput || !submitBtn) return;

        // Простая нативная валидация
        let isValid = true;
        
        if (nameInput.value.trim().length < 2) {
            showInputError(nameInput, 'Пожалуйста, введите ваше имя (минимум 2 символа)');
            isValid = false;
        } else {
            clearInputError(nameInput);
        }

        if (contactInput.value.trim().length < 4) {
            showInputError(contactInput, 'Введите Telegram, VK или Email для связи');
            isValid = false;
        } else {
            clearInputError(contactInput);
        }

        if (messageInput.value.trim().length < 10) {
            showInputError(messageInput, 'Пожалуйста, опишите ваш вопрос более подробно (от 10 символов)');
            isValid = false;
        } else {
            clearInputError(messageInput);
        }

        if (!isValid) {
            showToast('Пожалуйста, заполните все обязательные поля корректно', 'error');
            return;
        }

        // Эффект отправки сообщения
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="spinner"></span> Отправка...`;

        // Имитируем отправку на сервер
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalText;

            // Очищаем поля формы
            form.reset();

            // Показываем красивое уведомление
            showToast('Сообщение успешно отправлено! Софья ответит вам в ближайшее время.', 'success');
        }, 1800);
    });

    function showInputError(inputEl, message) {
        const formGroup = inputEl.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.add('has-error');
        let errorEl = formGroup.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            formGroup.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    function clearInputError(inputEl) {
        const formGroup = inputEl.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('has-error');
        const errorEl = formGroup.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }
}

/* ==========================================================================
   Всплывающие уведомления (Toast Notifications System)
   ========================================================================== */
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    
    // Если контейнера для тостов еще нет — создаем его
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-in`;
    
    // Выбор иконки по типу уведомления
    let icon = '';
    if (type === 'success') {
        icon = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
        icon = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else { // info
        icon = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
        ${icon}
        <span class="toast-text">${message}</span>
        <button class="toast-close-btn">&times;</button>
    `;

    container.appendChild(toast);

    // Слушатель закрытия по крестику
    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });

    // Автоматическое удаление через 4 секунды
    const autoTimeout = setTimeout(() => {
        removeToast(toast);
    }, 4000);

    function removeToast(el) {
        clearTimeout(autoTimeout);
        el.classList.replace('animate-slide-in', 'animate-slide-out');
        // Ждем окончания анимации скрытия, затем удаляем элемент из DOM
        el.addEventListener('animationend', () => {
            el.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        });
    }
}

/* ==========================================================================
   5. Scrollspy (Подсветка активных пунктов меню) & Кнопка «Наверх»
   ========================================================================== */
function initScrollspyAndBackToTop() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.btn-nav)');
    
    // Создаем кнопку «Наверх» в DOM
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    backToTopBtn.setAttribute('aria-label', 'Вернуться к началу страницы');
    document.body.appendChild(backToTopBtn);

    // Слушатель скролла
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        // 1. Показ/скрытие кнопки «Наверх»
        if (scrollY > 500) {
            backToTopBtn.classList.add('back-to-top-visible');
        } else {
            backToTopBtn.classList.remove('back-to-top-visible');
        }

        // 2. Логика подсветки пунктов меню (Scrollspy)
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Учитываем высоту фиксированной шапки
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('nav-link-active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('nav-link-active');
                }
            });
        } else {
            // Если мы в самом верху страницы
            navLinks.forEach(link => link.classList.remove('nav-link-active'));
        }

        // 3. Динамический класс для шапки при скролле (увеличиваем тень/меняем прозрачность)
        const header = document.querySelector('.header');
        if (header) {
            if (scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
    });

    // Плавный скролл наверх при клике на кнопку
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
