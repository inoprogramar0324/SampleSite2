/* src/ts/contact-form.ts */

export function initContactForm() {
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const successContainer = document.getElementById('contact-success') as HTMLDivElement;
  
  if (!form || !successContainer) return;

  const inputs = form.querySelectorAll('input[required], textarea[required]') as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

  // Real-time validation visual state helpers
  inputs.forEach((input) => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('input-error')) {
        validateField(input);
      }
    });
  });

  function validateField(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    const errorSpan = document.getElementById(`${input.id}-error`);
    let isValid = true;
    let errorMessage = '';

    if (!input.value.trim()) {
      isValid = false;
      errorMessage = 'このフィールドは必須入力です。';
    } else if (input.type === 'email' && !validateEmail(input.value)) {
      isValid = false;
      errorMessage = '有効なメールアドレスを入力してください。';
    }

    if (!isValid) {
      input.classList.add('input-error');
      input.classList.remove('input-success');
      if (errorSpan) {
        errorSpan.textContent = errorMessage;
        errorSpan.classList.add('show');
      }
    } else {
      input.classList.remove('input-error');
      input.classList.add('input-success');
      if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.classList.remove('show');
      }
    }

    return isValid;
  }

  function validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    inputs.forEach((input) => {
      const fieldValid = validateField(input);
      if (!fieldValid) isFormValid = false;
    });

    // Check Agreement Checkbox
    const agreeCheckbox = form.querySelector('#agree') as HTMLInputElement;
    if (agreeCheckbox && !agreeCheckbox.checked) {
      alert('プライバシーポリシーに同意してください。');
      isFormValid = false;
    }

    if (!isFormValid) return;

    // Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" viewBox="0 0 50 50" style="width: 20px; height: 20px; animation: spin 1s linear infinite; margin-right: 8px;">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" style="stroke-dasharray: 1, 150; stroke-dashoffset: 0; animation: dash 1.5s ease-in-out infinite;"></circle>
      </svg>
      送信中...
    `;

    // Mock API Submit
    setTimeout(() => {
      // Hide Form with absolute class/animation
      form.style.opacity = '0';
      form.style.transform = 'translateY(20px)';
      form.style.transition = 'all 0.5s ease';

      setTimeout(() => {
        form.classList.add('hide');
        successContainer.classList.remove('hide');
        
        // Dynamic fade in
        setTimeout(() => {
          successContainer.style.opacity = '1';
          successContainer.style.transform = 'translateY(0)';
        }, 50);

        // Scroll back to visual container top
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);

      // Reset Form fields
      form.reset();
      inputs.forEach((input) => {
        input.classList.remove('input-success', 'input-error');
      });
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }, 2000);
  });
}
