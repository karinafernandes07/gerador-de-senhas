
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const passwordDisplay = document.getElementById('password');
  const lengthSlider = document.getElementById('length-slider');
  const lengthValue = document.getElementById('length-value');
  const decreaseLength = document.getElementById('decrease-length');
  const increaseLength = document.getElementById('increase-length');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const lowercaseCheckbox = document.getElementById('lowercase');
  const numbersCheckbox = document.getElementById('numbers');
  const symbolsCheckbox = document.getElementById('symbols');
  const generateBtn = document.getElementById('generate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.getElementById('strength-text');
  
  // Character sets
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  // Initial generation
  generatePassword();
  
  // Event listeners
  lengthSlider.addEventListener('input', updatePasswordLength);
  decreaseLength.addEventListener('click', decreasePasswordLength);
  increaseLength.addEventListener('click', increasePasswordLength);
  generateBtn.addEventListener('click', generatePassword);
  copyBtn.addEventListener('click', copyPassword);
  
  // Update checkboxes
  uppercaseCheckbox.addEventListener('change', validateCheckboxes);
  lowercaseCheckbox.addEventListener('change', validateCheckboxes);
  numbersCheckbox.addEventListener('change', validateCheckboxes);
  symbolsCheckbox.addEventListener('change', validateCheckboxes);
  
  // Functions
  function generatePassword() {
    let charset = '';
    let password = '';
    const length = parseInt(lengthSlider.value);
    
    // Build character set based on checked options
    if (uppercaseCheckbox.checked) charset += uppercaseChars;
    if (lowercaseCheckbox.checked) charset += lowercaseChars;
    if (numbersCheckbox.checked) charset += numberChars;
    if (symbolsCheckbox.checked) charset += symbolChars;
    
    // If no checkbox is selected, default to lowercase
    if (charset === '') {
      charset = lowercaseChars;
      lowercaseCheckbox.checked = true;
    }
    
    // Generate password
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    // Display password
    passwordDisplay.innerText = password;
    
    // Update password strength indicator
    updatePasswordStrength(password);
  }
  
  function updatePasswordLength() {
    lengthValue.innerText = lengthSlider.value;
    generatePassword();
    
    // Update slider fill
    const percentage = ((lengthSlider.value - lengthSlider.min) / (lengthSlider.max - lengthSlider.min)) * 100;
    lengthSlider.style.background = `linear-gradient(to right, var(--primary-color) ${percentage}%, var(--border-color) ${percentage}%)`;
  }
  
  function decreasePasswordLength() {
    if (parseInt(lengthSlider.value) > parseInt(lengthSlider.min)) {
      lengthSlider.value = parseInt(lengthSlider.value) - 1;
      updatePasswordLength();
    }
  }
  
  function increasePasswordLength() {
    if (parseInt(lengthSlider.value) < parseInt(lengthSlider.max)) {
      lengthSlider.value = parseInt(lengthSlider.value) + 1;
      updatePasswordLength();
    }
  }
  
  function validateCheckboxes(e) {
    // Ensure at least one checkbox is checked
    const anyChecked = 
      uppercaseCheckbox.checked || 
      lowercaseCheckbox.checked || 
      numbersCheckbox.checked || 
      symbolsCheckbox.checked;
    
    if (!anyChecked) {
      e.target.checked = true;
    }
    
    generatePassword();
  }
  
  function updatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety check
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    const varietyScore = [hasUppercase, hasLowercase, hasNumbers, hasSymbols]
      .filter(Boolean).length;
      
    strength += Math.min(2, varietyScore - 1);
    
    // Update UI
    strengthBar.className = 'strength-bar';
    
    if (strength <= 1) {
      strengthBar.classList.add('strength-weak');
      strengthText.innerText = 'Fraca';
    } else if (strength === 2) {
      strengthBar.classList.add('strength-medium');
      strengthText.innerText = 'Média';
    } else {
      strengthBar.classList.add('strength-strong');
      strengthText.innerText = 'Forte';
    }
  }
  
  function copyPassword() {
    if (!passwordDisplay.innerText) return;
    
    // Create a temporary textarea to copy the password
    const textarea = document.createElement('textarea');
    textarea.value = passwordDisplay.innerText;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      
      // Visual feedback
      copyBtn.innerHTML = '<span class="material-symbols-rounded">check</span>';
      setTimeout(() => {
        copyBtn.innerHTML = '<span class="material-symbols-rounded">content_copy</span>';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy password: ', err);
    } finally {
      document.body.removeChild(textarea);
    }
  }
  
  // Initialize slider background
  updatePasswordLength();
});
