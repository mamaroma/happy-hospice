/* ============================================
   Пансионат «Забота и Уют» — скрипты
   ============================================ */

(function () {
    'use strict';

    // ---------- Мобильное меню ----------
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('open'));
        });
    }

    // ---------- Reveal on scroll ----------
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    // ---------- Lightbox для галереи ----------
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (gallery && lightbox && lightboxImage) {
        const items = Array.from(gallery.querySelectorAll('.gallery-item img'));
        let currentIndex = 0;

        function openLightbox(index) {
            currentIndex = index;
            lightboxImage.src = items[currentIndex].src;
            lightboxImage.alt = items[currentIndex].alt || '';
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }

        function show(delta) {
            currentIndex = (currentIndex + delta + items.length) % items.length;
            lightboxImage.src = items[currentIndex].src;
            lightboxImage.alt = items[currentIndex].alt || '';
        }

        gallery.querySelectorAll('.gallery-item').forEach((item, idx) => {
            item.addEventListener('click', () => openLightbox(idx));
        });

        lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev && lightboxPrev.addEventListener('click', () => show(-1));
        lightboxNext && lightboxNext.addEventListener('click', () => show(1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') show(-1);
            if (e.key === 'ArrowRight') show(1);
        });
    }

    // ---------- Lightbox для дипломов ----------
    const qualGrid = document.querySelector('.qual-grid');
    const qualLightbox = document.getElementById('qualLightbox');
    const qualLightboxImage = document.getElementById('qualLightboxImage');
    const qualLightboxClose = document.getElementById('qualLightboxClose');
    const qualLightboxPrev = document.getElementById('qualLightboxPrev');
    const qualLightboxNext = document.getElementById('qualLightboxNext');

    if (qualGrid && qualLightbox && qualLightboxImage) {
        const qualItems = Array.from(qualGrid.querySelectorAll('.qual-item img'));
        let qualIndex = 0;

        function openQualLightbox(index) {
            qualIndex = index;
            qualLightboxImage.src = qualItems[qualIndex].src;
            qualLightboxImage.alt = qualItems[qualIndex].alt || '';
            qualLightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeQualLightbox() {
            qualLightbox.classList.remove('open');
            document.body.style.overflow = '';
        }

        function showQual(delta) {
            qualIndex = (qualIndex + delta + qualItems.length) % qualItems.length;
            qualLightboxImage.src = qualItems[qualIndex].src;
            qualLightboxImage.alt = qualItems[qualIndex].alt || '';
        }

        qualGrid.querySelectorAll('.qual-item').forEach((item, idx) => {
            item.addEventListener('click', () => openQualLightbox(idx));
        });

        qualLightboxClose && qualLightboxClose.addEventListener('click', closeQualLightbox);
        qualLightboxPrev && qualLightboxPrev.addEventListener('click', () => showQual(-1));
        qualLightboxNext && qualLightboxNext.addEventListener('click', () => showQual(1));

        qualLightbox.addEventListener('click', (e) => {
            if (e.target === qualLightbox) closeQualLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!qualLightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeQualLightbox();
            if (e.key === 'ArrowLeft') showQual(-1);
            if (e.key === 'ArrowRight') showQual(1);
        });
    }

    // ---------- Заявки → Google Sheets ----------
    const APPLICATION_FORM_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyui4xBeN8mQX54wxrRAfplvYpN6cXlyc_kypFdd9vq3aTi2hSMxIfi8VoNXShL1C5n/exec';

    function markValidity(el, ok) {
        if (!el) return;
        el.classList.toggle('invalid', !ok);
    }

    function isValidPhone(value) {
        const digits = String(value || '').replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 11;
    }

    function setFormStatus(statusEl, message, type) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.classList.remove('is-success', 'is-error');
        if (type) statusEl.classList.add(type);
    }

    async function submitLead({ fio, phone, consent, source }, { statusEl, submitBtn, form, fieldNames }) {
        let valid = true;

        const nameOk = Boolean(fio);
        markValidity(form.elements.fio, nameOk);
        if (!nameOk) valid = false;

        const phoneOk = isValidPhone(phone);
        markValidity(form.elements.phone, phoneOk);
        if (!phoneOk) valid = false;

        markValidity(form.elements.consent, consent);
        if (!consent) valid = false;

        if (!valid) {
            setFormStatus(statusEl, 'Укажите имя, телефон и согласие на обработку данных.', 'is-error');
            return false;
        }

        if (!APPLICATION_FORM_SCRIPT_URL) {
            setFormStatus(statusEl, 'Форма пока не подключена к таблице. Сообщите администратору сайта.', 'is-error');
            return false;
        }

        submitBtn.disabled = true;
        setFormStatus(statusEl, 'Отправляем заявку…', null);

        try {
            const data = {
                fio,
                phone,
                consent: 'Да',
                source: source || 'form',
                birthDate: '',
                gender: '',
                email: '',
                diagnosis: ''
            };

            await fetch(APPLICATION_FORM_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(data).toString()
            });

            form.reset();
            (fieldNames || ['fio', 'phone']).forEach((name) => markValidity(form.elements[name], true));
            markValidity(form.elements.consent, true);
            setFormStatus(statusEl, 'Спасибо! Мы перезвоним Вам в ближайшее время.', 'is-success');
            return true;
        } catch (err) {
            setFormStatus(statusEl, 'Не удалось отправить. Попробуйте ещё раз или позвоните нам.', 'is-error');
            return false;
        } finally {
            submitBtn.disabled = false;
        }
    }

    const applicationForm = document.getElementById('applicationForm');
    const applicationStatus = document.getElementById('applicationStatus');
    const applicationSubmit = document.getElementById('applicationSubmit');

    if (applicationForm && applicationStatus && applicationSubmit) {
        applicationForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await submitLead({
                fio: applicationForm.fio.value.trim(),
                phone: applicationForm.phone.value.trim(),
                consent: applicationForm.consent.checked,
                source: 'application'
            }, {
                statusEl: applicationStatus,
                submitBtn: applicationSubmit,
                form: applicationForm,
                fieldNames: ['fio', 'phone']
            });
        });
    }

    // ---------- Виджет «Перезвоните мне» ----------
    const callbackWidget = document.getElementById('callbackWidget');
    const callbackFab = document.getElementById('callbackFab');
    const callbackPanel = document.getElementById('callbackPanel');
    const callbackClose = document.getElementById('callbackClose');
    const callbackForm = document.getElementById('callbackForm');
    const callbackStatus = document.getElementById('callbackStatus');
    const callbackSubmit = document.getElementById('callbackSubmit');

    if (callbackWidget && callbackFab && callbackPanel) {
        function openCallback() {
            callbackPanel.hidden = false;
            callbackWidget.classList.add('is-open');
            callbackFab.setAttribute('aria-expanded', 'true');
            const nameInput = document.getElementById('cbName');
            if (nameInput) nameInput.focus();
        }

        function closeCallback() {
            callbackPanel.hidden = true;
            callbackWidget.classList.remove('is-open');
            callbackFab.setAttribute('aria-expanded', 'false');
        }

        callbackFab.addEventListener('click', () => {
            if (callbackWidget.classList.contains('is-open')) closeCallback();
            else openCallback();
        });

        if (callbackClose) callbackClose.addEventListener('click', closeCallback);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && callbackWidget.classList.contains('is-open')) {
                closeCallback();
            }
        });

        // Лёгкое напоминание через 25 сек, если ещё не открывали
        window.setTimeout(() => {
            if (!callbackWidget.classList.contains('is-open')) {
                callbackFab.classList.add('is-pulse');
            }
        }, 25000);

        if (callbackForm && callbackStatus && callbackSubmit) {
            callbackForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const ok = await submitLead({
                    fio: callbackForm.fio.value.trim(),
                    phone: callbackForm.phone.value.trim(),
                    consent: callbackForm.consent.checked,
                    source: 'callback'
                }, {
                    statusEl: callbackStatus,
                    submitBtn: callbackSubmit,
                    form: callbackForm,
                    fieldNames: ['fio', 'phone']
                });
                if (ok) {
                    window.setTimeout(closeCallback, 2200);
                }
            });
        }
    }
})();
