<template>
    <div class="header">
      <img src="" class="logo">
      <h3 class="teamname">SeverM</h3>
    </div>
    <div class="welcome-container">
      <h1>Welcome!</h1>
      <h2 class="typing-text">通用的服务器实时监控平台</h2>
      <h2 class="typing-text">多服务器核心数据一键可知</h2>
      <h2 class="typing-text">自定义数据采集时间，高效监控触手可及</h2>
    </div>
    <div class="buttons">
      <a href="#" style="--clr:#74B5FF" @click.prevent="goToRegister"><span>还没有账号？</span></a>
      <a href="#" style="--clr:#74B5FF" @click.prevent="goToLogin"><span>有账号，现在开始→</span></a>
    </div>
  </template>
  
  <style scoped>
  @font-face {
    font-family: 'PangMenZhengDao';
    src: url('@/assets/PangMenZhengDaoBiaoTiTiMianFeiBan-2.ttf');
    font-weight: normal;
    font-style: normal;
}
@font-face {
  font-family: 'Ubuntu';
  src: url('@/assets/._Ubuntu-M.ttf');
  font-weight: normal;
  font-style: normal;
}
  </style>
  
  <style>
  body {
    background-color: #000000;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
  }
  
  .teamname {
    position: fixed;
    right: 5px;
    top: 5px;
    color: white;
    font-size: 35px;
    font-family: 'PangMenZhengDao', sans-serif;
  }
  
  .welcome-container {
    position: fixed;
    left: 7vw;
    top: 8vh;
    font-family: 'Ubuntu';
    padding: 40px 20px;
    text-align: center;
  }
  
  h1 {
    text-align: left;
    margin-bottom: -40px;
    font-size: 180px;
    color: #4095E5;
    font-weight: bold;
    left: 0;
  }
  
  h2.typing-text {
    left: 0;
    font-size: 40px;
    margin-top: -17px;
    text-align: left;
    font-weight: bold;
    position: relative;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    width: 0;
    margin-bottom: 20px;
  }
  
  .cursor {
    color: #74B5FF;
    opacity: 0;
    animation: blink 1s step-end infinite;
    position: absolute;
    display: inline-block;
  }
  
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  
  .buttons {
    position: fixed;
    top: 80vh;
    left: 0;
    right: 0;
    font-family: 'Ubuntu';
    text-align: center;
  }
  
  a {
    position: relative;
    padding: 2.7vh 6vw;
    background-color: #333333;
    border-radius: 50px;
    color: #999;
    font-size: 1.5em;
    text-decoration: none;
    overflow: hidden;
    transition: 0.5s;
    margin: 5vw;
  }
  
  a span {
    position: relative;
    z-index: 3;
    letter-spacing: 0.2em;
  }
  
  a:hover span {
    color: var(--clr);
    text-shadow: 0 0 15px var(--clr), 0 0 40px var(--clr);
  }
  
  a::before {
    content: '';
    position: absolute;
    top: var(--y);
    left: var(--x);
    transform: translate(-50%, -50%);
    width: 180px;
    height: 180px;
    background: radial-gradient(var(--clr), transparent, transparent);
    opacity: 0;
    transition: 0.1s;
    clip-path: circle(50% at center);
    z-index: 1;
  }
  
  a:hover::before {
    opacity: 1;
  }
  
  a::after {
    content: '';
    background-color: #333333;
    position: absolute;
    inset: 0.4vw;
    border-radius: 48px;
    z-index: 2;
  }
  </style>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'WelcomePage',
    setup() {
      const router = useRouter();
  
      const goToRegister = () => {
        router.push('/register');
      };
  
      const goToLogin = () => {
        router.push('/login');
      };
  
      return {
        goToRegister,
        goToLogin
      };
    },
    mounted() {
      let btns = document.querySelectorAll('a');
      btns.forEach(btn => {
        btn.onmousemove = (e) => {
          let rect = btn.getBoundingClientRect();
          let x = e.clientX - rect.left;
          let y = e.clientY - rect.top;
          btn.style.setProperty('--x', `${x}px`);
          btn.style.setProperty('--y', `${y}px`);
        };
      });
  
      const h2Elements = document.querySelectorAll('h2.typing-text');
      let currentIndex = 0;
  
      const typeLine = (element, text, index) => {
        let charIndex = 0;
        let visibleText = '';
        let cursor = document.createElement('span');
        cursor.classList.add('cursor');
        cursor.textContent = '__';
        element.appendChild(cursor);
  
        const typeChar = () => {
          if (charIndex < text.length) {
            if (text[charIndex]!== ' ') {
              visibleText += text[charIndex];
              element.textContent = visibleText;
              element.appendChild(cursor);
              element.style.width = `${element.scrollWidth}px`;
            }
            charIndex++;
            setTimeout(typeChar, 100);
          } else {
            if (index === h2Elements.length - 1) {
              cursor.style.opacity = '1';
            }
            if (index < h2Elements.length - 1) {
              setTimeout(() => {
                typeLine(h2Elements[index + 1], h2Elements[index + 1].textContent, index + 1);
              }, 500);
            }
          }
        };
  
        typeChar();
      };
  
      if (h2Elements.length > 0) {
        typeLine(h2Elements[0], h2Elements[0].textContent, 0);
      }
    }
  };
  </script>