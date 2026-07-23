/* ============================================
   Пансионат «Счастье» — скрипты
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

    // ---------- Форма заявки → Google Sheets ----------
    // После публикации Apps Script вставьте сюда URL веб-приложения:
    const APPLICATION_FORM_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyui4xBeN8mQX54wxrRAfplvYpN6cXlyc_kypFdd9vq3aTi2hSMxIfi8VoNXShL1C5n/exec';

    const applicationForm = document.getElementById('applicationForm');
    const applicationStatus = document.getElementById('applicationStatus');
    const applicationSubmit = document.getElementById('applicationSubmit');

    if (applicationForm && applicationStatus && applicationSubmit) {
        const fields = ['fio', 'birthDate', 'gender', 'phone', 'email', 'diagnosis'];

        function setStatus(message, type) {
            applicationStatus.textContent = message;
            applicationStatus.classList.remove('is-success', 'is-error');
            if (type) applicationStatus.classList.add(type);
        }

        function markValidity(el, ok) {
            el.classList.toggle('invalid', !ok);
        }

        applicationForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const data = {
                fio: applicationForm.fio.value.trim(),
                birthDate: applicationForm.birthDate.value,
                gender: applicationForm.gender.value,
                phone: applicationForm.phone.value.trim(),
                email: applicationForm.email.value.trim(),
                diagnosis: applicationForm.diagnosis.value.trim(),
                consent: applicationForm.consent.checked ? 'Да' : ''
            };

            let valid = true;
            fields.forEach((name) => {
                const el = applicationForm.elements[name];
                const ok = Boolean(data[name]);
                markValidity(el, ok);
                if (!ok) valid = false;
            });

            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
            markValidity(applicationForm.email, emailOk);
            if (!emailOk) valid = false;

            markValidity(applicationForm.consent, applicationForm.consent.checked);
            if (!applicationForm.consent.checked) valid = false;

            if (!valid) {
                setStatus('Проверьте, пожалуйста, заполнение всех обязательных полей.', 'is-error');
                return;
            }

            if (!APPLICATION_FORM_SCRIPT_URL) {
                setStatus('Форма пока не подключена к таблице. Сообщите администратору сайта.', 'is-error');
                return;
            }

            applicationSubmit.disabled = true;
            setStatus('Отправляем заявку…', null);

            try {
                const body = new URLSearchParams(data);

                await fetch(APPLICATION_FORM_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: body.toString()
                });

                applicationForm.reset();
                fields.forEach((name) => markValidity(applicationForm.elements[name], true));
                markValidity(applicationForm.consent, true);
                setStatus('Заявка отправлена. Мы свяжемся с Вами в ближайшее время.', 'is-success');
            } catch (err) {
                setStatus('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.', 'is-error');
            } finally {
                applicationSubmit.disabled = false;
            }
        });
    }
})();
