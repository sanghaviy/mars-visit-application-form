
interface AppFormData {
  // Stage 1
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  phone: string;
  // Stage 2
  departureDate: string;
  returnDate: string;
  accommodationPreference: string;
  specialRequests: string;
  // Stage 3
  healthDeclaration: boolean;
  emergencyContact: string;
  medicalConditions: string;
}

interface AppFormErrors {
  fullName?: string;
  dateOfBirth?: string;
  nationality?: string;
  email?: string;
  phone?: string;
  departureDate?: string;
  returnDate?: string;
  accommodationPreference?: string;
  healthDeclaration?: string;
  emergencyContact?: string;
}

const appRoot = document.getElementById('app');
if (!appRoot) {
  throw new Error('App root not found');
}

let currentStage = 0;
const totalStages = 3;

let formData: AppFormData = {
  fullName: '',
  dateOfBirth: '',
  nationality: '',
  email: '',
  phone: '',
  departureDate: '',
  returnDate: '',
  accommodationPreference: 'Space Hotel',
  specialRequests: '',
  healthDeclaration: false,
  emergencyContact: '',
  medicalConditions: '',
};

let formErrors: AppFormErrors = {};
let isSubmitted = false;

const STAGES_CONFIG = [
  {
    title: 'Stage 1: Personal Information',
    fields: ['fullName', 'dateOfBirth', 'nationality', 'email', 'phone'],
  },
  {
    title: 'Stage 2: Travel Preferences',
    fields: ['departureDate', 'returnDate', 'accommodationPreference', 'specialRequests'],
  },
  {
    title: 'Stage 3: Health and Safety',
    fields: ['healthDeclaration', 'emergencyContact', 'medicalConditions'],
  },
];

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone: string): boolean {
  // Allows digits, spaces, +, (), - and checks for a reasonable length (7-15 characters after stripping non-digits)
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 7 && cleaned.length <= 15 && /^\+?[\d\s()-]+$/.test(phone);
}

function validateStage(): boolean {
  formErrors = {};
  let isValid = true;
  const currentFields = STAGES_CONFIG[currentStage].fields;

  if (currentFields.includes('fullName') && !formData.fullName.trim()) {
    formErrors.fullName = 'Full Name is required.';
    isValid = false;
  }
  if (currentFields.includes('dateOfBirth') && !formData.dateOfBirth) {
    formErrors.dateOfBirth = 'Date of Birth is required.';
    isValid = false;
  }
  if (currentFields.includes('nationality') && !formData.nationality.trim()) {
    formErrors.nationality = 'Nationality is required.';
    isValid = false;
  }
  if (currentFields.includes('email')) {
    if (!formData.email.trim()) {
      formErrors.email = 'Email is required.';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      formErrors.email = 'Invalid email format.';
      isValid = false;
    }
  }
  if (currentFields.includes('phone')) {
    if (!formData.phone.trim()) {
      formErrors.phone = 'Phone number is required.';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      formErrors.phone = 'Invalid phone number format.';
      isValid = false;
    }
  }
  if (currentFields.includes('departureDate')) {
    if (!formData.departureDate) {
      formErrors.departureDate = 'Departure Date is required.';
      isValid = false;
    } else if (new Date(formData.departureDate) <= new Date()) {
      formErrors.departureDate = 'Departure Date must be in the future.';
      isValid = false;
    }
  }
  if (currentFields.includes('returnDate')) {
    if (!formData.returnDate) {
      formErrors.returnDate = 'Return Date is required.';
      isValid = false;
    } else if (formData.departureDate && new Date(formData.returnDate) <= new Date(formData.departureDate)) {
      formErrors.returnDate = 'Return Date must be after Departure Date.';
      isValid = false;
    }
  }
   if (currentFields.includes('accommodationPreference') && !formData.accommodationPreference) {
    formErrors.accommodationPreference = 'Accommodation Preference is required.';
    isValid = false;
  }
  if (currentFields.includes('healthDeclaration') && !formData.healthDeclaration) {
    formErrors.healthDeclaration = 'Health Declaration is required. You must confirm you are healthy.';
    isValid = false;
  }
  if (currentFields.includes('emergencyContact') && !formData.emergencyContact.trim()) {
    formErrors.emergencyContact = 'Emergency Contact Information is required.';
    isValid = false;
  }
  
  render();
  return isValid;
}


function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  const name = target.name as keyof AppFormData;
  const value = target.value;

  if (target.type === 'checkbox' && name === 'healthDeclaration') {
    formData.healthDeclaration = (target as HTMLInputElement).checked;
  } else if (typeof formData[name] === 'string') {
     // This assignment is safe if formData[name] is indeed a string.
     // For other types, specific handling would be needed.
     // Given the current AppFormData, all other fields are strings.
    (formData[name] as string) = value;
  }


  if (formErrors[name as keyof AppFormErrors]) {
    delete formErrors[name as keyof AppFormErrors];
    render(); 
  }
}

function createInputElement(
  name: keyof AppFormData,
  type: string,
  label: string,
  required: boolean,
  options?: { value: string; label: string }[]
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'form-group';

  const labelEl = document.createElement('label');
  labelEl.htmlFor = name;
  labelEl.textContent = label + (required ? ' *' : '');
  container.appendChild(labelEl);

  let inputEl: HTMLElement;
  if (type === 'textarea') {
    const textarea = document.createElement('textarea');
    textarea.name = name;
    textarea.id = name;
    if (typeof formData[name] === 'string') {
      textarea.value = formData[name] as string;
    }
    textarea.rows = 3;
    if (required) textarea.setAttribute('aria-required', 'true');
    inputEl = textarea;
  } else if (type === 'radio' && options) {
    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';
    radioGroup.setAttribute('role', 'radiogroup');
    radioGroup.setAttribute('aria-labelledby', `${name}-label`);
    labelEl.id = `${name}-label`; 

    options.forEach(opt => {
      const wrapper = document.createElement('div');
      wrapper.className = 'radio-option';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = name;
      radio.id = `${name}-${opt.value}`;
      radio.value = opt.value;
      if (typeof formData[name] === 'string') {
         radio.checked = formData[name] === opt.value;
      }
      if (required) radio.setAttribute('aria-required', 'true');
      
      const radioLabel = document.createElement('label');
      radioLabel.htmlFor = `${name}-${opt.value}`;
      radioLabel.textContent = opt.label;
      
      wrapper.appendChild(radio);
      wrapper.appendChild(radioLabel);
      radioGroup.appendChild(wrapper);
    });
    inputEl = radioGroup;
  } else if (type === 'checkbox') {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = name;
    checkbox.id = name;
    if (name === 'healthDeclaration') { // Explicitly handle boolean field
        checkbox.checked = formData.healthDeclaration;
    }
    if (required) checkbox.setAttribute('aria-required', 'true');
    
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'checkbox-wrapper';
    checkboxWrapper.appendChild(checkbox);
    labelEl.htmlFor = name; 
    checkboxWrapper.appendChild(labelEl); 
    container.innerHTML = ''; 
    container.appendChild(checkboxWrapper); 
    inputEl = checkbox; 
  }
  else {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.id = name;
    if (typeof formData[name] === 'string') {
      input.value = formData[name] as string;
    }
    if (required) input.setAttribute('aria-required', 'true');
    inputEl = input;
  }
  
  if (type !== 'checkbox' && type !== 'radio') { 
      container.appendChild(inputEl);
  } else if (type === 'radio') {
     container.appendChild(inputEl); 
  }


  if (formErrors[name as keyof AppFormErrors]) {
    inputEl.setAttribute('aria-invalid', 'true');
    inputEl.setAttribute('aria-describedby', `${name}-error`);
    const errorEl = document.createElement('p');
    errorEl.id = `${name}-error`;
    errorEl.className = 'error-message';
    errorEl.textContent = formErrors[name as keyof AppFormErrors]!;
    container.appendChild(errorEl);
  } else {
    inputEl.removeAttribute('aria-invalid');
    inputEl.removeAttribute('aria-describedby');
  }

  inputEl.addEventListener('input', handleInputChange);
  inputEl.addEventListener('change', handleInputChange); 

  return container;
}


function renderStage(stageIndex: number) {
  const stageConfig = STAGES_CONFIG[stageIndex];
  const formContent = document.createElement('div');
  formContent.className = 'stage-content';

  const titleEl = document.createElement('h2');
  titleEl.textContent = stageConfig.title;
  formContent.appendChild(titleEl);

  if (stageIndex === 0) { 
    formContent.appendChild(createInputElement('fullName', 'text', 'Full Name', true));
    formContent.appendChild(createInputElement('dateOfBirth', 'date', 'Date of Birth', true));
    formContent.appendChild(createInputElement('nationality', 'text', 'Nationality', true));
    const contactTitle = document.createElement('h3');
    contactTitle.textContent = 'Contact Information';
    contactTitle.className = 'form-subtitle';
    formContent.appendChild(contactTitle);
    formContent.appendChild(createInputElement('email', 'email', 'Email', true));
    formContent.appendChild(createInputElement('phone', 'tel', 'Phone', true));
  } else if (stageIndex === 1) { 
    formContent.appendChild(createInputElement('departureDate', 'date', 'Departure Date', true));
    formContent.appendChild(createInputElement('returnDate', 'date', 'Return Date', true));
    formContent.appendChild(createInputElement('accommodationPreference', 'radio', 'Accommodation Preference', true, [
      { value: 'Space Hotel', label: 'Space Hotel' },
      { value: 'Martian Base', label: 'Martian Base' },
    ]));
    formContent.appendChild(createInputElement('specialRequests', 'textarea', 'Special Requests or Preferences', false));
  } else if (stageIndex === 2) { 
    formContent.appendChild(createInputElement('healthDeclaration', 'checkbox', 'I declare I am healthy and fit for space travel.', true));
    formContent.appendChild(createInputElement('emergencyContact', 'text', 'Emergency Contact Information', true));
    formContent.appendChild(createInputElement('medicalConditions', 'textarea', 'Any Medical Conditions (Optional)', false));
  }
  return formContent;
}

function renderNavigation() {
  const navContainer = document.createElement('div');
  navContainer.className = 'navigation-buttons';

  if (currentStage > 0) {
    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.textContent = 'Previous';
    prevButton.className = 'button-secondary';
    prevButton.addEventListener('click', () => {
      currentStage--;
      render();
    });
    navContainer.appendChild(prevButton);
  }

  if (currentStage < totalStages - 1) {
    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = 'Next';
    nextButton.className = 'button-primary';
    nextButton.addEventListener('click', () => {
      if (validateStage()) {
        currentStage++;
        render();
      }
    });
    navContainer.appendChild(nextButton);
  } else {
    const submitButton = document.createElement('button');
    submitButton.type = 'button'; 
    submitButton.textContent = 'Submit';
    submitButton.className = 'button-primary';
    submitButton.addEventListener('click', () => {
      if (validateStage()) { 
        isSubmitted = true;
        render();
      }
    });
    navContainer.appendChild(submitButton);
  }
  return navContainer;
}

function renderSuccessMessage() {
  appRoot!.innerHTML = ''; 
  const successContainer = document.createElement('div');
  successContainer.className = 'success-message card';
  
  const title = document.createElement('h2');
  title.textContent = 'Application Submitted!';
  successContainer.appendChild(title);
  
  const message = document.createElement('p');
  message.textContent = 'Thank you for your application to visit Mars. We will review your information and be in touch soon.';
  successContainer.appendChild(message);

  const summaryTitle = document.createElement('h3');
  summaryTitle.textContent = 'Your Submitted Information:';
  summaryTitle.style.marginTop = '20px';
  successContainer.appendChild(summaryTitle);

  const summaryList = document.createElement('ul');
  summaryList.className = 'summary-list';
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      const fieldKey = key as keyof AppFormData;
      const li = document.createElement('li');
      const fieldName = fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      let value: string | boolean | undefined = formData[fieldKey];
      
      if (typeof value === 'boolean') {
          value = value ? 'Yes' : 'No';
      }
      if (fieldKey === 'healthDeclaration' && value === 'Yes') {
          value = 'Declared healthy and fit for space travel';
      }
      li.innerHTML = `<strong>${fieldName}:</strong> ${value || 'N/A'}`;
      summaryList.appendChild(li);
    }
  }
  successContainer.appendChild(summaryList);

  appRoot!.appendChild(successContainer);
}


function render() {
  if (!appRoot) return;
  appRoot.innerHTML = ''; 

  if (isSubmitted) {
    renderSuccessMessage();
    return;
  }

  const formContainer = document.createElement('div');
  formContainer.className = 'form-container card';
  
  const progressIndicator = document.createElement('div');
  progressIndicator.className = 'progress-indicator';
  progressIndicator.textContent = `Stage ${currentStage + 1} of ${totalStages}`;
  formContainer.appendChild(progressIndicator);

  const stageContent = renderStage(currentStage);
  formContainer.appendChild(stageContent);

  const navigation = renderNavigation();
  formContainer.appendChild(navigation);

  appRoot.appendChild(formContainer);
  
  const firstErrorField = Object.keys(formErrors)[0];
  let fieldToFocus: HTMLElement | null = null;
  if (firstErrorField) {
      fieldToFocus = formContainer.querySelector(`[name="${firstErrorField}"]`);
  } else {
      fieldToFocus = formContainer.querySelector('input:not([type="hidden"]), textarea, select');
  }
  if (fieldToFocus) {
    fieldToFocus.focus();
  }
}

// Initial render
render();
