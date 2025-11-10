// ===== SISTEMA DE COMPRAS COM PROTEÇÃO ANTI-SPAM =====
let lastPurchaseTime = 0;
const PURCHASE_COOLDOWN = 5 * 60 * 1000; // 5 minutos em milissegundos

// ===== FUNCIONALIDADES PRINCIPAIS =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling para links âncora
    initSmoothScrolling();
    
    // Animações de entrada
    initScrollAnimations();
    
    // Menu mobile
    initMobileMenu();
    
    // Efeitos de hover
    initHoverEffects();
    
    // Contador de membros
    initMemberCounter();
    
    // Sistema de compras com anti-spam
    initPurchaseSystem();
    
    // Copiar IP
    initCopyIP();
    
    // Inicializar cooldown
    initCooldownSystem();
});

// ===== SCROLL SUAVE =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                closeMobileMenu();
            }
        });
    });
}

// ===== ANIMAÇÕES DE SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.vip-card, .key-card, .command-item, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.overlay');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Fechar menu ao clicar no overlay
        overlay.addEventListener('click', closeMobileMenu);
        
        // Fechar menu ao clicar em um link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

function closeMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.overlay');
    
    if (mobileNav) mobileNav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== EFEITOS HOVER =====
function initHoverEffects() {
    // Adicionar delay nas animações flutuantes
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
}

// ===== CONTADOR DE MEMBROS =====
function initMemberCounter() {
    const memberCount = document.querySelector('.member-count');
    if (!memberCount) return;
    
    let count = 100;
    const targetCount = 100 + Math.floor(Math.random() * 50);
    
    function updateCounter() {
        if (count < targetCount) {
            count++;
            memberCount.innerHTML = `<i class="fas fa-users"></i> MAIS DE ${count} MEMBROS ATIVOS!`;
            setTimeout(updateCounter, 100);
        }
    }
    
    // Iniciar contador quando a seção estiver visível
    const counterObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            updateCounter();
            counterObserver.unobserve(entries[0].target);
        }
    });
    
    counterObserver.observe(memberCount);
}

// ===== SISTEMA DE COMPRAS COM ANTI-SPAM =====
function initPurchaseSystem() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.textContent.includes('COMPRAR')) {
                e.preventDefault();
                
                // Verificar cooldown
                const currentTime = Date.now();
                const timeSinceLastPurchase = currentTime - lastPurchaseTime;
                
                if (timeSinceLastPurchase < PURCHASE_COOLDOWN) {
                    const remainingTime = Math.ceil((PURCHASE_COOLDOWN - timeSinceLastPurchase) / 1000);
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    
                    showCooldownMessage(minutes, seconds);
                    return;
                }
                
                // Identificar o produto
                let product = null;
                let productType = '';
                
                // Verificar se é VIP
                const vipCard = this.closest('.vip-card');
                if (vipCard) {
                    const vipName = vipCard.querySelector('.vip-name').textContent;
                    const vipPrice = vipCard.querySelector('.vip-price').textContent;
                    product = {
                        name: vipName,
                        price: vipPrice,
                        type: 'VIP'
                    };
                    productType = 'VIP';
                }
                
                // Verificar se é chave
                const keyCard = this.closest('.key-card');
                if (keyCard) {
                    const keyName = keyCard.querySelector('.key-name').textContent;
                    const keyPrice = keyCard.querySelector('.key-price').textContent;
                    product = {
                        name: keyName,
                        price: keyPrice,
                        type: 'CHAVE'
                    };
                    productType = 'CHAVE';
                }
                
                // Verificar se é Umban
                if (this.textContent.includes('UMBAN') || this.previousElementSibling?.textContent.includes('UMBAN')) {
                    product = {
                        name: 'UMBAN',
                        price: 'R$ 10,00',
                        type: 'UMBAN'
                    };
                    productType = 'UMBAN';
                }
                
                if (product) {
                    generatePurchaseCode(product, productType);
                }
            }
        });
    });
}

// ===== GERAR CÓDIGO DE COMPRA =====
function generatePurchaseCode(product, productType) {
    // Gerar código único
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const purchaseCode = `SF${timestamp.toString(36).toUpperCase()}${randomNum.toString().padStart(4, '0')}`;
    
    // Criar objeto de compra
    const purchase = {
        code: purchaseCode,
        product: product.name,
        price: product.price,
        type: productType,
        timestamp: timestamp,
        date: new Date().toLocaleString('pt-BR')
    };
    
    // Atualizar tempo da última compra
    lastPurchaseTime = timestamp;
    saveCooldown();
    
    // Mostrar modal de confirmação
    showPurchaseModal(purchase);
}

// ===== MODAL DE CONFIRMAÇÃO =====
function showPurchaseModal(purchase) {
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🎉 PEDIDO GERADO COM SUCESSO!</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="purchase-details">
                    <div class="detail-item">
                        <span class="label">Código do Pedido:</span>
                        <span class="value code-highlight">${purchase.code}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Produto:</span>
                        <span class="value">${purchase.product}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Preço:</span>
                        <span class="value">${purchase.price}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Data:</span>
                        <span class="value">${purchase.date}</span>
                    </div>
                </div>
                
                <div class="cooldown-info">
                    <i class="fas fa-clock"></i>
                    <span>Próxima compra disponível em: <span class="cooldown-timer">5:00</span></span>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-copy" onclick="copyPurchaseCode('${purchase.code}')">
                        <i class="fas fa-copy"></i> Copiar Código
                    </button>
                    <a class="btn btn-whatsapp" href="${generateWhatsAppLink(purchase)}" target="_blank">
                        <i class="fab fa-whatsapp"></i> Enviar para WhatsApp
                    </a>
                </div>
                
                <div class="instructions">
                    <h4>📋 Como Finalizar a Compra:</h4>
                    <ol>
                        <li>Clique em "Enviar para WhatsApp"</li>
                        <li>O código será enviado automaticamente</li>
                        <li>Aguarde nossa confirmação</li>
                        <li>Realize o pagamento via PIX</li>
                        <li>Seu VIP/Chave será ativado em até 10 minutos</li>
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Iniciar contador do cooldown
    startCooldownTimer();
}

// ===== GERAR LINK DO WHATSAPP =====
function generateWhatsAppLink(purchase) {
    const phoneNumber = '5512974088566';
    const message = `🛒 *PEDIDO SURVIVAL FLEX* 🛒

*Código do Pedido:* ${purchase.code}
*Produto:* ${purchase.product}
*Preço:* ${purchase.price}
*Tipo:* ${purchase.type}
*Data:* ${purchase.date}

*Informações do Comprador:*
• Nome: [SEU NOME AQUI]
• Discord: [SEU DISCORD]
• Minecraft: [SEU NICK]

_*Pagamento via PIX*_
_Chave PIX: (12) 97408-8566_
_Titular: PATRICE_`;
    
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// ===== COPIAR CÓDIGO =====
function copyPurchaseCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        // Mostrar feedback visual
        const copyBtn = document.querySelector('.btn-copy');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Código Copiado!';
        copyBtn.style.background = 'var(--success)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Erro ao copiar código. Tente novamente.');
    });
}

// ===== CONTADOR DE COOLDOWN =====
function startCooldownTimer() {
    let timeLeft = PURCHASE_COOLDOWN / 1000;
    const timerElement = document.querySelector('.cooldown-timer');
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (timerElement) {
                timerElement.textContent = 'PRONTO!';
                timerElement.style.color = 'var(--success)';
            }
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Mudar cor conforme o tempo diminui
            if (timeLeft < 60) {
                timerElement.style.color = 'var(--danger)';
            } else if (timeLeft < 180) {
                timerElement.style.color = 'var(--accent)';
            }
        }
    }, 1000);
}

// ===== MENSAGEM DE COOLDOWN =====
function showCooldownMessage(minutes, seconds) {
    // Criar mensagem de cooldown
    const cooldownModal = document.createElement('div');
    cooldownModal.className = 'cooldown-modal';
    cooldownModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>⏰ AGUARDE</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="cooldown-message">
                    <i class="fas fa-hourglass-half"></i>
                    <h4>Compra em Cooldown</h4>
                    <p>Você precisa aguardar <span class="cooldown-time">${minutes}:${seconds.toString().padStart(2, '0')}</span> antes de fazer outra compra.</p>
                    <p><small>Esta medida previne spam e garante melhor atendimento.</small></p>
                </div>
                <button class="btn btn-close-cooldown">Entendido</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(cooldownModal);
    
    // Fechar modal
    cooldownModal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(cooldownModal);
    });
    
    cooldownModal.querySelector('.btn-close-cooldown').addEventListener('click', () => {
        document.body.removeChild(cooldownModal);
    });
    
    cooldownModal.addEventListener('click', (e) => {
        if (e.target === cooldownModal) {
            document.body.removeChild(cooldownModal);
        }
    });
    
    // Atualizar contador
    const timeElement = cooldownModal.querySelector('.cooldown-time');
    let totalSeconds = (minutes * 60) + seconds;
    
    const cooldownInterval = setInterval(() => {
        totalSeconds--;
        
        if (totalSeconds <= 0) {
            clearInterval(cooldownInterval);
            if (cooldownModal.parentNode) {
                document.body.removeChild(cooldownModal);
            }
            return;
        }
        
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        timeElement.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

// ===== VERIFICAR COOLDOWN AO CARREGAR =====
function initCooldownSystem() {
    // Verificar se há cooldown ativo do localStorage
    const lastPurchase = JSON.parse(localStorage.getItem('lastPurchase') || '{}');
    if (lastPurchase.timestamp) {
        lastPurchaseTime = lastPurchase.timestamp;
    }
}

// ===== SALVAR COOLDOWN =====
function saveCooldown() {
    localStorage.setItem('lastPurchase', JSON.stringify({
        timestamp: lastPurchaseTime
    }));
}

// ===== COPIAR IP DO SERVIDOR =====
function initCopyIP() {
    const serverIP = document.querySelector('.server-ip');
    if (serverIP) {
        serverIP.style.cursor = 'pointer';
        serverIP.title = 'Clique para copiar o IP';
        
        serverIP.addEventListener('click', function() {
            navigator.clipboard.writeText('survivalflex.com:25565').then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> IP COPIADO COM SUCESSO!';
                this.style.background = 'var(--success)';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
            });
        });
    }
}