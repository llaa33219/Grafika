function injectScript(filePath, attributes = {}) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(filePath);
    script.type = 'text/javascript';
    
    // 데이터 속성 추가
    for (const [key, value] of Object.entries(attributes)) {
        script.setAttribute(key, value);
    }
    
    (document.head || document.documentElement).appendChild(script);
}

// 리소스 URL들을 데이터 속성으로 전달하여 WebGL-toggle.js에서 사용
injectScript('WebGL-toggle.js', {
    'data-pixi-url': chrome.runtime.getURL('pixi.min.js'),
    'data-preloadjs-url': chrome.runtime.getURL('preloadjs-0.6.0.min.js'),
    'data-easeljs-url': chrome.runtime.getURL('easeljs-0.8.0.min.js'),
    'data-soundjs-url': chrome.runtime.getURL('soundjs-0.6.0.min.js')
});

// UI 생성 및 상호작용을 담당하는 메인 스크립트를 주입
injectScript('main.js');
