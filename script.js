  document.addEventListener('DOMContentLoaded', function() {
            // Éléments DOM
            const passwordOutput = document.getElementById('password-output');
            const copyBtn = document.getElementById('copy-btn');
            const lengthSlider = document.getElementById('length-slider');
            const lengthValue = document.getElementById('length-value');
            const uppercaseCheckbox = document.getElementById('uppercase');
            const lowercaseCheckbox = document.getElementById('lowercase');
            const numbersCheckbox = document.getElementById('numbers');
            const symbolsCheckbox = document.getElementById('symbols');
            const generateBtn = document.getElementById('generate-btn');
            const meterFill = document.getElementById('meter-fill');
            const strengthText = document.getElementById('strength-text');
            const notification = document.getElementById('notification');
            
            // Caractères disponibles
            const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
            const numberChars = '0123456789';
            const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            
            // Mettre à jour la valeur de la longueur
            lengthSlider.addEventListener('input', function() {
                lengthValue.textContent = this.value;
                generatePassword();
            });
            
            // Générer un mot de passe lorsque les options changent
            [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(checkbox => {
                checkbox.addEventListener('change', generatePassword);
            });
            
            // Générer un mot de passe au clic du bouton
            generateBtn.addEventListener('click', generatePassword);
            
            // Copier le mot de passe
            copyBtn.addEventListener('click', function() {
                if (passwordOutput.value) {
                    navigator.clipboard.writeText(passwordOutput.value)
                        .then(() => {
                            showNotification();
                        })
                        .catch(err => {
                            console.error('Erreur lors de la copie : ', err);
                        });
                }
            });
            
            // Fonction pour générer le mot de passe
            function generatePassword() {
                const length = parseInt(lengthSlider.value);
                const includeUppercase = uppercaseCheckbox.checked;
                const includeLowercase = lowercaseCheckbox.checked;
                const includeNumbers = numbersCheckbox.checked;
                const includeSymbols = symbolsCheckbox.checked;
                
                // Vérifier qu'au moins un type est sélectionné
                if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
                    passwordOutput.value = 'Sélectionnez au moins une option';
                    updateStrengthMeter(0);
                    return;
                }
                
                let charset = '';
                if (includeUppercase) charset += uppercaseChars;
                if (includeLowercase) charset += lowercaseChars;
                if (includeNumbers) charset += numberChars;
                if (includeSymbols) charset += symbolChars;
                
                let password = '';
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * charset.length);
                    password += charset[randomIndex];
                }
                
                passwordOutput.value = password;
                updateStrengthMeter(calculatePasswordStrength(password, charset.length));
            }
            
            // Calculer la force du mot de passe
            function calculatePasswordStrength(password, charsetSize) {
                let strength = 0;
                
                // Score basé sur la longueur
                strength += password.length * 4;
                
                // Score basé sur la diversité des caractères
                const hasUppercase = /[A-Z]/.test(password);
                const hasLowercase = /[a-z]/.test(password);
                const hasNumbers = /[0-9]/.test(password);
                const hasSymbols = /[^A-Za-z0-9]/.test(password);
                
                const charTypesCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols]
                    .filter(Boolean).length;
                
                strength += (charTypesCount - 1) * 10;
                
                // Score basé sur l'entropie
                const entropy = Math.log2(Math.pow(charsetSize, password.length));
                strength += entropy / 5;
                
                // Limiter à 100%
                return Math.min(strength, 100);
            }
            
            // Mettre à jour l'indicateur de force
            function updateStrengthMeter(strength) {
                const percent = Math.max(0, Math.min(100, strength));
                meterFill.style.width = $(percent)%{}
                
                // Changer la couleur et le texte selon la force
                if (percent < 40) {
                    meterFill.style.background = '#e74c3c'; // Rouge
                    strengthText.textContent = 'Faible';
                } else if (percent < 70) {
                    meterFill.style.background = '#f39c12'; // Orange
                    strengthText.textContent = 'Moyen';
                } else {
                    meterFill.style.background = '#2ecc71'; // Vert
                    strengthText.textContent = 'Fort';
                }
            }
            
            // Afficher la notification
            function showNotification() {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 2000);
            }
            
            // Générer un mot de passe initial
            generatePassword();
        });